(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var flashBlocker  = require('./flashBlocker')
var createElement = require('./createElement')
var MAMAPlayer    = require('./player')
var log           = require('./log')
var purl          = require('./purl')
var mamaKey       = require('./mamaKey')
var seekers       = require('./seekers')
var flvsp         = require('./seeker_flvsp');
var matched

if (window[mamaKey] != true) {

function seeked (source, comments) {
  if (!source) {
    log('\u89e3\u6790\u5185\u5bb9\u5730\u5740\u5931\u8d25', 2)
    delete window[mamaKey]
    return
  } 
  log('\u89e3\u6790\u5185\u5bb9\u5730\u5740\u5b8c\u6210'+source.map(function (i) {return '<a href="'+i[1]+'" target="_blank">'+i[0]+'</a>'}).join(' '), 2)
  var mask = createElement('div', {
    appendTo: document.body,
    style: {
      position: 'fixed',
      background: 'rgba(0,0,0,0.8)',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '999999'
    }
  })
  createElement('div', {
    appendTo: mask,
    style: {
      width: '1000px',
      height: '500px',
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: '-250px',
      marginLeft: '-500px',
      borderRadius: '2px',
      boxShadow: '0 0 2px #000000, 0 0 200px #000000',
    }
  })
  createElement('div', {
    appendTo: mask,
    innerHTML: '<a style="color:#555555;" href="http://zythum.sinaapp.com/mama2/" target="_blank">MAMA2: \u5988\u5988\u518d\u4e5f\u4e0d\u7528\u62c5\u5fc3\u6211\u7684 MacBook \u53d1\u70ed\u8ba1\u5212</a>',
    style: {
      position: 'absolute',
      bottom: '10px',
      left: '0',
      right: '0',
      height: '20px',
      lineHeight: '20px',
      textAlign: 'center',
      fontSize:'12px',
      fontFamily: 'arial, sans-serif'
    }
  })
  var container = createElement('div', {
    appendTo: mask,
    innerHTML: '<div id="MAMA2_video_placeHolder"></div>',
    style: {
      width: '1000px',
      height: '500px',
      position: 'absolute',
      backgroundColor: '#000000',
      top: '50%',
      left: '50%',
      marginTop: '-250px',
      marginLeft: '-500px',
      borderRadius: '2px',
      overflow: 'hidden'
    }
  })
  createElement('div', {
    appendTo: container,
    innerHTML: '&times;',
    style: {
      width: '20px',
      height: '20px',
      lineHeight: '20px',
      textAlign: 'center',
      position: 'absolute',
      color: '#ffffff',
      fontSize: '20px',
      top: '5px',
      right: '5px',
      textShadow: '0 0 2px #000000',
      fontWeight: 'bold',
      fontFamily: 'Garamond, "Apple Garamond"',
      cursor: 'pointer'
    }
  }).onclick = function () {
    document.body.removeChild(mask)
    player.video.src = 'about:blank'
    delete window[mamaKey]
  }
  var player = new MAMAPlayer('MAMA2_video_placeHolder', '1000x500', source, comments)
  player.iframe.contentWindow.focus()
  flashBlocker()
  player.iframe.style.display = 'block'
  window[mamaKey] = true
}

var url = purl(location.href)
if (url.attr('host') === 'zythum.sinaapp.com' && 
  url.attr('directory') === '/mama2/ps4/' && url.param('url') ) {
  url = purl(url.param('url'))
}

seekers.forEach(function (seeker) {
  if (matched === true) return
  if (!!seeker.match(url) === true) {
    log('\u5f00\u59cb\u89e3\u6790\u5185\u5bb9\u5730\u5740')
    matched = true
    seeker.getVideos(url, seeked)   
  }
})

if (matched === undefined) {
  log('\u5c1d\u8bd5\u4f7f\u7528<a target="_blank" href="http://weibo.com/justashit">\u4e00\u73af\u540c\u5b66</a>\u63d0\u4f9b\u7684\u89e3\u6790\u670d\u52a1', 2)
  flvsp.getVideos(url, seeked)
}

}
},{"./createElement":4,"./flashBlocker":5,"./log":9,"./mamaKey":10,"./player":12,"./purl":13,"./seeker_flvsp":17,"./seekers":22}],2:[function(require,module,exports){
/*  \uff03function ajax#
 *  < {
 *    url:          String   \u8bf7\u6c42\u5730\u5740
 *    param:        Object   \u8bf7\u6c42\u53c2\u6570.\u53ef\u7f3a\u7701
 *    method:       String   \u8bf7\u6c42\u65b9\u6cd5GET,POST,etc. \u53ef\u7f3a\u7701\uff0c\u9ed8\u8ba4\u662fGET 
 *    callback:     Function \u8bf7\u6c42\u7684callback, \u5982\u679c\u5931\u8d25\u8fd4\u56de\uff0d1\uff0c \u6210\u529f\u8fd4\u56de\u5185\u5bb9
 *    contentType:  String   \u8fd4\u56de\u5185\u5bb9\u7684\u683c\u5f0f。\u5982\u679c\u662fJOSN\u4f1a\u505aJSON Parse\uff0c \u53ef\u7f3a\u7701,\u9ed8\u8ba4\u662fjson
 *    context:      Any      callback\u56de\u8c03\u51fd\u6570\u7684this\u6307\u5411。\u53ef\u7f3a\u7701
 *  }
 *  \u7528\u4e8e\u53d1\u8d77ajax\u6216\u8005jsonp\u8bf7\u6c42
 */

var jsonp       = require('./jsonp')
var noop        = require('./noop')
var queryString = require('./queryString')

function defalutOption (option, defalutValue) {
  return option === undefined ? defalutValue : option
}

function queryString (obj) {
  var query = []
  for (one in obj) {
    if (obj.hasOwnProperty(one)) {
      query.push([one, obj[one]].join('='))
    }
  }
  return query.join('&')
}

function joinUrl (url, queryString) {
  if (queryString.length === 0) return url
  return url + (url.indexOf('?') === -1 ? '?' : '&') + queryString
}

function ajax (options) {
  var url         = defalutOption(options.url, '')
  var query       = queryString( defalutOption(options.param, {}) )
  var method      = defalutOption(options.method, 'GET')
  var callback    = defalutOption(options.callback, noop)
  var contentType = defalutOption(options.contentType, 'json')
  var context     = defalutOption(options.context, null)

  if (options.jsonp) {
    return jsonp(
      joinUrl(url, query),
      callback.bind(context),
      typeof options.jsonp === 'string' ? options.jsonp : undefined
    )
  }

  var xhr = new XMLHttpRequest()
  if (method.toLowerCase() === 'get') {
    url = joinUrl(url, query)
    query = ''
  }
  xhr.open(method, url, true)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
  xhr.send(query)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 ) {
      if (xhr.status === 200) {
        var data = xhr.responseText
        if (contentType.toLowerCase() === 'json') {
          try {
            data = JSON.parse(data)
          } catch(e) {
            data = -1
          }         
        }
        return callback.call(context, data)
      } else {
        return callback.call(context, -1)
      }
    }
  }
}
module.exports = ajax;

},{"./jsonp":8,"./noop":11,"./queryString":14}],3:[function(require,module,exports){
/*  \uff03Bool canPlayM3U8\uff03
 *  \u8fd4\u56de\u6d4f\u89c8\u5668\u662f\u5426\u652f\u6301m3u8\u683c\u5f0f\u7684\u89c6\u9891\u64ad\u653e。
 *  \u76ee\u524dchrome,firefox\u53ea\u652f\u6301mp4
 */
module.exports = !!document.createElement('video').canPlayType('application/x-mpegURL')
},{}],4:[function(require,module,exports){
/*
 * \u7528\u4e8e\u7b80\u5355\u521b\u5efahtml\u8282\u70b9
 */
function createElement (tagName, attributes) {
  var element = document.createElement(tagName)
  if ( typeof attributes === 'function' ) {
    attributes.call(element)
  } else {
    for (var attribute in attributes) {
      if ( attributes.hasOwnProperty(attribute) ) {
        switch (attribute) {
        case 'appendTo':
          attributes[attribute].appendChild(element)
          break
        case 'innerHTML':
        case 'className':
        case 'id':
          element[attribute] = attributes[attribute]
          break
        case 'style':
          var styles = attributes[attribute]
          for (var name in styles)
            if ( styles.hasOwnProperty(name) )
              element.style[name] = styles[name]
          break
        default:
          element.setAttribute(attribute, attributes[attribute] + '')
        }
      }
    }
  }
  return element
}

module.exports = createElement
},{}],5:[function(require,module,exports){
/*  
 *  \u7528\u4e8e\u5c4f\u853d\u9875\u9762\u4e0a\u7684\u6240\u6709flash
 */
var flashText = '<div style="text-shadow:0 0 2px #eee;letter-spacing:-1px;background:#eee;font-weight:bold;padding:0;font-family:arial,sans-serif;font-size:30px;color:#ccc;width:152px;height:52px;border:4px solid #ccc;border-radius:12px;position:absolute;top:50%;left:50%;margin:-30px 0 0 -80px;text-align:center;line-height:52px;">Flash</div>';

var count = 0;
var flashBlocks = {};
//\u70b9\u51fb\u65f6\u95f4\u89e6\u53d1
var click2ShowFlash = function(e){
  var index = this.getAttribute('data-flash-index');
  var flash = flashBlocks[index];
  flash.setAttribute('data-flash-show','isshow');
  this.parentNode.insertBefore(flash, this);
  this.parentNode.removeChild(this);
  this.removeEventListener('click', click2ShowFlash, false);
};

var createAPlaceHolder = function(flash, width, height){
  var index = count++;
  var style = document.defaultView.getComputedStyle(flash, null);
  var positionType = style.position;
    positionType = positionType === 'static' ? 'relative' : positionType;
  var margin       = style['margin'];
  var display      = style['display'] == 'inline' ? 'inline-block' : style['display'];
  var style = [
    '',
    'width:'    + width  +'px',
    'height:'   + height +'px',
    'position:' + positionType,
    'margin:'   + margin,
    'display:'  + display,
    'margin:0',
    'padding:0',
    'border:0',
    'border-radius:1px',
    'cursor:pointer',
    'background:-webkit-linear-gradient(top, rgba(240,240,240,1)0%,rgba(220,220,220,1)100%)',     
    ''
  ]
  flashBlocks[index] = flash;
  var placeHolder = document.createElement('div');
  placeHolder.setAttribute('title', '&#x70B9;&#x6211;&#x8FD8;&#x539F;Flash');
  placeHolder.setAttribute('data-flash-index', '' + index);
  flash.parentNode.insertBefore(placeHolder, flash);
  flash.parentNode.removeChild(flash);
  placeHolder.addEventListener('click', click2ShowFlash, false);
  placeHolder.style.cssText += style.join(';');
  placeHolder.innerHTML = flashText;
  return placeHolder;
};

var parseFlash = function(target){
  if(target instanceof HTMLObjectElement) {
    if(target.innerHTML.trim() == '') return;
    if(target.getAttribute("classid") && !/^java:/.test(target.getAttribute("classid"))) return;      
  } else if(!(target instanceof HTMLEmbedElement)) return;

  var width = target.offsetWidth;
  var height = target.offsetHeight;

  if(width > 160 && height > 60){
    createAPlaceHolder(target, width, height);
  }
};

var handleBeforeLoadEvent = function(e){
  var target = e.target
  if(target.getAttribute('data-flash-show') == 'isshow') return;
  parseFlash(target);
};

module.exports = function() { 
  var embeds = document.getElementsByTagName('embed');
  var objects = document.getElementsByTagName('object');
  for(var i=0,len=objects.length; i<len; i++) objects[i] && parseFlash(objects[i]);
  for(var i=0,len=embeds.length; i<len; i++)  embeds[i] && parseFlash(embeds[i]);
}
// document.addEventListener("beforeload", handleBeforeLoadEvent, true);

},{}],6:[function(require,module,exports){
/*  \uff03function getCookies#
 *  < String  cookie\u540d
 *  > String  cookie\u503c
 */

module.exports = function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}
},{}],7:[function(require,module,exports){
/*  \uff03function httpProxy#
 *  < String        \u8bf7\u6c42\u5730\u5740
 *  < String        \u8bf7\u6c42\u65b9\u6cd5GET,POST,etc.
 *  < Object        \u8bf7\u6c42\u53c2\u6570
 *  < Function      \u8bf7\u6c42\u7684callback, \u5982\u679c\u5931\u8d25\u8fd4\u56de\uff0d1\uff0c \u6210\u529f\u8fd4\u56de\u5185\u5bb9
 *  < {
 *      xml:       Bool   \u662f\u5426\u9700\u8981\u505axml2json \u53ef\u7f3a\u7701, \u9ed8\u8ba4fasle
 *      gzinflate: Bool   \u662f\u5426\u9700\u8981\u505agzinflate \u53ef\u7f3a\u7701, \u9ed8\u8ba4fasle
 *      context:   Any    callback\u56de\u8c03\u7684this\u6307\u5411 \u53ef\u7f3a\u7701
 *    }
 *  }
 *  \u7528\u4e8e\u53d1\u8d77\u8de8\u57df\u7684ajax\u8bf7\u6c42。\u65e2\u63a5\u53e3\u8fd4\u56de\u8de8\u57df\u53c8\u4e0d\u652f\u6301jsonp\u534f\u8bae\u7684
 */

var createElement = require('./createElement')
var ajax          = require('./ajax')
var queryString   = require('./queryString')

var proxyUrl = 'http://zythum.sinaapp.com/mama2/proxy.php'

function httpProxy (url, type, params, callback, opts) {
  opts = opts || {}
  ajax({
    url: proxyUrl,
    param : {
      params: encodeURIComponent(queryString(params)),//\u4e0a\u884c\u53c2\u6570
      referrer: opts.referrer || location.href,
      url: encodeURIComponent(url),
      post: type === 'post' ? 1 : 0,
      xml: opts.xml ? 1 : 0,
      text: opts.text ? 1 : 0,
      gzinflate: opts.gzinflate ? 1 : 0,
      ua: opts.ua || navigator.userAgent
    },
    jsonp: true,
    callback: callback,
    context: opts.context
  })
}

module.exports = httpProxy
},{"./ajax":2,"./createElement":4,"./queryString":14}],8:[function(require,module,exports){
/*  \uff03function jsonp#
 *  jsonp\u65b9\u6cd5。\u63a8\u8350\u4f7f\u7528ajax\u65b9\u6cd5。ajax\u5305\u542b\u4e86jsonp
 */
var createElement = require('./createElement')
var noop          = require('./noop')

var callbackPrefix = 'MAMA2_HTTP_JSONP_CALLBACK'
var callbackCount  = 0
var timeoutDelay   = 10000

function callbackHandle () {
  return callbackPrefix + callbackCount++
}

function jsonp (url, callback, callbackKey) {

  callbackKey = callbackKey || 'callback'

  var _callbackHandle = callbackHandle()  
  window[_callbackHandle] = function (rs) {
    clearTimeout(timeoutTimer)
    window[_callbackHandle] = noop
    callback(rs)
    document.body.removeChild(script)
  }
  var timeoutTimer = setTimeout(function () {
    window[_callbackHandle](-1)
  }, timeoutDelay)

  var script = createElement('script', {
    appendTo: document.body,
    src: url + (url.indexOf('?') >= 0 ? '&' : '?') + callbackKey + '=' + _callbackHandle
  })
}

module.exports = jsonp
},{"./createElement":4,"./noop":11}],9:[function(require,module,exports){
/*  \uff03function log\uff03
 *  < String
 *  log, \u4f1a\u5728\u9875\u9762\u548cconsole\u4e2d\u8f93\u51falog
 */

var createElement = require('./createElement')
var MAMALogDOM
var logTimer
var logDelay = 10000

function log (msg, delay) {
  if ( MAMALogDOM === undefined ) {
    MAMALogDOM = createElement('div', {
      style: {
        backgroundColor: '#24272A',
        color: '#ffffff',
        position: 'fixed',
        zIndex: '1000000',
        top: '0',
        left: '0',
        padding: '5px 10px',
        fontSize: '14px'
      }
    })
  }
  clearTimeout(logTimer)
  
  MAMALogDOM.innerHTML = '<span style="color:#DF6558">MAMA2 &gt;</span> ' + msg
  console && console.log && console.log('%c MAMA2 %c %s', 'background:#24272A; color:#ffffff', '', msg)

  document.body.appendChild(MAMALogDOM)
  logTimer = setTimeout(function () {
    document.body.removeChild(MAMALogDOM)
  }, delay*1000 || logDelay)
}
module.exports = log
},{"./createElement":4}],10:[function(require,module,exports){
//\u5988\u5988\u8ba1\u5212\u552f\u4e00\u503c
module.exports = 'MAMAKEY_\u7530\u7434\u662f\u8fd9\u4e2a\u4e16\u754c\u4e0a\u6700\u53ef\u7231\u7684\u5973\u5b69\u5b50\u5475\u5475\u5475\u5475\uff0c\u6211\u8981\u8ba9\u5168\u4e16\u754c\u90fd\u5728\u77e5\u9053'
},{}],11:[function(require,module,exports){
//\u7a7a\u65b9\u6cd5
module.exports = function () {}
},{}],12:[function(require,module,exports){
var MAMAPlayer;

// MAMAPlayer 
// https://github.com/zythum/mamaplayer
!function e(t,i,n){function o(r,a){if(!i[r]){if(!t[r]){var l="function"==typeof require&&require;if(!a&&l)return l(r,!0);if(s)return s(r,!0);throw new Error("Cannot find module '"+r+"'")}var c=i[r]={exports:{}};t[r][0].call(c.exports,function(e){var i=t[r][1][e];return o(i?i:e)},c,c.exports,e,t,i,n)}return i[r].exports}for(var s="function"==typeof require&&require,r=0;r<n.length;r++)o(n[r]);return o}({1:[function(e,t){function i(e){for(var t=[],i=1;i<arguments.length;i++){var o=arguments[i],s=o.init;t.push(s),delete o.init,n(e.prototype,o)}e.prototype.init=function(){t.forEach(function(e){e.call(this)}.bind(this))}}var n=e("./extend");t.exports=i},{"./extend":9}],2:[function(e,t){var i=e("./player.css"),n=e("./player.html"),o=(e("./extend"),e("./createElement")),s=e("./parseDOMByClassNames");t.exports={init:function(){var e=function(){var e=this.iframe.contentDocument.getElementsByTagName("head")[0],t=this.iframe.contentDocument.body;o("style",function(){e.appendChild(this);try{this.styleSheet.cssText=i}catch(t){this.appendChild(document.createTextNode(i))}}),o("link",{appendTo:e,href:"http://libs.cncdn.cn/font-awesome/4.3.0/css/font-awesome.min.css",rel:"stylesheet",type:"text/css"}),t.innerHTML=n,this.DOMs=s(t,["player","video","video-frame","comments","comments-btn","play","progress_anchor","buffered_anchor","fullscreen","allscreen","hd","volume_anchor","current","duration"]),this.video=this.DOMs.video}.bind(this),t=document.getElementById(this.id),r=this.iframe=o("iframe",{allowTransparency:!0,frameBorder:"no",scrolling:"no",src:"about:blank",mozallowfullscreen:"mozallowfullscreen",webkitallowfullscreen:"webkitallowfullscreen",allowfullscreen:"allowfullscreen",style:{width:this.size[0]+"px",height:this.size[1]+"px",overflow:"hidden"}});t&&t.parentNode?(t.parentNode.replaceChild(r,t),e()):(document.body.appendChild(r),e(),document.body.removeChild(r))}}},{"./createElement":7,"./extend":9,"./parseDOMByClassNames":11,"./player.css":12,"./player.html":13}],3:[function(e,t){function i(e){e.strokeStyle="black",e.lineWidth=3,e.font='bold 20px "PingHei","Lucida Grande", "Lucida Sans Unicode", "STHeiti", "Helvetica","Arial","Verdana","sans-serif"'}var n=(e("./createElement"),.1),o=25,s=4e3,r=document.createElement("canvas").getContext("2d");i(r);var a=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame||function(e){setTimeout(e,1e3/60)};t.exports={init:function(){this.video.addEventListener("play",this.reStartComment.bind(this)),this.video.addEventListener("pause",this.pauseComment.bind(this)),this.lastCommnetUpdateTime=0,this.lastCommnetIndex=0,this.commentLoopPreQueue=[],this.commentLoopQueue=[],this.commentButtonPreQueue=[],this.commentButtonQueue=[],this.commentTopPreQueue=[],this.commentTopQueue=[],this.drawQueue=[],this.preRenders=[],this.preRenderMap={},this.enableComment=void 0===this.comments?!1:!0,this.prevDrawCanvas=document.createElement("canvas"),this.canvas=this.DOMs.comments.getContext("2d"),this.comments&&this.DOMs.player.classList.add("has-comments"),this.DOMs["comments-btn"].classList.add("enable"),this.DOMs.comments.display=this.enableComment?"block":"none";var e=0,t=function(){(e=~e)&&this.onCommentTimeUpdate(),a(t)}.bind(this);t()},needDrawText:function(e,t,i){this.drawQueue.push([e,t,i])},drawText:function(){var e=this.prevDrawCanvas,t=this.prevDrawCanvas.getContext("2d");e.width=this.canvasWidth,e.height=this.canvasHeight,t.clearRect(0,0,this.canvasWidth,this.canvasHeight);var n=[];this.preRenders.forEach(function(e,t){e.used=!1,void 0===e.cid&&n.push(t)});for(var s;s=this.drawQueue.shift();)!function(e,s){var r,a=e[0].text+e[0].color,l=s.preRenderMap[a];if(void 0===l){var l=n.shift();void 0===l?(r=document.createElement("canvas"),l=s.preRenders.push(r)-1):r=s.preRenders[l];var c=r.width=e[0].width,h=r.height=o+10,d=r.getContext("2d");d.clearRect(0,0,c,h),i(d),d.fillStyle=e[0].color,d.strokeText(e[0].text,0,o),d.fillText(e[0].text,0,o),r.cid=a,s.preRenderMap[a]=l}else r=s.preRenders[l];r.used=!0,t.drawImage(r,e[1],e[2])}(s,this);this.preRenders.forEach(function(e){e.used===!1&&(delete this.preRenderMap[e.cid],e.cid=void 0)}.bind(this)),this.canvas.clearRect(0,0,this.canvasWidth,this.canvasHeight),this.canvas.drawImage(e,0,0)},createComment:function(e,t){if(void 0===e)return!1;var i=r.measureText(e.text);return{startTime:t,text:e.text,color:e.color,width:i.width+20}},commentTop:function(e,t,i){this.commentTopQueue.forEach(function(t,n){void 0!=t&&(i>t.startTime+s?this.commentTopQueue[n]=void 0:this.needDrawText(t,(e-t.width)/2,o*n))}.bind(this));for(var n;n=this.commentTopPreQueue.shift();)n=this.createComment(n,i),this.commentTopQueue.forEach(function(t,i){n&&void 0===t&&(t=this.commentTopQueue[i]=n,this.needDrawText(t,(e-n.width)/2,o*i),n=void 0)}.bind(this)),n&&(this.commentTopQueue.push(n),this.needDrawText(n,(e-n.width)/2,o*this.commentTopQueue.length-1))},commentBottom:function(e,t,i){t-=10,this.commentButtonQueue.forEach(function(n,r){void 0!=n&&(i>n.startTime+s?this.commentButtonQueue[r]=void 0:this.needDrawText(n,(e-n.width)/2,t-o*(r+1)))}.bind(this));for(var n;n=this.commentButtonPreQueue.shift();)n=this.createComment(n,i),this.commentButtonQueue.forEach(function(i,s){n&&void 0===i&&(i=this.commentButtonQueue[s]=n,this.needDrawText(i,(e-n.width)/2,t-o*(s+1)),n=void 0)}.bind(this)),n&&(this.commentButtonQueue.push(n),this.needDrawText(n,(e-n.width)/2,t-o*this.commentButtonQueue.length))},commentLoop:function(e,t,i){for(var s=t/o|0,r=-1;++r<s;){var a=this.commentLoopQueue[r];if(void 0===a&&(a=this.commentLoopQueue[r]=[]),this.commentLoopPreQueue.length>0){var l=0===a.length?void 0:a[a.length-1];if(void 0===l||(i-l.startTime)*n>l.width){var c=this.createComment(this.commentLoopPreQueue.shift(),i);c&&a.push(c)}}this.commentLoopQueue[r]=a.filter(function(t){var s=(i-t.startTime)*n;return 0>s||s>t.width+e?!1:(this.needDrawText(t,e-s,o*r),!0)}.bind(this))}for(var h=this.commentLoopQueue.length-s;h-->0;)this.commentLoopQueue.pop()},pauseComment:function(){this.pauseCommentAt=Date.now()},reStartComment:function(){if(this.pauseCommentAt){var e=Date.now()-this.pauseCommentAt;this.commentLoopQueue.forEach(function(t){t.forEach(function(t){t&&(t.startTime+=e)})}),this.commentButtonQueue.forEach(function(t){t&&(t.startTime+=e)}),this.commentTopQueue.forEach(function(t){t&&(t.startTime+=e)})}this.pauseCommentAt=void 0},drawComment:function(){if(!this.pauseCommentAt){var e=Date.now(),t=this.DOMs["video-frame"].offsetWidth,i=this.DOMs["video-frame"].offsetHeight;t!=this.canvasWidth&&(this.DOMs.comments.width=t,this.canvasWidth=t),i!=this.canvasHeight&&(this.DOMs.comments.height=i,this.canvasHeight=i);var n=this.video.offsetWidth,o=this.video.offsetHeight;this.commentLoop(n,o,e),this.commentTop(n,o,e),this.commentBottom(n,o,e),this.drawText()}},onCommentTimeUpdate:function(){if(this.enableComment!==!1){var e=this.video.currentTime;if(Math.abs(e-this.lastCommnetUpdateTime)<=1&&e>this.lastCommnetUpdateTime){var t=0;for(this.lastCommnetIndex&&this.comments[this.lastCommnetIndex].time<=this.lastCommnetUpdateTime&&(t=this.lastCommnetIndex);++t<this.comments.length;)if(!(this.comments[t].time<=this.lastCommnetUpdateTime)){if(this.comments[t].time>e)break;switch(this.comments[t].pos){case"bottom":this.commentButtonPreQueue.push(this.comments[t]);break;case"top":this.commentTopPreQueue.push(this.comments[t]);break;default:this.commentLoopPreQueue.push(this.comments[t])}this.lastCommnetIndex=t}}try{this.drawComment()}catch(i){}this.lastCommnetUpdateTime=e}}}},{"./createElement":7}],4:[function(e,t){function i(e){return Array.prototype.slice.call(e)}function n(e,t,i,n){function o(t){var i=(t.clientX-e.parentNode.getBoundingClientRect().left)/e.parentNode.offsetWidth;return Math.min(Math.max(i,0),1)}function s(t){1==t.which&&(l=!0,e.draging=!0,r(t))}function r(e){if(1==e.which&&l===!0){var t=o(e);i(t)}}function a(t){if(1==t.which&&l===!0){var s=o(t);i(s),n(s),l=!1,delete e.draging}}var l=!1;i=i||function(){},n=n||function(){},e.parentNode.addEventListener("mousedown",s),t.addEventListener("mousemove",r),t.addEventListener("mouseup",a)}var o=(e("./createElement"),e("./delegateClickByClassName")),s=e("./timeFormat");t.exports={init:function(){var e=this.iframe.contentDocument,t=o(e);t.on("play",this.onPlayClick,this),t.on("video-frame",this.onVideoClick,this),t.on("source",this.onSourceClick,this),t.on("allscreen",this.onAllScreenClick,this),t.on("fullscreen",this.onfullScreenClick,this),t.on("normalscreen",this.onNormalScreenClick,this),t.on("comments-btn",this.oncommentsBtnClick,this),t.on("airplay",this.onAirplayBtnClick,this),e.documentElement.addEventListener("keydown",this.onKeyDown.bind(this),!1),this.DOMs.player.addEventListener("mousemove",this.onMouseActive.bind(this)),n(this.DOMs.progress_anchor,e,this.onProgressAnchorWillSet.bind(this),this.onProgressAnchorSet.bind(this)),n(this.DOMs.volume_anchor,e,this.onVolumeAnchorWillSet.bind(this))},onKeyDown:function(e){switch(e.preventDefault(),e.keyCode){case 32:this.onPlayClick();break;case 39:this.video.currentTime=Math.min(this.video.duration,this.video.currentTime+10);break;case 37:this.video.currentTime=Math.max(0,this.video.currentTime-10);break;case 38:this.video.volume=Math.min(1,this.video.volume+.1),this.DOMs.volume_anchor.style.width=100*this.video.volume+"%";break;case 40:this.video.volume=Math.max(0,this.video.volume-.1),this.DOMs.volume_anchor.style.width=100*this.video.volume+"%";break;case 65:this.DOMs.player.classList.contains("allscreen")?this.onNormalScreenClick():this.onAllScreenClick();break;case 70:this.DOMs.player.classList.contains("fullscreen")||this.onfullScreenClick()}},onVideoClick:function(){void 0==this.videoClickDblTimer?this.videoClickDblTimer=setTimeout(function(){this.videoClickDblTimer=void 0,this.onPlayClick()}.bind(this),300):(clearTimeout(this.videoClickDblTimer),this.videoClickDblTimer=void 0,document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement?this.onNormalScreenClick():this.onfullScreenClick())},onMouseActive:function(){this.DOMs.player.classList.add("active"),clearTimeout(this.MouseActiveTimer),this.MouseActiveTimer=setTimeout(function(){this.DOMs.player.classList.remove("active")}.bind(this),1e3)},onPlayClick:function(){this.DOMs.play.classList.contains("paused")?(this.video.play(),this.DOMs.play.classList.remove("paused")):(this.video.pause(),this.DOMs.play.classList.add("paused"))},onSourceClick:function(e){e.classList.contains("curr")||(this.video.preloadStartTime=this.video.currentTime,this.video.src=this.sourceList[0|e.getAttribute("sourceIndex")][1],i(e.parentNode.childNodes).forEach(function(t){e===t?t.classList.add("curr"):t.classList.remove("curr")}.bind(this)))},onProgressAnchorWillSet:function(e){var t=this.video.duration,i=t*e;this.DOMs.current.innerHTML=s(i),this.DOMs.duration.innerHTML=s(t),this.DOMs.progress_anchor.style.width=100*e+"%"},onProgressAnchorSet:function(e){this.video.currentTime=this.video.duration*e},onVolumeAnchorWillSet:function(e){this.video.volume=e,this.DOMs.volume_anchor.style.width=100*e+"%"},onAllScreenClick:function(){var e=document.documentElement.clientWidth,t=document.documentElement.clientHeight;this.iframe.style.cssText=";position:fixed;top:0;left:0;width:"+e+"px;height:"+t+"px;z-index:999999;",this.allScreenWinResizeFunction=this.allScreenWinResizeFunction||function(){this.iframe.style.width=document.documentElement.clientWidth+"px",this.iframe.style.height=document.documentElement.clientHeight+"px"}.bind(this),window.removeEventListener("resize",this.allScreenWinResizeFunction),window.addEventListener("resize",this.allScreenWinResizeFunction),this.DOMs.player.classList.add("allscreen")},onfullScreenClick:function(){["webkitRequestFullScreen","mozRequestFullScreen","requestFullScreen"].forEach(function(e){this.DOMs.player[e]&&this.DOMs.player[e]()}.bind(this)),this.onMouseActive()},onNormalScreenClick:function(){window.removeEventListener("resize",this.allScreenWinResizeFunction),this.iframe.style.cssText=";width:"+this.size[0]+"px;height:"+this.size[1]+"px;",["webkitCancelFullScreen","mozCancelFullScreen","cancelFullScreen"].forEach(function(e){document[e]&&document[e]()}),this.DOMs.player.classList.remove("allscreen")},oncommentsBtnClick:function(){this.enableComment=!this.DOMs["comments-btn"].classList.contains("enable"),this.enableComment?(setTimeout(function(){this.DOMs.comments.style.display="block"}.bind(this),80),this.DOMs["comments-btn"].classList.add("enable")):(this.DOMs.comments.style.display="none",this.DOMs["comments-btn"].classList.remove("enable"))},onAirplayBtnClick:function(){this.video.webkitShowPlaybackTargetPicker()}}},{"./createElement":7,"./delegateClickByClassName":8,"./timeFormat":14}],5:[function(e,t){{var i=(e("./extend"),e("./createElement"));e("./parseDOMByClassNames")}t.exports={init:function(){var e=0;this.sourceList.forEach(function(t,n){i("li",{appendTo:this.DOMs.hd,sourceIndex:n,className:"source "+(n===e?"curr":""),innerHTML:t[0]})}.bind(this)),this.DOMs.video.src=this.sourceList[e][1]}}},{"./createElement":7,"./extend":9,"./parseDOMByClassNames":11}],6:[function(e,t){var i=e("./timeFormat");t.exports={init:function(){this.video.addEventListener("timeupdate",this.onVideoTimeUpdate.bind(this)),this.video.addEventListener("play",this.onVideoPlay.bind(this)),this.video.addEventListener("pause",this.onVideoTimePause.bind(this)),this.video.addEventListener("loadedmetadata",this.onVideoLoadedMetaData.bind(this)),this.video.addEventListener("webkitplaybacktargetavailabilitychanged",this.onPlaybackTargetAvailabilityChanged.bind(this)),setInterval(this.videoBuffered.bind(this),1e3),this.DOMs.volume_anchor.style.width=100*this.video.volume+"%"},onVideoTimeUpdate:function(){var e=this.video.currentTime,t=this.video.duration;this.DOMs.current.innerHTML=i(e),this.DOMs.duration.innerHTML=i(t),this.DOMs.progress_anchor.draging||(this.DOMs.progress_anchor.style.width=100*Math.min(Math.max(e/t,0),1)+"%")},videoBuffered:function(){var e=this.video.buffered,t=this.video.currentTime,i=0==e.length?0:e.end(e.length-1);this.DOMs.buffered_anchor.style.width=100*Math.min(Math.max(i/this.video.duration,0),1)+"%",0==i||t>=i?this.DOMs.player.classList.add("loading"):this.DOMs.player.classList.remove("loading")},onVideoPlay:function(){this.DOMs.play.classList.remove("paused")},onVideoTimePause:function(){this.DOMs.play.classList.add("paused")},onVideoLoadedMetaData:function(){this.video.preloadStartTime&&(this.video.currentTime=this.video.preloadStartTime,delete this.video.preloadStartTime)},onPlaybackTargetAvailabilityChanged:function(e){var t="support-airplay";"available"===e.availability?this.DOMs.player.classList.add(t):this.DOMs.player.classList.remove(t)}}},{"./timeFormat":14}],7:[function(e,t){function i(e,t){var i=document.createElement(e);if("function"==typeof t)t.call(i);else for(var n in t)if(t.hasOwnProperty(n))switch(n){case"appendTo":t[n].appendChild(i);break;case"text":var o=document.createTextNode(t[n]);i.innerHTML="",i.appendChild(o);break;case"innerHTML":case"className":case"id":i[n]=t[n];break;case"style":var s=t[n];for(var r in s)s.hasOwnProperty(r)&&(i.style[r]=s[r]);break;default:i.setAttribute(n,t[n]+"")}return i}t.exports=i},{}],8:[function(e,t){function i(e){return Array.prototype.slice.call(e)}function n(e){this._eventMap={},this._rootElement=e,this._isRootElementBindedClick=!1,this._bindClickFunction=function(e){!function t(e,n){n&&n.nodeName&&(n.classList&&i(n.classList).forEach(function(t){e.trigger(t,n)}),t(e,n.parentNode))}(this,e.target)}.bind(this)}var o=e("./extend");o(n.prototype,{on:function(e,t,i){void 0===this._eventMap[e]&&(this._eventMap[e]=[]),this._eventMap[e].push([t,i]),this._isRootElementBindedClick||(_isRootElementBindedClick=!0,this._rootElement.addEventListener("click",this._bindClickFunction,!1))},off:function(e,t){if(void 0!=this._eventMap[e])for(var i=this._eventMap[e].length;i--;)if(this._eventMap[e][i][0]===t){this._eventMap[e].splice(i,1);break}for(var n in this._eventMap)break;void 0===n&&this._isRootElementBindedClick&&(_isRootElementBindedClick=!1,this._rootElement.removeEventListener("click",this._bindClickFunction,!1))},trigger:function(e,t){t=void 0===t?this._rootElement.getElementsByTagNames(e):[t],t.forEach(function(t){(this._eventMap[e]||[]).forEach(function(e){e[0].call(e[1],t)})}.bind(this))}}),t.exports=function(e){return new n(e)}},{"./extend":9}],9:[function(e,t){function i(e){for(var t,i=arguments.length,n=1;i>n;){t=arguments[n++];for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o])}return e}t.exports=i},{}],10:[function(e){function t(e,t,i,n){this.id=e,this.size=t.split("x"),this.sourceList=i||[],this.comments=n,this.init()}e("./component")(t,e("./component_build"),e("./component_event"),e("./component_video"),e("./component_source"),e("./component_comments")),MAMAPlayer=t},{"./component":1,"./component_build":2,"./component_comments":3,"./component_event":4,"./component_source":5,"./component_video":6}],11:[function(e,t){function i(e,t){var i={};return t.forEach(function(t){i[t]=e.getElementsByClassName(t)[0]}),i}t.exports=i},{}],12:[function(e,t){t.exports='* { margin:0; padding:0; }body { font-family: "PingHei","Lucida Grande", "Lucida Sans Unicode", "STHeiti", "Helvetica","Arial","Verdana","sans-serif"; font-size:16px;}html, body, .player { height: 100%; }.player:-webkit-full-screen { width: 100%; cursor:url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==); }.player:-moz-full-screen { width: 100%; cursor:url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==); }.player:full-screen { width: 100%; cursor:url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==); }.player { border-radius: 3px; overflow: hidden; position: relative; cursor: default;  -webkit-user-select: none;  -moz-user-select: none; user-select: none;}.video-frame { box-sizing: border-box; padding-bottom: 50px; height: 100%; overflow: hidden; position: relative;}.video-frame .comments{ position: absolute; top:0;left:0; width:100%; height:100%;  -webkit-transform:translateZ(0);  -moz-transform:translateZ(0); transform:translateZ(0);  pointer-events: none;}.player:-webkit-full-screen .video-frame { padding-bottom: 0px; }.player:-moz-full-screen .video-frame { padding-bottom: 0px; }.player:full-screen .video-frame{ padding-bottom: 0px; }.video { width: 100%;  height: 100%; background: #000000;}.controller {  position: absolute; bottom: 0px;  left:0; right:0;  background: #24272A;  height: 50px;}.controller .loading-icon { display: none;  position: absolute; width: 20px;  height: 20px; line-height: 20px;  text-align: center; font-size: 20px;  color: #ffffff; top: -30px; right: 10px;}.player.loading .controller .loading-icon {  display: block;}.player:-webkit-full-screen .controller { -webkit-transform:translateY(50px); -webkit-transition: -webkit-transform 0.3s ease;}.player:-moz-full-screen .controller { -moz-transform:translateY(50px);  -moz-transition: -moz-transform 0.3s ease;}.player:full-screen .controller {  transform:translateY(50px); transition: transform 0.3s ease;}.player.active:-webkit-full-screen { cursor: default;}.player.active:-moz-full-screen {  cursor: default;}.player.active:full-screen { cursor: default;}.player.active:-webkit-full-screen .controller,.player:-webkit-full-screen .controller:hover { -webkit-transform:translateY(0);  cursor: default;}.player.active:-moz-full-screen .controller,.player:-moz-full-screen .controller:hover { -moz-transform:translateY(0); cursor: default;}.player.active:full-screen .controller.player:full-screen .controller:hover {  transform:translateY(0);  cursor: default;}.player.active:-webkit-full-screen .controller .progress .progress_anchor:after,.player:-webkit-full-screen .controller:hover .progress .progress_anchor:after { height:12px;}.player.active:-moz-full-screen .controller .progress .progress_anchor:after,.player:-moz-full-screen .controller:hover .progress .progress_anchor:after { height:12px;}.player.active:full-screen .controller .progress .progress_anchor:after,.player:full-screen .controller:hover .progress .progress_anchor:after { height:12px;}.player:-webkit-full-screen .controller .progress .progress_anchor:after { height:4px;}.player:-moz-full-screen .controller .progress .progress_anchor:after { height:4px;}.player:full-screen .controller .progress .progress_anchor:after {  height:4px;}.controller .progress { position: absolute; top:0px;  left:0; right:0;  border-right: 4px solid #181A1D;  border-left: 8px solid #DF6558; height: 4px;  background: #181A1D;  z-index:1;  -webkit-transform: translateZ(0); -moz-transform: translateZ(0);  transform: translateZ(0);}.controller .progress:after { content:""; display: block; position: absolute; top:0px;  left:0; right:0;  bottom:-10px; height: 10px;}.controller .progress .anchor { height: 4px;  background: #DF6558;  position: absolute; top:0;left:0;}.controller .progress .anchor:after { content:""; display: block; width: 12px;  background: #DF6558;  position: absolute; right:-4px; top: 50%; height: 12px; box-shadow: 0 0 2px rgba(0,0,0, 0.4); border-radius: 12px;  -webkit-transform: translateY(-50%);  -moz-transform: translateY(-50%); transform: translateY(-50%);}.controller .progress .anchor.buffered_anchor {  position: relative; background: rgba(255,255,255,0.1);}.controller .progress .anchor.buffered_anchor:after {  box-shadow: none; height: 4px;  width: 4px; border-radius: 0; background: rgba(255,255,255,0.1);}.controller .right { height: 50px; position: absolute; top:0;  left:10px;  right:10px; pointer-events: none;}.controller .play,.controller .volume,.controller .time,.controller .hd,.controller .airplay,.controller .allscreen,.controller .normalscreen,.controller .comments-btn,.controller .fullscreen { padding-top:4px;  height: 46px; line-height: 50px;  text-align: center; color: #eeeeee; float:left; text-shadow:0 0 2px rgba(0,0,0,0.5);  pointer-events: auto;}.controller .hd,.controller .airplay,.controller .allscreen,.controller .normalscreen,.controller .comments-btn,.controller .fullscreen { float:right;}.controller .play {  width: 36px;  padding-left: 10px; cursor: pointer;}.controller .play:after {  font-family: "FontAwesome"; content: "\\f04c";}.controller .play.paused:after { content: "\\f04b";}.controller .volume {  min-width: 30px;  position: relative; overflow: hidden; -webkit-transition: min-width 0.3s ease 0.5s; -moz-transition: min-width 0.3s ease 0.5s;  transition: min-width 0.3s ease 0.5s;}.controller .volume:hover { min-width: 128px;}.controller .volume:before {  font-family: "FontAwesome"; content: "\\f028";  width: 36px;  display: block;}.controller .volume .progress { width: 70px;  top: 27px;  left: 40px;}.controller .time { font-size: 12px;  font-weight: bold;  padding-left: 10px;}.controller .time .current {  color: #DF6558;}.controller .fullscreen,.controller .airplay,.controller .allscreen,.controller .comments-btn,.controller .normalscreen { width: 36px;  cursor: pointer;}.controller .comments-btn {  margin-right: -15px;  display: none;}.player.has-comments .controller .comments-btn { display: block;}.controller .comments-btn:before {  font-family: "FontAwesome"; content: "\\f075";}.controller .comments-btn.enable:before {  color: #DF6558;}.controller .airplay,.controller .normalscreen {  display: none;}.player:-webkit-full-screen .controller .fullscreen,.player:-webkit-full-screen .controller .allscreen { display: none;}.player:-webkit-full-screen .controller .normalscreen,.player.allscreen .controller .normalscreen,.player.support-airplay .controller .airplay { display: block;}.player.allscreen .controller .allscreen {  display: none;}.controller .fullscreen:before { font-family: "FontAwesome"; content: "\\f0b2";}.controller .allscreen:before {  font-family: "FontAwesome"; content: "\\f065";}.controller .normalscreen:before { font-family: "FontAwesome"; content: "\\f066";}.controller .airplay { background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0ibWFtYS1haXJwbGF5LWljb24iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMjJweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMjIgMTYiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwb2x5bGluZSBwb2ludHM9IjUsMTIgMSwxMiAxLDEgMjEsMSAyMSwxMiAxNywxMiIgc3R5bGU9ImZpbGw6dHJhbnNwYXJlbnQ7c3Ryb2tlOndoaXRlO3N0cm9rZS13aWR0aDoxIi8+PHBvbHlsaW5lIHBvaW50cz0iNCwxNiAxMSwxMCAxOCwxNiIgc3R5bGU9ImZpbGw6d2hpdGU7c3Ryb2tlOnRyYW5zcGFyZW50O3N0cm9rZS13aWR0aDowIi8+PC9zdmc+DQo=) no-repeat center 20px;  background-size: 22px auto;}.controller .hd { white-space:nowrap; overflow: hidden; margin-right: 10px; text-align: right;}.controller .hd:hover li { max-width: 300px;}.controller .hd li {  display: inline-block;  max-width: 0px; -webkit-transition: max-width 0.8s ease 0.3s; -moz-transition: max-width 0.8s ease 0.3s;  transition: max-width 0.8s ease 0.3s; overflow: hidden; font-size: 14px;  font-weight: bold;  position: relative; cursor: pointer;}.controller .hd li:before {  content: "";  display: inline-block;  width:20px;}.controller .hd li:before { content: "";  display: inline-block;  width:20px;}.controller .hd li.curr { max-width: 300px; cursor: default;  color: #DF6558;}.controller .hd li.curr:after { content: "";  display: block; position: absolute; width:4px;  height:4px; border-radius: 50%; background: #ffffff;  left: 12px; top: 23px;  opacity: 0; -webkit-transition: opacity 0.5s ease 0.3s; -moz-transition: opacity 0.5s ease 0.3s;  transition: opacity 0.5s ease 0.3s;}'},{}],13:[function(e,t){t.exports='<div class="player">  <div class="video-frame"><video class="video" autoplay="autoplay"></video><canvas class="comments"></canvas></div>  <div class="controller">    <div class="loading-icon fa fa-spin fa-circle-o-notch"></div>   <div class="progress">      <div class="anchor buffered_anchor" style="width:0%"></div>     <div class="anchor progress_anchor" style="width:0%"></div>   </div>    <div class="right">     <div class="fullscreen"></div>      <div class="allscreen"></div>     <div class="normalscreen"></div>      <div class="airplay"></div>     <ul class="hd"></ul>      <div class="comments-btn"></div>     </div>    <div class="left">     <div class="play paused"></div>     <div class="volume">        <div class="progress">          <div class="anchor volume_anchor" style="width:0%"></div>       </div>      </div>      <div class="time">        <span class="current">00:00:00</span> / <span class="duration">00:00:00</span>      </div>     </div> </div></div>'},{}],14:[function(e,t){function i(e,t){return(Array(t).join(0)+e).slice(-t)}function n(e){var t,n=[];return[3600,60,1].forEach(function(o){n.push(i(t=e/o|0,2)),e-=t*o}),n.join(":")}t.exports=n},{}]},{},[10]);

//exports
module.exports = MAMAPlayer;
},{}],13:[function(require,module,exports){
/*
 * Purl (A JavaScript URL parser) v2.3.1
 * Developed and maintanined by Mark Perkins, mark@allmarkedup.com
 * Source repository: https://github.com/allmarkedup/jQuery-URL-Parser
 * Licensed under an MIT-style license. See https://github.com/allmarkedup/jQuery-URL-Parser/blob/master/LICENSE for details.
 */

var tag2attr = {
        a       : 'href',
        img     : 'src',
        form    : 'action',
        base    : 'href',
        script  : 'src',
        iframe  : 'src',
        link    : 'href',
        embed   : 'src',
        object  : 'data'
    },

    key = ['source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'], // keys available to query

    aliases = { 'anchor' : 'fragment' }, // aliases for backwards compatability

    parser = {
        strict : /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,  //less intuitive, more accurate to the specs
        loose :  /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ // more intuitive, fails on relative paths and deviates from specs
    },

    isint = /^[0-9]+$/;

function parseUri( url, strictMode ) {
    var str = decodeURI( url ),
    res   = parser[ strictMode || false ? 'strict' : 'loose' ].exec( str ),
    uri = { attr : {}, param : {}, seg : {} },
    i   = 14;

    while ( i-- ) {
        uri.attr[ key[i] ] = res[i] || '';
    }

    // build query and fragment parameters
    uri.param['query'] = parseString(uri.attr['query']);
    uri.param['fragment'] = parseString(uri.attr['fragment']);

    // split path and fragement into segments
    uri.seg['path'] = uri.attr.path.replace(/^\/+|\/+$/g,'').split('/');
    uri.seg['fragment'] = uri.attr.fragment.replace(/^\/+|\/+$/g,'').split('/');

    // compile a 'base' domain attribute
    uri.attr['base'] = uri.attr.host ? (uri.attr.protocol ?  uri.attr.protocol+'://'+uri.attr.host : uri.attr.host) + (uri.attr.port ? ':'+uri.attr.port : '') : '';

    return uri;
}

function getAttrName( elm ) {
    var tn = elm.tagName;
    if ( typeof tn !== 'undefined' ) return tag2attr[tn.toLowerCase()];
    return tn;
}

function promote(parent, key) {
    if (parent[key].length === 0) return parent[key] = {};
    var t = {};
    for (var i in parent[key]) t[i] = parent[key][i];
    parent[key] = t;
    return t;
}

function parse(parts, parent, key, val) {
    var part = parts.shift();
    if (!part) {
        if (isArray(parent[key])) {
            parent[key].push(val);
        } else if ('object' == typeof parent[key]) {
            parent[key] = val;
        } else if ('undefined' == typeof parent[key]) {
            parent[key] = val;
        } else {
            parent[key] = [parent[key], val];
        }
    } else {
        var obj = parent[key] = parent[key] || [];
        if (']' == part) {
            if (isArray(obj)) {
                if ('' !== val) obj.push(val);
            } else if ('object' == typeof obj) {
                obj[keys(obj).length] = val;
            } else {
                obj = parent[key] = [parent[key], val];
            }
        } else if (~part.indexOf(']')) {
            part = part.substr(0, part.length - 1);
            if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
            parse(parts, obj, part, val);
            // key
        } else {
            if (!isint.test(part) && isArray(obj)) obj = promote(parent, key);
            parse(parts, obj, part, val);
        }
    }
}

function merge(parent, key, val) {
    if (~key.indexOf(']')) {
        var parts = key.split('[');
        parse(parts, parent, 'base', val);
    } else {
        if (!isint.test(key) && isArray(parent.base)) {
            var t = {};
            for (var k in parent.base) t[k] = parent.base[k];
            parent.base = t;
        }
        if (key !== '') {
            set(parent.base, key, val);
        }
    }
    return parent;
}

function parseString(str) {
    return reduce(String(str).split(/&|;/), function(ret, pair) {
        try {
            pair = decodeURIComponent(pair.replace(/\+/g, ' '));
        } catch(e) {
            // ignore
        }
        var eql = pair.indexOf('='),
            brace = lastBraceInKey(pair),
            key = pair.substr(0, brace || eql),
            val = pair.substr(brace || eql, pair.length);

        val = val.substr(val.indexOf('=') + 1, val.length);

        if (key === '') {
            key = pair;
            val = '';
        }

        return merge(ret, key, val);
    }, { base: {} }).base;
}

function set(obj, key, val) {
    var v = obj[key];
    if (typeof v === 'undefined') {
        obj[key] = val;
    } else if (isArray(v)) {
        v.push(val);
    } else {
        obj[key] = [v, val];
    }
}

function lastBraceInKey(str) {
    var len = str.length,
        brace,
        c;
    for (var i = 0; i < len; ++i) {
        c = str[i];
        if (']' == c) brace = false;
        if ('[' == c) brace = true;
        if ('=' == c && !brace) return i;
    }
}

function reduce(obj, accumulator){
    var i = 0,
        l = obj.length >> 0,
        curr = arguments[2];
    while (i < l) {
        if (i in obj) curr = accumulator.call(undefined, curr, obj[i], i, obj);
        ++i;
    }
    return curr;
}

function isArray(vArg) {
    return Object.prototype.toString.call(vArg) === "[object Array]";
}

function keys(obj) {
    var key_array = [];
    for ( var prop in obj ) {
        if ( obj.hasOwnProperty(prop) ) key_array.push(prop);
    }
    return key_array;
}

function purl( url, strictMode ) {
    if ( arguments.length === 1 && url === true ) {
        strictMode = true;
        url = undefined;
    }
    strictMode = strictMode || false;
    url = url || window.location.toString();

    return {

        data : parseUri(url, strictMode),

        // get various attributes from the URI
        attr : function( attr ) {
            attr = aliases[attr] || attr;
            return typeof attr !== 'undefined' ? this.data.attr[attr] : this.data.attr;
        },

        // return query string parameters
        param : function( param ) {
            return typeof param !== 'undefined' ? this.data.param.query[param] : this.data.param.query;
        },

        // return fragment parameters
        fparam : function( param ) {
            return typeof param !== 'undefined' ? this.data.param.fragment[param] : this.data.param.fragment;
        },

        // return path segments
        segment : function( seg ) {
            if ( typeof seg === 'undefined' ) {
                return this.data.seg.path;
            } else {
                seg = seg < 0 ? this.data.seg.path.length + seg : seg - 1; // negative segments count from the end
                return this.data.seg.path[seg];
            }
        },

        // return fragment segments
        fsegment : function( seg ) {
            if ( typeof seg === 'undefined' ) {
                return this.data.seg.fragment;
            } else {
                seg = seg < 0 ? this.data.seg.fragment.length + seg : seg - 1; // negative segments count from the end
                return this.data.seg.fragment[seg];
            }
        }

    };

}

module.exports = purl;

},{}],14:[function(require,module,exports){
/*  \uff03function queryString#
 *  < Object   \u4f8b\u5982 {a:1,b:2,c:3}
 *  > String   \u4f8b\u5982 a=1&b=2&c=3
 *  \u7528\u4e8e\u62fc\u88c5url\u5730\u5740\u7684query
 */
function queryString (obj) {
  var query = []
  for (one in obj) {
    if (obj.hasOwnProperty(one)) {
      query.push([one, obj[one]].join('='))
    }
  }
  return query.join('&')
}
module.exports = queryString
},{}],15:[function(require,module,exports){
/*  91porn 
 *  @Snooze 2015-7-26
 */
var canPlayM3U8 = require('./canPlayM3U8')
var ajax        = require('./ajax')
var log         = require('./log')

exports.match = function (url) {
  if (window.so && window.so.variables) {
    var fileId = window.so.variables.file
    var secCode = window.so.variables.seccode
    var max_vid = window.so.variables.max_vid
    return !!fileId & !!secCode & !!max_vid & 
      /view_video\.php\?viewkey/.test( url.attr('source') )
  }
  return false;
}

exports.getVideos = function (url, callback) {  
  //var mediaSpaceHTML = document.getElementById("mediaspace").innerHTML
  //var fileId = /file','(.*?)'/i.exec(mediaSpaceHTML)[1]
  //var secCode = /seccode','(.*?)'/i.exec(mediaSpaceHTML)[1]
  //var max_vid = /max_bid','(.*?)'/i.exec(mediaSpaceHTML)[1]
  var fileId = window.so.variables.file
  var secCode = window.so.variables.seccode
  var max_vid = window.so.variables.max_vid
  

  var mp4 = function(callback){
    ajax({
      url: 'http://www.91porn.com/getfile.php',
      jsonp: false,
      param: {
        VID: fileId,
        mp4: '0',
        seccode: secCode,
        max_vid: max_vid
      },
      contentType: 'notJSON',
      callback: function(param){
        if(param == -1 || param.code == -1) return log('\u89e3\u679091porn\u89c6\u9891\u5730\u5740\u5931\u8d25')
        mp4Url = param.split('=')[1].split('&')[0]
        var urls = []
        urls.push(['\u4f4e\u6e05\u7248', mp4Url])
        log('\u89e3\u679091porn\u89c6\u9891\u5730\u5740\u6210\u529f ' + urls.map(function (item) {return '<a href='+item[1]+'>'+item[0]+'</a>'}).join(' '), 2)
        // console.info(urls)
        return callback(urls);
      }
    });
  };
  mp4(callback)
}




},{"./ajax":2,"./canPlayM3U8":3,"./log":9}],16:[function(require,module,exports){
/*  bilibli 
 *  @\u6731\u4e00
 */
var purl      = require('./purl')
var log       = require('./log')
var httpProxy = require('./httpProxy')
var getCookie = require('./getCookie')

function pad(num, n) { 
  return (Array(n).join(0) + num).slice(-n)
}

exports.match = function (url) {
  return url.attr('host').indexOf('bilibili') >= 0 && /^\/video\/av\d+\/$/.test(url.attr('directory'))
}

exports.getVideos = function (url, callback) {
  log('\u5f00\u59cb\u89e3\u6790bilibli\u89c6\u9891\u5730\u5740')
  var aid = url.attr('directory').match(/^\/video\/av(\d+)\/$/)[1]
  var page = (function () {
    pageMatch = url.attr('file').match(/^index\_(\d+)\.html$/)
    return pageMatch ? pageMatch[1] : 1
  }())
  
  httpProxy(
    'http://www.bilibili.com/m/html5', 
    'get', 
    {aid: aid, page: page, sid: getCookie('sid')},
  function (rs) {
    if (rs && rs.src) {
      log('\u83b7\u53d6\u5230<a href="'+rs.src+'">\u89c6\u9891\u5730\u5740</a>, \u5e76\u5f00\u59cb\u89e3\u6790bilibli\u5f39\u5e55')
      var source = [ ['bilibili', rs.src] ]
      httpProxy(rs.cid, 'get', {}, function (rs) {

        if (rs && rs.i) {
          var comments = [].concat(rs.i.d || [])
          comments = comments.map(function (comment) {
            var p = comment['@p'].split(',')
            switch (p[1] | 0) {
              case 4:  p[1] = 'bottom'; break
              case 5:  p[1] =  'top'; break
              default: p[1] = 'loop'
            }
            return {
              time: parseFloat(p[0]),
              pos:  p[1],
              color: '#' + pad((p[3] | 0).toString(16), 6),
              text: comment['#text']
            }
          }).sort(function (a, b) {
            return a.time - b.time
          })
          log('\u4e00\u5207\u987a\u5229\u5f00\u59cb\u64ad\u653e', 2)
          callback(source, comments)
        } else {
          log('\u89e3\u6790bilibli\u5f39\u5e55\u5931\u8d25, \u4f46\u52c9\u5f3a\u53ef\u4ee5\u64ad\u653e', 2)
          callback(source)
        }

      }, {gzinflate:1, xml:1})
    } else {
      log('\u89e3\u6790bilibli\u89c6\u9891\u5730\u5740\u5931\u8d25', 2)
      callback(false)
    }
  })
}

},{"./getCookie":6,"./httpProxy":7,"./log":9,"./purl":13}],17:[function(require,module,exports){
/*  tudou 
 *  @\u6731\u4e00
 */
var canPlayM3U8 = require('./canPlayM3U8')
var ajax        = require('./ajax')
var log         = require('./log')

exports.match = function (url) {
  return true;
}

exports.getVideos = function (url, callback) {
  ajax({
    url: 'http://acfunfix.sinaapp.com/mama.php',
    jsonp: true,
    param: {
      url: url.attr('source')
    },
    callback: function(param) {
      if (param.code != 200) {
        callback(false);
      }
      var source = canPlayM3U8 && param.m3u8 ? param.m3u8 : param.mp4;
      var rs = [];
      if (source) {
        for(type in source) {
          rs.push([type, source[type]]);
        }
        callback(rs);
      }
    }
  })
}
},{"./ajax":2,"./canPlayM3U8":3,"./log":9}],18:[function(require,module,exports){
/*  hunantv 
 *  @\u60c5\u8ff7\u6d77\u9f9fpizza
 */
var canPlayM3U8 = require('./canPlayM3U8')
var ajax        = require('./ajax')
var log         = require('./log')
exports.match = function (url) {
  return /www\.hunantv\.com/.test(url.attr('host'))
}
exports.getVideos = function (url, callback) {
  //\u8292\u679c\u53f0\u6ca1\u6709mp4 o(╯□╰)o
  if (canPlayM3U8) {
    var getParams = function(req_url){
      var params_url = req_url.split("?")[1];
      var params_tmp = new Array();
      params_tmp = params_url.split("&");
      var params = {};
      for(key in params_tmp){
        param = params_tmp[key];
        item = new Array();
        item = params_tmp[key].split("=");
        if (item[0] != '') {
            params[item[0]] = item[1];
        }
      }
      return params;
    }

    var m3u8_req_parms = '&fmt=6&pno=7&m3u8=1';
    var str_orig = document.getElementsByName('FlashVars')[0].getAttribute('value');
    var str_tmp = str_orig.split("&file=")[1];
    var req_url = str_tmp.split("%26fmt")[0];
    req_url = req_url + m3u8_req_parms;
    req_url = decodeURIComponent(req_url);
    params = getParams(req_url);

    //\u83b7\u53d6\u4e09\u79cd\u6e05\u6670\u5ea6
    var limitrate = new Array();
    limitrate = ['570', '1056', '1615'];
    urls = new Array();
    params.limitrate = limitrate[0];
    text = "\u6807\u6e05";
    ajax({
      url: 'http://pcvcr.cdn.imgo.tv/ncrs/vod.do',
      jsonp: true,
      param: params,
      callback: function(data){
        if (data.status == 'ok') urls.push([text, data.info])
        params.limitrate = limitrate[1];
        text = "\u9ad8\u6e05";
        ajax({
          url: 'http://pcvcr.cdn.imgo.tv/ncrs/vod.do',
          jsonp: true,
          param: params,
          callback: function(data){
            if (data.status == 'ok') urls.push([text, data.info])
            params.limitrate = limitrate[2];
            text = "\u8d85\u6e05";
            ajax({
              url: 'http://pcvcr.cdn.imgo.tv/ncrs/vod.do',
              jsonp: true,
              param: params,
              callback: function(data){
                if (data.status == 'ok') urls.push([text, data.info])
                return callback(urls);
              }
            });
          }
        });
      }
    });
  }else{
    log('\u8bf7\u4f7f\u7528Safari\u89c2\u770b\u672c\u89c6\u9891');
    setTimeout(function(){
      return callback();
    }, 2000);
  }
}
},{"./ajax":2,"./canPlayM3U8":3,"./log":9}],19:[function(require,module,exports){
/*  iqiyi 
 *  @\u6731\u4e00
 */
var canPlayM3U8 = require('./canPlayM3U8')
var queryString = require('./queryString')
var getCookie = require('./getCookie')
var ajax = require('./ajax')
var httpProxy = require('./httpProxy')
var log = require('./log')

function formatVd (vd) {
  switch (vd) {
    case 1:  return {index: 2, text: '\u6807\u6e05'  }
    case 2:  return {index: 3, text: '\u9ad8\u6e05'  }
    case 96: return {index: 1, text: '\u6e23\u753b\u8d28' }
    default: return {index: 0, text: '\u672a\u77e5'  }
  }
}

exports.match = function (url) {
  return /^http:\/\/www\.iqiyi\.com/.test(url.attr('source')) && !!window.Q.PageInfo
}

exports.getVideos = function (url, callback) {
  var uid = '';
  try{
    uid = JSON.parse(getCookie('P00002')).uid
  }catch(e) {}
  var cupid = 'qc_100001_100102' //\u8fd9\u4e2a\u5199\u6b7b\u5427
  var tvId = window.Q.PageInfo.playPageInfo.tvId
  var albumId = window.Q.PageInfo.playPageInfo.albumId
  var vid = window.Q.PageInfo.playPageInfo.vid ||
    document.getElementById('flashbox').getAttribute('data-player-videoid')

  var param = weorjjigh(tvId)
  param.uid = uid
  param.cupid = cupid
  param.platForm = 'h5'
  param.type = canPlayM3U8 ? 'm3u8' : 'mp4',
  param.qypid = tvId + '_21'
  ajax({
    url: 'http://cache.m.iqiyi.com/jp/tmts/'+tvId+'/'+vid+'/',
    jsonp: true,
    param: param,
    callback: function (rs) {
      var source = []      
      if (rs.data.vidl && rs.data.vidl.length) {
        source = rs.data.vidl
          .map(function (data) {
            var vData = formatVd(data.vd);
            vData.m3u = data.m3u;
            return vData;
          })
          .sort(function (dataA, dataB) {
            return dataB.index - dataA.index
          })
          .map(function (data) {
            return [data.text, data.m3u]
          })
      } else {
        if (rs.data.m3u.length > 0) source = ['\u6807\u6e05', rs.data.m3u]
      }
      callback(source)
    }
  })
}

},{"./ajax":2,"./canPlayM3U8":3,"./getCookie":6,"./httpProxy":7,"./log":9,"./queryString":14}],20:[function(require,module,exports){
/*  tudou 
 *  @\u6731\u4e00
 */
var canPlayM3U8 = require('./canPlayM3U8')
var ajax        = require('./ajax')
var log         = require('./log')
var youku       = require('./seeker_youku')

exports.match = function (url) {
  var _id = window.iid || (window.pageConfig && window.pageConfig.iid) || (window.itemData && window.itemData.iid)
  var youkuCode = window.itemData && window.itemData.vcode
  return /tudou\.com/.test(url.attr('host')) && (youkuCode || _id)
}

exports.getVideos = function (url, callback) {  
  var youkuCode = window.itemData && window.itemData.vcode
  if (youkuCode) {
    return youku.parseYoukuCode(youkuCode, callback)
  }
  var _id = window.iid || (window.pageConfig && window.pageConfig.iid) || (window.itemData && window.itemData.iid);
  var m3u8 = function(callback){    
    var urls = [
      ['\u539f\u753b', 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + _id + '&st=5'],
      ['\u8d85\u6e05', 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + _id + '&st=4'],
      ['\u9ad8\u6e05', 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + _id + '&st=3'],
      ['\u6807\u6e05', 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + _id + '&st=2']
    ]
    var _s
    if(window.itemData && window.itemData.segs){
      urls = []
      _s   = JSON.parse(window.itemData.segs)
      if(_s[5]) urls.push(['\u539f\u753b', 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + _id + '&st=5'])
      if(_s[4]) urls.push(['\u8d85\u6e05', 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + _id + '&st=4'])
      if(_s[3]) urls.push(['\u9ad8\u6e05', 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + _id + '&st=3'])
      if(_s[2]) urls.push(['\u6807\u6e05', 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + _id + '&st=2'])
    }   
    log('\u89e3\u6790tudou\u89c6\u9891\u5730\u5740\u6210\u529f ' + urls.map(function (item) {return '<a href='+item[1]+'>'+item[0]+'</a>'}).join(' '), 2)
    callback(urls)
  };
  var mp4 = function(callback){
    ajax({
      url: 'http://vr.tudou.com/v2proxy/v2.js',
      param: {
        it: _id,
        st: '52%2C53%2C54'
      },
      jsonp: 'jsonp',
      callback: function(param){
        if(param === -1 || param.code == -1) return log('\u89e3\u6790tudou\u89c6\u9891\u5730\u5740\u5931\u8d25')
        for(var urls=[],i=0,len=param.urls.length; i<len; i++){ urls.push([i, param.urls[i]]); }
        log('\u89e3\u6790tudou\u89c6\u9891\u5730\u5740\u6210\u529f ' + urls.map(function (item) {return '<a href='+item[1]+'>'+item[0]+'</a>'}).join(' '), 2)
        return callback(urls);
      }
    });
  };
  canPlayM3U8 ? m3u8(callback) : mp4(callback)
}
},{"./ajax":2,"./canPlayM3U8":3,"./log":9,"./seeker_youku":21}],21:[function(require,module,exports){
/*  youku 
 *  @\u6731\u4e00
 */
var canPlayM3U8 = require('./canPlayM3U8')
var ajax        = require('./ajax')
var log         = require('./log')
exports.match = function (url) {
  return /v\.youku\.com/.test(url.attr('host')) && !!window.videoId
}
var parseYoukuCode = exports.parseYoukuCode = function (_id, callback) {
  log('\u5f00\u59cb\u89e3\u6790youku\u89c6\u9891\u5730\u5740')  
  var mk_a3 = 'b4et';
  var mk_a4 = 'boa4';
  var userCache_a1 = '4';
  var userCache_a2 = '1';
  var rs;
  var sid;
  var token;
  function decode64(a) {
    if (!a)
      return "";
    a = a.toString();
    var b, c, d, e, f, g, h, i = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
    for (g = a.length, f = 0, h = ""; g > f;) {
      do
        b = i[255 & a.charCodeAt(f++)];
      while (g > f && -1 == b);
      if (-1 == b)
        break;
      do
        c = i[255 & a.charCodeAt(f++)];
      while (g > f && -1 == c);
      if (-1 == c)
        break;
      h += String.fromCharCode(b << 2 | (48 & c) >> 4);
      do {
        if (d = 255 & a.charCodeAt(f++), 61 == d)
          return h;
        d = i[d]
      }
      while (g > f && -1 == d);
      if (-1 == d)
        break;
      h += String.fromCharCode((15 & c) << 4 | (60 & d) >> 2);
      do {
        if (e = 255 & a.charCodeAt(f++), 61 == e)
          return h;
        e = i[e]
      }
      while (g > f && -1 == e);
      if (-1 == e)
        break;
      h += String.fromCharCode((3 & d) << 6 | e)
    }
    return h
  }

  function D(a) {
    if (!a) return "";
    var a = a.toString(),
      c, b, f, e, g, h;
    f = a.length;
    b = 0;
    for (c = ""; b < f;) {
      e = a.charCodeAt(b++) & 255;
      if (b == f) {
        c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
        c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4);
        c += "==";
        break
      }
      g = a.charCodeAt(b++);
      if (b == f) {
        c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
        c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4 | (g & 240) >> 4);
        c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((g &
          15) << 2);
        c += "=";
        break
      }
      h = a.charCodeAt(b++);
      c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
      c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4 | (g & 240) >> 4);
      c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((g & 15) << 2 | (h & 192) >> 6);
      c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h & 63)
    }
    return c
  }

  function E(a, c) {
    for (var b = [], f = 0, i, e = "", h = 0; 256 > h; h++) b[h] = h;
    for (h = 0; 256 > h; h++) f = (f + b[h] + a.charCodeAt(h % a.length)) % 256, i = b[h], b[h] = b[f], b[f] = i;
    for (var q = f = h = 0; q < c.length; q++) h = (h + 1) % 256, f = (f + b[h]) % 256, i = b[h], b[h] = b[f], b[f] = i, e += String.fromCharCode(c.charCodeAt(q) ^ b[(b[h] + b[f]) % 256]);
    return e
  }

  function F(a, c) {
    for (var b = [], f = 0; f < a.length; f++) {
      for (var i = 0, i = "a" <= a[f] && "z" >= a[f] ? a[f].charCodeAt(0) - 97 : a[f] - 0 + 26, e = 0; 36 > e; e++)
        if (c[e] == i) {
          i = e;
          break
        }
      b[f] = 25 < i ? i - 26 : String.fromCharCode(i + 97)
    }
    return b.join("")
  }
  
  var PlayListData = function(a, b, c) {
      var d = this;
      new Date;
      this._sid = sid, this._fileType = c, this._videoSegsDic = {};
      this._ip = a.security.ip;
      var e = (new RandomProxy, []),
        f = [];
      f.streams = {}, f.logos = {}, f.typeArr = {}, f.totalTime = {};
      for (var g = 0; g < b.length; g++) {
        for (var h = b[g].audio_lang, i = !1, j = 0; j < e.length; j++)
          if (e[j] == h) {
            i = !0;
            break
          }
        i || e.push(h)
      }
      for (var g = 0; g < e.length; g++) {
        for (var k = e[g], l = {}, m = {}, n = [], j = 0; j < b.length; j++) {
          var o = b[j];
          if (k == o.audio_lang) {
            if (!d.isValidType(o.stream_type))
              continue;
            var p = d.convertType(o.stream_type),
              q = 0;
            "none" != o.logo && (q = 1), m[p] = q;
            var r = !1;
            for (var s in n)
              p == n[s] && (r = !0);
            r || n.push(p);
            var t = o.segs;
            if (null == t)
              continue;
            var u = [];
            r && (u = l[p]);
            for (var v = 0; v < t.length; v++) {
              var w = t[v];
              if (null == w)
                break;
              var x = {};
              x.no = v, 
              x.size = w.size, 
              x.seconds = Number(w.total_milliseconds_video) / 1e3, 
              x.milliseconds_video = Number(o.milliseconds_video) / 1e3, 
              x.key = w.key, x.fileId = this.getFileId(o.stream_fileid, v), 
              x.src = this.getVideoSrc(j, v, a, o.stream_type, x.fileId), 
              x.type = p, 
              u.push(x)
            }
            l[p] = u
          }
        }
        var y = this.langCodeToCN(k).key;
        f.logos[y] = m, f.streams[y] = l, f.typeArr[y] = n        
      }
      this._videoSegsDic = f, this._videoSegsDic.lang = this.langCodeToCN(e[0]).key
    },
    RandomProxy = function(a) {
      this._randomSeed = a, this.cg_hun()
    };
  RandomProxy.prototype = {
    cg_hun: function() {
      this._cgStr = "";
      for (var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890", b = a.length, c = 0; b > c; c++) {
        var d = parseInt(this.ran() * a.length);
        this._cgStr += a.charAt(d), a = a.split(a.charAt(d)).join("")
      }
    },
    cg_fun: function(a) {
      for (var b = a.split("*"), c = "", d = 0; d < b.length - 1; d++)
        c += this._cgStr.charAt(b[d]);
      return c
    },
    ran: function() {
      return this._randomSeed = (211 * this._randomSeed + 30031) % 65536, this._randomSeed / 65536
    }
  }, PlayListData.prototype = {
    getFileId: function(a, b) {
      if (null == a || "" == a)
        return "";
      var c = "",
        d = a.slice(0, 8),
        e = b.toString(16);
      1 == e.length && (e = "0" + e), e = e.toUpperCase();
      var f = a.slice(10, a.length);
      return c = d + e + f
    },
    isValidType: function(a) {
      return "3gphd" == a || "flv" == a || "flvhd" == a || "mp4hd" == a || "mp4hd2" == a || "mp4hd3" == a ? !0 : !1
    },
    convertType: function(a) {
      var b = a;
      switch (a) {
        case "m3u8":
          b = "mp4";
          break;
        case "3gphd":
          b = "3gphd";
          break;
        case "flv":
          b = "flv";
          break;
        case "flvhd":
          b = "flv";
          break;
        case "mp4hd":
          b = "mp4";
          break;
        case "mp4hd2":
          b = "hd2";
          break;
        case "mp4hd3":
          b = "hd3"
      }
      return b
    },
    langCodeToCN: function(a) {
      var b = "";
      switch (a) {
        case "default":
          b = {
            key: "guoyu",
            value: "\u56fd\u8bed"
          };
          break;
        case "guoyu":
          b = {
            key: "guoyu",
            value: "\u56fd\u8bed"
          };
          break;
        case "yue":
          b = {
            key: "yue",
            value: "\u7ca4\u8bed"
          };
          break;
        case "chuan":
          b = {
            key: "chuan",
            value: "\u5ddd\u8bdd"
          };
          break;
        case "tai":
          b = {
            key: "tai",
            value: "\u53f0\u6e7e"
          };
          break;
        case "min":
          b = {
            key: "min",
            value: "\u95fd\u5357"
          };
          break;
        case "en":
          b = {
            key: "en",
            value: "\u82f1\u8bed"
          };
          break;
        case "ja":
          b = {
            key: "ja",
            value: "\u65e5\u8bed"
          };
          break;
        case "kr":
          b = {
            key: "kr",
            value: "\u97e9\u8bed"
          };
          break;
        case "in":
          b = {
            key: "in",
            value: "\u5370\u5ea6"
          };
          break;
        case "ru":
          b = {
            key: "ru",
            value: "\u4fc4\u8bed"
          };
          break;
        case "fr":
          b = {
            key: "fr",
            value: "\u6cd5\u8bed"
          };
          break;
        case "de":
          b = {
            key: "de",
            value: "\u5fb7\u8bed"
          };
          break;
        case "it":
          b = {
            key: "it",
            value: "\u610f\u8bed"
          };
          break;
        case "es":
          b = {
            key: "es",
            value: "\u897f\u8bed"
          };
          break;
        case "po":
          b = {
            key: "po",
            value: "\u8461\u8bed"
          };
          break;
        case "th":
          b = {
            key: "th",
            value: "\u6cf0\u8bed"
          }
      }
      return b
    },
    getVideoSrc: function(a, b, c, d, e, f, g) {
      var h = c.stream[a],
        i = c.video.encodeid;
      if (!i || !d)
        return "";
      var j = {
          flv: 0,
          flvhd: 0,
          mp4: 1,
          hd2: 2,
          "3gphd": 1,
          "3gp": 0
        },
        k = j[d],
        l = {
          flv: "flv",
          mp4: "mp4",
          hd2: "flv",
          mp4hd: "mp4",
          mp4hd2: "mp4",
          "3gphd": "mp4",
          "3gp": "flv",
          flvhd: "flv"
        },
        m = l[d],
        n = b.toString(16);
      1 == n.length && (n = "0" + n);
      var o = h.segs[b].total_milliseconds_video / 1e3,
        p = h.segs[b].key;
      ("" == p || -1 == p) && (p = h.key2 + h.key1);
      var q = "";
      c.show && (q = c.show.pay ? "&ypremium=1" : "&ymovie=1");
      var r = "/player/getFlvPath/sid/" + sid + "_" + n + "/st/" + m + "/fileid/" + e + "?K=" + p + "&hd=" + k + "&myp=0&ts=" + o + "&ypp=0" + q,
        s = [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26],
        t = encodeURIComponent(encode64(E(F(mk_a4 + "poz" + userCache_a2, s).toString(), sid + "_" + e + "_" + token)));
      return r += "&ep=" + t, r += "&ctype=12", r += "&ev=1", r += "&token=" + token, r += "&oip=" + this._ip, r += (f ? "/password/" + f : "") + (g ? g : ""), r = "http://k.youku.com" + r
    }
  };

  ajax({
    url: 'http://play.youku.com/play/get.json?vid=' + _id + '&ct=12',
    jsonp: true,
    callback: function (param) {
      if(param == -1) {
        log('\u89e3\u6790youku\u89c6\u9891\u5730\u5740\u5931\u8d25', 2)
      }
      rs = param;
      var a = param.data,
        c = E(F(mk_a3 + "o0b" + userCache_a1, [19, 1, 4, 7, 30, 14, 28, 8, 24,
          17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26
        ]).toString(), decode64(a.security.encrypt_string));
      c     = c.split("_");
      sid   = c[0];
      token = c[1];
      if ( canPlayM3U8 && navigator.userAgent.indexOf('PlayStation') === -1 ) {
        var ep  = encodeURIComponent(D(E(F(mk_a4 + "poz" + userCache_a2, [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]).toString(), sid + "_" + _id + "_" + token)));
        var oip = a.security.ip;
        var source = [
          ['\u8d85\u6e05', 'http://pl.youku.com/playlist/m3u8?vid='+_id+'&type=hd2&ctype=12&keyframe=1&ep='+ep+'&sid='+sid+'&token='+token+'&ev=1&oip='+oip],
          ['\u9ad8\u6e05', 'http://pl.youku.com/playlist/m3u8?vid='+_id+'&type=mp4&ctype=12&keyframe=1&ep='+ep+'&sid='+sid+'&token='+token+'&ev=1&oip='+oip],
          ['\u6807\u6e05', 'http://pl.youku.com/playlist/m3u8?vid='+_id+'&type=flv&ctype=12&keyframe=1&ep='+ep+'&sid='+sid+'&token='+token+'&ev=1&oip='+oip]
        ];
        log('\u89e3\u6790youku\u89c6\u9891\u5730\u5740\u6210\u529f ' + source.map(function (item) {return '<a href='+item[1]+'>'+item[0]+'</a>'}).join(' '), 2)
        callback(source);
      } else {
        var t = new PlayListData(a, a.stream, 'mp4')
        var source = [
          ['\u6807\u6e05', t._videoSegsDic.streams['guoyu']['3gphd'][0].src]
        ];
        log('\u89e3\u6790youku\u89c6\u9891\u5730\u5740\u6210\u529f ' + source.map(function (item) {return '<a href='+item[1]+'>'+item[0]+'</a>'}).join(' '), 2)
        callback(source);
      }
    }
  })
}
exports.getVideos = function (url, callback) {
  parseYoukuCode(window.videoId, callback)
}
},{"./ajax":2,"./canPlayM3U8":3,"./log":9}],22:[function(require,module,exports){
module.exports = [
  require('./seeker_bilibili'),
  require('./seeker_youku'),
  require('./seeker_tudou'),
  require('./seeker_iqiyi'),
  require('./seeker_hunantv'),
  require('./seeker_91porn')
  // ,require('./seeker_example')
]

},{"./seeker_91porn":15,"./seeker_bilibili":16,"./seeker_hunantv":18,"./seeker_iqiyi":19,"./seeker_tudou":20,"./seeker_youku":21}]},{},[1]);
/# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvYWpheC5qcyIsInNyYy9jYW5QbGF5TTNVOC5qcyIsInNyYy9jcmVhdGVFbGVtZW50LmpzIiwic3JjL2ZsYXNoQmxvY2tlci5qcyIsInNyYy9nZXRDb29raWUuanMiLCJzcmMvaHR0cFByb3h5LmpzIiwic3JjL2pzb25wLmpzIiwic3JjL2xvZy5qcyIsInNyYy9tYW1hS2V5LmpzIiwic3JjL25vb3AuanMiLCJzcmMvcGxheWVyLmpzIiwic3JjL3B1cmwuanMiLCJzcmMvcXVlcnlTdHJpbmcuanMiLCJzcmMvc2Vla2VyXzkxcG9ybi5qcyIsInNyYy9zZWVrZXJfYmlsaWJpbGkuanMiLCJzcmMvc2Vla2VyX2ZsdnNwLmpzIiwic3JjL3NlZWtlcl9odW5hbnR2LmpzIiwic3JjL3NlZWtlcl9pcWl5aS5qcyIsInNyYy9zZWVrZXJfdHVkb3UuanMiLCJzcmMvc2Vla2VyX3lvdWt1LmpzIiwic3JjL3NlZWtlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBOztBQ0RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBmbGFzaEJsb2NrZXIgID0gcmVxdWlyZSgnLi9mbGFzaEJsb2NrZXInKVxudmFyIGNyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKCcuL2NyZWF0ZUVsZW1lbnQnKVxudmFyIE1BTUFQbGF5ZXIgICAgPSByZXF1aXJlKCcuL3BsYXllcicpXG52YXIgbG9nICAgICAgICAgICA9IHJlcXVpcmUoJy4vbG9nJylcbnZhciBwdXJsICAgICAgICAgID0gcmVxdWlyZSgnLi9wdXJsJylcbnZhciBtYW1hS2V5ICAgICAgID0gcmVxdWlyZSgnLi9tYW1hS2V5JylcbnZhciBzZWVrZXJzICAgICAgID0gcmVxdWlyZSgnLi9zZWVrZXJzJylcbnZhciBmbHZzcCAgICAgICAgID0gcmVxdWlyZSgnLi9zZWVrZXJfZmx2c3AnKTtcbnZhciBtYXRjaGVkXG5cbmlmICh3aW5kb3dbbWFtYUtleV0gIT0gdHJ1ZSkge1xuXG5mdW5jdGlvbiBzZWVrZWQgKHNvdXJjZSwgY29tbWVudHMpIHtcbiAgaWYgKCFzb3VyY2UpIHtcbiAgICBsb2coJ+ino+aekOWGheWuueWcsOWdgOWksei0pScsIDIpXG4gICAgZGVsZXRlIHdpbmRvd1ttYW1hS2V5XVxuICAgIHJldHVyblxuICB9IFxuICBsb2coJ+ino+aekOWGheWuueWcsOWdgOWujOaIkCcrc291cmNlLm1hcChmdW5jdGlvbiAoaSkge3JldHVybiAnPGEgaHJlZj1cIicraVsxXSsnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+JytpWzBdKyc8L2E+J30pLmpvaW4oJyAnKSwgMilcbiAgdmFyIG1hc2sgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgYXBwZW5kVG86IGRvY3VtZW50LmJvZHksXG4gICAgc3R5bGU6IHtcbiAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgYmFja2dyb3VuZDogJ3JnYmEoMCwwLDAsMC44KScsXG4gICAgICB0b3A6ICcwJyxcbiAgICAgIGxlZnQ6ICcwJyxcbiAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgIHpJbmRleDogJzk5OTk5OSdcbiAgICB9XG4gIH0pXG4gIGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICBhcHBlbmRUbzogbWFzayxcbiAgICBzdHlsZToge1xuICAgICAgd2lkdGg6ICcxMDAwcHgnLFxuICAgICAgaGVpZ2h0OiAnNTAwcHgnLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB0b3A6ICc1MCUnLFxuICAgICAgbGVmdDogJzUwJScsXG4gICAgICBtYXJnaW5Ub3A6ICctMjUwcHgnLFxuICAgICAgbWFyZ2luTGVmdDogJy01MDBweCcsXG4gICAgICBib3JkZXJSYWRpdXM6ICcycHgnLFxuICAgICAgYm94U2hhZG93OiAnMCAwIDJweCAjMDAwMDAwLCAwIDAgMjAwcHggIzAwMDAwMCcsXG4gICAgfVxuICB9KVxuICBjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgYXBwZW5kVG86IG1hc2ssXG4gICAgaW5uZXJIVE1MOiAnPGEgc3R5bGU9XCJjb2xvcjojNTU1NTU1O1wiIGhyZWY9XCJodHRwOi8venl0aHVtLnNpbmFhcHAuY29tL21hbWEyL1wiIHRhcmdldD1cIl9ibGFua1wiPk1BTUEyOiDlpojlpojlho3kuZ/kuI3nlKjmi4Xlv4PmiJHnmoQgTWFjQm9vayDlj5Hng63orqHliJI8L2E+JyxcbiAgICBzdHlsZToge1xuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICBib3R0b206ICcxMHB4JyxcbiAgICAgIGxlZnQ6ICcwJyxcbiAgICAgIHJpZ2h0OiAnMCcsXG4gICAgICBoZWlnaHQ6ICcyMHB4JyxcbiAgICAgIGxpbmVIZWlnaHQ6ICcyMHB4JyxcbiAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICBmb250U2l6ZTonMTJweCcsXG4gICAgICBmb250RmFtaWx5OiAnYXJpYWwsIHNhbnMtc2VyaWYnXG4gICAgfVxuICB9KVxuICB2YXIgY29udGFpbmVyID0gY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgIGFwcGVuZFRvOiBtYXNrLFxuICAgIGlubmVySFRNTDogJzxkaXYgaWQ9XCJNQU1BMl92aWRlb19wbGFjZUhvbGRlclwiPjwvZGl2PicsXG4gICAgc3R5bGU6IHtcbiAgICAgIHdpZHRoOiAnMTAwMHB4JyxcbiAgICAgIGhlaWdodDogJzUwMHB4JyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzAwMDAwMCcsXG4gICAgICB0b3A6ICc1MCUnLFxuICAgICAgbGVmdDogJzUwJScsXG4gICAgICBtYXJnaW5Ub3A6ICctMjUwcHgnLFxuICAgICAgbWFyZ2luTGVmdDogJy01MDBweCcsXG4gICAgICBib3JkZXJSYWRpdXM6ICcycHgnLFxuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gICAgfVxuICB9KVxuICBjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgYXBwZW5kVG86IGNvbnRhaW5lcixcbiAgICBpbm5lckhUTUw6ICcmdGltZXM7JyxcbiAgICBzdHlsZToge1xuICAgICAgd2lkdGg6ICcyMHB4JyxcbiAgICAgIGhlaWdodDogJzIwcHgnLFxuICAgICAgbGluZUhlaWdodDogJzIwcHgnLFxuICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgIGZvbnRTaXplOiAnMjBweCcsXG4gICAgICB0b3A6ICc1cHgnLFxuICAgICAgcmlnaHQ6ICc1cHgnLFxuICAgICAgdGV4dFNoYWRvdzogJzAgMCAycHggIzAwMDAwMCcsXG4gICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgICBmb250RmFtaWx5OiAnR2FyYW1vbmQsIFwiQXBwbGUgR2FyYW1vbmRcIicsXG4gICAgICBjdXJzb3I6ICdwb2ludGVyJ1xuICAgIH1cbiAgfSkub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKG1hc2spXG4gICAgcGxheWVyLnZpZGVvLnNyYyA9ICdhYm91dDpibGFuaydcbiAgICBkZWxldGUgd2luZG93W21hbWFLZXldXG4gIH1cbiAgdmFyIHBsYXllciA9IG5ldyBNQU1BUGxheWVyKCdNQU1BMl92aWRlb19wbGFjZUhvbGRlcicsICcxMDAweDUwMCcsIHNvdXJjZSwgY29tbWVudHMpXG4gIHBsYXllci5pZnJhbWUuY29udGVudFdpbmRvdy5mb2N1cygpXG4gIGZsYXNoQmxvY2tlcigpXG4gIHBsYXllci5pZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgd2luZG93W21hbWFLZXldID0gdHJ1ZVxufVxuXG52YXIgdXJsID0gcHVybChsb2NhdGlvbi5ocmVmKVxuaWYgKHVybC5hdHRyKCdob3N0JykgPT09ICd6eXRodW0uc2luYWFwcC5jb20nICYmIFxuICB1cmwuYXR0cignZGlyZWN0b3J5JykgPT09ICcvbWFtYTIvcHM0LycgJiYgdXJsLnBhcmFtKCd1cmwnKSApIHtcbiAgdXJsID0gcHVybCh1cmwucGFyYW0oJ3VybCcpKVxufVxuXG5zZWVrZXJzLmZvckVhY2goZnVuY3Rpb24gKHNlZWtlcikge1xuICBpZiAobWF0Y2hlZCA9PT0gdHJ1ZSkgcmV0dXJuXG4gIGlmICghIXNlZWtlci5tYXRjaCh1cmwpID09PSB0cnVlKSB7XG4gICAgbG9nKCflvIDlp4vop6PmnpDlhoXlrrnlnLDlnYAnKVxuICAgIG1hdGNoZWQgPSB0cnVlXG4gICAgc2Vla2VyLmdldFZpZGVvcyh1cmwsIHNlZWtlZCkgICBcbiAgfVxufSlcblxuaWYgKG1hdGNoZWQgPT09IHVuZGVmaW5lZCkge1xuICBsb2coJ+WwneivleS9v+eUqDxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCJodHRwOi8vd2VpYm8uY29tL2p1c3Rhc2hpdFwiPuS4gOeOr+WQjOWtpjwvYT7mj5DkvpvnmoTop6PmnpDmnI3liqEnLCAyKVxuICBmbHZzcC5nZXRWaWRlb3ModXJsLCBzZWVrZWQpXG59XG5cbn0iLCIvKiAg77yDZnVuY3Rpb24gYWpheCNcbiAqICA8IHtcbiAqICAgIHVybDogICAgICAgICAgU3RyaW5nICAg6K+35rGC5Zyw5Z2AXG4gKiAgICBwYXJhbTogICAgICAgIE9iamVjdCAgIOivt+axguWPguaVsC7lj6/nvLrnnIFcbiAqICAgIG1ldGhvZDogICAgICAgU3RyaW5nICAg6K+35rGC5pa55rOVR0VULFBPU1QsZXRjLiDlj6/nvLrnnIHvvIzpu5jorqTmmK9HRVQgXG4gKiAgICBjYWxsYmFjazogICAgIEZ1bmN0aW9uIOivt+axgueahGNhbGxiYWNrLCDlpoLmnpzlpLHotKXov5Tlm57vvI0x77yMIOaIkOWKn+i/lOWbnuWGheWuuVxuICogICAgY29udGVudFR5cGU6ICBTdHJpbmcgICDov5Tlm57lhoXlrrnnmoTmoLzlvI/jgILlpoLmnpzmmK9KT1NO5Lya5YGaSlNPTiBQYXJzZe+8jCDlj6/nvLrnnIEs6buY6K6k5pivanNvblxuICogICAgY29udGV4dDogICAgICBBbnkgICAgICBjYWxsYmFja+Wbnuiwg+WHveaVsOeahHRoaXPmjIflkJHjgILlj6/nvLrnnIFcbiAqICB9XG4gKiAg55So5LqO5Y+R6LW3YWpheOaIluiAhWpzb25w6K+35rGCXG4gKi9cblxudmFyIGpzb25wICAgICAgID0gcmVxdWlyZSgnLi9qc29ucCcpXG52YXIgbm9vcCAgICAgICAgPSByZXF1aXJlKCcuL25vb3AnKVxudmFyIHF1ZXJ5U3RyaW5nID0gcmVxdWlyZSgnLi9xdWVyeVN0cmluZycpXG5cbmZ1bmN0aW9uIGRlZmFsdXRPcHRpb24gKG9wdGlvbiwgZGVmYWx1dFZhbHVlKSB7XG4gIHJldHVybiBvcHRpb24gPT09IHVuZGVmaW5lZCA/IGRlZmFsdXRWYWx1ZSA6IG9wdGlvblxufVxuXG5mdW5jdGlvbiBxdWVyeVN0cmluZyAob2JqKSB7XG4gIHZhciBxdWVyeSA9IFtdXG4gIGZvciAob25lIGluIG9iaikge1xuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkob25lKSkge1xuICAgICAgcXVlcnkucHVzaChbb25lLCBvYmpbb25lXV0uam9pbignPScpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gcXVlcnkuam9pbignJicpXG59XG5cbmZ1bmN0aW9uIGpvaW5VcmwgKHVybCwgcXVlcnlTdHJpbmcpIHtcbiAgaWYgKHF1ZXJ5U3RyaW5nLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHVybFxuICByZXR1cm4gdXJsICsgKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHF1ZXJ5U3RyaW5nXG59XG5cbmZ1bmN0aW9uIGFqYXggKG9wdGlvbnMpIHtcbiAgdmFyIHVybCAgICAgICAgID0gZGVmYWx1dE9wdGlvbihvcHRpb25zLnVybCwgJycpXG4gIHZhciBxdWVyeSAgICAgICA9IHF1ZXJ5U3RyaW5nKCBkZWZhbHV0T3B0aW9uKG9wdGlvbnMucGFyYW0sIHt9KSApXG4gIHZhciBtZXRob2QgICAgICA9IGRlZmFsdXRPcHRpb24ob3B0aW9ucy5tZXRob2QsICdHRVQnKVxuICB2YXIgY2FsbGJhY2sgICAgPSBkZWZhbHV0T3B0aW9uKG9wdGlvbnMuY2FsbGJhY2ssIG5vb3ApXG4gIHZhciBjb250ZW50VHlwZSA9IGRlZmFsdXRPcHRpb24ob3B0aW9ucy5jb250ZW50VHlwZSwgJ2pzb24nKVxuICB2YXIgY29udGV4dCAgICAgPSBkZWZhbHV0T3B0aW9uKG9wdGlvbnMuY29udGV4dCwgbnVsbClcblxuICBpZiAob3B0aW9ucy5qc29ucCkge1xuICAgIHJldHVybiBqc29ucChcbiAgICAgIGpvaW5VcmwodXJsLCBxdWVyeSksXG4gICAgICBjYWxsYmFjay5iaW5kKGNvbnRleHQpLFxuICAgICAgdHlwZW9mIG9wdGlvbnMuanNvbnAgPT09ICdzdHJpbmcnID8gb3B0aW9ucy5qc29ucCA6IHVuZGVmaW5lZFxuICAgIClcbiAgfVxuXG4gIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICBpZiAobWV0aG9kLnRvTG93ZXJDYXNlKCkgPT09ICdnZXQnKSB7XG4gICAgdXJsID0gam9pblVybCh1cmwsIHF1ZXJ5KVxuICAgIHF1ZXJ5ID0gJydcbiAgfVxuICB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSlcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnKVxuICB4aHIuc2VuZChxdWVyeSlcbiAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQgKSB7XG4gICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgIHZhciBkYXRhID0geGhyLnJlc3BvbnNlVGV4dFxuICAgICAgICBpZiAoY29udGVudFR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ2pzb24nKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpXG4gICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBkYXRhID0gLTFcbiAgICAgICAgICB9ICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgZGF0YSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjay5jYWxsKGNvbnRleHQsIC0xKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBhamF4O1xuIiwiLyogIO+8g0Jvb2wgY2FuUGxheU0zVTjvvINcbiAqICDov5Tlm57mtY/op4jlmajmmK/lkKbmlK/mjIFtM3U45qC85byP55qE6KeG6aKR5pKt5pS+44CCXG4gKiAg55uu5YmNY2hyb21lLGZpcmVmb3jlj6rmlK/mjIFtcDRcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAhIWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJykuY2FuUGxheVR5cGUoJ2FwcGxpY2F0aW9uL3gtbXBlZ1VSTCcpIiwiLypcbiAqIOeUqOS6jueugOWNleWIm+W7umh0bWzoioLngrlcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRWxlbWVudCAodGFnTmFtZSwgYXR0cmlidXRlcykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSlcbiAgaWYgKCB0eXBlb2YgYXR0cmlidXRlcyA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICBhdHRyaWJ1dGVzLmNhbGwoZWxlbWVudClcbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBhdHRyaWJ1dGUgaW4gYXR0cmlidXRlcykge1xuICAgICAgaWYgKCBhdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGF0dHJpYnV0ZSkgKSB7XG4gICAgICAgIHN3aXRjaCAoYXR0cmlidXRlKSB7XG4gICAgICAgIGNhc2UgJ2FwcGVuZFRvJzpcbiAgICAgICAgICBhdHRyaWJ1dGVzW2F0dHJpYnV0ZV0uYXBwZW5kQ2hpbGQoZWxlbWVudClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdpbm5lckhUTUwnOlxuICAgICAgICBjYXNlICdjbGFzc05hbWUnOlxuICAgICAgICBjYXNlICdpZCc6XG4gICAgICAgICAgZWxlbWVudFthdHRyaWJ1dGVdID0gYXR0cmlidXRlc1thdHRyaWJ1dGVdXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnc3R5bGUnOlxuICAgICAgICAgIHZhciBzdHlsZXMgPSBhdHRyaWJ1dGVzW2F0dHJpYnV0ZV1cbiAgICAgICAgICBmb3IgKHZhciBuYW1lIGluIHN0eWxlcylcbiAgICAgICAgICAgIGlmICggc3R5bGVzLmhhc093blByb3BlcnR5KG5hbWUpIClcbiAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtuYW1lXSA9IHN0eWxlc1tuYW1lXVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCBhdHRyaWJ1dGVzW2F0dHJpYnV0ZV0gKyAnJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZWxlbWVudFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUVsZW1lbnQiLCIvKiAgXG4gKiAg55So5LqO5bGP6JS96aG16Z2i5LiK55qE5omA5pyJZmxhc2hcbiAqL1xudmFyIGZsYXNoVGV4dCA9ICc8ZGl2IHN0eWxlPVwidGV4dC1zaGFkb3c6MCAwIDJweCAjZWVlO2xldHRlci1zcGFjaW5nOi0xcHg7YmFja2dyb3VuZDojZWVlO2ZvbnQtd2VpZ2h0OmJvbGQ7cGFkZGluZzowO2ZvbnQtZmFtaWx5OmFyaWFsLHNhbnMtc2VyaWY7Zm9udC1zaXplOjMwcHg7Y29sb3I6I2NjYzt3aWR0aDoxNTJweDtoZWlnaHQ6NTJweDtib3JkZXI6NHB4IHNvbGlkICNjY2M7Ym9yZGVyLXJhZGl1czoxMnB4O3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1MCU7bGVmdDo1MCU7bWFyZ2luOi0zMHB4IDAgMCAtODBweDt0ZXh0LWFsaWduOmNlbnRlcjtsaW5lLWhlaWdodDo1MnB4O1wiPkZsYXNoPC9kaXY+JztcblxudmFyIGNvdW50ID0gMDtcbnZhciBmbGFzaEJsb2NrcyA9IHt9O1xuLy/ngrnlh7vml7bpl7Top6blj5FcbnZhciBjbGljazJTaG93Rmxhc2ggPSBmdW5jdGlvbihlKXtcbiAgdmFyIGluZGV4ID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmxhc2gtaW5kZXgnKTtcbiAgdmFyIGZsYXNoID0gZmxhc2hCbG9ja3NbaW5kZXhdO1xuICBmbGFzaC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmxhc2gtc2hvdycsJ2lzc2hvdycpO1xuICB0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGZsYXNoLCB0aGlzKTtcbiAgdGhpcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMpO1xuICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2syU2hvd0ZsYXNoLCBmYWxzZSk7XG59O1xuXG52YXIgY3JlYXRlQVBsYWNlSG9sZGVyID0gZnVuY3Rpb24oZmxhc2gsIHdpZHRoLCBoZWlnaHQpe1xuICB2YXIgaW5kZXggPSBjb3VudCsrO1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKGZsYXNoLCBudWxsKTtcbiAgdmFyIHBvc2l0aW9uVHlwZSA9IHN0eWxlLnBvc2l0aW9uO1xuICAgIHBvc2l0aW9uVHlwZSA9IHBvc2l0aW9uVHlwZSA9PT0gJ3N0YXRpYycgPyAncmVsYXRpdmUnIDogcG9zaXRpb25UeXBlO1xuICB2YXIgbWFyZ2luICAgICAgID0gc3R5bGVbJ21hcmdpbiddO1xuICB2YXIgZGlzcGxheSAgICAgID0gc3R5bGVbJ2Rpc3BsYXknXSA9PSAnaW5saW5lJyA/ICdpbmxpbmUtYmxvY2snIDogc3R5bGVbJ2Rpc3BsYXknXTtcbiAgdmFyIHN0eWxlID0gW1xuICAgICcnLFxuICAgICd3aWR0aDonICAgICsgd2lkdGggICsncHgnLFxuICAgICdoZWlnaHQ6JyAgICsgaGVpZ2h0ICsncHgnLFxuICAgICdwb3NpdGlvbjonICsgcG9zaXRpb25UeXBlLFxuICAgICdtYXJnaW46JyAgICsgbWFyZ2luLFxuICAgICdkaXNwbGF5OicgICsgZGlzcGxheSxcbiAgICAnbWFyZ2luOjAnLFxuICAgICdwYWRkaW5nOjAnLFxuICAgICdib3JkZXI6MCcsXG4gICAgJ2JvcmRlci1yYWRpdXM6MXB4JyxcbiAgICAnY3Vyc29yOnBvaW50ZXInLFxuICAgICdiYWNrZ3JvdW5kOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KHRvcCwgcmdiYSgyNDAsMjQwLDI0MCwxKTAlLHJnYmEoMjIwLDIyMCwyMjAsMSkxMDAlKScsICAgICBcbiAgICAnJ1xuICBdXG4gIGZsYXNoQmxvY2tzW2luZGV4XSA9IGZsYXNoO1xuICB2YXIgcGxhY2VIb2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgcGxhY2VIb2xkZXIuc2V0QXR0cmlidXRlKCd0aXRsZScsICcmI3g3MEI5OyYjeDYyMTE7JiN4OEZEODsmI3g1MzlGO0ZsYXNoJyk7XG4gIHBsYWNlSG9sZGVyLnNldEF0dHJpYnV0ZSgnZGF0YS1mbGFzaC1pbmRleCcsICcnICsgaW5kZXgpO1xuICBmbGFzaC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShwbGFjZUhvbGRlciwgZmxhc2gpO1xuICBmbGFzaC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGZsYXNoKTtcbiAgcGxhY2VIb2xkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGljazJTaG93Rmxhc2gsIGZhbHNlKTtcbiAgcGxhY2VIb2xkZXIuc3R5bGUuY3NzVGV4dCArPSBzdHlsZS5qb2luKCc7Jyk7XG4gIHBsYWNlSG9sZGVyLmlubmVySFRNTCA9IGZsYXNoVGV4dDtcbiAgcmV0dXJuIHBsYWNlSG9sZGVyO1xufTtcblxudmFyIHBhcnNlRmxhc2ggPSBmdW5jdGlvbih0YXJnZXQpe1xuICBpZih0YXJnZXQgaW5zdGFuY2VvZiBIVE1MT2JqZWN0RWxlbWVudCkge1xuICAgIGlmKHRhcmdldC5pbm5lckhUTUwudHJpbSgpID09ICcnKSByZXR1cm47XG4gICAgaWYodGFyZ2V0LmdldEF0dHJpYnV0ZShcImNsYXNzaWRcIikgJiYgIS9eamF2YTovLnRlc3QodGFyZ2V0LmdldEF0dHJpYnV0ZShcImNsYXNzaWRcIikpKSByZXR1cm47ICAgICAgXG4gIH0gZWxzZSBpZighKHRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbWJlZEVsZW1lbnQpKSByZXR1cm47XG5cbiAgdmFyIHdpZHRoID0gdGFyZ2V0Lm9mZnNldFdpZHRoO1xuICB2YXIgaGVpZ2h0ID0gdGFyZ2V0Lm9mZnNldEhlaWdodDtcblxuICBpZih3aWR0aCA+IDE2MCAmJiBoZWlnaHQgPiA2MCl7XG4gICAgY3JlYXRlQVBsYWNlSG9sZGVyKHRhcmdldCwgd2lkdGgsIGhlaWdodCk7XG4gIH1cbn07XG5cbnZhciBoYW5kbGVCZWZvcmVMb2FkRXZlbnQgPSBmdW5jdGlvbihlKXtcbiAgdmFyIHRhcmdldCA9IGUudGFyZ2V0XG4gIGlmKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmxhc2gtc2hvdycpID09ICdpc3Nob3cnKSByZXR1cm47XG4gIHBhcnNlRmxhc2godGFyZ2V0KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7IFxuICB2YXIgZW1iZWRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2VtYmVkJyk7XG4gIHZhciBvYmplY3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ29iamVjdCcpO1xuICBmb3IodmFyIGk9MCxsZW49b2JqZWN0cy5sZW5ndGg7IGk8bGVuOyBpKyspIG9iamVjdHNbaV0gJiYgcGFyc2VGbGFzaChvYmplY3RzW2ldKTtcbiAgZm9yKHZhciBpPTAsbGVuPWVtYmVkcy5sZW5ndGg7IGk8bGVuOyBpKyspICBlbWJlZHNbaV0gJiYgcGFyc2VGbGFzaChlbWJlZHNbaV0pO1xufVxuLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImJlZm9yZWxvYWRcIiwgaGFuZGxlQmVmb3JlTG9hZEV2ZW50LCB0cnVlKTtcbiIsIi8qICDvvINmdW5jdGlvbiBnZXRDb29raWVzI1xuICogIDwgU3RyaW5nICBjb29raWXlkI1cbiAqICA+IFN0cmluZyAgY29va2ll5YC8XG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRDb29raWUoY19uYW1lKSB7XG4gICAgaWYgKGRvY3VtZW50LmNvb2tpZS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNfc3RhcnQgPSBkb2N1bWVudC5jb29raWUuaW5kZXhPZihjX25hbWUgKyBcIj1cIilcbiAgICAgICAgaWYgKGNfc3RhcnQgIT0gLTEpIHtcbiAgICAgICAgICAgIGNfc3RhcnQgPSBjX3N0YXJ0ICsgY19uYW1lLmxlbmd0aCArIDFcbiAgICAgICAgICAgIGNfZW5kID0gZG9jdW1lbnQuY29va2llLmluZGV4T2YoXCI7XCIsIGNfc3RhcnQpXG4gICAgICAgICAgICBpZiAoY19lbmQgPT0gLTEpIGNfZW5kID0gZG9jdW1lbnQuY29va2llLmxlbmd0aFxuICAgICAgICAgICAgcmV0dXJuIHVuZXNjYXBlKGRvY3VtZW50LmNvb2tpZS5zdWJzdHJpbmcoY19zdGFydCwgY19lbmQpKVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBcIlwiXG59IiwiLyogIO+8g2Z1bmN0aW9uIGh0dHBQcm94eSNcbiAqICA8IFN0cmluZyAgICAgICAg6K+35rGC5Zyw5Z2AXG4gKiAgPCBTdHJpbmcgICAgICAgIOivt+axguaWueazlUdFVCxQT1NULGV0Yy5cbiAqICA8IE9iamVjdCAgICAgICAg6K+35rGC5Y+C5pWwXG4gKiAgPCBGdW5jdGlvbiAgICAgIOivt+axgueahGNhbGxiYWNrLCDlpoLmnpzlpLHotKXov5Tlm57vvI0x77yMIOaIkOWKn+i/lOWbnuWGheWuuVxuICogIDwge1xuICogICAgICB4bWw6ICAgICAgIEJvb2wgICDmmK/lkKbpnIDopoHlgZp4bWwyanNvbiDlj6/nvLrnnIEsIOm7mOiupGZhc2xlXG4gKiAgICAgIGd6aW5mbGF0ZTogQm9vbCAgIOaYr+WQpumcgOimgeWBmmd6aW5mbGF0ZSDlj6/nvLrnnIEsIOm7mOiupGZhc2xlXG4gKiAgICAgIGNvbnRleHQ6ICAgQW55ICAgIGNhbGxiYWNr5Zue6LCD55qEdGhpc+aMh+WQkSDlj6/nvLrnnIFcbiAqICAgIH1cbiAqICB9XG4gKiAg55So5LqO5Y+R6LW36Leo5Z+f55qEYWpheOivt+axguOAguaXouaOpeWPo+i/lOWbnui3qOWfn+WPiOS4jeaUr+aMgWpzb25w5Y2P6K6u55qEXG4gKi9cblxudmFyIGNyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKCcuL2NyZWF0ZUVsZW1lbnQnKVxudmFyIGFqYXggICAgICAgICAgPSByZXF1aXJlKCcuL2FqYXgnKVxudmFyIHF1ZXJ5U3RyaW5nICAgPSByZXF1aXJlKCcuL3F1ZXJ5U3RyaW5nJylcblxudmFyIHByb3h5VXJsID0gJ2h0dHA6Ly96eXRodW0uc2luYWFwcC5jb20vbWFtYTIvcHJveHkucGhwJ1xuXG5mdW5jdGlvbiBodHRwUHJveHkgKHVybCwgdHlwZSwgcGFyYW1zLCBjYWxsYmFjaywgb3B0cykge1xuICBvcHRzID0gb3B0cyB8fCB7fVxuICBhamF4KHtcbiAgICB1cmw6IHByb3h5VXJsLFxuICAgIHBhcmFtIDoge1xuICAgICAgcGFyYW1zOiBlbmNvZGVVUklDb21wb25lbnQocXVlcnlTdHJpbmcocGFyYW1zKSksLy/kuIrooYzlj4LmlbBcbiAgICAgIHJlZmVycmVyOiBvcHRzLnJlZmVycmVyIHx8IGxvY2F0aW9uLmhyZWYsXG4gICAgICB1cmw6IGVuY29kZVVSSUNvbXBvbmVudCh1cmwpLFxuICAgICAgcG9zdDogdHlwZSA9PT0gJ3Bvc3QnID8gMSA6IDAsXG4gICAgICB4bWw6IG9wdHMueG1sID8gMSA6IDAsXG4gICAgICB0ZXh0OiBvcHRzLnRleHQgPyAxIDogMCxcbiAgICAgIGd6aW5mbGF0ZTogb3B0cy5nemluZmxhdGUgPyAxIDogMCxcbiAgICAgIHVhOiBvcHRzLnVhIHx8IG5hdmlnYXRvci51c2VyQWdlbnRcbiAgICB9LFxuICAgIGpzb25wOiB0cnVlLFxuICAgIGNhbGxiYWNrOiBjYWxsYmFjayxcbiAgICBjb250ZXh0OiBvcHRzLmNvbnRleHRcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBodHRwUHJveHkiLCIvKiAg77yDZnVuY3Rpb24ganNvbnAjXG4gKiAganNvbnDmlrnms5XjgILmjqjojZDkvb/nlKhhamF45pa55rOV44CCYWpheOWMheWQq+S6hmpzb25wXG4gKi9cbnZhciBjcmVhdGVFbGVtZW50ID0gcmVxdWlyZSgnLi9jcmVhdGVFbGVtZW50JylcbnZhciBub29wICAgICAgICAgID0gcmVxdWlyZSgnLi9ub29wJylcblxudmFyIGNhbGxiYWNrUHJlZml4ID0gJ01BTUEyX0hUVFBfSlNPTlBfQ0FMTEJBQ0snXG52YXIgY2FsbGJhY2tDb3VudCAgPSAwXG52YXIgdGltZW91dERlbGF5ICAgPSAxMDAwMFxuXG5mdW5jdGlvbiBjYWxsYmFja0hhbmRsZSAoKSB7XG4gIHJldHVybiBjYWxsYmFja1ByZWZpeCArIGNhbGxiYWNrQ291bnQrK1xufVxuXG5mdW5jdGlvbiBqc29ucCAodXJsLCBjYWxsYmFjaywgY2FsbGJhY2tLZXkpIHtcblxuICBjYWxsYmFja0tleSA9IGNhbGxiYWNrS2V5IHx8ICdjYWxsYmFjaydcblxuICB2YXIgX2NhbGxiYWNrSGFuZGxlID0gY2FsbGJhY2tIYW5kbGUoKSAgXG4gIHdpbmRvd1tfY2FsbGJhY2tIYW5kbGVdID0gZnVuY3Rpb24gKHJzKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXRUaW1lcilcbiAgICB3aW5kb3dbX2NhbGxiYWNrSGFuZGxlXSA9IG5vb3BcbiAgICBjYWxsYmFjayhycylcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHNjcmlwdClcbiAgfVxuICB2YXIgdGltZW91dFRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgd2luZG93W19jYWxsYmFja0hhbmRsZV0oLTEpXG4gIH0sIHRpbWVvdXREZWxheSlcblxuICB2YXIgc2NyaXB0ID0gY3JlYXRlRWxlbWVudCgnc2NyaXB0Jywge1xuICAgIGFwcGVuZFRvOiBkb2N1bWVudC5ib2R5LFxuICAgIHNyYzogdXJsICsgKHVybC5pbmRleE9mKCc/JykgPj0gMCA/ICcmJyA6ICc/JykgKyBjYWxsYmFja0tleSArICc9JyArIF9jYWxsYmFja0hhbmRsZVxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGpzb25wIiwiLyogIO+8g2Z1bmN0aW9uIGxvZ++8g1xuICogIDwgU3RyaW5nXG4gKiAgbG9nLCDkvJrlnKjpobXpnaLlkoxjb25zb2xl5Lit6L6T5Ye6bG9nXG4gKi9cblxudmFyIGNyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKCcuL2NyZWF0ZUVsZW1lbnQnKVxudmFyIE1BTUFMb2dET01cbnZhciBsb2dUaW1lclxudmFyIGxvZ0RlbGF5ID0gMTAwMDBcblxuZnVuY3Rpb24gbG9nIChtc2csIGRlbGF5KSB7XG4gIGlmICggTUFNQUxvZ0RPTSA9PT0gdW5kZWZpbmVkICkge1xuICAgIE1BTUFMb2dET00gPSBjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgICBzdHlsZToge1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMjQyNzJBJyxcbiAgICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgcG9zaXRpb246ICdmaXhlZCcsXG4gICAgICAgIHpJbmRleDogJzEwMDAwMDAnLFxuICAgICAgICB0b3A6ICcwJyxcbiAgICAgICAgbGVmdDogJzAnLFxuICAgICAgICBwYWRkaW5nOiAnNXB4IDEwcHgnLFxuICAgICAgICBmb250U2l6ZTogJzE0cHgnXG4gICAgICB9XG4gICAgfSlcbiAgfVxuICBjbGVhclRpbWVvdXQobG9nVGltZXIpXG4gIFxuICBNQU1BTG9nRE9NLmlubmVySFRNTCA9ICc8c3BhbiBzdHlsZT1cImNvbG9yOiNERjY1NThcIj5NQU1BMiAmZ3Q7PC9zcGFuPiAnICsgbXNnXG4gIGNvbnNvbGUgJiYgY29uc29sZS5sb2cgJiYgY29uc29sZS5sb2coJyVjIE1BTUEyICVjICVzJywgJ2JhY2tncm91bmQ6IzI0MjcyQTsgY29sb3I6I2ZmZmZmZicsICcnLCBtc2cpXG5cbiAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChNQU1BTG9nRE9NKVxuICBsb2dUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoTUFNQUxvZ0RPTSlcbiAgfSwgZGVsYXkqMTAwMCB8fCBsb2dEZWxheSlcbn1cbm1vZHVsZS5leHBvcnRzID0gbG9nIiwiLy/lpojlpojorqHliJLllK/kuIDlgLxcbm1vZHVsZS5leHBvcnRzID0gJ01BTUFLRVlf55Sw55C05piv6L+Z5Liq5LiW55WM5LiK5pyA5Y+v54ix55qE5aWz5a2p5a2Q5ZG15ZG15ZG15ZG177yM5oiR6KaB6K6p5YWo5LiW55WM6YO95Zyo55+l6YGTJyIsIi8v56m65pa55rOVXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHt9IiwidmFyIE1BTUFQbGF5ZXI7XG5cbi8vIE1BTUFQbGF5ZXIgXG4vLyBodHRwczovL2dpdGh1Yi5jb20venl0aHVtL21hbWFwbGF5ZXJcbiFmdW5jdGlvbiBlKHQsaSxuKXtmdW5jdGlvbiBvKHIsYSl7aWYoIWlbcl0pe2lmKCF0W3JdKXt2YXIgbD1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFhJiZsKXJldHVybiBsKHIsITApO2lmKHMpcmV0dXJuIHMociwhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIityK1wiJ1wiKX12YXIgYz1pW3JdPXtleHBvcnRzOnt9fTt0W3JdWzBdLmNhbGwoYy5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBpPXRbcl1bMV1bZV07cmV0dXJuIG8oaT9pOmUpfSxjLGMuZXhwb3J0cyxlLHQsaSxuKX1yZXR1cm4gaVtyXS5leHBvcnRzfWZvcih2YXIgcz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLHI9MDtyPG4ubGVuZ3RoO3IrKylvKG5bcl0pO3JldHVybiBvfSh7MTpbZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBpKGUpe2Zvcih2YXIgdD1bXSxpPTE7aTxhcmd1bWVudHMubGVuZ3RoO2krKyl7dmFyIG89YXJndW1lbnRzW2ldLHM9by5pbml0O3QucHVzaChzKSxkZWxldGUgby5pbml0LG4oZS5wcm90b3R5cGUsbyl9ZS5wcm90b3R5cGUuaW5pdD1mdW5jdGlvbigpe3QuZm9yRWFjaChmdW5jdGlvbihlKXtlLmNhbGwodGhpcyl9LmJpbmQodGhpcykpfX12YXIgbj1lKFwiLi9leHRlbmRcIik7dC5leHBvcnRzPWl9LHtcIi4vZXh0ZW5kXCI6OX1dLDI6W2Z1bmN0aW9uKGUsdCl7dmFyIGk9ZShcIi4vcGxheWVyLmNzc1wiKSxuPWUoXCIuL3BsYXllci5odG1sXCIpLG89KGUoXCIuL2V4dGVuZFwiKSxlKFwiLi9jcmVhdGVFbGVtZW50XCIpKSxzPWUoXCIuL3BhcnNlRE9NQnlDbGFzc05hbWVzXCIpO3QuZXhwb3J0cz17aW5pdDpmdW5jdGlvbigpe3ZhciBlPWZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5pZnJhbWUuY29udGVudERvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwiaGVhZFwiKVswXSx0PXRoaXMuaWZyYW1lLmNvbnRlbnREb2N1bWVudC5ib2R5O28oXCJzdHlsZVwiLGZ1bmN0aW9uKCl7ZS5hcHBlbmRDaGlsZCh0aGlzKTt0cnl7dGhpcy5zdHlsZVNoZWV0LmNzc1RleHQ9aX1jYXRjaCh0KXt0aGlzLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGkpKX19KSxvKFwibGlua1wiLHthcHBlbmRUbzplLGhyZWY6XCJodHRwOi8vbGlicy5jbmNkbi5jbi9mb250LWF3ZXNvbWUvNC4zLjAvY3NzL2ZvbnQtYXdlc29tZS5taW4uY3NzXCIscmVsOlwic3R5bGVzaGVldFwiLHR5cGU6XCJ0ZXh0L2Nzc1wifSksdC5pbm5lckhUTUw9bix0aGlzLkRPTXM9cyh0LFtcInBsYXllclwiLFwidmlkZW9cIixcInZpZGVvLWZyYW1lXCIsXCJjb21tZW50c1wiLFwiY29tbWVudHMtYnRuXCIsXCJwbGF5XCIsXCJwcm9ncmVzc19hbmNob3JcIixcImJ1ZmZlcmVkX2FuY2hvclwiLFwiZnVsbHNjcmVlblwiLFwiYWxsc2NyZWVuXCIsXCJoZFwiLFwidm9sdW1lX2FuY2hvclwiLFwiY3VycmVudFwiLFwiZHVyYXRpb25cIl0pLHRoaXMudmlkZW89dGhpcy5ET01zLnZpZGVvfS5iaW5kKHRoaXMpLHQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCkscj10aGlzLmlmcmFtZT1vKFwiaWZyYW1lXCIse2FsbG93VHJhbnNwYXJlbmN5OiEwLGZyYW1lQm9yZGVyOlwibm9cIixzY3JvbGxpbmc6XCJub1wiLHNyYzpcImFib3V0OmJsYW5rXCIsbW96YWxsb3dmdWxsc2NyZWVuOlwibW96YWxsb3dmdWxsc2NyZWVuXCIsd2Via2l0YWxsb3dmdWxsc2NyZWVuOlwid2Via2l0YWxsb3dmdWxsc2NyZWVuXCIsYWxsb3dmdWxsc2NyZWVuOlwiYWxsb3dmdWxsc2NyZWVuXCIsc3R5bGU6e3dpZHRoOnRoaXMuc2l6ZVswXStcInB4XCIsaGVpZ2h0OnRoaXMuc2l6ZVsxXStcInB4XCIsb3ZlcmZsb3c6XCJoaWRkZW5cIn19KTt0JiZ0LnBhcmVudE5vZGU/KHQucGFyZW50Tm9kZS5yZXBsYWNlQ2hpbGQocix0KSxlKCkpOihkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHIpLGUoKSxkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHIpKX19fSx7XCIuL2NyZWF0ZUVsZW1lbnRcIjo3LFwiLi9leHRlbmRcIjo5LFwiLi9wYXJzZURPTUJ5Q2xhc3NOYW1lc1wiOjExLFwiLi9wbGF5ZXIuY3NzXCI6MTIsXCIuL3BsYXllci5odG1sXCI6MTN9XSwzOltmdW5jdGlvbihlLHQpe2Z1bmN0aW9uIGkoZSl7ZS5zdHJva2VTdHlsZT1cImJsYWNrXCIsZS5saW5lV2lkdGg9MyxlLmZvbnQ9J2JvbGQgMjBweCBcIlBpbmdIZWlcIixcIkx1Y2lkYSBHcmFuZGVcIiwgXCJMdWNpZGEgU2FucyBVbmljb2RlXCIsIFwiU1RIZWl0aVwiLCBcIkhlbHZldGljYVwiLFwiQXJpYWxcIixcIlZlcmRhbmFcIixcInNhbnMtc2VyaWZcIid9dmFyIG49KGUoXCIuL2NyZWF0ZUVsZW1lbnRcIiksLjEpLG89MjUscz00ZTMscj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLmdldENvbnRleHQoXCIyZFwiKTtpKHIpO3ZhciBhPXdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZXx8d2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGZ1bmN0aW9uKGUpe3NldFRpbWVvdXQoZSwxZTMvNjApfTt0LmV4cG9ydHM9e2luaXQ6ZnVuY3Rpb24oKXt0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJwbGF5XCIsdGhpcy5yZVN0YXJ0Q29tbWVudC5iaW5kKHRoaXMpKSx0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJwYXVzZVwiLHRoaXMucGF1c2VDb21tZW50LmJpbmQodGhpcykpLHRoaXMubGFzdENvbW1uZXRVcGRhdGVUaW1lPTAsdGhpcy5sYXN0Q29tbW5ldEluZGV4PTAsdGhpcy5jb21tZW50TG9vcFByZVF1ZXVlPVtdLHRoaXMuY29tbWVudExvb3BRdWV1ZT1bXSx0aGlzLmNvbW1lbnRCdXR0b25QcmVRdWV1ZT1bXSx0aGlzLmNvbW1lbnRCdXR0b25RdWV1ZT1bXSx0aGlzLmNvbW1lbnRUb3BQcmVRdWV1ZT1bXSx0aGlzLmNvbW1lbnRUb3BRdWV1ZT1bXSx0aGlzLmRyYXdRdWV1ZT1bXSx0aGlzLnByZVJlbmRlcnM9W10sdGhpcy5wcmVSZW5kZXJNYXA9e30sdGhpcy5lbmFibGVDb21tZW50PXZvaWQgMD09PXRoaXMuY29tbWVudHM/ITE6ITAsdGhpcy5wcmV2RHJhd0NhbnZhcz1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLHRoaXMuY2FudmFzPXRoaXMuRE9Ncy5jb21tZW50cy5nZXRDb250ZXh0KFwiMmRcIiksdGhpcy5jb21tZW50cyYmdGhpcy5ET01zLnBsYXllci5jbGFzc0xpc3QuYWRkKFwiaGFzLWNvbW1lbnRzXCIpLHRoaXMuRE9Nc1tcImNvbW1lbnRzLWJ0blwiXS5jbGFzc0xpc3QuYWRkKFwiZW5hYmxlXCIpLHRoaXMuRE9Ncy5jb21tZW50cy5kaXNwbGF5PXRoaXMuZW5hYmxlQ29tbWVudD9cImJsb2NrXCI6XCJub25lXCI7dmFyIGU9MCx0PWZ1bmN0aW9uKCl7KGU9fmUpJiZ0aGlzLm9uQ29tbWVudFRpbWVVcGRhdGUoKSxhKHQpfS5iaW5kKHRoaXMpO3QoKX0sbmVlZERyYXdUZXh0OmZ1bmN0aW9uKGUsdCxpKXt0aGlzLmRyYXdRdWV1ZS5wdXNoKFtlLHQsaV0pfSxkcmF3VGV4dDpmdW5jdGlvbigpe3ZhciBlPXRoaXMucHJldkRyYXdDYW52YXMsdD10aGlzLnByZXZEcmF3Q2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtlLndpZHRoPXRoaXMuY2FudmFzV2lkdGgsZS5oZWlnaHQ9dGhpcy5jYW52YXNIZWlnaHQsdC5jbGVhclJlY3QoMCwwLHRoaXMuY2FudmFzV2lkdGgsdGhpcy5jYW52YXNIZWlnaHQpO3ZhciBuPVtdO3RoaXMucHJlUmVuZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGUsdCl7ZS51c2VkPSExLHZvaWQgMD09PWUuY2lkJiZuLnB1c2godCl9KTtmb3IodmFyIHM7cz10aGlzLmRyYXdRdWV1ZS5zaGlmdCgpOykhZnVuY3Rpb24oZSxzKXt2YXIgcixhPWVbMF0udGV4dCtlWzBdLmNvbG9yLGw9cy5wcmVSZW5kZXJNYXBbYV07aWYodm9pZCAwPT09bCl7dmFyIGw9bi5zaGlmdCgpO3ZvaWQgMD09PWw/KHI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSxsPXMucHJlUmVuZGVycy5wdXNoKHIpLTEpOnI9cy5wcmVSZW5kZXJzW2xdO3ZhciBjPXIud2lkdGg9ZVswXS53aWR0aCxoPXIuaGVpZ2h0PW8rMTAsZD1yLmdldENvbnRleHQoXCIyZFwiKTtkLmNsZWFyUmVjdCgwLDAsYyxoKSxpKGQpLGQuZmlsbFN0eWxlPWVbMF0uY29sb3IsZC5zdHJva2VUZXh0KGVbMF0udGV4dCwwLG8pLGQuZmlsbFRleHQoZVswXS50ZXh0LDAsbyksci5jaWQ9YSxzLnByZVJlbmRlck1hcFthXT1sfWVsc2Ugcj1zLnByZVJlbmRlcnNbbF07ci51c2VkPSEwLHQuZHJhd0ltYWdlKHIsZVsxXSxlWzJdKX0ocyx0aGlzKTt0aGlzLnByZVJlbmRlcnMuZm9yRWFjaChmdW5jdGlvbihlKXtlLnVzZWQ9PT0hMSYmKGRlbGV0ZSB0aGlzLnByZVJlbmRlck1hcFtlLmNpZF0sZS5jaWQ9dm9pZCAwKX0uYmluZCh0aGlzKSksdGhpcy5jYW52YXMuY2xlYXJSZWN0KDAsMCx0aGlzLmNhbnZhc1dpZHRoLHRoaXMuY2FudmFzSGVpZ2h0KSx0aGlzLmNhbnZhcy5kcmF3SW1hZ2UoZSwwLDApfSxjcmVhdGVDb21tZW50OmZ1bmN0aW9uKGUsdCl7aWYodm9pZCAwPT09ZSlyZXR1cm4hMTt2YXIgaT1yLm1lYXN1cmVUZXh0KGUudGV4dCk7cmV0dXJue3N0YXJ0VGltZTp0LHRleHQ6ZS50ZXh0LGNvbG9yOmUuY29sb3Isd2lkdGg6aS53aWR0aCsyMH19LGNvbW1lbnRUb3A6ZnVuY3Rpb24oZSx0LGkpe3RoaXMuY29tbWVudFRvcFF1ZXVlLmZvckVhY2goZnVuY3Rpb24odCxuKXt2b2lkIDAhPXQmJihpPnQuc3RhcnRUaW1lK3M/dGhpcy5jb21tZW50VG9wUXVldWVbbl09dm9pZCAwOnRoaXMubmVlZERyYXdUZXh0KHQsKGUtdC53aWR0aCkvMixvKm4pKX0uYmluZCh0aGlzKSk7Zm9yKHZhciBuO249dGhpcy5jb21tZW50VG9wUHJlUXVldWUuc2hpZnQoKTspbj10aGlzLmNyZWF0ZUNvbW1lbnQobixpKSx0aGlzLmNvbW1lbnRUb3BRdWV1ZS5mb3JFYWNoKGZ1bmN0aW9uKHQsaSl7biYmdm9pZCAwPT09dCYmKHQ9dGhpcy5jb21tZW50VG9wUXVldWVbaV09bix0aGlzLm5lZWREcmF3VGV4dCh0LChlLW4ud2lkdGgpLzIsbyppKSxuPXZvaWQgMCl9LmJpbmQodGhpcykpLG4mJih0aGlzLmNvbW1lbnRUb3BRdWV1ZS5wdXNoKG4pLHRoaXMubmVlZERyYXdUZXh0KG4sKGUtbi53aWR0aCkvMixvKnRoaXMuY29tbWVudFRvcFF1ZXVlLmxlbmd0aC0xKSl9LGNvbW1lbnRCb3R0b206ZnVuY3Rpb24oZSx0LGkpe3QtPTEwLHRoaXMuY29tbWVudEJ1dHRvblF1ZXVlLmZvckVhY2goZnVuY3Rpb24obixyKXt2b2lkIDAhPW4mJihpPm4uc3RhcnRUaW1lK3M/dGhpcy5jb21tZW50QnV0dG9uUXVldWVbcl09dm9pZCAwOnRoaXMubmVlZERyYXdUZXh0KG4sKGUtbi53aWR0aCkvMix0LW8qKHIrMSkpKX0uYmluZCh0aGlzKSk7Zm9yKHZhciBuO249dGhpcy5jb21tZW50QnV0dG9uUHJlUXVldWUuc2hpZnQoKTspbj10aGlzLmNyZWF0ZUNvbW1lbnQobixpKSx0aGlzLmNvbW1lbnRCdXR0b25RdWV1ZS5mb3JFYWNoKGZ1bmN0aW9uKGkscyl7biYmdm9pZCAwPT09aSYmKGk9dGhpcy5jb21tZW50QnV0dG9uUXVldWVbc109bix0aGlzLm5lZWREcmF3VGV4dChpLChlLW4ud2lkdGgpLzIsdC1vKihzKzEpKSxuPXZvaWQgMCl9LmJpbmQodGhpcykpLG4mJih0aGlzLmNvbW1lbnRCdXR0b25RdWV1ZS5wdXNoKG4pLHRoaXMubmVlZERyYXdUZXh0KG4sKGUtbi53aWR0aCkvMix0LW8qdGhpcy5jb21tZW50QnV0dG9uUXVldWUubGVuZ3RoKSl9LGNvbW1lbnRMb29wOmZ1bmN0aW9uKGUsdCxpKXtmb3IodmFyIHM9dC9vfDAscj0tMTsrK3I8czspe3ZhciBhPXRoaXMuY29tbWVudExvb3BRdWV1ZVtyXTtpZih2b2lkIDA9PT1hJiYoYT10aGlzLmNvbW1lbnRMb29wUXVldWVbcl09W10pLHRoaXMuY29tbWVudExvb3BQcmVRdWV1ZS5sZW5ndGg+MCl7dmFyIGw9MD09PWEubGVuZ3RoP3ZvaWQgMDphW2EubGVuZ3RoLTFdO2lmKHZvaWQgMD09PWx8fChpLWwuc3RhcnRUaW1lKSpuPmwud2lkdGgpe3ZhciBjPXRoaXMuY3JlYXRlQ29tbWVudCh0aGlzLmNvbW1lbnRMb29wUHJlUXVldWUuc2hpZnQoKSxpKTtjJiZhLnB1c2goYyl9fXRoaXMuY29tbWVudExvb3BRdWV1ZVtyXT1hLmZpbHRlcihmdW5jdGlvbih0KXt2YXIgcz0oaS10LnN0YXJ0VGltZSkqbjtyZXR1cm4gMD5zfHxzPnQud2lkdGgrZT8hMToodGhpcy5uZWVkRHJhd1RleHQodCxlLXMsbypyKSwhMCl9LmJpbmQodGhpcykpfWZvcih2YXIgaD10aGlzLmNvbW1lbnRMb29wUXVldWUubGVuZ3RoLXM7aC0tPjA7KXRoaXMuY29tbWVudExvb3BRdWV1ZS5wb3AoKX0scGF1c2VDb21tZW50OmZ1bmN0aW9uKCl7dGhpcy5wYXVzZUNvbW1lbnRBdD1EYXRlLm5vdygpfSxyZVN0YXJ0Q29tbWVudDpmdW5jdGlvbigpe2lmKHRoaXMucGF1c2VDb21tZW50QXQpe3ZhciBlPURhdGUubm93KCktdGhpcy5wYXVzZUNvbW1lbnRBdDt0aGlzLmNvbW1lbnRMb29wUXVldWUuZm9yRWFjaChmdW5jdGlvbih0KXt0LmZvckVhY2goZnVuY3Rpb24odCl7dCYmKHQuc3RhcnRUaW1lKz1lKX0pfSksdGhpcy5jb21tZW50QnV0dG9uUXVldWUuZm9yRWFjaChmdW5jdGlvbih0KXt0JiYodC5zdGFydFRpbWUrPWUpfSksdGhpcy5jb21tZW50VG9wUXVldWUuZm9yRWFjaChmdW5jdGlvbih0KXt0JiYodC5zdGFydFRpbWUrPWUpfSl9dGhpcy5wYXVzZUNvbW1lbnRBdD12b2lkIDB9LGRyYXdDb21tZW50OmZ1bmN0aW9uKCl7aWYoIXRoaXMucGF1c2VDb21tZW50QXQpe3ZhciBlPURhdGUubm93KCksdD10aGlzLkRPTXNbXCJ2aWRlby1mcmFtZVwiXS5vZmZzZXRXaWR0aCxpPXRoaXMuRE9Nc1tcInZpZGVvLWZyYW1lXCJdLm9mZnNldEhlaWdodDt0IT10aGlzLmNhbnZhc1dpZHRoJiYodGhpcy5ET01zLmNvbW1lbnRzLndpZHRoPXQsdGhpcy5jYW52YXNXaWR0aD10KSxpIT10aGlzLmNhbnZhc0hlaWdodCYmKHRoaXMuRE9Ncy5jb21tZW50cy5oZWlnaHQ9aSx0aGlzLmNhbnZhc0hlaWdodD1pKTt2YXIgbj10aGlzLnZpZGVvLm9mZnNldFdpZHRoLG89dGhpcy52aWRlby5vZmZzZXRIZWlnaHQ7dGhpcy5jb21tZW50TG9vcChuLG8sZSksdGhpcy5jb21tZW50VG9wKG4sbyxlKSx0aGlzLmNvbW1lbnRCb3R0b20obixvLGUpLHRoaXMuZHJhd1RleHQoKX19LG9uQ29tbWVudFRpbWVVcGRhdGU6ZnVuY3Rpb24oKXtpZih0aGlzLmVuYWJsZUNvbW1lbnQhPT0hMSl7dmFyIGU9dGhpcy52aWRlby5jdXJyZW50VGltZTtpZihNYXRoLmFicyhlLXRoaXMubGFzdENvbW1uZXRVcGRhdGVUaW1lKTw9MSYmZT50aGlzLmxhc3RDb21tbmV0VXBkYXRlVGltZSl7dmFyIHQ9MDtmb3IodGhpcy5sYXN0Q29tbW5ldEluZGV4JiZ0aGlzLmNvbW1lbnRzW3RoaXMubGFzdENvbW1uZXRJbmRleF0udGltZTw9dGhpcy5sYXN0Q29tbW5ldFVwZGF0ZVRpbWUmJih0PXRoaXMubGFzdENvbW1uZXRJbmRleCk7Kyt0PHRoaXMuY29tbWVudHMubGVuZ3RoOylpZighKHRoaXMuY29tbWVudHNbdF0udGltZTw9dGhpcy5sYXN0Q29tbW5ldFVwZGF0ZVRpbWUpKXtpZih0aGlzLmNvbW1lbnRzW3RdLnRpbWU+ZSlicmVhaztzd2l0Y2godGhpcy5jb21tZW50c1t0XS5wb3Mpe2Nhc2VcImJvdHRvbVwiOnRoaXMuY29tbWVudEJ1dHRvblByZVF1ZXVlLnB1c2godGhpcy5jb21tZW50c1t0XSk7YnJlYWs7Y2FzZVwidG9wXCI6dGhpcy5jb21tZW50VG9wUHJlUXVldWUucHVzaCh0aGlzLmNvbW1lbnRzW3RdKTticmVhaztkZWZhdWx0OnRoaXMuY29tbWVudExvb3BQcmVRdWV1ZS5wdXNoKHRoaXMuY29tbWVudHNbdF0pfXRoaXMubGFzdENvbW1uZXRJbmRleD10fX10cnl7dGhpcy5kcmF3Q29tbWVudCgpfWNhdGNoKGkpe310aGlzLmxhc3RDb21tbmV0VXBkYXRlVGltZT1lfX19fSx7XCIuL2NyZWF0ZUVsZW1lbnRcIjo3fV0sNDpbZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBpKGUpe3JldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChlKX1mdW5jdGlvbiBuKGUsdCxpLG4pe2Z1bmN0aW9uIG8odCl7dmFyIGk9KHQuY2xpZW50WC1lLnBhcmVudE5vZGUuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdCkvZS5wYXJlbnROb2RlLm9mZnNldFdpZHRoO3JldHVybiBNYXRoLm1pbihNYXRoLm1heChpLDApLDEpfWZ1bmN0aW9uIHModCl7MT09dC53aGljaCYmKGw9ITAsZS5kcmFnaW5nPSEwLHIodCkpfWZ1bmN0aW9uIHIoZSl7aWYoMT09ZS53aGljaCYmbD09PSEwKXt2YXIgdD1vKGUpO2kodCl9fWZ1bmN0aW9uIGEodCl7aWYoMT09dC53aGljaCYmbD09PSEwKXt2YXIgcz1vKHQpO2kocyksbihzKSxsPSExLGRlbGV0ZSBlLmRyYWdpbmd9fXZhciBsPSExO2k9aXx8ZnVuY3Rpb24oKXt9LG49bnx8ZnVuY3Rpb24oKXt9LGUucGFyZW50Tm9kZS5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIscyksdC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsciksdC5hZGRFdmVudExpc3RlbmVyKFwibW91c2V1cFwiLGEpfXZhciBvPShlKFwiLi9jcmVhdGVFbGVtZW50XCIpLGUoXCIuL2RlbGVnYXRlQ2xpY2tCeUNsYXNzTmFtZVwiKSkscz1lKFwiLi90aW1lRm9ybWF0XCIpO3QuZXhwb3J0cz17aW5pdDpmdW5jdGlvbigpe3ZhciBlPXRoaXMuaWZyYW1lLmNvbnRlbnREb2N1bWVudCx0PW8oZSk7dC5vbihcInBsYXlcIix0aGlzLm9uUGxheUNsaWNrLHRoaXMpLHQub24oXCJ2aWRlby1mcmFtZVwiLHRoaXMub25WaWRlb0NsaWNrLHRoaXMpLHQub24oXCJzb3VyY2VcIix0aGlzLm9uU291cmNlQ2xpY2ssdGhpcyksdC5vbihcImFsbHNjcmVlblwiLHRoaXMub25BbGxTY3JlZW5DbGljayx0aGlzKSx0Lm9uKFwiZnVsbHNjcmVlblwiLHRoaXMub25mdWxsU2NyZWVuQ2xpY2ssdGhpcyksdC5vbihcIm5vcm1hbHNjcmVlblwiLHRoaXMub25Ob3JtYWxTY3JlZW5DbGljayx0aGlzKSx0Lm9uKFwiY29tbWVudHMtYnRuXCIsdGhpcy5vbmNvbW1lbnRzQnRuQ2xpY2ssdGhpcyksdC5vbihcImFpcnBsYXlcIix0aGlzLm9uQWlycGxheUJ0bkNsaWNrLHRoaXMpLGUuZG9jdW1lbnRFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJrZXlkb3duXCIsdGhpcy5vbktleURvd24uYmluZCh0aGlzKSwhMSksdGhpcy5ET01zLnBsYXllci5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vtb3ZlXCIsdGhpcy5vbk1vdXNlQWN0aXZlLmJpbmQodGhpcykpLG4odGhpcy5ET01zLnByb2dyZXNzX2FuY2hvcixlLHRoaXMub25Qcm9ncmVzc0FuY2hvcldpbGxTZXQuYmluZCh0aGlzKSx0aGlzLm9uUHJvZ3Jlc3NBbmNob3JTZXQuYmluZCh0aGlzKSksbih0aGlzLkRPTXMudm9sdW1lX2FuY2hvcixlLHRoaXMub25Wb2x1bWVBbmNob3JXaWxsU2V0LmJpbmQodGhpcykpfSxvbktleURvd246ZnVuY3Rpb24oZSl7c3dpdGNoKGUucHJldmVudERlZmF1bHQoKSxlLmtleUNvZGUpe2Nhc2UgMzI6dGhpcy5vblBsYXlDbGljaygpO2JyZWFrO2Nhc2UgMzk6dGhpcy52aWRlby5jdXJyZW50VGltZT1NYXRoLm1pbih0aGlzLnZpZGVvLmR1cmF0aW9uLHRoaXMudmlkZW8uY3VycmVudFRpbWUrMTApO2JyZWFrO2Nhc2UgMzc6dGhpcy52aWRlby5jdXJyZW50VGltZT1NYXRoLm1heCgwLHRoaXMudmlkZW8uY3VycmVudFRpbWUtMTApO2JyZWFrO2Nhc2UgMzg6dGhpcy52aWRlby52b2x1bWU9TWF0aC5taW4oMSx0aGlzLnZpZGVvLnZvbHVtZSsuMSksdGhpcy5ET01zLnZvbHVtZV9hbmNob3Iuc3R5bGUud2lkdGg9MTAwKnRoaXMudmlkZW8udm9sdW1lK1wiJVwiO2JyZWFrO2Nhc2UgNDA6dGhpcy52aWRlby52b2x1bWU9TWF0aC5tYXgoMCx0aGlzLnZpZGVvLnZvbHVtZS0uMSksdGhpcy5ET01zLnZvbHVtZV9hbmNob3Iuc3R5bGUud2lkdGg9MTAwKnRoaXMudmlkZW8udm9sdW1lK1wiJVwiO2JyZWFrO2Nhc2UgNjU6dGhpcy5ET01zLnBsYXllci5jbGFzc0xpc3QuY29udGFpbnMoXCJhbGxzY3JlZW5cIik/dGhpcy5vbk5vcm1hbFNjcmVlbkNsaWNrKCk6dGhpcy5vbkFsbFNjcmVlbkNsaWNrKCk7YnJlYWs7Y2FzZSA3MDp0aGlzLkRPTXMucGxheWVyLmNsYXNzTGlzdC5jb250YWlucyhcImZ1bGxzY3JlZW5cIil8fHRoaXMub25mdWxsU2NyZWVuQ2xpY2soKX19LG9uVmlkZW9DbGljazpmdW5jdGlvbigpe3ZvaWQgMD09dGhpcy52aWRlb0NsaWNrRGJsVGltZXI/dGhpcy52aWRlb0NsaWNrRGJsVGltZXI9c2V0VGltZW91dChmdW5jdGlvbigpe3RoaXMudmlkZW9DbGlja0RibFRpbWVyPXZvaWQgMCx0aGlzLm9uUGxheUNsaWNrKCl9LmJpbmQodGhpcyksMzAwKTooY2xlYXJUaW1lb3V0KHRoaXMudmlkZW9DbGlja0RibFRpbWVyKSx0aGlzLnZpZGVvQ2xpY2tEYmxUaW1lcj12b2lkIDAsZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnR8fGRvY3VtZW50Lm1vekZ1bGxTY3JlZW5FbGVtZW50fHxkb2N1bWVudC53ZWJraXRGdWxsc2NyZWVuRWxlbWVudD90aGlzLm9uTm9ybWFsU2NyZWVuQ2xpY2soKTp0aGlzLm9uZnVsbFNjcmVlbkNsaWNrKCkpfSxvbk1vdXNlQWN0aXZlOmZ1bmN0aW9uKCl7dGhpcy5ET01zLnBsYXllci5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpLGNsZWFyVGltZW91dCh0aGlzLk1vdXNlQWN0aXZlVGltZXIpLHRoaXMuTW91c2VBY3RpdmVUaW1lcj1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhpcy5ET01zLnBsYXllci5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpfS5iaW5kKHRoaXMpLDFlMyl9LG9uUGxheUNsaWNrOmZ1bmN0aW9uKCl7dGhpcy5ET01zLnBsYXkuY2xhc3NMaXN0LmNvbnRhaW5zKFwicGF1c2VkXCIpPyh0aGlzLnZpZGVvLnBsYXkoKSx0aGlzLkRPTXMucGxheS5jbGFzc0xpc3QucmVtb3ZlKFwicGF1c2VkXCIpKToodGhpcy52aWRlby5wYXVzZSgpLHRoaXMuRE9Ncy5wbGF5LmNsYXNzTGlzdC5hZGQoXCJwYXVzZWRcIikpfSxvblNvdXJjZUNsaWNrOmZ1bmN0aW9uKGUpe2UuY2xhc3NMaXN0LmNvbnRhaW5zKFwiY3VyclwiKXx8KHRoaXMudmlkZW8ucHJlbG9hZFN0YXJ0VGltZT10aGlzLnZpZGVvLmN1cnJlbnRUaW1lLHRoaXMudmlkZW8uc3JjPXRoaXMuc291cmNlTGlzdFswfGUuZ2V0QXR0cmlidXRlKFwic291cmNlSW5kZXhcIildWzFdLGkoZS5wYXJlbnROb2RlLmNoaWxkTm9kZXMpLmZvckVhY2goZnVuY3Rpb24odCl7ZT09PXQ/dC5jbGFzc0xpc3QuYWRkKFwiY3VyclwiKTp0LmNsYXNzTGlzdC5yZW1vdmUoXCJjdXJyXCIpfS5iaW5kKHRoaXMpKSl9LG9uUHJvZ3Jlc3NBbmNob3JXaWxsU2V0OmZ1bmN0aW9uKGUpe3ZhciB0PXRoaXMudmlkZW8uZHVyYXRpb24saT10KmU7dGhpcy5ET01zLmN1cnJlbnQuaW5uZXJIVE1MPXMoaSksdGhpcy5ET01zLmR1cmF0aW9uLmlubmVySFRNTD1zKHQpLHRoaXMuRE9Ncy5wcm9ncmVzc19hbmNob3Iuc3R5bGUud2lkdGg9MTAwKmUrXCIlXCJ9LG9uUHJvZ3Jlc3NBbmNob3JTZXQ6ZnVuY3Rpb24oZSl7dGhpcy52aWRlby5jdXJyZW50VGltZT10aGlzLnZpZGVvLmR1cmF0aW9uKmV9LG9uVm9sdW1lQW5jaG9yV2lsbFNldDpmdW5jdGlvbihlKXt0aGlzLnZpZGVvLnZvbHVtZT1lLHRoaXMuRE9Ncy52b2x1bWVfYW5jaG9yLnN0eWxlLndpZHRoPTEwMCplK1wiJVwifSxvbkFsbFNjcmVlbkNsaWNrOmZ1bmN0aW9uKCl7dmFyIGU9ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoLHQ9ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodDt0aGlzLmlmcmFtZS5zdHlsZS5jc3NUZXh0PVwiO3Bvc2l0aW9uOmZpeGVkO3RvcDowO2xlZnQ6MDt3aWR0aDpcIitlK1wicHg7aGVpZ2h0OlwiK3QrXCJweDt6LWluZGV4Ojk5OTk5OTtcIix0aGlzLmFsbFNjcmVlbldpblJlc2l6ZUZ1bmN0aW9uPXRoaXMuYWxsU2NyZWVuV2luUmVzaXplRnVuY3Rpb258fGZ1bmN0aW9uKCl7dGhpcy5pZnJhbWUuc3R5bGUud2lkdGg9ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoK1wicHhcIix0aGlzLmlmcmFtZS5zdHlsZS5oZWlnaHQ9ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCtcInB4XCJ9LmJpbmQodGhpcyksd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIix0aGlzLmFsbFNjcmVlbldpblJlc2l6ZUZ1bmN0aW9uKSx3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLHRoaXMuYWxsU2NyZWVuV2luUmVzaXplRnVuY3Rpb24pLHRoaXMuRE9Ncy5wbGF5ZXIuY2xhc3NMaXN0LmFkZChcImFsbHNjcmVlblwiKX0sb25mdWxsU2NyZWVuQ2xpY2s6ZnVuY3Rpb24oKXtbXCJ3ZWJraXRSZXF1ZXN0RnVsbFNjcmVlblwiLFwibW96UmVxdWVzdEZ1bGxTY3JlZW5cIixcInJlcXVlc3RGdWxsU2NyZWVuXCJdLmZvckVhY2goZnVuY3Rpb24oZSl7dGhpcy5ET01zLnBsYXllcltlXSYmdGhpcy5ET01zLnBsYXllcltlXSgpfS5iaW5kKHRoaXMpKSx0aGlzLm9uTW91c2VBY3RpdmUoKX0sb25Ob3JtYWxTY3JlZW5DbGljazpmdW5jdGlvbigpe3dpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsdGhpcy5hbGxTY3JlZW5XaW5SZXNpemVGdW5jdGlvbiksdGhpcy5pZnJhbWUuc3R5bGUuY3NzVGV4dD1cIjt3aWR0aDpcIit0aGlzLnNpemVbMF0rXCJweDtoZWlnaHQ6XCIrdGhpcy5zaXplWzFdK1wicHg7XCIsW1wid2Via2l0Q2FuY2VsRnVsbFNjcmVlblwiLFwibW96Q2FuY2VsRnVsbFNjcmVlblwiLFwiY2FuY2VsRnVsbFNjcmVlblwiXS5mb3JFYWNoKGZ1bmN0aW9uKGUpe2RvY3VtZW50W2VdJiZkb2N1bWVudFtlXSgpfSksdGhpcy5ET01zLnBsYXllci5jbGFzc0xpc3QucmVtb3ZlKFwiYWxsc2NyZWVuXCIpfSxvbmNvbW1lbnRzQnRuQ2xpY2s6ZnVuY3Rpb24oKXt0aGlzLmVuYWJsZUNvbW1lbnQ9IXRoaXMuRE9Nc1tcImNvbW1lbnRzLWJ0blwiXS5jbGFzc0xpc3QuY29udGFpbnMoXCJlbmFibGVcIiksdGhpcy5lbmFibGVDb21tZW50PyhzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhpcy5ET01zLmNvbW1lbnRzLnN0eWxlLmRpc3BsYXk9XCJibG9ja1wifS5iaW5kKHRoaXMpLDgwKSx0aGlzLkRPTXNbXCJjb21tZW50cy1idG5cIl0uY2xhc3NMaXN0LmFkZChcImVuYWJsZVwiKSk6KHRoaXMuRE9Ncy5jb21tZW50cy5zdHlsZS5kaXNwbGF5PVwibm9uZVwiLHRoaXMuRE9Nc1tcImNvbW1lbnRzLWJ0blwiXS5jbGFzc0xpc3QucmVtb3ZlKFwiZW5hYmxlXCIpKX0sb25BaXJwbGF5QnRuQ2xpY2s6ZnVuY3Rpb24oKXt0aGlzLnZpZGVvLndlYmtpdFNob3dQbGF5YmFja1RhcmdldFBpY2tlcigpfX19LHtcIi4vY3JlYXRlRWxlbWVudFwiOjcsXCIuL2RlbGVnYXRlQ2xpY2tCeUNsYXNzTmFtZVwiOjgsXCIuL3RpbWVGb3JtYXRcIjoxNH1dLDU6W2Z1bmN0aW9uKGUsdCl7e3ZhciBpPShlKFwiLi9leHRlbmRcIiksZShcIi4vY3JlYXRlRWxlbWVudFwiKSk7ZShcIi4vcGFyc2VET01CeUNsYXNzTmFtZXNcIil9dC5leHBvcnRzPXtpbml0OmZ1bmN0aW9uKCl7dmFyIGU9MDt0aGlzLnNvdXJjZUxpc3QuZm9yRWFjaChmdW5jdGlvbih0LG4pe2koXCJsaVwiLHthcHBlbmRUbzp0aGlzLkRPTXMuaGQsc291cmNlSW5kZXg6bixjbGFzc05hbWU6XCJzb3VyY2UgXCIrKG49PT1lP1wiY3VyclwiOlwiXCIpLGlubmVySFRNTDp0WzBdfSl9LmJpbmQodGhpcykpLHRoaXMuRE9Ncy52aWRlby5zcmM9dGhpcy5zb3VyY2VMaXN0W2VdWzFdfX19LHtcIi4vY3JlYXRlRWxlbWVudFwiOjcsXCIuL2V4dGVuZFwiOjksXCIuL3BhcnNlRE9NQnlDbGFzc05hbWVzXCI6MTF9XSw2OltmdW5jdGlvbihlLHQpe3ZhciBpPWUoXCIuL3RpbWVGb3JtYXRcIik7dC5leHBvcnRzPXtpbml0OmZ1bmN0aW9uKCl7dGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKFwidGltZXVwZGF0ZVwiLHRoaXMub25WaWRlb1RpbWVVcGRhdGUuYmluZCh0aGlzKSksdGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKFwicGxheVwiLHRoaXMub25WaWRlb1BsYXkuYmluZCh0aGlzKSksdGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKFwicGF1c2VcIix0aGlzLm9uVmlkZW9UaW1lUGF1c2UuYmluZCh0aGlzKSksdGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKFwibG9hZGVkbWV0YWRhdGFcIix0aGlzLm9uVmlkZW9Mb2FkZWRNZXRhRGF0YS5iaW5kKHRoaXMpKSx0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJ3ZWJraXRwbGF5YmFja3RhcmdldGF2YWlsYWJpbGl0eWNoYW5nZWRcIix0aGlzLm9uUGxheWJhY2tUYXJnZXRBdmFpbGFiaWxpdHlDaGFuZ2VkLmJpbmQodGhpcykpLHNldEludGVydmFsKHRoaXMudmlkZW9CdWZmZXJlZC5iaW5kKHRoaXMpLDFlMyksdGhpcy5ET01zLnZvbHVtZV9hbmNob3Iuc3R5bGUud2lkdGg9MTAwKnRoaXMudmlkZW8udm9sdW1lK1wiJVwifSxvblZpZGVvVGltZVVwZGF0ZTpmdW5jdGlvbigpe3ZhciBlPXRoaXMudmlkZW8uY3VycmVudFRpbWUsdD10aGlzLnZpZGVvLmR1cmF0aW9uO3RoaXMuRE9Ncy5jdXJyZW50LmlubmVySFRNTD1pKGUpLHRoaXMuRE9Ncy5kdXJhdGlvbi5pbm5lckhUTUw9aSh0KSx0aGlzLkRPTXMucHJvZ3Jlc3NfYW5jaG9yLmRyYWdpbmd8fCh0aGlzLkRPTXMucHJvZ3Jlc3NfYW5jaG9yLnN0eWxlLndpZHRoPTEwMCpNYXRoLm1pbihNYXRoLm1heChlL3QsMCksMSkrXCIlXCIpfSx2aWRlb0J1ZmZlcmVkOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy52aWRlby5idWZmZXJlZCx0PXRoaXMudmlkZW8uY3VycmVudFRpbWUsaT0wPT1lLmxlbmd0aD8wOmUuZW5kKGUubGVuZ3RoLTEpO3RoaXMuRE9Ncy5idWZmZXJlZF9hbmNob3Iuc3R5bGUud2lkdGg9MTAwKk1hdGgubWluKE1hdGgubWF4KGkvdGhpcy52aWRlby5kdXJhdGlvbiwwKSwxKStcIiVcIiwwPT1pfHx0Pj1pP3RoaXMuRE9Ncy5wbGF5ZXIuY2xhc3NMaXN0LmFkZChcImxvYWRpbmdcIik6dGhpcy5ET01zLnBsYXllci5jbGFzc0xpc3QucmVtb3ZlKFwibG9hZGluZ1wiKX0sb25WaWRlb1BsYXk6ZnVuY3Rpb24oKXt0aGlzLkRPTXMucGxheS5jbGFzc0xpc3QucmVtb3ZlKFwicGF1c2VkXCIpfSxvblZpZGVvVGltZVBhdXNlOmZ1bmN0aW9uKCl7dGhpcy5ET01zLnBsYXkuY2xhc3NMaXN0LmFkZChcInBhdXNlZFwiKX0sb25WaWRlb0xvYWRlZE1ldGFEYXRhOmZ1bmN0aW9uKCl7dGhpcy52aWRlby5wcmVsb2FkU3RhcnRUaW1lJiYodGhpcy52aWRlby5jdXJyZW50VGltZT10aGlzLnZpZGVvLnByZWxvYWRTdGFydFRpbWUsZGVsZXRlIHRoaXMudmlkZW8ucHJlbG9hZFN0YXJ0VGltZSl9LG9uUGxheWJhY2tUYXJnZXRBdmFpbGFiaWxpdHlDaGFuZ2VkOmZ1bmN0aW9uKGUpe3ZhciB0PVwic3VwcG9ydC1haXJwbGF5XCI7XCJhdmFpbGFibGVcIj09PWUuYXZhaWxhYmlsaXR5P3RoaXMuRE9Ncy5wbGF5ZXIuY2xhc3NMaXN0LmFkZCh0KTp0aGlzLkRPTXMucGxheWVyLmNsYXNzTGlzdC5yZW1vdmUodCl9fX0se1wiLi90aW1lRm9ybWF0XCI6MTR9XSw3OltmdW5jdGlvbihlLHQpe2Z1bmN0aW9uIGkoZSx0KXt2YXIgaT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KGUpO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHQpdC5jYWxsKGkpO2Vsc2UgZm9yKHZhciBuIGluIHQpaWYodC5oYXNPd25Qcm9wZXJ0eShuKSlzd2l0Y2gobil7Y2FzZVwiYXBwZW5kVG9cIjp0W25dLmFwcGVuZENoaWxkKGkpO2JyZWFrO2Nhc2VcInRleHRcIjp2YXIgbz1kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0W25dKTtpLmlubmVySFRNTD1cIlwiLGkuYXBwZW5kQ2hpbGQobyk7YnJlYWs7Y2FzZVwiaW5uZXJIVE1MXCI6Y2FzZVwiY2xhc3NOYW1lXCI6Y2FzZVwiaWRcIjppW25dPXRbbl07YnJlYWs7Y2FzZVwic3R5bGVcIjp2YXIgcz10W25dO2Zvcih2YXIgciBpbiBzKXMuaGFzT3duUHJvcGVydHkocikmJihpLnN0eWxlW3JdPXNbcl0pO2JyZWFrO2RlZmF1bHQ6aS5zZXRBdHRyaWJ1dGUobix0W25dK1wiXCIpfXJldHVybiBpfXQuZXhwb3J0cz1pfSx7fV0sODpbZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBpKGUpe3JldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChlKX1mdW5jdGlvbiBuKGUpe3RoaXMuX2V2ZW50TWFwPXt9LHRoaXMuX3Jvb3RFbGVtZW50PWUsdGhpcy5faXNSb290RWxlbWVudEJpbmRlZENsaWNrPSExLHRoaXMuX2JpbmRDbGlja0Z1bmN0aW9uPWZ1bmN0aW9uKGUpeyFmdW5jdGlvbiB0KGUsbil7biYmbi5ub2RlTmFtZSYmKG4uY2xhc3NMaXN0JiZpKG4uY2xhc3NMaXN0KS5mb3JFYWNoKGZ1bmN0aW9uKHQpe2UudHJpZ2dlcih0LG4pfSksdChlLG4ucGFyZW50Tm9kZSkpfSh0aGlzLGUudGFyZ2V0KX0uYmluZCh0aGlzKX12YXIgbz1lKFwiLi9leHRlbmRcIik7byhuLnByb3RvdHlwZSx7b246ZnVuY3Rpb24oZSx0LGkpe3ZvaWQgMD09PXRoaXMuX2V2ZW50TWFwW2VdJiYodGhpcy5fZXZlbnRNYXBbZV09W10pLHRoaXMuX2V2ZW50TWFwW2VdLnB1c2goW3QsaV0pLHRoaXMuX2lzUm9vdEVsZW1lbnRCaW5kZWRDbGlja3x8KF9pc1Jvb3RFbGVtZW50QmluZGVkQ2xpY2s9ITAsdGhpcy5fcm9vdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsdGhpcy5fYmluZENsaWNrRnVuY3Rpb24sITEpKX0sb2ZmOmZ1bmN0aW9uKGUsdCl7aWYodm9pZCAwIT10aGlzLl9ldmVudE1hcFtlXSlmb3IodmFyIGk9dGhpcy5fZXZlbnRNYXBbZV0ubGVuZ3RoO2ktLTspaWYodGhpcy5fZXZlbnRNYXBbZV1baV1bMF09PT10KXt0aGlzLl9ldmVudE1hcFtlXS5zcGxpY2UoaSwxKTticmVha31mb3IodmFyIG4gaW4gdGhpcy5fZXZlbnRNYXApYnJlYWs7dm9pZCAwPT09biYmdGhpcy5faXNSb290RWxlbWVudEJpbmRlZENsaWNrJiYoX2lzUm9vdEVsZW1lbnRCaW5kZWRDbGljaz0hMSx0aGlzLl9yb290RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIix0aGlzLl9iaW5kQ2xpY2tGdW5jdGlvbiwhMSkpfSx0cmlnZ2VyOmZ1bmN0aW9uKGUsdCl7dD12b2lkIDA9PT10P3RoaXMuX3Jvb3RFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lcyhlKTpbdF0sdC5mb3JFYWNoKGZ1bmN0aW9uKHQpeyh0aGlzLl9ldmVudE1hcFtlXXx8W10pLmZvckVhY2goZnVuY3Rpb24oZSl7ZVswXS5jYWxsKGVbMV0sdCl9KX0uYmluZCh0aGlzKSl9fSksdC5leHBvcnRzPWZ1bmN0aW9uKGUpe3JldHVybiBuZXcgbihlKX19LHtcIi4vZXh0ZW5kXCI6OX1dLDk6W2Z1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gaShlKXtmb3IodmFyIHQsaT1hcmd1bWVudHMubGVuZ3RoLG49MTtpPm47KXt0PWFyZ3VtZW50c1tuKytdO2Zvcih2YXIgbyBpbiB0KXQuaGFzT3duUHJvcGVydHkobykmJihlW29dPXRbb10pfXJldHVybiBlfXQuZXhwb3J0cz1pfSx7fV0sMTA6W2Z1bmN0aW9uKGUpe2Z1bmN0aW9uIHQoZSx0LGksbil7dGhpcy5pZD1lLHRoaXMuc2l6ZT10LnNwbGl0KFwieFwiKSx0aGlzLnNvdXJjZUxpc3Q9aXx8W10sdGhpcy5jb21tZW50cz1uLHRoaXMuaW5pdCgpfWUoXCIuL2NvbXBvbmVudFwiKSh0LGUoXCIuL2NvbXBvbmVudF9idWlsZFwiKSxlKFwiLi9jb21wb25lbnRfZXZlbnRcIiksZShcIi4vY29tcG9uZW50X3ZpZGVvXCIpLGUoXCIuL2NvbXBvbmVudF9zb3VyY2VcIiksZShcIi4vY29tcG9uZW50X2NvbW1lbnRzXCIpKSxNQU1BUGxheWVyPXR9LHtcIi4vY29tcG9uZW50XCI6MSxcIi4vY29tcG9uZW50X2J1aWxkXCI6MixcIi4vY29tcG9uZW50X2NvbW1lbnRzXCI6MyxcIi4vY29tcG9uZW50X2V2ZW50XCI6NCxcIi4vY29tcG9uZW50X3NvdXJjZVwiOjUsXCIuL2NvbXBvbmVudF92aWRlb1wiOjZ9XSwxMTpbZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBpKGUsdCl7dmFyIGk9e307cmV0dXJuIHQuZm9yRWFjaChmdW5jdGlvbih0KXtpW3RdPWUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0KVswXX0pLGl9dC5leHBvcnRzPWl9LHt9XSwxMjpbZnVuY3Rpb24oZSx0KXt0LmV4cG9ydHM9JyogeyBtYXJnaW46MDsgcGFkZGluZzowOyB9Ym9keSB7IGZvbnQtZmFtaWx5OiBcIlBpbmdIZWlcIixcIkx1Y2lkYSBHcmFuZGVcIiwgXCJMdWNpZGEgU2FucyBVbmljb2RlXCIsIFwiU1RIZWl0aVwiLCBcIkhlbHZldGljYVwiLFwiQXJpYWxcIixcIlZlcmRhbmFcIixcInNhbnMtc2VyaWZcIjsgZm9udC1zaXplOjE2cHg7fWh0bWwsIGJvZHksIC5wbGF5ZXIgeyBoZWlnaHQ6IDEwMCU7IH0ucGxheWVyOi13ZWJraXQtZnVsbC1zY3JlZW4geyB3aWR0aDogMTAwJTsgY3Vyc29yOnVybChkYXRhOmltYWdlL2dpZjtiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUFFQUFBQUJDQVlBQUFBZkZjU0pBQUFBRFVsRVFWUUltV05nWUdCZ0FBQUFCUUFCaDZGTzFBQUFBQUJKUlU1RXJrSmdnZz09KTsgfS5wbGF5ZXI6LW1vei1mdWxsLXNjcmVlbiB7IHdpZHRoOiAxMDAlOyBjdXJzb3I6dXJsKGRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQUVBQUFBQkNBWUFBQUFmRmNTSkFBQUFEVWxFUVZRSW1XTmdZR0JnQUFBQUJRQUJoNkZPMUFBQUFBQkpSVTVFcmtKZ2dnPT0pOyB9LnBsYXllcjpmdWxsLXNjcmVlbiB7IHdpZHRoOiAxMDAlOyBjdXJzb3I6dXJsKGRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQUVBQUFBQkNBWUFBQUFmRmNTSkFBQUFEVWxFUVZRSW1XTmdZR0JnQUFBQUJRQUJoNkZPMUFBQUFBQkpSVTVFcmtKZ2dnPT0pOyB9LnBsYXllciB7IGJvcmRlci1yYWRpdXM6IDNweDsgb3ZlcmZsb3c6IGhpZGRlbjsgcG9zaXRpb246IHJlbGF0aXZlOyBjdXJzb3I6IGRlZmF1bHQ7ICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lOyAgLW1vei11c2VyLXNlbGVjdDogbm9uZTsgdXNlci1zZWxlY3Q6IG5vbmU7fS52aWRlby1mcmFtZSB7IGJveC1zaXppbmc6IGJvcmRlci1ib3g7IHBhZGRpbmctYm90dG9tOiA1MHB4OyBoZWlnaHQ6IDEwMCU7IG92ZXJmbG93OiBoaWRkZW47IHBvc2l0aW9uOiByZWxhdGl2ZTt9LnZpZGVvLWZyYW1lIC5jb21tZW50c3sgcG9zaXRpb246IGFic29sdXRlOyB0b3A6MDtsZWZ0OjA7IHdpZHRoOjEwMCU7IGhlaWdodDoxMDAlOyAgLXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlWigwKTsgIC1tb3otdHJhbnNmb3JtOnRyYW5zbGF0ZVooMCk7IHRyYW5zZm9ybTp0cmFuc2xhdGVaKDApOyAgcG9pbnRlci1ldmVudHM6IG5vbmU7fS5wbGF5ZXI6LXdlYmtpdC1mdWxsLXNjcmVlbiAudmlkZW8tZnJhbWUgeyBwYWRkaW5nLWJvdHRvbTogMHB4OyB9LnBsYXllcjotbW96LWZ1bGwtc2NyZWVuIC52aWRlby1mcmFtZSB7IHBhZGRpbmctYm90dG9tOiAwcHg7IH0ucGxheWVyOmZ1bGwtc2NyZWVuIC52aWRlby1mcmFtZXsgcGFkZGluZy1ib3R0b206IDBweDsgfS52aWRlbyB7IHdpZHRoOiAxMDAlOyAgaGVpZ2h0OiAxMDAlOyBiYWNrZ3JvdW5kOiAjMDAwMDAwO30uY29udHJvbGxlciB7ICBwb3NpdGlvbjogYWJzb2x1dGU7IGJvdHRvbTogMHB4OyAgbGVmdDowOyByaWdodDowOyAgYmFja2dyb3VuZDogIzI0MjcyQTsgIGhlaWdodDogNTBweDt9LmNvbnRyb2xsZXIgLmxvYWRpbmctaWNvbiB7IGRpc3BsYXk6IG5vbmU7ICBwb3NpdGlvbjogYWJzb2x1dGU7IHdpZHRoOiAyMHB4OyAgaGVpZ2h0OiAyMHB4OyBsaW5lLWhlaWdodDogMjBweDsgIHRleHQtYWxpZ246IGNlbnRlcjsgZm9udC1zaXplOiAyMHB4OyAgY29sb3I6ICNmZmZmZmY7IHRvcDogLTMwcHg7IHJpZ2h0OiAxMHB4O30ucGxheWVyLmxvYWRpbmcgLmNvbnRyb2xsZXIgLmxvYWRpbmctaWNvbiB7ICBkaXNwbGF5OiBibG9jazt9LnBsYXllcjotd2Via2l0LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIHsgLXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlWSg1MHB4KTsgLXdlYmtpdC10cmFuc2l0aW9uOiAtd2Via2l0LXRyYW5zZm9ybSAwLjNzIGVhc2U7fS5wbGF5ZXI6LW1vei1mdWxsLXNjcmVlbiAuY29udHJvbGxlciB7IC1tb3otdHJhbnNmb3JtOnRyYW5zbGF0ZVkoNTBweCk7ICAtbW96LXRyYW5zaXRpb246IC1tb3otdHJhbnNmb3JtIDAuM3MgZWFzZTt9LnBsYXllcjpmdWxsLXNjcmVlbiAuY29udHJvbGxlciB7ICB0cmFuc2Zvcm06dHJhbnNsYXRlWSg1MHB4KTsgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuM3MgZWFzZTt9LnBsYXllci5hY3RpdmU6LXdlYmtpdC1mdWxsLXNjcmVlbiB7IGN1cnNvcjogZGVmYXVsdDt9LnBsYXllci5hY3RpdmU6LW1vei1mdWxsLXNjcmVlbiB7ICBjdXJzb3I6IGRlZmF1bHQ7fS5wbGF5ZXIuYWN0aXZlOmZ1bGwtc2NyZWVuIHsgY3Vyc29yOiBkZWZhdWx0O30ucGxheWVyLmFjdGl2ZTotd2Via2l0LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyLC5wbGF5ZXI6LXdlYmtpdC1mdWxsLXNjcmVlbiAuY29udHJvbGxlcjpob3ZlciB7IC13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCk7ICBjdXJzb3I6IGRlZmF1bHQ7fS5wbGF5ZXIuYWN0aXZlOi1tb3otZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIsLnBsYXllcjotbW96LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyOmhvdmVyIHsgLW1vei10cmFuc2Zvcm06dHJhbnNsYXRlWSgwKTsgY3Vyc29yOiBkZWZhdWx0O30ucGxheWVyLmFjdGl2ZTpmdWxsLXNjcmVlbiAuY29udHJvbGxlci5wbGF5ZXI6ZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXI6aG92ZXIgeyAgdHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCk7ICBjdXJzb3I6IGRlZmF1bHQ7fS5wbGF5ZXIuYWN0aXZlOi13ZWJraXQtZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgLnByb2dyZXNzIC5wcm9ncmVzc19hbmNob3I6YWZ0ZXIsLnBsYXllcjotd2Via2l0LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyOmhvdmVyIC5wcm9ncmVzcyAucHJvZ3Jlc3NfYW5jaG9yOmFmdGVyIHsgaGVpZ2h0OjEycHg7fS5wbGF5ZXIuYWN0aXZlOi1tb3otZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgLnByb2dyZXNzIC5wcm9ncmVzc19hbmNob3I6YWZ0ZXIsLnBsYXllcjotbW96LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyOmhvdmVyIC5wcm9ncmVzcyAucHJvZ3Jlc3NfYW5jaG9yOmFmdGVyIHsgaGVpZ2h0OjEycHg7fS5wbGF5ZXIuYWN0aXZlOmZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIC5wcm9ncmVzcyAucHJvZ3Jlc3NfYW5jaG9yOmFmdGVyLC5wbGF5ZXI6ZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXI6aG92ZXIgLnByb2dyZXNzIC5wcm9ncmVzc19hbmNob3I6YWZ0ZXIgeyBoZWlnaHQ6MTJweDt9LnBsYXllcjotd2Via2l0LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIC5wcm9ncmVzcyAucHJvZ3Jlc3NfYW5jaG9yOmFmdGVyIHsgaGVpZ2h0OjRweDt9LnBsYXllcjotbW96LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIC5wcm9ncmVzcyAucHJvZ3Jlc3NfYW5jaG9yOmFmdGVyIHsgaGVpZ2h0OjRweDt9LnBsYXllcjpmdWxsLXNjcmVlbiAuY29udHJvbGxlciAucHJvZ3Jlc3MgLnByb2dyZXNzX2FuY2hvcjphZnRlciB7ICBoZWlnaHQ6NHB4O30uY29udHJvbGxlciAucHJvZ3Jlc3MgeyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDowcHg7ICBsZWZ0OjA7IHJpZ2h0OjA7ICBib3JkZXItcmlnaHQ6IDRweCBzb2xpZCAjMTgxQTFEOyAgYm9yZGVyLWxlZnQ6IDhweCBzb2xpZCAjREY2NTU4OyBoZWlnaHQ6IDRweDsgIGJhY2tncm91bmQ6ICMxODFBMUQ7ICB6LWluZGV4OjE7ICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWigwKTsgLW1vei10cmFuc2Zvcm06IHRyYW5zbGF0ZVooMCk7ICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVooMCk7fS5jb250cm9sbGVyIC5wcm9ncmVzczphZnRlciB7IGNvbnRlbnQ6XCJcIjsgZGlzcGxheTogYmxvY2s7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOjBweDsgIGxlZnQ6MDsgcmlnaHQ6MDsgIGJvdHRvbTotMTBweDsgaGVpZ2h0OiAxMHB4O30uY29udHJvbGxlciAucHJvZ3Jlc3MgLmFuY2hvciB7IGhlaWdodDogNHB4OyAgYmFja2dyb3VuZDogI0RGNjU1ODsgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOjA7bGVmdDowO30uY29udHJvbGxlciAucHJvZ3Jlc3MgLmFuY2hvcjphZnRlciB7IGNvbnRlbnQ6XCJcIjsgZGlzcGxheTogYmxvY2s7IHdpZHRoOiAxMnB4OyAgYmFja2dyb3VuZDogI0RGNjU1ODsgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgcmlnaHQ6LTRweDsgdG9wOiA1MCU7IGhlaWdodDogMTJweDsgYm94LXNoYWRvdzogMCAwIDJweCByZ2JhKDAsMCwwLCAwLjQpOyBib3JkZXItcmFkaXVzOiAxMnB4OyAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7ICAtbW96LXRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO30uY29udHJvbGxlciAucHJvZ3Jlc3MgLmFuY2hvci5idWZmZXJlZF9hbmNob3IgeyAgcG9zaXRpb246IHJlbGF0aXZlOyBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwyNTUsMjU1LDAuMSk7fS5jb250cm9sbGVyIC5wcm9ncmVzcyAuYW5jaG9yLmJ1ZmZlcmVkX2FuY2hvcjphZnRlciB7ICBib3gtc2hhZG93OiBub25lOyBoZWlnaHQ6IDRweDsgIHdpZHRoOiA0cHg7IGJvcmRlci1yYWRpdXM6IDA7IGJhY2tncm91bmQ6IHJnYmEoMjU1LDI1NSwyNTUsMC4xKTt9LmNvbnRyb2xsZXIgLnJpZ2h0IHsgaGVpZ2h0OiA1MHB4OyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDowOyAgbGVmdDoxMHB4OyAgcmlnaHQ6MTBweDsgcG9pbnRlci1ldmVudHM6IG5vbmU7fS5jb250cm9sbGVyIC5wbGF5LC5jb250cm9sbGVyIC52b2x1bWUsLmNvbnRyb2xsZXIgLnRpbWUsLmNvbnRyb2xsZXIgLmhkLC5jb250cm9sbGVyIC5haXJwbGF5LC5jb250cm9sbGVyIC5hbGxzY3JlZW4sLmNvbnRyb2xsZXIgLm5vcm1hbHNjcmVlbiwuY29udHJvbGxlciAuY29tbWVudHMtYnRuLC5jb250cm9sbGVyIC5mdWxsc2NyZWVuIHsgcGFkZGluZy10b3A6NHB4OyAgaGVpZ2h0OiA0NnB4OyBsaW5lLWhlaWdodDogNTBweDsgIHRleHQtYWxpZ246IGNlbnRlcjsgY29sb3I6ICNlZWVlZWU7IGZsb2F0OmxlZnQ7IHRleHQtc2hhZG93OjAgMCAycHggcmdiYSgwLDAsMCwwLjUpOyAgcG9pbnRlci1ldmVudHM6IGF1dG87fS5jb250cm9sbGVyIC5oZCwuY29udHJvbGxlciAuYWlycGxheSwuY29udHJvbGxlciAuYWxsc2NyZWVuLC5jb250cm9sbGVyIC5ub3JtYWxzY3JlZW4sLmNvbnRyb2xsZXIgLmNvbW1lbnRzLWJ0biwuY29udHJvbGxlciAuZnVsbHNjcmVlbiB7IGZsb2F0OnJpZ2h0O30uY29udHJvbGxlciAucGxheSB7ICB3aWR0aDogMzZweDsgIHBhZGRpbmctbGVmdDogMTBweDsgY3Vyc29yOiBwb2ludGVyO30uY29udHJvbGxlciAucGxheTphZnRlciB7ICBmb250LWZhbWlseTogXCJGb250QXdlc29tZVwiOyBjb250ZW50OiBcIlxcXFxmMDRjXCI7fS5jb250cm9sbGVyIC5wbGF5LnBhdXNlZDphZnRlciB7IGNvbnRlbnQ6IFwiXFxcXGYwNGJcIjt9LmNvbnRyb2xsZXIgLnZvbHVtZSB7ICBtaW4td2lkdGg6IDMwcHg7ICBwb3NpdGlvbjogcmVsYXRpdmU7IG92ZXJmbG93OiBoaWRkZW47IC13ZWJraXQtdHJhbnNpdGlvbjogbWluLXdpZHRoIDAuM3MgZWFzZSAwLjVzOyAtbW96LXRyYW5zaXRpb246IG1pbi13aWR0aCAwLjNzIGVhc2UgMC41czsgIHRyYW5zaXRpb246IG1pbi13aWR0aCAwLjNzIGVhc2UgMC41czt9LmNvbnRyb2xsZXIgLnZvbHVtZTpob3ZlciB7IG1pbi13aWR0aDogMTI4cHg7fS5jb250cm9sbGVyIC52b2x1bWU6YmVmb3JlIHsgIGZvbnQtZmFtaWx5OiBcIkZvbnRBd2Vzb21lXCI7IGNvbnRlbnQ6IFwiXFxcXGYwMjhcIjsgIHdpZHRoOiAzNnB4OyAgZGlzcGxheTogYmxvY2s7fS5jb250cm9sbGVyIC52b2x1bWUgLnByb2dyZXNzIHsgd2lkdGg6IDcwcHg7ICB0b3A6IDI3cHg7ICBsZWZ0OiA0MHB4O30uY29udHJvbGxlciAudGltZSB7IGZvbnQtc2l6ZTogMTJweDsgIGZvbnQtd2VpZ2h0OiBib2xkOyAgcGFkZGluZy1sZWZ0OiAxMHB4O30uY29udHJvbGxlciAudGltZSAuY3VycmVudCB7ICBjb2xvcjogI0RGNjU1ODt9LmNvbnRyb2xsZXIgLmZ1bGxzY3JlZW4sLmNvbnRyb2xsZXIgLmFpcnBsYXksLmNvbnRyb2xsZXIgLmFsbHNjcmVlbiwuY29udHJvbGxlciAuY29tbWVudHMtYnRuLC5jb250cm9sbGVyIC5ub3JtYWxzY3JlZW4geyB3aWR0aDogMzZweDsgIGN1cnNvcjogcG9pbnRlcjt9LmNvbnRyb2xsZXIgLmNvbW1lbnRzLWJ0biB7ICBtYXJnaW4tcmlnaHQ6IC0xNXB4OyAgZGlzcGxheTogbm9uZTt9LnBsYXllci5oYXMtY29tbWVudHMgLmNvbnRyb2xsZXIgLmNvbW1lbnRzLWJ0biB7IGRpc3BsYXk6IGJsb2NrO30uY29udHJvbGxlciAuY29tbWVudHMtYnRuOmJlZm9yZSB7ICBmb250LWZhbWlseTogXCJGb250QXdlc29tZVwiOyBjb250ZW50OiBcIlxcXFxmMDc1XCI7fS5jb250cm9sbGVyIC5jb21tZW50cy1idG4uZW5hYmxlOmJlZm9yZSB7ICBjb2xvcjogI0RGNjU1ODt9LmNvbnRyb2xsZXIgLmFpcnBsYXksLmNvbnRyb2xsZXIgLm5vcm1hbHNjcmVlbiB7ICBkaXNwbGF5OiBub25lO30ucGxheWVyOi13ZWJraXQtZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgLmZ1bGxzY3JlZW4sLnBsYXllcjotd2Via2l0LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIC5hbGxzY3JlZW4geyBkaXNwbGF5OiBub25lO30ucGxheWVyOi13ZWJraXQtZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgLm5vcm1hbHNjcmVlbiwucGxheWVyLmFsbHNjcmVlbiAuY29udHJvbGxlciAubm9ybWFsc2NyZWVuLC5wbGF5ZXIuc3VwcG9ydC1haXJwbGF5IC5jb250cm9sbGVyIC5haXJwbGF5IHsgZGlzcGxheTogYmxvY2s7fS5wbGF5ZXIuYWxsc2NyZWVuIC5jb250cm9sbGVyIC5hbGxzY3JlZW4geyAgZGlzcGxheTogbm9uZTt9LmNvbnRyb2xsZXIgLmZ1bGxzY3JlZW46YmVmb3JlIHsgZm9udC1mYW1pbHk6IFwiRm9udEF3ZXNvbWVcIjsgY29udGVudDogXCJcXFxcZjBiMlwiO30uY29udHJvbGxlciAuYWxsc2NyZWVuOmJlZm9yZSB7ICBmb250LWZhbWlseTogXCJGb250QXdlc29tZVwiOyBjb250ZW50OiBcIlxcXFxmMDY1XCI7fS5jb250cm9sbGVyIC5ub3JtYWxzY3JlZW46YmVmb3JlIHsgZm9udC1mYW1pbHk6IFwiRm9udEF3ZXNvbWVcIjsgY29udGVudDogXCJcXFxcZjA2NlwiO30uY29udHJvbGxlciAuYWlycGxheSB7IGJhY2tncm91bmQ6IHVybChkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBEOTRiV3dnZG1WeWMybHZiajBpTVM0d0lpQmxibU52WkdsdVp6MGlkWFJtTFRnaVB6NDhJVVJQUTFSWlVFVWdjM1puSUZCVlFreEpReUFpTFM4dlZ6TkRMeTlFVkVRZ1UxWkhJREV1TVM4dlJVNGlJQ0pvZEhSd09pOHZkM2QzTG5jekxtOXlaeTlIY21Gd2FHbGpjeTlUVmtjdk1TNHhMMFJVUkM5emRtY3hNUzVrZEdRaVBqeHpkbWNnZG1WeWMybHZiajBpTVM0eElpQnBaRDBpYldGdFlTMWhhWEp3YkdGNUxXbGpiMjRpSUhodGJHNXpQU0pvZEhSd09pOHZkM2QzTG5jekxtOXlaeTh5TURBd0wzTjJaeUlnZUcxc2JuTTZlR3hwYm1zOUltaDBkSEE2THk5M2QzY3Vkek11YjNKbkx6RTVPVGt2ZUd4cGJtc2lJSGc5SWpCd2VDSWdlVDBpTUhCNElpQjNhV1IwYUQwaU1qSndlQ0lnYUdWcFoyaDBQU0l4Tm5CNElpQjJhV1YzUW05NFBTSXdJREFnTWpJZ01UWWlJSGh0YkRwemNHRmpaVDBpY0hKbGMyVnlkbVVpUGp4d2IyeDViR2x1WlNCd2IybHVkSE05SWpVc01USWdNU3d4TWlBeExERWdNakVzTVNBeU1Td3hNaUF4Tnl3eE1pSWdjM1I1YkdVOUltWnBiR3c2ZEhKaGJuTndZWEpsYm5RN2MzUnliMnRsT25kb2FYUmxPM04wY205clpTMTNhV1IwYURveElpOCtQSEJ2Ykhsc2FXNWxJSEJ2YVc1MGN6MGlOQ3d4TmlBeE1Td3hNQ0F4T0N3eE5pSWdjM1I1YkdVOUltWnBiR3c2ZDJocGRHVTdjM1J5YjJ0bE9uUnlZVzV6Y0dGeVpXNTBPM04wY205clpTMTNhV1IwYURvd0lpOCtQQzl6ZG1jK0RRbz0pIG5vLXJlcGVhdCBjZW50ZXIgMjBweDsgIGJhY2tncm91bmQtc2l6ZTogMjJweCBhdXRvO30uY29udHJvbGxlciAuaGQgeyB3aGl0ZS1zcGFjZTpub3dyYXA7IG92ZXJmbG93OiBoaWRkZW47IG1hcmdpbi1yaWdodDogMTBweDsgdGV4dC1hbGlnbjogcmlnaHQ7fS5jb250cm9sbGVyIC5oZDpob3ZlciBsaSB7IG1heC13aWR0aDogMzAwcHg7fS5jb250cm9sbGVyIC5oZCBsaSB7ICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7ICBtYXgtd2lkdGg6IDBweDsgLXdlYmtpdC10cmFuc2l0aW9uOiBtYXgtd2lkdGggMC44cyBlYXNlIDAuM3M7IC1tb3otdHJhbnNpdGlvbjogbWF4LXdpZHRoIDAuOHMgZWFzZSAwLjNzOyAgdHJhbnNpdGlvbjogbWF4LXdpZHRoIDAuOHMgZWFzZSAwLjNzOyBvdmVyZmxvdzogaGlkZGVuOyBmb250LXNpemU6IDE0cHg7ICBmb250LXdlaWdodDogYm9sZDsgIHBvc2l0aW9uOiByZWxhdGl2ZTsgY3Vyc29yOiBwb2ludGVyO30uY29udHJvbGxlciAuaGQgbGk6YmVmb3JlIHsgIGNvbnRlbnQ6IFwiXCI7ICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7ICB3aWR0aDoyMHB4O30uY29udHJvbGxlciAuaGQgbGk6YmVmb3JlIHsgY29udGVudDogXCJcIjsgIGRpc3BsYXk6IGlubGluZS1ibG9jazsgIHdpZHRoOjIwcHg7fS5jb250cm9sbGVyIC5oZCBsaS5jdXJyIHsgbWF4LXdpZHRoOiAzMDBweDsgY3Vyc29yOiBkZWZhdWx0OyAgY29sb3I6ICNERjY1NTg7fS5jb250cm9sbGVyIC5oZCBsaS5jdXJyOmFmdGVyIHsgY29udGVudDogXCJcIjsgIGRpc3BsYXk6IGJsb2NrOyBwb3NpdGlvbjogYWJzb2x1dGU7IHdpZHRoOjRweDsgIGhlaWdodDo0cHg7IGJvcmRlci1yYWRpdXM6IDUwJTsgYmFja2dyb3VuZDogI2ZmZmZmZjsgIGxlZnQ6IDEycHg7IHRvcDogMjNweDsgIG9wYWNpdHk6IDA7IC13ZWJraXQtdHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzIGVhc2UgMC4zczsgLW1vei10cmFuc2l0aW9uOiBvcGFjaXR5IDAuNXMgZWFzZSAwLjNzOyAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzIGVhc2UgMC4zczt9J30se31dLDEzOltmdW5jdGlvbihlLHQpe3QuZXhwb3J0cz0nPGRpdiBjbGFzcz1cInBsYXllclwiPiAgPGRpdiBjbGFzcz1cInZpZGVvLWZyYW1lXCI+PHZpZGVvIGNsYXNzPVwidmlkZW9cIiBhdXRvcGxheT1cImF1dG9wbGF5XCI+PC92aWRlbz48Y2FudmFzIGNsYXNzPVwiY29tbWVudHNcIj48L2NhbnZhcz48L2Rpdj4gIDxkaXYgY2xhc3M9XCJjb250cm9sbGVyXCI+ICAgIDxkaXYgY2xhc3M9XCJsb2FkaW5nLWljb24gZmEgZmEtc3BpbiBmYS1jaXJjbGUtby1ub3RjaFwiPjwvZGl2PiAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzc1wiPiAgICAgIDxkaXYgY2xhc3M9XCJhbmNob3IgYnVmZmVyZWRfYW5jaG9yXCIgc3R5bGU9XCJ3aWR0aDowJVwiPjwvZGl2PiAgICAgPGRpdiBjbGFzcz1cImFuY2hvciBwcm9ncmVzc19hbmNob3JcIiBzdHlsZT1cIndpZHRoOjAlXCI+PC9kaXY+ICAgPC9kaXY+ICAgIDxkaXYgY2xhc3M9XCJyaWdodFwiPiAgICAgPGRpdiBjbGFzcz1cImZ1bGxzY3JlZW5cIj48L2Rpdj4gICAgICA8ZGl2IGNsYXNzPVwiYWxsc2NyZWVuXCI+PC9kaXY+ICAgICA8ZGl2IGNsYXNzPVwibm9ybWFsc2NyZWVuXCI+PC9kaXY+ICAgICAgPGRpdiBjbGFzcz1cImFpcnBsYXlcIj48L2Rpdj4gICAgIDx1bCBjbGFzcz1cImhkXCI+PC91bD4gICAgICA8ZGl2IGNsYXNzPVwiY29tbWVudHMtYnRuXCI+PC9kaXY+ICAgICA8L2Rpdj4gICAgPGRpdiBjbGFzcz1cImxlZnRcIj4gICAgIDxkaXYgY2xhc3M9XCJwbGF5IHBhdXNlZFwiPjwvZGl2PiAgICAgPGRpdiBjbGFzcz1cInZvbHVtZVwiPiAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzXCI+ICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbmNob3Igdm9sdW1lX2FuY2hvclwiIHN0eWxlPVwid2lkdGg6MCVcIj48L2Rpdj4gICAgICAgPC9kaXY+ICAgICAgPC9kaXY+ICAgICAgPGRpdiBjbGFzcz1cInRpbWVcIj4gICAgICAgIDxzcGFuIGNsYXNzPVwiY3VycmVudFwiPjAwOjAwOjAwPC9zcGFuPiAvIDxzcGFuIGNsYXNzPVwiZHVyYXRpb25cIj4wMDowMDowMDwvc3Bhbj4gICAgICA8L2Rpdj4gICAgIDwvZGl2PiA8L2Rpdj48L2Rpdj4nfSx7fV0sMTQ6W2Z1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gaShlLHQpe3JldHVybihBcnJheSh0KS5qb2luKDApK2UpLnNsaWNlKC10KX1mdW5jdGlvbiBuKGUpe3ZhciB0LG49W107cmV0dXJuWzM2MDAsNjAsMV0uZm9yRWFjaChmdW5jdGlvbihvKXtuLnB1c2goaSh0PWUvb3wwLDIpKSxlLT10Km99KSxuLmpvaW4oXCI6XCIpfXQuZXhwb3J0cz1ufSx7fV19LHt9LFsxMF0pO1xuXG4vL2V4cG9ydHNcbm1vZHVsZS5leHBvcnRzID0gTUFNQVBsYXllcjsiLCIvKlxuICogUHVybCAoQSBKYXZhU2NyaXB0IFVSTCBwYXJzZXIpIHYyLjMuMVxuICogRGV2ZWxvcGVkIGFuZCBtYWludGFuaW5lZCBieSBNYXJrIFBlcmtpbnMsIG1hcmtAYWxsbWFya2VkdXAuY29tXG4gKiBTb3VyY2UgcmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2FsbG1hcmtlZHVwL2pRdWVyeS1VUkwtUGFyc2VyXG4gKiBMaWNlbnNlZCB1bmRlciBhbiBNSVQtc3R5bGUgbGljZW5zZS4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbGxtYXJrZWR1cC9qUXVlcnktVVJMLVBhcnNlci9ibG9iL21hc3Rlci9MSUNFTlNFIGZvciBkZXRhaWxzLlxuICovXG5cbnZhciB0YWcyYXR0ciA9IHtcbiAgICAgICAgYSAgICAgICA6ICdocmVmJyxcbiAgICAgICAgaW1nICAgICA6ICdzcmMnLFxuICAgICAgICBmb3JtICAgIDogJ2FjdGlvbicsXG4gICAgICAgIGJhc2UgICAgOiAnaHJlZicsXG4gICAgICAgIHNjcmlwdCAgOiAnc3JjJyxcbiAgICAgICAgaWZyYW1lICA6ICdzcmMnLFxuICAgICAgICBsaW5rICAgIDogJ2hyZWYnLFxuICAgICAgICBlbWJlZCAgIDogJ3NyYycsXG4gICAgICAgIG9iamVjdCAgOiAnZGF0YSdcbiAgICB9LFxuXG4gICAga2V5ID0gWydzb3VyY2UnLCAncHJvdG9jb2wnLCAnYXV0aG9yaXR5JywgJ3VzZXJJbmZvJywgJ3VzZXInLCAncGFzc3dvcmQnLCAnaG9zdCcsICdwb3J0JywgJ3JlbGF0aXZlJywgJ3BhdGgnLCAnZGlyZWN0b3J5JywgJ2ZpbGUnLCAncXVlcnknLCAnZnJhZ21lbnQnXSwgLy8ga2V5cyBhdmFpbGFibGUgdG8gcXVlcnlcblxuICAgIGFsaWFzZXMgPSB7ICdhbmNob3InIDogJ2ZyYWdtZW50JyB9LCAvLyBhbGlhc2VzIGZvciBiYWNrd2FyZHMgY29tcGF0YWJpbGl0eVxuXG4gICAgcGFyc2VyID0ge1xuICAgICAgICBzdHJpY3QgOiAvXig/OihbXjpcXC8/I10rKTopPyg/OlxcL1xcLygoPzooKFteOkBdKik6PyhbXjpAXSopKT9AKT8oW146XFwvPyNdKikoPzo6KFxcZCopKT8pKT8oKCgoPzpbXj8jXFwvXSpcXC8pKikoW14/I10qKSkoPzpcXD8oW14jXSopKT8oPzojKC4qKSk/KS8sICAvL2xlc3MgaW50dWl0aXZlLCBtb3JlIGFjY3VyYXRlIHRvIHRoZSBzcGVjc1xuICAgICAgICBsb29zZSA6ICAvXig/Oig/IVteOkBdKzpbXjpAXFwvXSpAKShbXjpcXC8/Iy5dKyk6KT8oPzpcXC9cXC8pPygoPzooKFteOkBdKik6PyhbXjpAXSopKT9AKT8oW146XFwvPyNdKikoPzo6KFxcZCopKT8pKCgoXFwvKD86W14/I10oPyFbXj8jXFwvXSpcXC5bXj8jXFwvLl0rKD86Wz8jXXwkKSkpKlxcLz8pPyhbXj8jXFwvXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLyAvLyBtb3JlIGludHVpdGl2ZSwgZmFpbHMgb24gcmVsYXRpdmUgcGF0aHMgYW5kIGRldmlhdGVzIGZyb20gc3BlY3NcbiAgICB9LFxuXG4gICAgaXNpbnQgPSAvXlswLTldKyQvO1xuXG5mdW5jdGlvbiBwYXJzZVVyaSggdXJsLCBzdHJpY3RNb2RlICkge1xuICAgIHZhciBzdHIgPSBkZWNvZGVVUkkoIHVybCApLFxuICAgIHJlcyAgID0gcGFyc2VyWyBzdHJpY3RNb2RlIHx8IGZhbHNlID8gJ3N0cmljdCcgOiAnbG9vc2UnIF0uZXhlYyggc3RyICksXG4gICAgdXJpID0geyBhdHRyIDoge30sIHBhcmFtIDoge30sIHNlZyA6IHt9IH0sXG4gICAgaSAgID0gMTQ7XG5cbiAgICB3aGlsZSAoIGktLSApIHtcbiAgICAgICAgdXJpLmF0dHJbIGtleVtpXSBdID0gcmVzW2ldIHx8ICcnO1xuICAgIH1cblxuICAgIC8vIGJ1aWxkIHF1ZXJ5IGFuZCBmcmFnbWVudCBwYXJhbWV0ZXJzXG4gICAgdXJpLnBhcmFtWydxdWVyeSddID0gcGFyc2VTdHJpbmcodXJpLmF0dHJbJ3F1ZXJ5J10pO1xuICAgIHVyaS5wYXJhbVsnZnJhZ21lbnQnXSA9IHBhcnNlU3RyaW5nKHVyaS5hdHRyWydmcmFnbWVudCddKTtcblxuICAgIC8vIHNwbGl0IHBhdGggYW5kIGZyYWdlbWVudCBpbnRvIHNlZ21lbnRzXG4gICAgdXJpLnNlZ1sncGF0aCddID0gdXJpLmF0dHIucGF0aC5yZXBsYWNlKC9eXFwvK3xcXC8rJC9nLCcnKS5zcGxpdCgnLycpO1xuICAgIHVyaS5zZWdbJ2ZyYWdtZW50J10gPSB1cmkuYXR0ci5mcmFnbWVudC5yZXBsYWNlKC9eXFwvK3xcXC8rJC9nLCcnKS5zcGxpdCgnLycpO1xuXG4gICAgLy8gY29tcGlsZSBhICdiYXNlJyBkb21haW4gYXR0cmlidXRlXG4gICAgdXJpLmF0dHJbJ2Jhc2UnXSA9IHVyaS5hdHRyLmhvc3QgPyAodXJpLmF0dHIucHJvdG9jb2wgPyAgdXJpLmF0dHIucHJvdG9jb2wrJzovLycrdXJpLmF0dHIuaG9zdCA6IHVyaS5hdHRyLmhvc3QpICsgKHVyaS5hdHRyLnBvcnQgPyAnOicrdXJpLmF0dHIucG9ydCA6ICcnKSA6ICcnO1xuXG4gICAgcmV0dXJuIHVyaTtcbn1cblxuZnVuY3Rpb24gZ2V0QXR0ck5hbWUoIGVsbSApIHtcbiAgICB2YXIgdG4gPSBlbG0udGFnTmFtZTtcbiAgICBpZiAoIHR5cGVvZiB0biAhPT0gJ3VuZGVmaW5lZCcgKSByZXR1cm4gdGFnMmF0dHJbdG4udG9Mb3dlckNhc2UoKV07XG4gICAgcmV0dXJuIHRuO1xufVxuXG5mdW5jdGlvbiBwcm9tb3RlKHBhcmVudCwga2V5KSB7XG4gICAgaWYgKHBhcmVudFtrZXldLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHBhcmVudFtrZXldID0ge307XG4gICAgdmFyIHQgPSB7fTtcbiAgICBmb3IgKHZhciBpIGluIHBhcmVudFtrZXldKSB0W2ldID0gcGFyZW50W2tleV1baV07XG4gICAgcGFyZW50W2tleV0gPSB0O1xuICAgIHJldHVybiB0O1xufVxuXG5mdW5jdGlvbiBwYXJzZShwYXJ0cywgcGFyZW50LCBrZXksIHZhbCkge1xuICAgIHZhciBwYXJ0ID0gcGFydHMuc2hpZnQoKTtcbiAgICBpZiAoIXBhcnQpIHtcbiAgICAgICAgaWYgKGlzQXJyYXkocGFyZW50W2tleV0pKSB7XG4gICAgICAgICAgICBwYXJlbnRba2V5XS5wdXNoKHZhbCk7XG4gICAgICAgIH0gZWxzZSBpZiAoJ29iamVjdCcgPT0gdHlwZW9mIHBhcmVudFtrZXldKSB7XG4gICAgICAgICAgICBwYXJlbnRba2V5XSA9IHZhbDtcbiAgICAgICAgfSBlbHNlIGlmICgndW5kZWZpbmVkJyA9PSB0eXBlb2YgcGFyZW50W2tleV0pIHtcbiAgICAgICAgICAgIHBhcmVudFtrZXldID0gdmFsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50W2tleV0gPSBbcGFyZW50W2tleV0sIHZhbF07XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgb2JqID0gcGFyZW50W2tleV0gPSBwYXJlbnRba2V5XSB8fCBbXTtcbiAgICAgICAgaWYgKCddJyA9PSBwYXJ0KSB7XG4gICAgICAgICAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAgICAgICAgICAgaWYgKCcnICE9PSB2YWwpIG9iai5wdXNoKHZhbCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCdvYmplY3QnID09IHR5cGVvZiBvYmopIHtcbiAgICAgICAgICAgICAgICBvYmpba2V5cyhvYmopLmxlbmd0aF0gPSB2YWw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9iaiA9IHBhcmVudFtrZXldID0gW3BhcmVudFtrZXldLCB2YWxdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKH5wYXJ0LmluZGV4T2YoJ10nKSkge1xuICAgICAgICAgICAgcGFydCA9IHBhcnQuc3Vic3RyKDAsIHBhcnQubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICBpZiAoIWlzaW50LnRlc3QocGFydCkgJiYgaXNBcnJheShvYmopKSBvYmogPSBwcm9tb3RlKHBhcmVudCwga2V5KTtcbiAgICAgICAgICAgIHBhcnNlKHBhcnRzLCBvYmosIHBhcnQsIHZhbCk7XG4gICAgICAgICAgICAvLyBrZXlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghaXNpbnQudGVzdChwYXJ0KSAmJiBpc0FycmF5KG9iaikpIG9iaiA9IHByb21vdGUocGFyZW50LCBrZXkpO1xuICAgICAgICAgICAgcGFyc2UocGFydHMsIG9iaiwgcGFydCwgdmFsKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbWVyZ2UocGFyZW50LCBrZXksIHZhbCkge1xuICAgIGlmICh+a2V5LmluZGV4T2YoJ10nKSkge1xuICAgICAgICB2YXIgcGFydHMgPSBrZXkuc3BsaXQoJ1snKTtcbiAgICAgICAgcGFyc2UocGFydHMsIHBhcmVudCwgJ2Jhc2UnLCB2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghaXNpbnQudGVzdChrZXkpICYmIGlzQXJyYXkocGFyZW50LmJhc2UpKSB7XG4gICAgICAgICAgICB2YXIgdCA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgayBpbiBwYXJlbnQuYmFzZSkgdFtrXSA9IHBhcmVudC5iYXNlW2tdO1xuICAgICAgICAgICAgcGFyZW50LmJhc2UgPSB0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChrZXkgIT09ICcnKSB7XG4gICAgICAgICAgICBzZXQocGFyZW50LmJhc2UsIGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGFyZW50O1xufVxuXG5mdW5jdGlvbiBwYXJzZVN0cmluZyhzdHIpIHtcbiAgICByZXR1cm4gcmVkdWNlKFN0cmluZyhzdHIpLnNwbGl0KC8mfDsvKSwgZnVuY3Rpb24ocmV0LCBwYWlyKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwYWlyID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXIucmVwbGFjZSgvXFwrL2csICcgJykpO1xuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIC8vIGlnbm9yZVxuICAgICAgICB9XG4gICAgICAgIHZhciBlcWwgPSBwYWlyLmluZGV4T2YoJz0nKSxcbiAgICAgICAgICAgIGJyYWNlID0gbGFzdEJyYWNlSW5LZXkocGFpciksXG4gICAgICAgICAgICBrZXkgPSBwYWlyLnN1YnN0cigwLCBicmFjZSB8fCBlcWwpLFxuICAgICAgICAgICAgdmFsID0gcGFpci5zdWJzdHIoYnJhY2UgfHwgZXFsLCBwYWlyLmxlbmd0aCk7XG5cbiAgICAgICAgdmFsID0gdmFsLnN1YnN0cih2YWwuaW5kZXhPZignPScpICsgMSwgdmFsLmxlbmd0aCk7XG5cbiAgICAgICAgaWYgKGtleSA9PT0gJycpIHtcbiAgICAgICAgICAgIGtleSA9IHBhaXI7XG4gICAgICAgICAgICB2YWwgPSAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtZXJnZShyZXQsIGtleSwgdmFsKTtcbiAgICB9LCB7IGJhc2U6IHt9IH0pLmJhc2U7XG59XG5cbmZ1bmN0aW9uIHNldChvYmosIGtleSwgdmFsKSB7XG4gICAgdmFyIHYgPSBvYmpba2V5XTtcbiAgICBpZiAodHlwZW9mIHYgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG9ialtrZXldID0gdmFsO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2KSkge1xuICAgICAgICB2LnB1c2godmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvYmpba2V5XSA9IFt2LCB2YWxdO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbGFzdEJyYWNlSW5LZXkoc3RyKSB7XG4gICAgdmFyIGxlbiA9IHN0ci5sZW5ndGgsXG4gICAgICAgIGJyYWNlLFxuICAgICAgICBjO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgYyA9IHN0cltpXTtcbiAgICAgICAgaWYgKCddJyA9PSBjKSBicmFjZSA9IGZhbHNlO1xuICAgICAgICBpZiAoJ1snID09IGMpIGJyYWNlID0gdHJ1ZTtcbiAgICAgICAgaWYgKCc9JyA9PSBjICYmICFicmFjZSkgcmV0dXJuIGk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiByZWR1Y2Uob2JqLCBhY2N1bXVsYXRvcil7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsID0gb2JqLmxlbmd0aCA+PiAwLFxuICAgICAgICBjdXJyID0gYXJndW1lbnRzWzJdO1xuICAgIHdoaWxlIChpIDwgbCkge1xuICAgICAgICBpZiAoaSBpbiBvYmopIGN1cnIgPSBhY2N1bXVsYXRvci5jYWxsKHVuZGVmaW5lZCwgY3Vyciwgb2JqW2ldLCBpLCBvYmopO1xuICAgICAgICArK2k7XG4gICAgfVxuICAgIHJldHVybiBjdXJyO1xufVxuXG5mdW5jdGlvbiBpc0FycmF5KHZBcmcpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZBcmcpID09PSBcIltvYmplY3QgQXJyYXldXCI7XG59XG5cbmZ1bmN0aW9uIGtleXMob2JqKSB7XG4gICAgdmFyIGtleV9hcnJheSA9IFtdO1xuICAgIGZvciAoIHZhciBwcm9wIGluIG9iaiApIHtcbiAgICAgICAgaWYgKCBvYmouaGFzT3duUHJvcGVydHkocHJvcCkgKSBrZXlfYXJyYXkucHVzaChwcm9wKTtcbiAgICB9XG4gICAgcmV0dXJuIGtleV9hcnJheTtcbn1cblxuZnVuY3Rpb24gcHVybCggdXJsLCBzdHJpY3RNb2RlICkge1xuICAgIGlmICggYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiB1cmwgPT09IHRydWUgKSB7XG4gICAgICAgIHN0cmljdE1vZGUgPSB0cnVlO1xuICAgICAgICB1cmwgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHN0cmljdE1vZGUgPSBzdHJpY3RNb2RlIHx8IGZhbHNlO1xuICAgIHVybCA9IHVybCB8fCB3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKTtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgZGF0YSA6IHBhcnNlVXJpKHVybCwgc3RyaWN0TW9kZSksXG5cbiAgICAgICAgLy8gZ2V0IHZhcmlvdXMgYXR0cmlidXRlcyBmcm9tIHRoZSBVUklcbiAgICAgICAgYXR0ciA6IGZ1bmN0aW9uKCBhdHRyICkge1xuICAgICAgICAgICAgYXR0ciA9IGFsaWFzZXNbYXR0cl0gfHwgYXR0cjtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYXR0ciAhPT0gJ3VuZGVmaW5lZCcgPyB0aGlzLmRhdGEuYXR0clthdHRyXSA6IHRoaXMuZGF0YS5hdHRyO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHJldHVybiBxdWVyeSBzdHJpbmcgcGFyYW1ldGVyc1xuICAgICAgICBwYXJhbSA6IGZ1bmN0aW9uKCBwYXJhbSApIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgcGFyYW0gIT09ICd1bmRlZmluZWQnID8gdGhpcy5kYXRhLnBhcmFtLnF1ZXJ5W3BhcmFtXSA6IHRoaXMuZGF0YS5wYXJhbS5xdWVyeTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyByZXR1cm4gZnJhZ21lbnQgcGFyYW1ldGVyc1xuICAgICAgICBmcGFyYW0gOiBmdW5jdGlvbiggcGFyYW0gKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHBhcmFtICE9PSAndW5kZWZpbmVkJyA/IHRoaXMuZGF0YS5wYXJhbS5mcmFnbWVudFtwYXJhbV0gOiB0aGlzLmRhdGEucGFyYW0uZnJhZ21lbnQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gcmV0dXJuIHBhdGggc2VnbWVudHNcbiAgICAgICAgc2VnbWVudCA6IGZ1bmN0aW9uKCBzZWcgKSB7XG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBzZWcgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEuc2VnLnBhdGg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlZyA9IHNlZyA8IDAgPyB0aGlzLmRhdGEuc2VnLnBhdGgubGVuZ3RoICsgc2VnIDogc2VnIC0gMTsgLy8gbmVnYXRpdmUgc2VnbWVudHMgY291bnQgZnJvbSB0aGUgZW5kXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5zZWcucGF0aFtzZWddO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHJldHVybiBmcmFnbWVudCBzZWdtZW50c1xuICAgICAgICBmc2VnbWVudCA6IGZ1bmN0aW9uKCBzZWcgKSB7XG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBzZWcgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEuc2VnLmZyYWdtZW50O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWcgPSBzZWcgPCAwID8gdGhpcy5kYXRhLnNlZy5mcmFnbWVudC5sZW5ndGggKyBzZWcgOiBzZWcgLSAxOyAvLyBuZWdhdGl2ZSBzZWdtZW50cyBjb3VudCBmcm9tIHRoZSBlbmRcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnNlZy5mcmFnbWVudFtzZWddO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHVybDtcbiIsIi8qICDvvINmdW5jdGlvbiBxdWVyeVN0cmluZyNcbiAqICA8IE9iamVjdCAgIOS+i+WmgiB7YToxLGI6MixjOjN9XG4gKiAgPiBTdHJpbmcgICDkvovlpoIgYT0xJmI9MiZjPTNcbiAqICDnlKjkuo7mi7zoo4V1cmzlnLDlnYDnmoRxdWVyeVxuICovXG5mdW5jdGlvbiBxdWVyeVN0cmluZyAob2JqKSB7XG4gIHZhciBxdWVyeSA9IFtdXG4gIGZvciAob25lIGluIG9iaikge1xuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkob25lKSkge1xuICAgICAgcXVlcnkucHVzaChbb25lLCBvYmpbb25lXV0uam9pbignPScpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gcXVlcnkuam9pbignJicpXG59XG5tb2R1bGUuZXhwb3J0cyA9IHF1ZXJ5U3RyaW5nIiwiLyogIDkxcG9ybiBcbiAqICBAU25vb3plIDIwMTUtNy0yNlxuICovXG52YXIgY2FuUGxheU0zVTggPSByZXF1aXJlKCcuL2NhblBsYXlNM1U4JylcbnZhciBhamF4ICAgICAgICA9IHJlcXVpcmUoJy4vYWpheCcpXG52YXIgbG9nICAgICAgICAgPSByZXF1aXJlKCcuL2xvZycpXG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAodXJsKSB7XG4gIGlmICh3aW5kb3cuc28gJiYgd2luZG93LnNvLnZhcmlhYmxlcykge1xuICAgIHZhciBmaWxlSWQgPSB3aW5kb3cuc28udmFyaWFibGVzLmZpbGVcbiAgICB2YXIgc2VjQ29kZSA9IHdpbmRvdy5zby52YXJpYWJsZXMuc2VjY29kZVxuICAgIHZhciBtYXhfdmlkID0gd2luZG93LnNvLnZhcmlhYmxlcy5tYXhfdmlkXG4gICAgcmV0dXJuICEhZmlsZUlkICYgISFzZWNDb2RlICYgISFtYXhfdmlkICYgXG4gICAgICAvdmlld192aWRlb1xcLnBocFxcP3ZpZXdrZXkvLnRlc3QoIHVybC5hdHRyKCdzb3VyY2UnKSApXG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7ICBcbiAgLy92YXIgbWVkaWFTcGFjZUhUTUwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lZGlhc3BhY2VcIikuaW5uZXJIVE1MXG4gIC8vdmFyIGZpbGVJZCA9IC9maWxlJywnKC4qPyknL2kuZXhlYyhtZWRpYVNwYWNlSFRNTClbMV1cbiAgLy92YXIgc2VjQ29kZSA9IC9zZWNjb2RlJywnKC4qPyknL2kuZXhlYyhtZWRpYVNwYWNlSFRNTClbMV1cbiAgLy92YXIgbWF4X3ZpZCA9IC9tYXhfYmlkJywnKC4qPyknL2kuZXhlYyhtZWRpYVNwYWNlSFRNTClbMV1cbiAgdmFyIGZpbGVJZCA9IHdpbmRvdy5zby52YXJpYWJsZXMuZmlsZVxuICB2YXIgc2VjQ29kZSA9IHdpbmRvdy5zby52YXJpYWJsZXMuc2VjY29kZVxuICB2YXIgbWF4X3ZpZCA9IHdpbmRvdy5zby52YXJpYWJsZXMubWF4X3ZpZFxuICBcblxuICB2YXIgbXA0ID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuICAgIGFqYXgoe1xuICAgICAgdXJsOiAnaHR0cDovL3d3dy45MXBvcm4uY29tL2dldGZpbGUucGhwJyxcbiAgICAgIGpzb25wOiBmYWxzZSxcbiAgICAgIHBhcmFtOiB7XG4gICAgICAgIFZJRDogZmlsZUlkLFxuICAgICAgICBtcDQ6ICcwJyxcbiAgICAgICAgc2VjY29kZTogc2VjQ29kZSxcbiAgICAgICAgbWF4X3ZpZDogbWF4X3ZpZFxuICAgICAgfSxcbiAgICAgIGNvbnRlbnRUeXBlOiAnbm90SlNPTicsXG4gICAgICBjYWxsYmFjazogZnVuY3Rpb24ocGFyYW0pe1xuICAgICAgICBpZihwYXJhbSA9PSAtMSB8fCBwYXJhbS5jb2RlID09IC0xKSByZXR1cm4gbG9nKCfop6PmnpA5MXBvcm7op4bpopHlnLDlnYDlpLHotKUnKVxuICAgICAgICBtcDRVcmwgPSBwYXJhbS5zcGxpdCgnPScpWzFdLnNwbGl0KCcmJylbMF1cbiAgICAgICAgdmFyIHVybHMgPSBbXVxuICAgICAgICB1cmxzLnB1c2goWyfkvY7muIXniYgnLCBtcDRVcmxdKVxuICAgICAgICBsb2coJ+ino+aekDkxcG9ybuinhumikeWcsOWdgOaIkOWKnyAnICsgdXJscy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtyZXR1cm4gJzxhIGhyZWY9JytpdGVtWzFdKyc+JytpdGVtWzBdKyc8L2E+J30pLmpvaW4oJyAnKSwgMilcbiAgICAgICAgLy8gY29uc29sZS5pbmZvKHVybHMpXG4gICAgICAgIHJldHVybiBjYWxsYmFjayh1cmxzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgbXA0KGNhbGxiYWNrKVxufVxuXG5cblxuIiwiLyogIGJpbGlibGkgXG4gKiAgQOacseS4gFxuICovXG52YXIgcHVybCAgICAgID0gcmVxdWlyZSgnLi9wdXJsJylcbnZhciBsb2cgICAgICAgPSByZXF1aXJlKCcuL2xvZycpXG52YXIgaHR0cFByb3h5ID0gcmVxdWlyZSgnLi9odHRwUHJveHknKVxudmFyIGdldENvb2tpZSA9IHJlcXVpcmUoJy4vZ2V0Q29va2llJylcblxuZnVuY3Rpb24gcGFkKG51bSwgbikgeyBcbiAgcmV0dXJuIChBcnJheShuKS5qb2luKDApICsgbnVtKS5zbGljZSgtbilcbn1cblxuZXhwb3J0cy5tYXRjaCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgcmV0dXJuIHVybC5hdHRyKCdob3N0JykuaW5kZXhPZignYmlsaWJpbGknKSA+PSAwICYmIC9eXFwvdmlkZW9cXC9hdlxcZCtcXC8kLy50ZXN0KHVybC5hdHRyKCdkaXJlY3RvcnknKSlcbn1cblxuZXhwb3J0cy5nZXRWaWRlb3MgPSBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaykge1xuICBsb2coJ+W8gOWni+ino+aekGJpbGlibGnop4bpopHlnLDlnYAnKVxuICB2YXIgYWlkID0gdXJsLmF0dHIoJ2RpcmVjdG9yeScpLm1hdGNoKC9eXFwvdmlkZW9cXC9hdihcXGQrKVxcLyQvKVsxXVxuICB2YXIgcGFnZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgcGFnZU1hdGNoID0gdXJsLmF0dHIoJ2ZpbGUnKS5tYXRjaCgvXmluZGV4XFxfKFxcZCspXFwuaHRtbCQvKVxuICAgIHJldHVybiBwYWdlTWF0Y2ggPyBwYWdlTWF0Y2hbMV0gOiAxXG4gIH0oKSlcbiAgXG4gIGh0dHBQcm94eShcbiAgICAnaHR0cDovL3d3dy5iaWxpYmlsaS5jb20vbS9odG1sNScsIFxuICAgICdnZXQnLCBcbiAgICB7YWlkOiBhaWQsIHBhZ2U6IHBhZ2UsIHNpZDogZ2V0Q29va2llKCdzaWQnKX0sXG4gIGZ1bmN0aW9uIChycykge1xuICAgIGlmIChycyAmJiBycy5zcmMpIHtcbiAgICAgIGxvZygn6I635Y+W5YiwPGEgaHJlZj1cIicrcnMuc3JjKydcIj7op4bpopHlnLDlnYA8L2E+LCDlubblvIDlp4vop6PmnpBiaWxpYmxp5by55bmVJylcbiAgICAgIHZhciBzb3VyY2UgPSBbIFsnYmlsaWJpbGknLCBycy5zcmNdIF1cbiAgICAgIGh0dHBQcm94eShycy5jaWQsICdnZXQnLCB7fSwgZnVuY3Rpb24gKHJzKSB7XG5cbiAgICAgICAgaWYgKHJzICYmIHJzLmkpIHtcbiAgICAgICAgICB2YXIgY29tbWVudHMgPSBbXS5jb25jYXQocnMuaS5kIHx8IFtdKVxuICAgICAgICAgIGNvbW1lbnRzID0gY29tbWVudHMubWFwKGZ1bmN0aW9uIChjb21tZW50KSB7XG4gICAgICAgICAgICB2YXIgcCA9IGNvbW1lbnRbJ0BwJ10uc3BsaXQoJywnKVxuICAgICAgICAgICAgc3dpdGNoIChwWzFdIHwgMCkge1xuICAgICAgICAgICAgICBjYXNlIDQ6ICBwWzFdID0gJ2JvdHRvbSc7IGJyZWFrXG4gICAgICAgICAgICAgIGNhc2UgNTogIHBbMV0gPSAgJ3RvcCc7IGJyZWFrXG4gICAgICAgICAgICAgIGRlZmF1bHQ6IHBbMV0gPSAnbG9vcCdcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgIHRpbWU6IHBhcnNlRmxvYXQocFswXSksXG4gICAgICAgICAgICAgIHBvczogIHBbMV0sXG4gICAgICAgICAgICAgIGNvbG9yOiAnIycgKyBwYWQoKHBbM10gfCAwKS50b1N0cmluZygxNiksIDYpLFxuICAgICAgICAgICAgICB0ZXh0OiBjb21tZW50WycjdGV4dCddXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIGEudGltZSAtIGIudGltZVxuICAgICAgICAgIH0pXG4gICAgICAgICAgbG9nKCfkuIDliIfpobrliKnlvIDlp4vmkq3mlL4nLCAyKVxuICAgICAgICAgIGNhbGxiYWNrKHNvdXJjZSwgY29tbWVudHMpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbG9nKCfop6PmnpBiaWxpYmxp5by55bmV5aSx6LSlLCDkvYbli4nlvLrlj6/ku6Xmkq3mlL4nLCAyKVxuICAgICAgICAgIGNhbGxiYWNrKHNvdXJjZSlcbiAgICAgICAgfVxuXG4gICAgICB9LCB7Z3ppbmZsYXRlOjEsIHhtbDoxfSlcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nKCfop6PmnpBiaWxpYmxp6KeG6aKR5Zyw5Z2A5aSx6LSlJywgMilcbiAgICAgIGNhbGxiYWNrKGZhbHNlKVxuICAgIH1cbiAgfSlcbn1cbiIsIi8qICB0dWRvdSBcbiAqICBA5pyx5LiAXG4gKi9cbnZhciBjYW5QbGF5TTNVOCA9IHJlcXVpcmUoJy4vY2FuUGxheU0zVTgnKVxudmFyIGFqYXggICAgICAgID0gcmVxdWlyZSgnLi9hamF4JylcbnZhciBsb2cgICAgICAgICA9IHJlcXVpcmUoJy4vbG9nJylcblxuZXhwb3J0cy5tYXRjaCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgcmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydHMuZ2V0VmlkZW9zID0gZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHtcbiAgYWpheCh7XG4gICAgdXJsOiAnaHR0cDovL2FjZnVuZml4LnNpbmFhcHAuY29tL21hbWEucGhwJyxcbiAgICBqc29ucDogdHJ1ZSxcbiAgICBwYXJhbToge1xuICAgICAgdXJsOiB1cmwuYXR0cignc291cmNlJylcbiAgICB9LFxuICAgIGNhbGxiYWNrOiBmdW5jdGlvbihwYXJhbSkge1xuICAgICAgaWYgKHBhcmFtLmNvZGUgIT0gMjAwKSB7XG4gICAgICAgIGNhbGxiYWNrKGZhbHNlKTtcbiAgICAgIH1cbiAgICAgIHZhciBzb3VyY2UgPSBjYW5QbGF5TTNVOCAmJiBwYXJhbS5tM3U4ID8gcGFyYW0ubTN1OCA6IHBhcmFtLm1wNDtcbiAgICAgIHZhciBycyA9IFtdO1xuICAgICAgaWYgKHNvdXJjZSkge1xuICAgICAgICBmb3IodHlwZSBpbiBzb3VyY2UpIHtcbiAgICAgICAgICBycy5wdXNoKFt0eXBlLCBzb3VyY2VbdHlwZV1dKTtcbiAgICAgICAgfVxuICAgICAgICBjYWxsYmFjayhycyk7XG4gICAgICB9XG4gICAgfVxuICB9KVxufSIsIi8qICBodW5hbnR2IFxuICogIEDmg4Xov7fmtbfpvp9waXp6YVxuICovXG52YXIgY2FuUGxheU0zVTggPSByZXF1aXJlKCcuL2NhblBsYXlNM1U4JylcbnZhciBhamF4ICAgICAgICA9IHJlcXVpcmUoJy4vYWpheCcpXG52YXIgbG9nICAgICAgICAgPSByZXF1aXJlKCcuL2xvZycpXG5leHBvcnRzLm1hdGNoID0gZnVuY3Rpb24gKHVybCkge1xuICByZXR1cm4gL3d3d1xcLmh1bmFudHZcXC5jb20vLnRlc3QodXJsLmF0dHIoJ2hvc3QnKSlcbn1cbmV4cG9ydHMuZ2V0VmlkZW9zID0gZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHtcbiAgLy/oipLmnpzlj7DmsqHmnIltcDQgbyjila/ilqHilbApb1xuICBpZiAoY2FuUGxheU0zVTgpIHtcbiAgICB2YXIgZ2V0UGFyYW1zID0gZnVuY3Rpb24ocmVxX3VybCl7XG4gICAgICB2YXIgcGFyYW1zX3VybCA9IHJlcV91cmwuc3BsaXQoXCI/XCIpWzFdO1xuICAgICAgdmFyIHBhcmFtc190bXAgPSBuZXcgQXJyYXkoKTtcbiAgICAgIHBhcmFtc190bXAgPSBwYXJhbXNfdXJsLnNwbGl0KFwiJlwiKTtcbiAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgIGZvcihrZXkgaW4gcGFyYW1zX3RtcCl7XG4gICAgICAgIHBhcmFtID0gcGFyYW1zX3RtcFtrZXldO1xuICAgICAgICBpdGVtID0gbmV3IEFycmF5KCk7XG4gICAgICAgIGl0ZW0gPSBwYXJhbXNfdG1wW2tleV0uc3BsaXQoXCI9XCIpO1xuICAgICAgICBpZiAoaXRlbVswXSAhPSAnJykge1xuICAgICAgICAgICAgcGFyYW1zW2l0ZW1bMF1dID0gaXRlbVsxXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHBhcmFtcztcbiAgICB9XG5cbiAgICB2YXIgbTN1OF9yZXFfcGFybXMgPSAnJmZtdD02JnBubz03Jm0zdTg9MSc7XG4gICAgdmFyIHN0cl9vcmlnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ0ZsYXNoVmFycycpWzBdLmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcbiAgICB2YXIgc3RyX3RtcCA9IHN0cl9vcmlnLnNwbGl0KFwiJmZpbGU9XCIpWzFdO1xuICAgIHZhciByZXFfdXJsID0gc3RyX3RtcC5zcGxpdChcIiUyNmZtdFwiKVswXTtcbiAgICByZXFfdXJsID0gcmVxX3VybCArIG0zdThfcmVxX3Bhcm1zO1xuICAgIHJlcV91cmwgPSBkZWNvZGVVUklDb21wb25lbnQocmVxX3VybCk7XG4gICAgcGFyYW1zID0gZ2V0UGFyYW1zKHJlcV91cmwpO1xuXG4gICAgLy/ojrflj5bkuInnp43muIXmmbDluqZcbiAgICB2YXIgbGltaXRyYXRlID0gbmV3IEFycmF5KCk7XG4gICAgbGltaXRyYXRlID0gWyc1NzAnLCAnMTA1NicsICcxNjE1J107XG4gICAgdXJscyA9IG5ldyBBcnJheSgpO1xuICAgIHBhcmFtcy5saW1pdHJhdGUgPSBsaW1pdHJhdGVbMF07XG4gICAgdGV4dCA9IFwi5qCH5riFXCI7XG4gICAgYWpheCh7XG4gICAgICB1cmw6ICdodHRwOi8vcGN2Y3IuY2RuLmltZ28udHYvbmNycy92b2QuZG8nLFxuICAgICAganNvbnA6IHRydWUsXG4gICAgICBwYXJhbTogcGFyYW1zLFxuICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT0gJ29rJykgdXJscy5wdXNoKFt0ZXh0LCBkYXRhLmluZm9dKVxuICAgICAgICBwYXJhbXMubGltaXRyYXRlID0gbGltaXRyYXRlWzFdO1xuICAgICAgICB0ZXh0ID0gXCLpq5jmuIVcIjtcbiAgICAgICAgYWpheCh7XG4gICAgICAgICAgdXJsOiAnaHR0cDovL3BjdmNyLmNkbi5pbWdvLnR2L25jcnMvdm9kLmRvJyxcbiAgICAgICAgICBqc29ucDogdHJ1ZSxcbiAgICAgICAgICBwYXJhbTogcGFyYW1zLFxuICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PSAnb2snKSB1cmxzLnB1c2goW3RleHQsIGRhdGEuaW5mb10pXG4gICAgICAgICAgICBwYXJhbXMubGltaXRyYXRlID0gbGltaXRyYXRlWzJdO1xuICAgICAgICAgICAgdGV4dCA9IFwi6LaF5riFXCI7XG4gICAgICAgICAgICBhamF4KHtcbiAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3BjdmNyLmNkbi5pbWdvLnR2L25jcnMvdm9kLmRvJyxcbiAgICAgICAgICAgICAganNvbnA6IHRydWUsXG4gICAgICAgICAgICAgIHBhcmFtOiBwYXJhbXMsXG4gICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT0gJ29rJykgdXJscy5wdXNoKFt0ZXh0LCBkYXRhLmluZm9dKVxuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayh1cmxzKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfWVsc2V7XG4gICAgbG9nKCfor7fkvb/nlKhTYWZhcmnop4LnnIvmnKzop4bpopEnKTtcbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICB9LCAyMDAwKTtcbiAgfVxufSIsIi8qICBpcWl5aSBcbiAqICBA5pyx5LiAXG4gKi9cbnZhciBjYW5QbGF5TTNVOCA9IHJlcXVpcmUoJy4vY2FuUGxheU0zVTgnKVxudmFyIHF1ZXJ5U3RyaW5nID0gcmVxdWlyZSgnLi9xdWVyeVN0cmluZycpXG52YXIgZ2V0Q29va2llID0gcmVxdWlyZSgnLi9nZXRDb29raWUnKVxudmFyIGFqYXggPSByZXF1aXJlKCcuL2FqYXgnKVxudmFyIGh0dHBQcm94eSA9IHJlcXVpcmUoJy4vaHR0cFByb3h5JylcbnZhciBsb2cgPSByZXF1aXJlKCcuL2xvZycpXG5cbmZ1bmN0aW9uIGZvcm1hdFZkICh2ZCkge1xuICBzd2l0Y2ggKHZkKSB7XG4gICAgY2FzZSAxOiAgcmV0dXJuIHtpbmRleDogMiwgdGV4dDogJ+agh+a4hScgIH1cbiAgICBjYXNlIDI6ICByZXR1cm4ge2luZGV4OiAzLCB0ZXh0OiAn6auY5riFJyAgfVxuICAgIGNhc2UgOTY6IHJldHVybiB7aW5kZXg6IDEsIHRleHQ6ICfmuKPnlLvotKgnIH1cbiAgICBkZWZhdWx0OiByZXR1cm4ge2luZGV4OiAwLCB0ZXh0OiAn5pyq55+lJyAgfVxuICB9XG59XG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAodXJsKSB7XG4gIHJldHVybiAvXmh0dHA6XFwvXFwvd3d3XFwuaXFpeWlcXC5jb20vLnRlc3QodXJsLmF0dHIoJ3NvdXJjZScpKSAmJiAhIXdpbmRvdy5RLlBhZ2VJbmZvXG59XG5cbmV4cG9ydHMuZ2V0VmlkZW9zID0gZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHtcbiAgdmFyIHVpZCA9ICcnO1xuICB0cnl7XG4gICAgdWlkID0gSlNPTi5wYXJzZShnZXRDb29raWUoJ1AwMDAwMicpKS51aWRcbiAgfWNhdGNoKGUpIHt9XG4gIHZhciBjdXBpZCA9ICdxY18xMDAwMDFfMTAwMTAyJyAvL+i/meS4quWGmeatu+WQp1xuICB2YXIgdHZJZCA9IHdpbmRvdy5RLlBhZ2VJbmZvLnBsYXlQYWdlSW5mby50dklkXG4gIHZhciBhbGJ1bUlkID0gd2luZG93LlEuUGFnZUluZm8ucGxheVBhZ2VJbmZvLmFsYnVtSWRcbiAgdmFyIHZpZCA9IHdpbmRvdy5RLlBhZ2VJbmZvLnBsYXlQYWdlSW5mby52aWQgfHxcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmxhc2hib3gnKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGxheWVyLXZpZGVvaWQnKVxuXG4gIHZhciBwYXJhbSA9IHdlb3JqamlnaCh0dklkKVxuICBwYXJhbS51aWQgPSB1aWRcbiAgcGFyYW0uY3VwaWQgPSBjdXBpZFxuICBwYXJhbS5wbGF0Rm9ybSA9ICdoNSdcbiAgcGFyYW0udHlwZSA9IGNhblBsYXlNM1U4ID8gJ20zdTgnIDogJ21wNCcsXG4gIHBhcmFtLnF5cGlkID0gdHZJZCArICdfMjEnXG4gIGFqYXgoe1xuICAgIHVybDogJ2h0dHA6Ly9jYWNoZS5tLmlxaXlpLmNvbS9qcC90bXRzLycrdHZJZCsnLycrdmlkKycvJyxcbiAgICBqc29ucDogdHJ1ZSxcbiAgICBwYXJhbTogcGFyYW0sXG4gICAgY2FsbGJhY2s6IGZ1bmN0aW9uIChycykge1xuICAgICAgdmFyIHNvdXJjZSA9IFtdICAgICAgXG4gICAgICBpZiAocnMuZGF0YS52aWRsICYmIHJzLmRhdGEudmlkbC5sZW5ndGgpIHtcbiAgICAgICAgc291cmNlID0gcnMuZGF0YS52aWRsXG4gICAgICAgICAgLm1hcChmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgdmFyIHZEYXRhID0gZm9ybWF0VmQoZGF0YS52ZCk7XG4gICAgICAgICAgICB2RGF0YS5tM3UgPSBkYXRhLm0zdTtcbiAgICAgICAgICAgIHJldHVybiB2RGF0YTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5zb3J0KGZ1bmN0aW9uIChkYXRhQSwgZGF0YUIpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhQi5pbmRleCAtIGRhdGFBLmluZGV4XG4gICAgICAgICAgfSlcbiAgICAgICAgICAubWFwKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICByZXR1cm4gW2RhdGEudGV4dCwgZGF0YS5tM3VdXG4gICAgICAgICAgfSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChycy5kYXRhLm0zdS5sZW5ndGggPiAwKSBzb3VyY2UgPSBbJ+agh+a4hScsIHJzLmRhdGEubTN1XVxuICAgICAgfVxuICAgICAgY2FsbGJhY2soc291cmNlKVxuICAgIH1cbiAgfSlcbn1cbiIsIi8qICB0dWRvdSBcbiAqICBA5pyx5LiAXG4gKi9cbnZhciBjYW5QbGF5TTNVOCA9IHJlcXVpcmUoJy4vY2FuUGxheU0zVTgnKVxudmFyIGFqYXggICAgICAgID0gcmVxdWlyZSgnLi9hamF4JylcbnZhciBsb2cgICAgICAgICA9IHJlcXVpcmUoJy4vbG9nJylcbnZhciB5b3VrdSAgICAgICA9IHJlcXVpcmUoJy4vc2Vla2VyX3lvdWt1JylcblxuZXhwb3J0cy5tYXRjaCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgdmFyIF9pZCA9IHdpbmRvdy5paWQgfHwgKHdpbmRvdy5wYWdlQ29uZmlnICYmIHdpbmRvdy5wYWdlQ29uZmlnLmlpZCkgfHwgKHdpbmRvdy5pdGVtRGF0YSAmJiB3aW5kb3cuaXRlbURhdGEuaWlkKVxuICB2YXIgeW91a3VDb2RlID0gd2luZG93Lml0ZW1EYXRhICYmIHdpbmRvdy5pdGVtRGF0YS52Y29kZVxuICByZXR1cm4gL3R1ZG91XFwuY29tLy50ZXN0KHVybC5hdHRyKCdob3N0JykpICYmICh5b3VrdUNvZGUgfHwgX2lkKVxufVxuXG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7ICBcbiAgdmFyIHlvdWt1Q29kZSA9IHdpbmRvdy5pdGVtRGF0YSAmJiB3aW5kb3cuaXRlbURhdGEudmNvZGVcbiAgaWYgKHlvdWt1Q29kZSkge1xuICAgIHJldHVybiB5b3VrdS5wYXJzZVlvdWt1Q29kZSh5b3VrdUNvZGUsIGNhbGxiYWNrKVxuICB9XG4gIHZhciBfaWQgPSB3aW5kb3cuaWlkIHx8ICh3aW5kb3cucGFnZUNvbmZpZyAmJiB3aW5kb3cucGFnZUNvbmZpZy5paWQpIHx8ICh3aW5kb3cuaXRlbURhdGEgJiYgd2luZG93Lml0ZW1EYXRhLmlpZCk7XG4gIHZhciBtM3U4ID0gZnVuY3Rpb24oY2FsbGJhY2speyAgICBcbiAgICB2YXIgdXJscyA9IFtcbiAgICAgIFsn5Y6f55S7JywgJ2h0dHA6Ly92ci50dWRvdS5jb20vdjJwcm94eS92Mi5tM3U4P2l0PScgKyBfaWQgKyAnJnN0PTUnXSxcbiAgICAgIFsn6LaF5riFJywgJ2h0dHA6Ly92ci50dWRvdS5jb20vdjJwcm94eS92Mi5tM3U4P2l0PScgKyBfaWQgKyAnJnN0PTQnXSxcbiAgICAgIFsn6auY5riFJywgJ2h0dHA6Ly92ci50dWRvdS5jb20vdjJwcm94eS92Mi5tM3U4P2l0PScgKyBfaWQgKyAnJnN0PTMnXSxcbiAgICAgIFsn5qCH5riFJywgJ2h0dHA6Ly92ci50dWRvdS5jb20vdjJwcm94eS92Mi5tM3U4P2l0PScgKyBfaWQgKyAnJnN0PTInXVxuICAgIF1cbiAgICB2YXIgX3NcbiAgICBpZih3aW5kb3cuaXRlbURhdGEgJiYgd2luZG93Lml0ZW1EYXRhLnNlZ3Mpe1xuICAgICAgdXJscyA9IFtdXG4gICAgICBfcyAgID0gSlNPTi5wYXJzZSh3aW5kb3cuaXRlbURhdGEuc2VncylcbiAgICAgIGlmKF9zWzVdKSB1cmxzLnB1c2goWyfljp/nlLsnLCAnaHR0cDovL3ZyLnR1ZG91LmNvbS92MnByb3h5L3YyLm0zdTg/aXQ9JyArIF9pZCArICcmc3Q9NSddKVxuICAgICAgaWYoX3NbNF0pIHVybHMucHVzaChbJ+i2hea4hScsICdodHRwOi8vdnIudHVkb3UuY29tL3YycHJveHkvdjIubTN1OD9pdD0nICsgX2lkICsgJyZzdD00J10pXG4gICAgICBpZihfc1szXSkgdXJscy5wdXNoKFsn6auY5riFJywgJ2h0dHA6Ly92ci50dWRvdS5jb20vdjJwcm94eS92Mi5tM3U4P2l0PScgKyBfaWQgKyAnJnN0PTMnXSlcbiAgICAgIGlmKF9zWzJdKSB1cmxzLnB1c2goWyfmoIfmuIUnLCAnaHR0cDovL3ZyLnR1ZG91LmNvbS92MnByb3h5L3YyLm0zdTg/aXQ9JyArIF9pZCArICcmc3Q9MiddKVxuICAgIH0gICBcbiAgICBsb2coJ+ino+aekHR1ZG916KeG6aKR5Zyw5Z2A5oiQ5YqfICcgKyB1cmxzLm1hcChmdW5jdGlvbiAoaXRlbSkge3JldHVybiAnPGEgaHJlZj0nK2l0ZW1bMV0rJz4nK2l0ZW1bMF0rJzwvYT4nfSkuam9pbignICcpLCAyKVxuICAgIGNhbGxiYWNrKHVybHMpXG4gIH07XG4gIHZhciBtcDQgPSBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgYWpheCh7XG4gICAgICB1cmw6ICdodHRwOi8vdnIudHVkb3UuY29tL3YycHJveHkvdjIuanMnLFxuICAgICAgcGFyYW06IHtcbiAgICAgICAgaXQ6IF9pZCxcbiAgICAgICAgc3Q6ICc1MiUyQzUzJTJDNTQnXG4gICAgICB9LFxuICAgICAganNvbnA6ICdqc29ucCcsXG4gICAgICBjYWxsYmFjazogZnVuY3Rpb24ocGFyYW0pe1xuICAgICAgICBpZihwYXJhbSA9PT0gLTEgfHwgcGFyYW0uY29kZSA9PSAtMSkgcmV0dXJuIGxvZygn6Kej5p6QdHVkb3Xop4bpopHlnLDlnYDlpLHotKUnKVxuICAgICAgICBmb3IodmFyIHVybHM9W10saT0wLGxlbj1wYXJhbS51cmxzLmxlbmd0aDsgaTxsZW47IGkrKyl7IHVybHMucHVzaChbaSwgcGFyYW0udXJsc1tpXV0pOyB9XG4gICAgICAgIGxvZygn6Kej5p6QdHVkb3Xop4bpopHlnLDlnYDmiJDlip8gJyArIHVybHMubWFwKGZ1bmN0aW9uIChpdGVtKSB7cmV0dXJuICc8YSBocmVmPScraXRlbVsxXSsnPicraXRlbVswXSsnPC9hPid9KS5qb2luKCcgJyksIDIpXG4gICAgICAgIHJldHVybiBjYWxsYmFjayh1cmxzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgY2FuUGxheU0zVTggPyBtM3U4KGNhbGxiYWNrKSA6IG1wNChjYWxsYmFjaylcbn0iLCIvKiAgeW91a3UgXG4gKiAgQOacseS4gFxuICovXG52YXIgY2FuUGxheU0zVTggPSByZXF1aXJlKCcuL2NhblBsYXlNM1U4JylcbnZhciBhamF4ICAgICAgICA9IHJlcXVpcmUoJy4vYWpheCcpXG52YXIgbG9nICAgICAgICAgPSByZXF1aXJlKCcuL2xvZycpXG5leHBvcnRzLm1hdGNoID0gZnVuY3Rpb24gKHVybCkge1xuICByZXR1cm4gL3ZcXC55b3VrdVxcLmNvbS8udGVzdCh1cmwuYXR0cignaG9zdCcpKSAmJiAhIXdpbmRvdy52aWRlb0lkXG59XG52YXIgcGFyc2VZb3VrdUNvZGUgPSBleHBvcnRzLnBhcnNlWW91a3VDb2RlID0gZnVuY3Rpb24gKF9pZCwgY2FsbGJhY2spIHtcbiAgbG9nKCflvIDlp4vop6PmnpB5b3VrdeinhumikeWcsOWdgCcpICBcbiAgdmFyIG1rX2EzID0gJ2I0ZXQnO1xuICB2YXIgbWtfYTQgPSAnYm9hNCc7XG4gIHZhciB1c2VyQ2FjaGVfYTEgPSAnNCc7XG4gIHZhciB1c2VyQ2FjaGVfYTIgPSAnMSc7XG4gIHZhciBycztcbiAgdmFyIHNpZDtcbiAgdmFyIHRva2VuO1xuICBmdW5jdGlvbiBkZWNvZGU2NChhKSB7XG4gICAgaWYgKCFhKVxuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgYSA9IGEudG9TdHJpbmcoKTtcbiAgICB2YXIgYiwgYywgZCwgZSwgZiwgZywgaCwgaSA9IG5ldyBBcnJheSgtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgNjIsIC0xLCAtMSwgLTEsIDYzLCA1MiwgNTMsIDU0LCA1NSwgNTYsIDU3LCA1OCwgNTksIDYwLCA2MSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIDAsIDEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwLCAxMSwgMTIsIDEzLCAxNCwgMTUsIDE2LCAxNywgMTgsIDE5LCAyMCwgMjEsIDIyLCAyMywgMjQsIDI1LCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAyNiwgMjcsIDI4LCAyOSwgMzAsIDMxLCAzMiwgMzMsIDM0LCAzNSwgMzYsIDM3LCAzOCwgMzksIDQwLCA0MSwgNDIsIDQzLCA0NCwgNDUsIDQ2LCA0NywgNDgsIDQ5LCA1MCwgNTEsIC0xLCAtMSwgLTEsIC0xLCAtMSk7XG4gICAgZm9yIChnID0gYS5sZW5ndGgsIGYgPSAwLCBoID0gXCJcIjsgZyA+IGY7KSB7XG4gICAgICBkb1xuICAgICAgICBiID0gaVsyNTUgJiBhLmNoYXJDb2RlQXQoZisrKV07XG4gICAgICB3aGlsZSAoZyA+IGYgJiYgLTEgPT0gYik7XG4gICAgICBpZiAoLTEgPT0gYilcbiAgICAgICAgYnJlYWs7XG4gICAgICBkb1xuICAgICAgICBjID0gaVsyNTUgJiBhLmNoYXJDb2RlQXQoZisrKV07XG4gICAgICB3aGlsZSAoZyA+IGYgJiYgLTEgPT0gYyk7XG4gICAgICBpZiAoLTEgPT0gYylcbiAgICAgICAgYnJlYWs7XG4gICAgICBoICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYiA8PCAyIHwgKDQ4ICYgYykgPj4gNCk7XG4gICAgICBkbyB7XG4gICAgICAgIGlmIChkID0gMjU1ICYgYS5jaGFyQ29kZUF0KGYrKyksIDYxID09IGQpXG4gICAgICAgICAgcmV0dXJuIGg7XG4gICAgICAgIGQgPSBpW2RdXG4gICAgICB9XG4gICAgICB3aGlsZSAoZyA+IGYgJiYgLTEgPT0gZCk7XG4gICAgICBpZiAoLTEgPT0gZClcbiAgICAgICAgYnJlYWs7XG4gICAgICBoICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKDE1ICYgYykgPDwgNCB8ICg2MCAmIGQpID4+IDIpO1xuICAgICAgZG8ge1xuICAgICAgICBpZiAoZSA9IDI1NSAmIGEuY2hhckNvZGVBdChmKyspLCA2MSA9PSBlKVxuICAgICAgICAgIHJldHVybiBoO1xuICAgICAgICBlID0gaVtlXVxuICAgICAgfVxuICAgICAgd2hpbGUgKGcgPiBmICYmIC0xID09IGUpO1xuICAgICAgaWYgKC0xID09IGUpXG4gICAgICAgIGJyZWFrO1xuICAgICAgaCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgzICYgZCkgPDwgNiB8IGUpXG4gICAgfVxuICAgIHJldHVybiBoXG4gIH1cblxuICBmdW5jdGlvbiBEKGEpIHtcbiAgICBpZiAoIWEpIHJldHVybiBcIlwiO1xuICAgIHZhciBhID0gYS50b1N0cmluZygpLFxuICAgICAgYywgYiwgZiwgZSwgZywgaDtcbiAgICBmID0gYS5sZW5ndGg7XG4gICAgYiA9IDA7XG4gICAgZm9yIChjID0gXCJcIjsgYiA8IGY7KSB7XG4gICAgICBlID0gYS5jaGFyQ29kZUF0KGIrKykgJiAyNTU7XG4gICAgICBpZiAoYiA9PSBmKSB7XG4gICAgICAgIGMgKz0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCIuY2hhckF0KGUgPj4gMik7XG4gICAgICAgIGMgKz0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCIuY2hhckF0KChlICYgMykgPDwgNCk7XG4gICAgICAgIGMgKz0gXCI9PVwiO1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgICAgZyA9IGEuY2hhckNvZGVBdChiKyspO1xuICAgICAgaWYgKGIgPT0gZikge1xuICAgICAgICBjICs9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrL1wiLmNoYXJBdChlID4+IDIpO1xuICAgICAgICBjICs9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrL1wiLmNoYXJBdCgoZSAmIDMpIDw8IDQgfCAoZyAmIDI0MCkgPj4gNCk7XG4gICAgICAgIGMgKz0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCIuY2hhckF0KChnICZcbiAgICAgICAgICAxNSkgPDwgMik7XG4gICAgICAgIGMgKz0gXCI9XCI7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBoID0gYS5jaGFyQ29kZUF0KGIrKyk7XG4gICAgICBjICs9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrL1wiLmNoYXJBdChlID4+IDIpO1xuICAgICAgYyArPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIi5jaGFyQXQoKGUgJiAzKSA8PCA0IHwgKGcgJiAyNDApID4+IDQpO1xuICAgICAgYyArPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIi5jaGFyQXQoKGcgJiAxNSkgPDwgMiB8IChoICYgMTkyKSA+PiA2KTtcbiAgICAgIGMgKz0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCIuY2hhckF0KGggJiA2MylcbiAgICB9XG4gICAgcmV0dXJuIGNcbiAgfVxuXG4gIGZ1bmN0aW9uIEUoYSwgYykge1xuICAgIGZvciAodmFyIGIgPSBbXSwgZiA9IDAsIGksIGUgPSBcIlwiLCBoID0gMDsgMjU2ID4gaDsgaCsrKSBiW2hdID0gaDtcbiAgICBmb3IgKGggPSAwOyAyNTYgPiBoOyBoKyspIGYgPSAoZiArIGJbaF0gKyBhLmNoYXJDb2RlQXQoaCAlIGEubGVuZ3RoKSkgJSAyNTYsIGkgPSBiW2hdLCBiW2hdID0gYltmXSwgYltmXSA9IGk7XG4gICAgZm9yICh2YXIgcSA9IGYgPSBoID0gMDsgcSA8IGMubGVuZ3RoOyBxKyspIGggPSAoaCArIDEpICUgMjU2LCBmID0gKGYgKyBiW2hdKSAlIDI1NiwgaSA9IGJbaF0sIGJbaF0gPSBiW2ZdLCBiW2ZdID0gaSwgZSArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMuY2hhckNvZGVBdChxKSBeIGJbKGJbaF0gKyBiW2ZdKSAlIDI1Nl0pO1xuICAgIHJldHVybiBlXG4gIH1cblxuICBmdW5jdGlvbiBGKGEsIGMpIHtcbiAgICBmb3IgKHZhciBiID0gW10sIGYgPSAwOyBmIDwgYS5sZW5ndGg7IGYrKykge1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGkgPSBcImFcIiA8PSBhW2ZdICYmIFwielwiID49IGFbZl0gPyBhW2ZdLmNoYXJDb2RlQXQoMCkgLSA5NyA6IGFbZl0gLSAwICsgMjYsIGUgPSAwOyAzNiA+IGU7IGUrKylcbiAgICAgICAgaWYgKGNbZV0gPT0gaSkge1xuICAgICAgICAgIGkgPSBlO1xuICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgIGJbZl0gPSAyNSA8IGkgPyBpIC0gMjYgOiBTdHJpbmcuZnJvbUNoYXJDb2RlKGkgKyA5NylcbiAgICB9XG4gICAgcmV0dXJuIGIuam9pbihcIlwiKVxuICB9XG4gIFxuICB2YXIgUGxheUxpc3REYXRhID0gZnVuY3Rpb24oYSwgYiwgYykge1xuICAgICAgdmFyIGQgPSB0aGlzO1xuICAgICAgbmV3IERhdGU7XG4gICAgICB0aGlzLl9zaWQgPSBzaWQsIHRoaXMuX2ZpbGVUeXBlID0gYywgdGhpcy5fdmlkZW9TZWdzRGljID0ge307XG4gICAgICB0aGlzLl9pcCA9IGEuc2VjdXJpdHkuaXA7XG4gICAgICB2YXIgZSA9IChuZXcgUmFuZG9tUHJveHksIFtdKSxcbiAgICAgICAgZiA9IFtdO1xuICAgICAgZi5zdHJlYW1zID0ge30sIGYubG9nb3MgPSB7fSwgZi50eXBlQXJyID0ge30sIGYudG90YWxUaW1lID0ge307XG4gICAgICBmb3IgKHZhciBnID0gMDsgZyA8IGIubGVuZ3RoOyBnKyspIHtcbiAgICAgICAgZm9yICh2YXIgaCA9IGJbZ10uYXVkaW9fbGFuZywgaSA9ICExLCBqID0gMDsgaiA8IGUubGVuZ3RoOyBqKyspXG4gICAgICAgICAgaWYgKGVbal0gPT0gaCkge1xuICAgICAgICAgICAgaSA9ICEwO1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG4gICAgICAgIGkgfHwgZS5wdXNoKGgpXG4gICAgICB9XG4gICAgICBmb3IgKHZhciBnID0gMDsgZyA8IGUubGVuZ3RoOyBnKyspIHtcbiAgICAgICAgZm9yICh2YXIgayA9IGVbZ10sIGwgPSB7fSwgbSA9IHt9LCBuID0gW10sIGogPSAwOyBqIDwgYi5sZW5ndGg7IGorKykge1xuICAgICAgICAgIHZhciBvID0gYltqXTtcbiAgICAgICAgICBpZiAoayA9PSBvLmF1ZGlvX2xhbmcpIHtcbiAgICAgICAgICAgIGlmICghZC5pc1ZhbGlkVHlwZShvLnN0cmVhbV90eXBlKSlcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB2YXIgcCA9IGQuY29udmVydFR5cGUoby5zdHJlYW1fdHlwZSksXG4gICAgICAgICAgICAgIHEgPSAwO1xuICAgICAgICAgICAgXCJub25lXCIgIT0gby5sb2dvICYmIChxID0gMSksIG1bcF0gPSBxO1xuICAgICAgICAgICAgdmFyIHIgPSAhMTtcbiAgICAgICAgICAgIGZvciAodmFyIHMgaW4gbilcbiAgICAgICAgICAgICAgcCA9PSBuW3NdICYmIChyID0gITApO1xuICAgICAgICAgICAgciB8fCBuLnB1c2gocCk7XG4gICAgICAgICAgICB2YXIgdCA9IG8uc2VncztcbiAgICAgICAgICAgIGlmIChudWxsID09IHQpXG4gICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgdmFyIHUgPSBbXTtcbiAgICAgICAgICAgIHIgJiYgKHUgPSBsW3BdKTtcbiAgICAgICAgICAgIGZvciAodmFyIHYgPSAwOyB2IDwgdC5sZW5ndGg7IHYrKykge1xuICAgICAgICAgICAgICB2YXIgdyA9IHRbdl07XG4gICAgICAgICAgICAgIGlmIChudWxsID09IHcpXG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgIHZhciB4ID0ge307XG4gICAgICAgICAgICAgIHgubm8gPSB2LCBcbiAgICAgICAgICAgICAgeC5zaXplID0gdy5zaXplLCBcbiAgICAgICAgICAgICAgeC5zZWNvbmRzID0gTnVtYmVyKHcudG90YWxfbWlsbGlzZWNvbmRzX3ZpZGVvKSAvIDFlMywgXG4gICAgICAgICAgICAgIHgubWlsbGlzZWNvbmRzX3ZpZGVvID0gTnVtYmVyKG8ubWlsbGlzZWNvbmRzX3ZpZGVvKSAvIDFlMywgXG4gICAgICAgICAgICAgIHgua2V5ID0gdy5rZXksIHguZmlsZUlkID0gdGhpcy5nZXRGaWxlSWQoby5zdHJlYW1fZmlsZWlkLCB2KSwgXG4gICAgICAgICAgICAgIHguc3JjID0gdGhpcy5nZXRWaWRlb1NyYyhqLCB2LCBhLCBvLnN0cmVhbV90eXBlLCB4LmZpbGVJZCksIFxuICAgICAgICAgICAgICB4LnR5cGUgPSBwLCBcbiAgICAgICAgICAgICAgdS5wdXNoKHgpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsW3BdID0gdVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgeSA9IHRoaXMubGFuZ0NvZGVUb0NOKGspLmtleTtcbiAgICAgICAgZi5sb2dvc1t5XSA9IG0sIGYuc3RyZWFtc1t5XSA9IGwsIGYudHlwZUFyclt5XSA9IG4gICAgICAgIFxuICAgICAgfVxuICAgICAgdGhpcy5fdmlkZW9TZWdzRGljID0gZiwgdGhpcy5fdmlkZW9TZWdzRGljLmxhbmcgPSB0aGlzLmxhbmdDb2RlVG9DTihlWzBdKS5rZXlcbiAgICB9LFxuICAgIFJhbmRvbVByb3h5ID0gZnVuY3Rpb24oYSkge1xuICAgICAgdGhpcy5fcmFuZG9tU2VlZCA9IGEsIHRoaXMuY2dfaHVuKClcbiAgICB9O1xuICBSYW5kb21Qcm94eS5wcm90b3R5cGUgPSB7XG4gICAgY2dfaHVuOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuX2NnU3RyID0gXCJcIjtcbiAgICAgIGZvciAodmFyIGEgPSBcImFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVovXFxcXDouXy0xMjM0NTY3ODkwXCIsIGIgPSBhLmxlbmd0aCwgYyA9IDA7IGIgPiBjOyBjKyspIHtcbiAgICAgICAgdmFyIGQgPSBwYXJzZUludCh0aGlzLnJhbigpICogYS5sZW5ndGgpO1xuICAgICAgICB0aGlzLl9jZ1N0ciArPSBhLmNoYXJBdChkKSwgYSA9IGEuc3BsaXQoYS5jaGFyQXQoZCkpLmpvaW4oXCJcIilcbiAgICAgIH1cbiAgICB9LFxuICAgIGNnX2Z1bjogZnVuY3Rpb24oYSkge1xuICAgICAgZm9yICh2YXIgYiA9IGEuc3BsaXQoXCIqXCIpLCBjID0gXCJcIiwgZCA9IDA7IGQgPCBiLmxlbmd0aCAtIDE7IGQrKylcbiAgICAgICAgYyArPSB0aGlzLl9jZ1N0ci5jaGFyQXQoYltkXSk7XG4gICAgICByZXR1cm4gY1xuICAgIH0sXG4gICAgcmFuOiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLl9yYW5kb21TZWVkID0gKDIxMSAqIHRoaXMuX3JhbmRvbVNlZWQgKyAzMDAzMSkgJSA2NTUzNiwgdGhpcy5fcmFuZG9tU2VlZCAvIDY1NTM2XG4gICAgfVxuICB9LCBQbGF5TGlzdERhdGEucHJvdG90eXBlID0ge1xuICAgIGdldEZpbGVJZDogZnVuY3Rpb24oYSwgYikge1xuICAgICAgaWYgKG51bGwgPT0gYSB8fCBcIlwiID09IGEpXG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgdmFyIGMgPSBcIlwiLFxuICAgICAgICBkID0gYS5zbGljZSgwLCA4KSxcbiAgICAgICAgZSA9IGIudG9TdHJpbmcoMTYpO1xuICAgICAgMSA9PSBlLmxlbmd0aCAmJiAoZSA9IFwiMFwiICsgZSksIGUgPSBlLnRvVXBwZXJDYXNlKCk7XG4gICAgICB2YXIgZiA9IGEuc2xpY2UoMTAsIGEubGVuZ3RoKTtcbiAgICAgIHJldHVybiBjID0gZCArIGUgKyBmXG4gICAgfSxcbiAgICBpc1ZhbGlkVHlwZTogZnVuY3Rpb24oYSkge1xuICAgICAgcmV0dXJuIFwiM2dwaGRcIiA9PSBhIHx8IFwiZmx2XCIgPT0gYSB8fCBcImZsdmhkXCIgPT0gYSB8fCBcIm1wNGhkXCIgPT0gYSB8fCBcIm1wNGhkMlwiID09IGEgfHwgXCJtcDRoZDNcIiA9PSBhID8gITAgOiAhMVxuICAgIH0sXG4gICAgY29udmVydFR5cGU6IGZ1bmN0aW9uKGEpIHtcbiAgICAgIHZhciBiID0gYTtcbiAgICAgIHN3aXRjaCAoYSkge1xuICAgICAgICBjYXNlIFwibTN1OFwiOlxuICAgICAgICAgIGIgPSBcIm1wNFwiO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiM2dwaGRcIjpcbiAgICAgICAgICBiID0gXCIzZ3BoZFwiO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZmx2XCI6XG4gICAgICAgICAgYiA9IFwiZmx2XCI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmbHZoZFwiOlxuICAgICAgICAgIGIgPSBcImZsdlwiO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibXA0aGRcIjpcbiAgICAgICAgICBiID0gXCJtcDRcIjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm1wNGhkMlwiOlxuICAgICAgICAgIGIgPSBcImhkMlwiO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibXA0aGQzXCI6XG4gICAgICAgICAgYiA9IFwiaGQzXCJcbiAgICAgIH1cbiAgICAgIHJldHVybiBiXG4gICAgfSxcbiAgICBsYW5nQ29kZVRvQ046IGZ1bmN0aW9uKGEpIHtcbiAgICAgIHZhciBiID0gXCJcIjtcbiAgICAgIHN3aXRjaCAoYSkge1xuICAgICAgICBjYXNlIFwiZGVmYXVsdFwiOlxuICAgICAgICAgIGIgPSB7XG4gICAgICAgICAgICBrZXk6IFwiZ3VveXVcIixcbiAgICAgICAgICAgIHZhbHVlOiBcIuWbveivrVwiXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImd1b3l1XCI6XG4gICAgICAgICAgYiA9IHtcbiAgICAgICAgICAgIGtleTogXCJndW95dVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwi5Zu96K+tXCJcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwieXVlXCI6XG4gICAgICAgICAgYiA9IHtcbiAgICAgICAgICAgIGtleTogXCJ5dWVcIixcbiAgICAgICAgICAgIHZhbHVlOiBcIueypOivrVwiXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImNodWFuXCI6XG4gICAgICAgICAgYiA9IHtcbiAgICAgICAgICAgIGtleTogXCJjaHVhblwiLFxuICAgICAgICAgICAgdmFsdWU6IFwi5bed6K+dXCJcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwidGFpXCI6XG4gICAgICAgICAgYiA9IHtcbiAgICAgICAgICAgIGtleTogXCJ0YWlcIixcbiAgICAgICAgICAgIHZhbHVlOiBcIuWPsOa5vlwiXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIm1pblwiOlxuICAgICAgICAgIGIgPSB7XG4gICAgICAgICAgICBrZXk6IFwibWluXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCLpl73ljZdcIlxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJlblwiOlxuICAgICAgICAgIGIgPSB7XG4gICAgICAgICAgICBrZXk6IFwiZW5cIixcbiAgICAgICAgICAgIHZhbHVlOiBcIuiLseivrVwiXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImphXCI6XG4gICAgICAgICAgYiA9IHtcbiAgICAgICAgICAgIGtleTogXCJqYVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwi5pel6K+tXCJcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwia3JcIjpcbiAgICAgICAgICBiID0ge1xuICAgICAgICAgICAga2V5OiBcImtyXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCLpn6nor61cIlxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJpblwiOlxuICAgICAgICAgIGIgPSB7XG4gICAgICAgICAgICBrZXk6IFwiaW5cIixcbiAgICAgICAgICAgIHZhbHVlOiBcIuWNsOW6plwiXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInJ1XCI6XG4gICAgICAgICAgYiA9IHtcbiAgICAgICAgICAgIGtleTogXCJydVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwi5L+E6K+tXCJcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZnJcIjpcbiAgICAgICAgICBiID0ge1xuICAgICAgICAgICAga2V5OiBcImZyXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCLms5Xor61cIlxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJkZVwiOlxuICAgICAgICAgIGIgPSB7XG4gICAgICAgICAgICBrZXk6IFwiZGVcIixcbiAgICAgICAgICAgIHZhbHVlOiBcIuW+t+ivrVwiXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIml0XCI6XG4gICAgICAgICAgYiA9IHtcbiAgICAgICAgICAgIGtleTogXCJpdFwiLFxuICAgICAgICAgICAgdmFsdWU6IFwi5oSP6K+tXCJcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZXNcIjpcbiAgICAgICAgICBiID0ge1xuICAgICAgICAgICAga2V5OiBcImVzXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCLopb/or61cIlxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJwb1wiOlxuICAgICAgICAgIGIgPSB7XG4gICAgICAgICAgICBrZXk6IFwicG9cIixcbiAgICAgICAgICAgIHZhbHVlOiBcIuiRoeivrVwiXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInRoXCI6XG4gICAgICAgICAgYiA9IHtcbiAgICAgICAgICAgIGtleTogXCJ0aFwiLFxuICAgICAgICAgICAgdmFsdWU6IFwi5rOw6K+tXCJcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gYlxuICAgIH0sXG4gICAgZ2V0VmlkZW9TcmM6IGZ1bmN0aW9uKGEsIGIsIGMsIGQsIGUsIGYsIGcpIHtcbiAgICAgIHZhciBoID0gYy5zdHJlYW1bYV0sXG4gICAgICAgIGkgPSBjLnZpZGVvLmVuY29kZWlkO1xuICAgICAgaWYgKCFpIHx8ICFkKVxuICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgIHZhciBqID0ge1xuICAgICAgICAgIGZsdjogMCxcbiAgICAgICAgICBmbHZoZDogMCxcbiAgICAgICAgICBtcDQ6IDEsXG4gICAgICAgICAgaGQyOiAyLFxuICAgICAgICAgIFwiM2dwaGRcIjogMSxcbiAgICAgICAgICBcIjNncFwiOiAwXG4gICAgICAgIH0sXG4gICAgICAgIGsgPSBqW2RdLFxuICAgICAgICBsID0ge1xuICAgICAgICAgIGZsdjogXCJmbHZcIixcbiAgICAgICAgICBtcDQ6IFwibXA0XCIsXG4gICAgICAgICAgaGQyOiBcImZsdlwiLFxuICAgICAgICAgIG1wNGhkOiBcIm1wNFwiLFxuICAgICAgICAgIG1wNGhkMjogXCJtcDRcIixcbiAgICAgICAgICBcIjNncGhkXCI6IFwibXA0XCIsXG4gICAgICAgICAgXCIzZ3BcIjogXCJmbHZcIixcbiAgICAgICAgICBmbHZoZDogXCJmbHZcIlxuICAgICAgICB9LFxuICAgICAgICBtID0gbFtkXSxcbiAgICAgICAgbiA9IGIudG9TdHJpbmcoMTYpO1xuICAgICAgMSA9PSBuLmxlbmd0aCAmJiAobiA9IFwiMFwiICsgbik7XG4gICAgICB2YXIgbyA9IGguc2Vnc1tiXS50b3RhbF9taWxsaXNlY29uZHNfdmlkZW8gLyAxZTMsXG4gICAgICAgIHAgPSBoLnNlZ3NbYl0ua2V5O1xuICAgICAgKFwiXCIgPT0gcCB8fCAtMSA9PSBwKSAmJiAocCA9IGgua2V5MiArIGgua2V5MSk7XG4gICAgICB2YXIgcSA9IFwiXCI7XG4gICAgICBjLnNob3cgJiYgKHEgPSBjLnNob3cucGF5ID8gXCImeXByZW1pdW09MVwiIDogXCImeW1vdmllPTFcIik7XG4gICAgICB2YXIgciA9IFwiL3BsYXllci9nZXRGbHZQYXRoL3NpZC9cIiArIHNpZCArIFwiX1wiICsgbiArIFwiL3N0L1wiICsgbSArIFwiL2ZpbGVpZC9cIiArIGUgKyBcIj9LPVwiICsgcCArIFwiJmhkPVwiICsgayArIFwiJm15cD0wJnRzPVwiICsgbyArIFwiJnlwcD0wXCIgKyBxLFxuICAgICAgICBzID0gWzE5LCAxLCA0LCA3LCAzMCwgMTQsIDI4LCA4LCAyNCwgMTcsIDYsIDM1LCAzNCwgMTYsIDksIDEwLCAxMywgMjIsIDMyLCAyOSwgMzEsIDIxLCAxOCwgMywgMiwgMjMsIDI1LCAyNywgMTEsIDIwLCA1LCAxNSwgMTIsIDAsIDMzLCAyNl0sXG4gICAgICAgIHQgPSBlbmNvZGVVUklDb21wb25lbnQoZW5jb2RlNjQoRShGKG1rX2E0ICsgXCJwb3pcIiArIHVzZXJDYWNoZV9hMiwgcykudG9TdHJpbmcoKSwgc2lkICsgXCJfXCIgKyBlICsgXCJfXCIgKyB0b2tlbikpKTtcbiAgICAgIHJldHVybiByICs9IFwiJmVwPVwiICsgdCwgciArPSBcIiZjdHlwZT0xMlwiLCByICs9IFwiJmV2PTFcIiwgciArPSBcIiZ0b2tlbj1cIiArIHRva2VuLCByICs9IFwiJm9pcD1cIiArIHRoaXMuX2lwLCByICs9IChmID8gXCIvcGFzc3dvcmQvXCIgKyBmIDogXCJcIikgKyAoZyA/IGcgOiBcIlwiKSwgciA9IFwiaHR0cDovL2sueW91a3UuY29tXCIgKyByXG4gICAgfVxuICB9O1xuXG4gIGFqYXgoe1xuICAgIHVybDogJ2h0dHA6Ly9wbGF5LnlvdWt1LmNvbS9wbGF5L2dldC5qc29uP3ZpZD0nICsgX2lkICsgJyZjdD0xMicsXG4gICAganNvbnA6IHRydWUsXG4gICAgY2FsbGJhY2s6IGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgaWYocGFyYW0gPT0gLTEpIHtcbiAgICAgICAgbG9nKCfop6PmnpB5b3VrdeinhumikeWcsOWdgOWksei0pScsIDIpXG4gICAgICB9XG4gICAgICBycyA9IHBhcmFtO1xuICAgICAgdmFyIGEgPSBwYXJhbS5kYXRhLFxuICAgICAgICBjID0gRShGKG1rX2EzICsgXCJvMGJcIiArIHVzZXJDYWNoZV9hMSwgWzE5LCAxLCA0LCA3LCAzMCwgMTQsIDI4LCA4LCAyNCxcbiAgICAgICAgICAxNywgNiwgMzUsIDM0LCAxNiwgOSwgMTAsIDEzLCAyMiwgMzIsIDI5LCAzMSwgMjEsIDE4LCAzLCAyLCAyMywgMjUsIDI3LCAxMSwgMjAsIDUsIDE1LCAxMiwgMCwgMzMsIDI2XG4gICAgICAgIF0pLnRvU3RyaW5nKCksIGRlY29kZTY0KGEuc2VjdXJpdHkuZW5jcnlwdF9zdHJpbmcpKTtcbiAgICAgIGMgICAgID0gYy5zcGxpdChcIl9cIik7XG4gICAgICBzaWQgICA9IGNbMF07XG4gICAgICB0b2tlbiA9IGNbMV07XG4gICAgICBpZiAoIGNhblBsYXlNM1U4ICYmIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZignUGxheVN0YXRpb24nKSA9PT0gLTEgKSB7XG4gICAgICAgIHZhciBlcCAgPSBlbmNvZGVVUklDb21wb25lbnQoRChFKEYobWtfYTQgKyBcInBvelwiICsgdXNlckNhY2hlX2EyLCBbMTksIDEsIDQsIDcsIDMwLCAxNCwgMjgsIDgsIDI0LCAxNywgNiwgMzUsIDM0LCAxNiwgOSwgMTAsIDEzLCAyMiwgMzIsIDI5LCAzMSwgMjEsIDE4LCAzLCAyLCAyMywgMjUsIDI3LCAxMSwgMjAsIDUsIDE1LCAxMiwgMCwgMzMsIDI2XSkudG9TdHJpbmcoKSwgc2lkICsgXCJfXCIgKyBfaWQgKyBcIl9cIiArIHRva2VuKSkpO1xuICAgICAgICB2YXIgb2lwID0gYS5zZWN1cml0eS5pcDtcbiAgICAgICAgdmFyIHNvdXJjZSA9IFtcbiAgICAgICAgICBbJ+i2hea4hScsICdodHRwOi8vcGwueW91a3UuY29tL3BsYXlsaXN0L20zdTg/dmlkPScrX2lkKycmdHlwZT1oZDImY3R5cGU9MTIma2V5ZnJhbWU9MSZlcD0nK2VwKycmc2lkPScrc2lkKycmdG9rZW49Jyt0b2tlbisnJmV2PTEmb2lwPScrb2lwXSxcbiAgICAgICAgICBbJ+mrmOa4hScsICdodHRwOi8vcGwueW91a3UuY29tL3BsYXlsaXN0L20zdTg/dmlkPScrX2lkKycmdHlwZT1tcDQmY3R5cGU9MTIma2V5ZnJhbWU9MSZlcD0nK2VwKycmc2lkPScrc2lkKycmdG9rZW49Jyt0b2tlbisnJmV2PTEmb2lwPScrb2lwXSxcbiAgICAgICAgICBbJ+agh+a4hScsICdodHRwOi8vcGwueW91a3UuY29tL3BsYXlsaXN0L20zdTg/dmlkPScrX2lkKycmdHlwZT1mbHYmY3R5cGU9MTIma2V5ZnJhbWU9MSZlcD0nK2VwKycmc2lkPScrc2lkKycmdG9rZW49Jyt0b2tlbisnJmV2PTEmb2lwPScrb2lwXVxuICAgICAgICBdO1xuICAgICAgICBsb2coJ+ino+aekHlvdWt16KeG6aKR5Zyw5Z2A5oiQ5YqfICcgKyBzb3VyY2UubWFwKGZ1bmN0aW9uIChpdGVtKSB7cmV0dXJuICc8YSBocmVmPScraXRlbVsxXSsnPicraXRlbVswXSsnPC9hPid9KS5qb2luKCcgJyksIDIpXG4gICAgICAgIGNhbGxiYWNrKHNvdXJjZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgdCA9IG5ldyBQbGF5TGlzdERhdGEoYSwgYS5zdHJlYW0sICdtcDQnKVxuICAgICAgICB2YXIgc291cmNlID0gW1xuICAgICAgICAgIFsn5qCH5riFJywgdC5fdmlkZW9TZWdzRGljLnN0cmVhbXNbJ2d1b3l1J11bJzNncGhkJ11bMF0uc3JjXVxuICAgICAgICBdO1xuICAgICAgICBsb2coJ+ino+aekHlvdWt16KeG6aKR5Zyw5Z2A5oiQ5YqfICcgKyBzb3VyY2UubWFwKGZ1bmN0aW9uIChpdGVtKSB7cmV0dXJuICc8YSBocmVmPScraXRlbVsxXSsnPicraXRlbVswXSsnPC9hPid9KS5qb2luKCcgJyksIDIpXG4gICAgICAgIGNhbGxiYWNrKHNvdXJjZSk7XG4gICAgICB9XG4gICAgfVxuICB9KVxufVxuZXhwb3J0cy5nZXRWaWRlb3MgPSBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaykge1xuICBwYXJzZVlvdWt1Q29kZSh3aW5kb3cudmlkZW9JZCwgY2FsbGJhY2spXG59IiwibW9kdWxlLmV4cG9ydHMgPSBbXG4gIHJlcXVpcmUoJy4vc2Vla2VyX2JpbGliaWxpJyksXG4gIHJlcXVpcmUoJy4vc2Vla2VyX3lvdWt1JyksXG4gIHJlcXVpcmUoJy4vc2Vla2VyX3R1ZG91JyksXG4gIHJlcXVpcmUoJy4vc2Vla2VyX2lxaXlpJyksXG4gIHJlcXVpcmUoJy4vc2Vla2VyX2h1bmFudHYnKSxcbiAgcmVxdWlyZSgnLi9zZWVrZXJfOTFwb3JuJylcbiAgLy8gLHJlcXVpcmUoJy4vc2Vla2VyX2V4YW1wbGUnKVxuXVxuIl19
