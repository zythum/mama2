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

    var httpProxyOpts = {text: true, ua: 'Mozilla/5.0 (iPad; CPU iPhone OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B410 Safari/600.1.4'}

    httpProxy(location.href, 'get', {}, function(rs) {
        var m = rs.match(/<script[^>]*>\s*(eval.*;)\s*(?=<\/script>)<\/script>/)
        window.__qlt = window.__qlt || {MAMA2PlaceHolder: true}
        window.QP = window.QP || {}
        window.QP._ready = function (e) {if(this._isReady){e&&e()}else{e&&this._waits.push(e)}}
        eval(m[1])
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
                if (rs.data.m3utx.length > 0) source.push(['\u9ad8\u6e05', rs.data.m3utx])
                if (rs.data.m3u.length > 0) source.push(['\u6807\u6e05', rs.data.m3u])
                callback(source)
            }
        })
    }, httpProxyOpts)
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

},{"./seeker_91porn":15,"./seeker_bilibili":16,"./seeker_hunantv":18,"./seeker_iqiyi":19,"./seeker_tudou":20,"./seeker_youku":21}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvYWpheC5qcyIsInNyYy9jYW5QbGF5TTNVOC5qcyIsInNyYy9jcmVhdGVFbGVtZW50LmpzIiwic3JjL2ZsYXNoQmxvY2tlci5qcyIsInNyYy9nZXRDb29raWUuanMiLCJzcmMvaHR0cFByb3h5LmpzIiwic3JjL2pzb25wLmpzIiwic3JjL2xvZy5qcyIsInNyYy9tYW1hS2V5LmpzIiwic3JjL25vb3AuanMiLCJzcmMvcGxheWVyLmpzIiwic3JjL3B1cmwuanMiLCJzcmMvcXVlcnlTdHJpbmcuanMiLCJzcmMvc2Vla2VyXzkxcG9ybi5qcyIsInNyYy9zZWVrZXJfYmlsaWJpbGkuanMiLCJzcmMvc2Vla2VyX2ZsdnNwLmpzIiwic3JjL3NlZWtlcl9odW5hbnR2LmpzIiwic3JjL3NlZWtlcl9pcWl5aS5qcyIsInNyYy9zZWVrZXJfdHVkb3UuanMiLCJzcmMvc2Vla2VyX3lvdWt1LmpzIiwic3JjL3NlZWtlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBmbGFzaEJsb2NrZXIgID0gcmVxdWlyZSgnLi9mbGFzaEJsb2NrZXInKVxudmFyIGNyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKCcuL2NyZWF0ZUVsZW1lbnQnKVxudmFyIE1BTUFQbGF5ZXIgICAgPSByZXF1aXJlKCcuL3BsYXllcicpXG52YXIgbG9nICAgICAgICAgICA9IHJlcXVpcmUoJy4vbG9nJylcbnZhciBwdXJsICAgICAgICAgID0gcmVxdWlyZSgnLi9wdXJsJylcbnZhciBtYW1hS2V5ICAgICAgID0gcmVxdWlyZSgnLi9tYW1hS2V5JylcbnZhciBzZWVrZXJzICAgICAgID0gcmVxdWlyZSgnLi9zZWVrZXJzJylcbnZhciBmbHZzcCAgICAgICAgID0gcmVxdWlyZSgnLi9zZWVrZXJfZmx2c3AnKTtcbnZhciBtYXRjaGVkXG5cbmlmICh3aW5kb3dbbWFtYUtleV0gIT0gdHJ1ZSkge1xuXG5mdW5jdGlvbiBzZWVrZWQgKHNvdXJjZSwgY29tbWVudHMpIHtcbiAgaWYgKCFzb3VyY2UpIHtcbiAgICBsb2coJ+ino+aekOWGheWuueWcsOWdgOWksei0pScsIDIpXG4gICAgZGVsZXRlIHdpbmRvd1ttYW1hS2V5XVxuICAgIHJldHVyblxuICB9IFxuICBsb2coJ+ino+aekOWGheWuueWcsOWdgOWujOaIkCcrc291cmNlLm1hcChmdW5jdGlvbiAoaSkge3JldHVybiAnPGEgaHJlZj1cIicraVsxXSsnXCIgdGFyZ2V0PVwiX2JsYW5rXCI+JytpWzBdKyc8L2E+J30pLmpvaW4oJyAnKSwgMilcbiAgdmFyIG1hc2sgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgYXBwZW5kVG86IGRvY3VtZW50LmJvZHksXG4gICAgc3R5bGU6IHtcbiAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgYmFja2dyb3VuZDogJ3JnYmEoMCwwLDAsMC44KScsXG4gICAgICB0b3A6ICcwJyxcbiAgICAgIGxlZnQ6ICcwJyxcbiAgICAgIHdpZHRoOiAnMTAwJScsXG4gICAgICBoZWlnaHQ6ICcxMDAlJyxcbiAgICAgIHpJbmRleDogJzk5OTk5OSdcbiAgICB9XG4gIH0pXG4gIGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICBhcHBlbmRUbzogbWFzayxcbiAgICBzdHlsZToge1xuICAgICAgd2lkdGg6ICcxMDAwcHgnLFxuICAgICAgaGVpZ2h0OiAnNTAwcHgnLFxuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICB0b3A6ICc1MCUnLFxuICAgICAgbGVmdDogJzUwJScsXG4gICAgICBtYXJnaW5Ub3A6ICctMjUwcHgnLFxuICAgICAgbWFyZ2luTGVmdDogJy01MDBweCcsXG4gICAgICBib3JkZXJSYWRpdXM6ICcycHgnLFxuICAgICAgYm94U2hhZG93OiAnMCAwIDJweCAjMDAwMDAwLCAwIDAgMjAwcHggIzAwMDAwMCcsXG4gICAgfVxuICB9KVxuICBjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgYXBwZW5kVG86IG1hc2ssXG4gICAgaW5uZXJIVE1MOiAnPGEgc3R5bGU9XCJjb2xvcjojNTU1NTU1O1wiIGhyZWY9XCJodHRwOi8venl0aHVtLnNpbmFhcHAuY29tL21hbWEyL1wiIHRhcmdldD1cIl9ibGFua1wiPk1BTUEyOiDlpojlpojlho3kuZ/kuI3nlKjmi4Xlv4PmiJHnmoQgTWFjQm9vayDlj5Hng63orqHliJI8L2E+JyxcbiAgICBzdHlsZToge1xuICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICBib3R0b206ICcxMHB4JyxcbiAgICAgIGxlZnQ6ICcwJyxcbiAgICAgIHJpZ2h0OiAnMCcsXG4gICAgICBoZWlnaHQ6ICcyMHB4JyxcbiAgICAgIGxpbmVIZWlnaHQ6ICcyMHB4JyxcbiAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICBmb250U2l6ZTonMTJweCcsXG4gICAgICBmb250RmFtaWx5OiAnYXJpYWwsIHNhbnMtc2VyaWYnXG4gICAgfVxuICB9KVxuICB2YXIgY29udGFpbmVyID0gY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgIGFwcGVuZFRvOiBtYXNrLFxuICAgIGlubmVySFRNTDogJzxkaXYgaWQ9XCJNQU1BMl92aWRlb19wbGFjZUhvbGRlclwiPjwvZGl2PicsXG4gICAgc3R5bGU6IHtcbiAgICAgIHdpZHRoOiAnMTAwMHB4JyxcbiAgICAgIGhlaWdodDogJzUwMHB4JyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzAwMDAwMCcsXG4gICAgICB0b3A6ICc1MCUnLFxuICAgICAgbGVmdDogJzUwJScsXG4gICAgICBtYXJnaW5Ub3A6ICctMjUwcHgnLFxuICAgICAgbWFyZ2luTGVmdDogJy01MDBweCcsXG4gICAgICBib3JkZXJSYWRpdXM6ICcycHgnLFxuICAgICAgb3ZlcmZsb3c6ICdoaWRkZW4nXG4gICAgfVxuICB9KVxuICBjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgYXBwZW5kVG86IGNvbnRhaW5lcixcbiAgICBpbm5lckhUTUw6ICcmdGltZXM7JyxcbiAgICBzdHlsZToge1xuICAgICAgd2lkdGg6ICcyMHB4JyxcbiAgICAgIGhlaWdodDogJzIwcHgnLFxuICAgICAgbGluZUhlaWdodDogJzIwcHgnLFxuICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgIGZvbnRTaXplOiAnMjBweCcsXG4gICAgICB0b3A6ICc1cHgnLFxuICAgICAgcmlnaHQ6ICc1cHgnLFxuICAgICAgdGV4dFNoYWRvdzogJzAgMCAycHggIzAwMDAwMCcsXG4gICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgICBmb250RmFtaWx5OiAnR2FyYW1vbmQsIFwiQXBwbGUgR2FyYW1vbmRcIicsXG4gICAgICBjdXJzb3I6ICdwb2ludGVyJ1xuICAgIH1cbiAgfSkub25jbGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKG1hc2spXG4gICAgcGxheWVyLnZpZGVvLnNyYyA9ICdhYm91dDpibGFuaydcbiAgICBkZWxldGUgd2luZG93W21hbWFLZXldXG4gIH1cbiAgdmFyIHBsYXllciA9IG5ldyBNQU1BUGxheWVyKCdNQU1BMl92aWRlb19wbGFjZUhvbGRlcicsICcxMDAweDUwMCcsIHNvdXJjZSwgY29tbWVudHMpXG4gIHBsYXllci5pZnJhbWUuY29udGVudFdpbmRvdy5mb2N1cygpXG4gIGZsYXNoQmxvY2tlcigpXG4gIHBsYXllci5pZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcbiAgd2luZG93W21hbWFLZXldID0gdHJ1ZVxufVxuXG52YXIgdXJsID0gcHVybChsb2NhdGlvbi5ocmVmKVxuaWYgKHVybC5hdHRyKCdob3N0JykgPT09ICd6eXRodW0uc2luYWFwcC5jb20nICYmIFxuICB1cmwuYXR0cignZGlyZWN0b3J5JykgPT09ICcvbWFtYTIvcHM0LycgJiYgdXJsLnBhcmFtKCd1cmwnKSApIHtcbiAgdXJsID0gcHVybCh1cmwucGFyYW0oJ3VybCcpKVxufVxuXG5zZWVrZXJzLmZvckVhY2goZnVuY3Rpb24gKHNlZWtlcikge1xuICBpZiAobWF0Y2hlZCA9PT0gdHJ1ZSkgcmV0dXJuXG4gIGlmICghIXNlZWtlci5tYXRjaCh1cmwpID09PSB0cnVlKSB7XG4gICAgbG9nKCflvIDlp4vop6PmnpDlhoXlrrnlnLDlnYAnKVxuICAgIG1hdGNoZWQgPSB0cnVlXG4gICAgc2Vla2VyLmdldFZpZGVvcyh1cmwsIHNlZWtlZCkgICBcbiAgfVxufSlcblxuaWYgKG1hdGNoZWQgPT09IHVuZGVmaW5lZCkge1xuICBsb2coJ+WwneivleS9v+eUqDxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCJodHRwOi8vd2VpYm8uY29tL2p1c3Rhc2hpdFwiPuS4gOeOr+WQjOWtpjwvYT7mj5DkvpvnmoTop6PmnpDmnI3liqEnLCAyKVxuICBmbHZzcC5nZXRWaWRlb3ModXJsLCBzZWVrZWQpXG59XG5cbn0iLCIvKiAg77yDZnVuY3Rpb24gYWpheCNcbiAqICA8IHtcbiAqICAgIHVybDogICAgICAgICAgU3RyaW5nICAg6K+35rGC5Zyw5Z2AXG4gKiAgICBwYXJhbTogICAgICAgIE9iamVjdCAgIOivt+axguWPguaVsC7lj6/nvLrnnIFcbiAqICAgIG1ldGhvZDogICAgICAgU3RyaW5nICAg6K+35rGC5pa55rOVR0VULFBPU1QsZXRjLiDlj6/nvLrnnIHvvIzpu5jorqTmmK9HRVQgXG4gKiAgICBjYWxsYmFjazogICAgIEZ1bmN0aW9uIOivt+axgueahGNhbGxiYWNrLCDlpoLmnpzlpLHotKXov5Tlm57vvI0x77yMIOaIkOWKn+i/lOWbnuWGheWuuVxuICogICAgY29udGVudFR5cGU6ICBTdHJpbmcgICDov5Tlm57lhoXlrrnnmoTmoLzlvI/jgILlpoLmnpzmmK9KT1NO5Lya5YGaSlNPTiBQYXJzZe+8jCDlj6/nvLrnnIEs6buY6K6k5pivanNvblxuICogICAgY29udGV4dDogICAgICBBbnkgICAgICBjYWxsYmFja+Wbnuiwg+WHveaVsOeahHRoaXPmjIflkJHjgILlj6/nvLrnnIFcbiAqICB9XG4gKiAg55So5LqO5Y+R6LW3YWpheOaIluiAhWpzb25w6K+35rGCXG4gKi9cblxudmFyIGpzb25wICAgICAgID0gcmVxdWlyZSgnLi9qc29ucCcpXG52YXIgbm9vcCAgICAgICAgPSByZXF1aXJlKCcuL25vb3AnKVxudmFyIHF1ZXJ5U3RyaW5nID0gcmVxdWlyZSgnLi9xdWVyeVN0cmluZycpXG5cbmZ1bmN0aW9uIGRlZmFsdXRPcHRpb24gKG9wdGlvbiwgZGVmYWx1dFZhbHVlKSB7XG4gIHJldHVybiBvcHRpb24gPT09IHVuZGVmaW5lZCA/IGRlZmFsdXRWYWx1ZSA6IG9wdGlvblxufVxuXG5mdW5jdGlvbiBxdWVyeVN0cmluZyAob2JqKSB7XG4gIHZhciBxdWVyeSA9IFtdXG4gIGZvciAob25lIGluIG9iaikge1xuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkob25lKSkge1xuICAgICAgcXVlcnkucHVzaChbb25lLCBvYmpbb25lXV0uam9pbignPScpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gcXVlcnkuam9pbignJicpXG59XG5cbmZ1bmN0aW9uIGpvaW5VcmwgKHVybCwgcXVlcnlTdHJpbmcpIHtcbiAgaWYgKHF1ZXJ5U3RyaW5nLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHVybFxuICByZXR1cm4gdXJsICsgKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHF1ZXJ5U3RyaW5nXG59XG5cbmZ1bmN0aW9uIGFqYXggKG9wdGlvbnMpIHtcbiAgdmFyIHVybCAgICAgICAgID0gZGVmYWx1dE9wdGlvbihvcHRpb25zLnVybCwgJycpXG4gIHZhciBxdWVyeSAgICAgICA9IHF1ZXJ5U3RyaW5nKCBkZWZhbHV0T3B0aW9uKG9wdGlvbnMucGFyYW0sIHt9KSApXG4gIHZhciBtZXRob2QgICAgICA9IGRlZmFsdXRPcHRpb24ob3B0aW9ucy5tZXRob2QsICdHRVQnKVxuICB2YXIgY2FsbGJhY2sgICAgPSBkZWZhbHV0T3B0aW9uKG9wdGlvbnMuY2FsbGJhY2ssIG5vb3ApXG4gIHZhciBjb250ZW50VHlwZSA9IGRlZmFsdXRPcHRpb24ob3B0aW9ucy5jb250ZW50VHlwZSwgJ2pzb24nKVxuICB2YXIgY29udGV4dCAgICAgPSBkZWZhbHV0T3B0aW9uKG9wdGlvbnMuY29udGV4dCwgbnVsbClcblxuICBpZiAob3B0aW9ucy5qc29ucCkge1xuICAgIHJldHVybiBqc29ucChcbiAgICAgIGpvaW5VcmwodXJsLCBxdWVyeSksXG4gICAgICBjYWxsYmFjay5iaW5kKGNvbnRleHQpLFxuICAgICAgdHlwZW9mIG9wdGlvbnMuanNvbnAgPT09ICdzdHJpbmcnID8gb3B0aW9ucy5qc29ucCA6IHVuZGVmaW5lZFxuICAgIClcbiAgfVxuXG4gIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuICBpZiAobWV0aG9kLnRvTG93ZXJDYXNlKCkgPT09ICdnZXQnKSB7XG4gICAgdXJsID0gam9pblVybCh1cmwsIHF1ZXJ5KVxuICAgIHF1ZXJ5ID0gJydcbiAgfVxuICB4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSlcbiAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnKVxuICB4aHIuc2VuZChxdWVyeSlcbiAgeGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQgKSB7XG4gICAgICBpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgIHZhciBkYXRhID0geGhyLnJlc3BvbnNlVGV4dFxuICAgICAgICBpZiAoY29udGVudFR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ2pzb24nKSB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpXG4gICAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICBkYXRhID0gLTFcbiAgICAgICAgICB9ICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgZGF0YSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjay5jYWxsKGNvbnRleHQsIC0xKVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSBhamF4O1xuIiwiLyogIO+8g0Jvb2wgY2FuUGxheU0zVTjvvINcbiAqICDov5Tlm57mtY/op4jlmajmmK/lkKbmlK/mjIFtM3U45qC85byP55qE6KeG6aKR5pKt5pS+44CCXG4gKiAg55uu5YmNY2hyb21lLGZpcmVmb3jlj6rmlK/mjIFtcDRcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSAhIWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3ZpZGVvJykuY2FuUGxheVR5cGUoJ2FwcGxpY2F0aW9uL3gtbXBlZ1VSTCcpIiwiLypcbiAqIOeUqOS6jueugOWNleWIm+W7umh0bWzoioLngrlcbiAqL1xuZnVuY3Rpb24gY3JlYXRlRWxlbWVudCAodGFnTmFtZSwgYXR0cmlidXRlcykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnTmFtZSlcbiAgaWYgKCB0eXBlb2YgYXR0cmlidXRlcyA9PT0gJ2Z1bmN0aW9uJyApIHtcbiAgICBhdHRyaWJ1dGVzLmNhbGwoZWxlbWVudClcbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBhdHRyaWJ1dGUgaW4gYXR0cmlidXRlcykge1xuICAgICAgaWYgKCBhdHRyaWJ1dGVzLmhhc093blByb3BlcnR5KGF0dHJpYnV0ZSkgKSB7XG4gICAgICAgIHN3aXRjaCAoYXR0cmlidXRlKSB7XG4gICAgICAgIGNhc2UgJ2FwcGVuZFRvJzpcbiAgICAgICAgICBhdHRyaWJ1dGVzW2F0dHJpYnV0ZV0uYXBwZW5kQ2hpbGQoZWxlbWVudClcbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdpbm5lckhUTUwnOlxuICAgICAgICBjYXNlICdjbGFzc05hbWUnOlxuICAgICAgICBjYXNlICdpZCc6XG4gICAgICAgICAgZWxlbWVudFthdHRyaWJ1dGVdID0gYXR0cmlidXRlc1thdHRyaWJ1dGVdXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnc3R5bGUnOlxuICAgICAgICAgIHZhciBzdHlsZXMgPSBhdHRyaWJ1dGVzW2F0dHJpYnV0ZV1cbiAgICAgICAgICBmb3IgKHZhciBuYW1lIGluIHN0eWxlcylcbiAgICAgICAgICAgIGlmICggc3R5bGVzLmhhc093blByb3BlcnR5KG5hbWUpIClcbiAgICAgICAgICAgICAgZWxlbWVudC5zdHlsZVtuYW1lXSA9IHN0eWxlc1tuYW1lXVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoYXR0cmlidXRlLCBhdHRyaWJ1dGVzW2F0dHJpYnV0ZV0gKyAnJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZWxlbWVudFxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNyZWF0ZUVsZW1lbnQiLCIvKiAgXG4gKiAg55So5LqO5bGP6JS96aG16Z2i5LiK55qE5omA5pyJZmxhc2hcbiAqL1xudmFyIGZsYXNoVGV4dCA9ICc8ZGl2IHN0eWxlPVwidGV4dC1zaGFkb3c6MCAwIDJweCAjZWVlO2xldHRlci1zcGFjaW5nOi0xcHg7YmFja2dyb3VuZDojZWVlO2ZvbnQtd2VpZ2h0OmJvbGQ7cGFkZGluZzowO2ZvbnQtZmFtaWx5OmFyaWFsLHNhbnMtc2VyaWY7Zm9udC1zaXplOjMwcHg7Y29sb3I6I2NjYzt3aWR0aDoxNTJweDtoZWlnaHQ6NTJweDtib3JkZXI6NHB4IHNvbGlkICNjY2M7Ym9yZGVyLXJhZGl1czoxMnB4O3Bvc2l0aW9uOmFic29sdXRlO3RvcDo1MCU7bGVmdDo1MCU7bWFyZ2luOi0zMHB4IDAgMCAtODBweDt0ZXh0LWFsaWduOmNlbnRlcjtsaW5lLWhlaWdodDo1MnB4O1wiPkZsYXNoPC9kaXY+JztcblxudmFyIGNvdW50ID0gMDtcbnZhciBmbGFzaEJsb2NrcyA9IHt9O1xuLy/ngrnlh7vml7bpl7Top6blj5FcbnZhciBjbGljazJTaG93Rmxhc2ggPSBmdW5jdGlvbihlKXtcbiAgdmFyIGluZGV4ID0gdGhpcy5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmxhc2gtaW5kZXgnKTtcbiAgdmFyIGZsYXNoID0gZmxhc2hCbG9ja3NbaW5kZXhdO1xuICBmbGFzaC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZmxhc2gtc2hvdycsJ2lzc2hvdycpO1xuICB0aGlzLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGZsYXNoLCB0aGlzKTtcbiAgdGhpcy5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHRoaXMpO1xuICB0aGlzLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgY2xpY2syU2hvd0ZsYXNoLCBmYWxzZSk7XG59O1xuXG52YXIgY3JlYXRlQVBsYWNlSG9sZGVyID0gZnVuY3Rpb24oZmxhc2gsIHdpZHRoLCBoZWlnaHQpe1xuICB2YXIgaW5kZXggPSBjb3VudCsrO1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5kZWZhdWx0Vmlldy5nZXRDb21wdXRlZFN0eWxlKGZsYXNoLCBudWxsKTtcbiAgdmFyIHBvc2l0aW9uVHlwZSA9IHN0eWxlLnBvc2l0aW9uO1xuICAgIHBvc2l0aW9uVHlwZSA9IHBvc2l0aW9uVHlwZSA9PT0gJ3N0YXRpYycgPyAncmVsYXRpdmUnIDogcG9zaXRpb25UeXBlO1xuICB2YXIgbWFyZ2luICAgICAgID0gc3R5bGVbJ21hcmdpbiddO1xuICB2YXIgZGlzcGxheSAgICAgID0gc3R5bGVbJ2Rpc3BsYXknXSA9PSAnaW5saW5lJyA/ICdpbmxpbmUtYmxvY2snIDogc3R5bGVbJ2Rpc3BsYXknXTtcbiAgdmFyIHN0eWxlID0gW1xuICAgICcnLFxuICAgICd3aWR0aDonICAgICsgd2lkdGggICsncHgnLFxuICAgICdoZWlnaHQ6JyAgICsgaGVpZ2h0ICsncHgnLFxuICAgICdwb3NpdGlvbjonICsgcG9zaXRpb25UeXBlLFxuICAgICdtYXJnaW46JyAgICsgbWFyZ2luLFxuICAgICdkaXNwbGF5OicgICsgZGlzcGxheSxcbiAgICAnbWFyZ2luOjAnLFxuICAgICdwYWRkaW5nOjAnLFxuICAgICdib3JkZXI6MCcsXG4gICAgJ2JvcmRlci1yYWRpdXM6MXB4JyxcbiAgICAnY3Vyc29yOnBvaW50ZXInLFxuICAgICdiYWNrZ3JvdW5kOi13ZWJraXQtbGluZWFyLWdyYWRpZW50KHRvcCwgcmdiYSgyNDAsMjQwLDI0MCwxKTAlLHJnYmEoMjIwLDIyMCwyMjAsMSkxMDAlKScsICAgICBcbiAgICAnJ1xuICBdXG4gIGZsYXNoQmxvY2tzW2luZGV4XSA9IGZsYXNoO1xuICB2YXIgcGxhY2VIb2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgcGxhY2VIb2xkZXIuc2V0QXR0cmlidXRlKCd0aXRsZScsICcmI3g3MEI5OyYjeDYyMTE7JiN4OEZEODsmI3g1MzlGO0ZsYXNoJyk7XG4gIHBsYWNlSG9sZGVyLnNldEF0dHJpYnV0ZSgnZGF0YS1mbGFzaC1pbmRleCcsICcnICsgaW5kZXgpO1xuICBmbGFzaC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShwbGFjZUhvbGRlciwgZmxhc2gpO1xuICBmbGFzaC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGZsYXNoKTtcbiAgcGxhY2VIb2xkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGljazJTaG93Rmxhc2gsIGZhbHNlKTtcbiAgcGxhY2VIb2xkZXIuc3R5bGUuY3NzVGV4dCArPSBzdHlsZS5qb2luKCc7Jyk7XG4gIHBsYWNlSG9sZGVyLmlubmVySFRNTCA9IGZsYXNoVGV4dDtcbiAgcmV0dXJuIHBsYWNlSG9sZGVyO1xufTtcblxudmFyIHBhcnNlRmxhc2ggPSBmdW5jdGlvbih0YXJnZXQpe1xuICBpZih0YXJnZXQgaW5zdGFuY2VvZiBIVE1MT2JqZWN0RWxlbWVudCkge1xuICAgIGlmKHRhcmdldC5pbm5lckhUTUwudHJpbSgpID09ICcnKSByZXR1cm47XG4gICAgaWYodGFyZ2V0LmdldEF0dHJpYnV0ZShcImNsYXNzaWRcIikgJiYgIS9eamF2YTovLnRlc3QodGFyZ2V0LmdldEF0dHJpYnV0ZShcImNsYXNzaWRcIikpKSByZXR1cm47ICAgICAgXG4gIH0gZWxzZSBpZighKHRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbWJlZEVsZW1lbnQpKSByZXR1cm47XG5cbiAgdmFyIHdpZHRoID0gdGFyZ2V0Lm9mZnNldFdpZHRoO1xuICB2YXIgaGVpZ2h0ID0gdGFyZ2V0Lm9mZnNldEhlaWdodDtcblxuICBpZih3aWR0aCA+IDE2MCAmJiBoZWlnaHQgPiA2MCl7XG4gICAgY3JlYXRlQVBsYWNlSG9sZGVyKHRhcmdldCwgd2lkdGgsIGhlaWdodCk7XG4gIH1cbn07XG5cbnZhciBoYW5kbGVCZWZvcmVMb2FkRXZlbnQgPSBmdW5jdGlvbihlKXtcbiAgdmFyIHRhcmdldCA9IGUudGFyZ2V0XG4gIGlmKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmxhc2gtc2hvdycpID09ICdpc3Nob3cnKSByZXR1cm47XG4gIHBhcnNlRmxhc2godGFyZ2V0KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7IFxuICB2YXIgZW1iZWRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2VtYmVkJyk7XG4gIHZhciBvYmplY3RzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ29iamVjdCcpO1xuICBmb3IodmFyIGk9MCxsZW49b2JqZWN0cy5sZW5ndGg7IGk8bGVuOyBpKyspIG9iamVjdHNbaV0gJiYgcGFyc2VGbGFzaChvYmplY3RzW2ldKTtcbiAgZm9yKHZhciBpPTAsbGVuPWVtYmVkcy5sZW5ndGg7IGk8bGVuOyBpKyspICBlbWJlZHNbaV0gJiYgcGFyc2VGbGFzaChlbWJlZHNbaV0pO1xufVxuLy8gZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImJlZm9yZWxvYWRcIiwgaGFuZGxlQmVmb3JlTG9hZEV2ZW50LCB0cnVlKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZ2V0Q29va2llKGNfbmFtZSkge1xuICAgIGlmIChkb2N1bWVudC5jb29raWUubGVuZ3RoID4gMCkge1xuICAgICAgICBjX3N0YXJ0ID0gZG9jdW1lbnQuY29va2llLmluZGV4T2YoY19uYW1lICsgXCI9XCIpXG4gICAgICAgIGlmIChjX3N0YXJ0ICE9IC0xKSB7XG4gICAgICAgICAgICBjX3N0YXJ0ID0gY19zdGFydCArIGNfbmFtZS5sZW5ndGggKyAxXG4gICAgICAgICAgICBjX2VuZCA9IGRvY3VtZW50LmNvb2tpZS5pbmRleE9mKFwiO1wiLCBjX3N0YXJ0KVxuICAgICAgICAgICAgaWYgKGNfZW5kID09IC0xKSBjX2VuZCA9IGRvY3VtZW50LmNvb2tpZS5sZW5ndGhcbiAgICAgICAgICAgIHJldHVybiB1bmVzY2FwZShkb2N1bWVudC5jb29raWUuc3Vic3RyaW5nKGNfc3RhcnQsIGNfZW5kKSlcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gXCJcIlxufSIsIi8qICDvvINmdW5jdGlvbiBodHRwUHJveHkjXG4gKiAgPCBTdHJpbmcgICAgICAgIOivt+axguWcsOWdgFxuICogIDwgU3RyaW5nICAgICAgICDor7fmsYLmlrnms5VHRVQsUE9TVCxldGMuXG4gKiAgPCBPYmplY3QgICAgICAgIOivt+axguWPguaVsFxuICogIDwgRnVuY3Rpb24gICAgICDor7fmsYLnmoRjYWxsYmFjaywg5aaC5p6c5aSx6LSl6L+U5Zue77yNMe+8jCDmiJDlip/ov5Tlm57lhoXlrrlcbiAqICA8IHtcbiAqICAgICAgeG1sOiAgICAgICBCb29sICAg5piv5ZCm6ZyA6KaB5YGaeG1sMmpzb24g5Y+v57y655yBLCDpu5jorqRmYXNsZVxuICogICAgICBnemluZmxhdGU6IEJvb2wgICDmmK/lkKbpnIDopoHlgZpnemluZmxhdGUg5Y+v57y655yBLCDpu5jorqRmYXNsZVxuICogICAgICBjb250ZXh0OiAgIEFueSAgICBjYWxsYmFja+Wbnuiwg+eahHRoaXPmjIflkJEg5Y+v57y655yBXG4gKiAgICB9XG4gKiAgfVxuICogIOeUqOS6juWPkei1t+i3qOWfn+eahGFqYXjor7fmsYLjgILml6LmjqXlj6Pov5Tlm57ot6jln5/lj4jkuI3mlK/mjIFqc29ucOWNj+iurueahFxuICovXG5cbnZhciBjcmVhdGVFbGVtZW50ID0gcmVxdWlyZSgnLi9jcmVhdGVFbGVtZW50JylcbnZhciBhamF4ICAgICAgICAgID0gcmVxdWlyZSgnLi9hamF4JylcbnZhciBxdWVyeVN0cmluZyAgID0gcmVxdWlyZSgnLi9xdWVyeVN0cmluZycpXG5cbnZhciBwcm94eVVybCA9ICdodHRwOi8venl0aHVtLnNpbmFhcHAuY29tL21hbWEyL3Byb3h5LnBocCdcblxuZnVuY3Rpb24gaHR0cFByb3h5ICh1cmwsIHR5cGUsIHBhcmFtcywgY2FsbGJhY2ssIG9wdHMpIHtcbiAgb3B0cyA9IG9wdHMgfHwge31cbiAgYWpheCh7XG4gICAgdXJsOiBwcm94eVVybCxcbiAgICBwYXJhbSA6IHtcbiAgICAgIHBhcmFtczogZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5U3RyaW5nKHBhcmFtcykpLC8v5LiK6KGM5Y+C5pWwXG4gICAgICByZWZlcnJlcjogb3B0cy5yZWZlcnJlciB8fCBsb2NhdGlvbi5ocmVmLFxuICAgICAgdXJsOiBlbmNvZGVVUklDb21wb25lbnQodXJsKSxcbiAgICAgIHBvc3Q6IHR5cGUgPT09ICdwb3N0JyA/IDEgOiAwLFxuICAgICAgeG1sOiBvcHRzLnhtbCA/IDEgOiAwLFxuICAgICAgdGV4dDogb3B0cy50ZXh0ID8gMSA6IDAsXG4gICAgICBnemluZmxhdGU6IG9wdHMuZ3ppbmZsYXRlID8gMSA6IDAsXG4gICAgICB1YTogb3B0cy51YSB8fCBuYXZpZ2F0b3IudXNlckFnZW50XG4gICAgfSxcbiAgICBqc29ucDogdHJ1ZSxcbiAgICBjYWxsYmFjazogY2FsbGJhY2ssXG4gICAgY29udGV4dDogb3B0cy5jb250ZXh0XG4gIH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0gaHR0cFByb3h5IiwiLyogIO+8g2Z1bmN0aW9uIGpzb25wI1xuICogIGpzb25w5pa55rOV44CC5o6o6I2Q5L2/55SoYWpheOaWueazleOAgmFqYXjljIXlkKvkuoZqc29ucFxuICovXG52YXIgY3JlYXRlRWxlbWVudCA9IHJlcXVpcmUoJy4vY3JlYXRlRWxlbWVudCcpXG52YXIgbm9vcCAgICAgICAgICA9IHJlcXVpcmUoJy4vbm9vcCcpXG5cbnZhciBjYWxsYmFja1ByZWZpeCA9ICdNQU1BMl9IVFRQX0pTT05QX0NBTExCQUNLJ1xudmFyIGNhbGxiYWNrQ291bnQgID0gMFxudmFyIHRpbWVvdXREZWxheSAgID0gMTAwMDBcblxuZnVuY3Rpb24gY2FsbGJhY2tIYW5kbGUgKCkge1xuICByZXR1cm4gY2FsbGJhY2tQcmVmaXggKyBjYWxsYmFja0NvdW50Kytcbn1cblxuZnVuY3Rpb24ganNvbnAgKHVybCwgY2FsbGJhY2ssIGNhbGxiYWNrS2V5KSB7XG5cbiAgY2FsbGJhY2tLZXkgPSBjYWxsYmFja0tleSB8fCAnY2FsbGJhY2snXG5cbiAgdmFyIF9jYWxsYmFja0hhbmRsZSA9IGNhbGxiYWNrSGFuZGxlKCkgIFxuICB3aW5kb3dbX2NhbGxiYWNrSGFuZGxlXSA9IGZ1bmN0aW9uIChycykge1xuICAgIGNsZWFyVGltZW91dCh0aW1lb3V0VGltZXIpXG4gICAgd2luZG93W19jYWxsYmFja0hhbmRsZV0gPSBub29wXG4gICAgY2FsbGJhY2socnMpXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChzY3JpcHQpXG4gIH1cbiAgdmFyIHRpbWVvdXRUaW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgIHdpbmRvd1tfY2FsbGJhY2tIYW5kbGVdKC0xKVxuICB9LCB0aW1lb3V0RGVsYXkpXG5cbiAgdmFyIHNjcmlwdCA9IGNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcsIHtcbiAgICBhcHBlbmRUbzogZG9jdW1lbnQuYm9keSxcbiAgICBzcmM6IHVybCArICh1cmwuaW5kZXhPZignPycpID49IDAgPyAnJicgOiAnPycpICsgY2FsbGJhY2tLZXkgKyAnPScgKyBfY2FsbGJhY2tIYW5kbGVcbiAgfSlcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBqc29ucCIsIi8qICDvvINmdW5jdGlvbiBsb2fvvINcbiAqICA8IFN0cmluZ1xuICogIGxvZywg5Lya5Zyo6aG16Z2i5ZKMY29uc29sZeS4rei+k+WHumxvZ1xuICovXG5cbnZhciBjcmVhdGVFbGVtZW50ID0gcmVxdWlyZSgnLi9jcmVhdGVFbGVtZW50JylcbnZhciBNQU1BTG9nRE9NXG52YXIgbG9nVGltZXJcbnZhciBsb2dEZWxheSA9IDEwMDAwXG5cbmZ1bmN0aW9uIGxvZyAobXNnLCBkZWxheSkge1xuICBpZiAoIE1BTUFMb2dET00gPT09IHVuZGVmaW5lZCApIHtcbiAgICBNQU1BTG9nRE9NID0gY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgICAgc3R5bGU6IHtcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzI0MjcyQScsXG4gICAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICB6SW5kZXg6ICcxMDAwMDAwJyxcbiAgICAgICAgdG9wOiAnMCcsXG4gICAgICAgIGxlZnQ6ICcwJyxcbiAgICAgICAgcGFkZGluZzogJzVweCAxMHB4JyxcbiAgICAgICAgZm9udFNpemU6ICcxNHB4J1xuICAgICAgfVxuICAgIH0pXG4gIH1cbiAgY2xlYXJUaW1lb3V0KGxvZ1RpbWVyKVxuICBcbiAgTUFNQUxvZ0RPTS5pbm5lckhUTUwgPSAnPHNwYW4gc3R5bGU9XCJjb2xvcjojREY2NTU4XCI+TUFNQTIgJmd0Ozwvc3Bhbj4gJyArIG1zZ1xuICBjb25zb2xlICYmIGNvbnNvbGUubG9nICYmIGNvbnNvbGUubG9nKCclYyBNQU1BMiAlYyAlcycsICdiYWNrZ3JvdW5kOiMyNDI3MkE7IGNvbG9yOiNmZmZmZmYnLCAnJywgbXNnKVxuXG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoTUFNQUxvZ0RPTSlcbiAgbG9nVGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKE1BTUFMb2dET00pXG4gIH0sIGRlbGF5KjEwMDAgfHwgbG9nRGVsYXkpXG59XG5tb2R1bGUuZXhwb3J0cyA9IGxvZyIsIi8v5aaI5aaI6K6h5YiS5ZSv5LiA5YC8XG5tb2R1bGUuZXhwb3J0cyA9ICdNQU1BS0VZX+eUsOeQtOaYr+i/meS4quS4lueVjOS4iuacgOWPr+eIseeahOWls+WtqeWtkOWRteWRteWRteWRte+8jOaIkeimgeiuqeWFqOS4lueVjOmDveWcqOefpemBkyciLCIvL+epuuaWueazlVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7fSIsInZhciBNQU1BUGxheWVyO1xuXG4vLyBNQU1BUGxheWVyIFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL3p5dGh1bS9tYW1hcGxheWVyXG4hZnVuY3Rpb24gZSh0LGksbil7ZnVuY3Rpb24gbyhyLGEpe2lmKCFpW3JdKXtpZighdFtyXSl7dmFyIGw9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighYSYmbClyZXR1cm4gbChyLCEwKTtpZihzKXJldHVybiBzKHIsITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrcitcIidcIil9dmFyIGM9aVtyXT17ZXhwb3J0czp7fX07dFtyXVswXS5jYWxsKGMuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgaT10W3JdWzFdW2VdO3JldHVybiBvKGk/aTplKX0sYyxjLmV4cG9ydHMsZSx0LGksbil9cmV0dXJuIGlbcl0uZXhwb3J0c31mb3IodmFyIHM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxyPTA7cjxuLmxlbmd0aDtyKyspbyhuW3JdKTtyZXR1cm4gb30oezE6W2Z1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gaShlKXtmb3IodmFyIHQ9W10saT0xO2k8YXJndW1lbnRzLmxlbmd0aDtpKyspe3ZhciBvPWFyZ3VtZW50c1tpXSxzPW8uaW5pdDt0LnB1c2gocyksZGVsZXRlIG8uaW5pdCxuKGUucHJvdG90eXBlLG8pfWUucHJvdG90eXBlLmluaXQ9ZnVuY3Rpb24oKXt0LmZvckVhY2goZnVuY3Rpb24oZSl7ZS5jYWxsKHRoaXMpfS5iaW5kKHRoaXMpKX19dmFyIG49ZShcIi4vZXh0ZW5kXCIpO3QuZXhwb3J0cz1pfSx7XCIuL2V4dGVuZFwiOjl9XSwyOltmdW5jdGlvbihlLHQpe3ZhciBpPWUoXCIuL3BsYXllci5jc3NcIiksbj1lKFwiLi9wbGF5ZXIuaHRtbFwiKSxvPShlKFwiLi9leHRlbmRcIiksZShcIi4vY3JlYXRlRWxlbWVudFwiKSkscz1lKFwiLi9wYXJzZURPTUJ5Q2xhc3NOYW1lc1wiKTt0LmV4cG9ydHM9e2luaXQ6ZnVuY3Rpb24oKXt2YXIgZT1mdW5jdGlvbigpe3ZhciBlPXRoaXMuaWZyYW1lLmNvbnRlbnREb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0sdD10aGlzLmlmcmFtZS5jb250ZW50RG9jdW1lbnQuYm9keTtvKFwic3R5bGVcIixmdW5jdGlvbigpe2UuYXBwZW5kQ2hpbGQodGhpcyk7dHJ5e3RoaXMuc3R5bGVTaGVldC5jc3NUZXh0PWl9Y2F0Y2godCl7dGhpcy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShpKSl9fSksbyhcImxpbmtcIix7YXBwZW5kVG86ZSxocmVmOlwiaHR0cDovL2xpYnMuY25jZG4uY24vZm9udC1hd2Vzb21lLzQuMy4wL2Nzcy9mb250LWF3ZXNvbWUubWluLmNzc1wiLHJlbDpcInN0eWxlc2hlZXRcIix0eXBlOlwidGV4dC9jc3NcIn0pLHQuaW5uZXJIVE1MPW4sdGhpcy5ET01zPXModCxbXCJwbGF5ZXJcIixcInZpZGVvXCIsXCJ2aWRlby1mcmFtZVwiLFwiY29tbWVudHNcIixcImNvbW1lbnRzLWJ0blwiLFwicGxheVwiLFwicHJvZ3Jlc3NfYW5jaG9yXCIsXCJidWZmZXJlZF9hbmNob3JcIixcImZ1bGxzY3JlZW5cIixcImFsbHNjcmVlblwiLFwiaGRcIixcInZvbHVtZV9hbmNob3JcIixcImN1cnJlbnRcIixcImR1cmF0aW9uXCJdKSx0aGlzLnZpZGVvPXRoaXMuRE9Ncy52aWRlb30uYmluZCh0aGlzKSx0PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuaWQpLHI9dGhpcy5pZnJhbWU9byhcImlmcmFtZVwiLHthbGxvd1RyYW5zcGFyZW5jeTohMCxmcmFtZUJvcmRlcjpcIm5vXCIsc2Nyb2xsaW5nOlwibm9cIixzcmM6XCJhYm91dDpibGFua1wiLG1vemFsbG93ZnVsbHNjcmVlbjpcIm1vemFsbG93ZnVsbHNjcmVlblwiLHdlYmtpdGFsbG93ZnVsbHNjcmVlbjpcIndlYmtpdGFsbG93ZnVsbHNjcmVlblwiLGFsbG93ZnVsbHNjcmVlbjpcImFsbG93ZnVsbHNjcmVlblwiLHN0eWxlOnt3aWR0aDp0aGlzLnNpemVbMF0rXCJweFwiLGhlaWdodDp0aGlzLnNpemVbMV0rXCJweFwiLG92ZXJmbG93OlwiaGlkZGVuXCJ9fSk7dCYmdC5wYXJlbnROb2RlPyh0LnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHIsdCksZSgpKTooZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChyKSxlKCksZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChyKSl9fX0se1wiLi9jcmVhdGVFbGVtZW50XCI6NyxcIi4vZXh0ZW5kXCI6OSxcIi4vcGFyc2VET01CeUNsYXNzTmFtZXNcIjoxMSxcIi4vcGxheWVyLmNzc1wiOjEyLFwiLi9wbGF5ZXIuaHRtbFwiOjEzfV0sMzpbZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBpKGUpe2Uuc3Ryb2tlU3R5bGU9XCJibGFja1wiLGUubGluZVdpZHRoPTMsZS5mb250PSdib2xkIDIwcHggXCJQaW5nSGVpXCIsXCJMdWNpZGEgR3JhbmRlXCIsIFwiTHVjaWRhIFNhbnMgVW5pY29kZVwiLCBcIlNUSGVpdGlcIiwgXCJIZWx2ZXRpY2FcIixcIkFyaWFsXCIsXCJWZXJkYW5hXCIsXCJzYW5zLXNlcmlmXCInfXZhciBuPShlKFwiLi9jcmVhdGVFbGVtZW50XCIpLC4xKSxvPTI1LHM9NGUzLHI9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKS5nZXRDb250ZXh0KFwiMmRcIik7aShyKTt2YXIgYT13aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHx3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lfHx3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lfHx3aW5kb3cubXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxmdW5jdGlvbihlKXtzZXRUaW1lb3V0KGUsMWUzLzYwKX07dC5leHBvcnRzPXtpbml0OmZ1bmN0aW9uKCl7dGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKFwicGxheVwiLHRoaXMucmVTdGFydENvbW1lbnQuYmluZCh0aGlzKSksdGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKFwicGF1c2VcIix0aGlzLnBhdXNlQ29tbWVudC5iaW5kKHRoaXMpKSx0aGlzLmxhc3RDb21tbmV0VXBkYXRlVGltZT0wLHRoaXMubGFzdENvbW1uZXRJbmRleD0wLHRoaXMuY29tbWVudExvb3BQcmVRdWV1ZT1bXSx0aGlzLmNvbW1lbnRMb29wUXVldWU9W10sdGhpcy5jb21tZW50QnV0dG9uUHJlUXVldWU9W10sdGhpcy5jb21tZW50QnV0dG9uUXVldWU9W10sdGhpcy5jb21tZW50VG9wUHJlUXVldWU9W10sdGhpcy5jb21tZW50VG9wUXVldWU9W10sdGhpcy5kcmF3UXVldWU9W10sdGhpcy5wcmVSZW5kZXJzPVtdLHRoaXMucHJlUmVuZGVyTWFwPXt9LHRoaXMuZW5hYmxlQ29tbWVudD12b2lkIDA9PT10aGlzLmNvbW1lbnRzPyExOiEwLHRoaXMucHJldkRyYXdDYW52YXM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKSx0aGlzLmNhbnZhcz10aGlzLkRPTXMuY29tbWVudHMuZ2V0Q29udGV4dChcIjJkXCIpLHRoaXMuY29tbWVudHMmJnRoaXMuRE9Ncy5wbGF5ZXIuY2xhc3NMaXN0LmFkZChcImhhcy1jb21tZW50c1wiKSx0aGlzLkRPTXNbXCJjb21tZW50cy1idG5cIl0uY2xhc3NMaXN0LmFkZChcImVuYWJsZVwiKSx0aGlzLkRPTXMuY29tbWVudHMuZGlzcGxheT10aGlzLmVuYWJsZUNvbW1lbnQ/XCJibG9ja1wiOlwibm9uZVwiO3ZhciBlPTAsdD1mdW5jdGlvbigpeyhlPX5lKSYmdGhpcy5vbkNvbW1lbnRUaW1lVXBkYXRlKCksYSh0KX0uYmluZCh0aGlzKTt0KCl9LG5lZWREcmF3VGV4dDpmdW5jdGlvbihlLHQsaSl7dGhpcy5kcmF3UXVldWUucHVzaChbZSx0LGldKX0sZHJhd1RleHQ6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLnByZXZEcmF3Q2FudmFzLHQ9dGhpcy5wcmV2RHJhd0NhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7ZS53aWR0aD10aGlzLmNhbnZhc1dpZHRoLGUuaGVpZ2h0PXRoaXMuY2FudmFzSGVpZ2h0LHQuY2xlYXJSZWN0KDAsMCx0aGlzLmNhbnZhc1dpZHRoLHRoaXMuY2FudmFzSGVpZ2h0KTt2YXIgbj1bXTt0aGlzLnByZVJlbmRlcnMuZm9yRWFjaChmdW5jdGlvbihlLHQpe2UudXNlZD0hMSx2b2lkIDA9PT1lLmNpZCYmbi5wdXNoKHQpfSk7Zm9yKHZhciBzO3M9dGhpcy5kcmF3UXVldWUuc2hpZnQoKTspIWZ1bmN0aW9uKGUscyl7dmFyIHIsYT1lWzBdLnRleHQrZVswXS5jb2xvcixsPXMucHJlUmVuZGVyTWFwW2FdO2lmKHZvaWQgMD09PWwpe3ZhciBsPW4uc2hpZnQoKTt2b2lkIDA9PT1sPyhyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiksbD1zLnByZVJlbmRlcnMucHVzaChyKS0xKTpyPXMucHJlUmVuZGVyc1tsXTt2YXIgYz1yLndpZHRoPWVbMF0ud2lkdGgsaD1yLmhlaWdodD1vKzEwLGQ9ci5nZXRDb250ZXh0KFwiMmRcIik7ZC5jbGVhclJlY3QoMCwwLGMsaCksaShkKSxkLmZpbGxTdHlsZT1lWzBdLmNvbG9yLGQuc3Ryb2tlVGV4dChlWzBdLnRleHQsMCxvKSxkLmZpbGxUZXh0KGVbMF0udGV4dCwwLG8pLHIuY2lkPWEscy5wcmVSZW5kZXJNYXBbYV09bH1lbHNlIHI9cy5wcmVSZW5kZXJzW2xdO3IudXNlZD0hMCx0LmRyYXdJbWFnZShyLGVbMV0sZVsyXSl9KHMsdGhpcyk7dGhpcy5wcmVSZW5kZXJzLmZvckVhY2goZnVuY3Rpb24oZSl7ZS51c2VkPT09ITEmJihkZWxldGUgdGhpcy5wcmVSZW5kZXJNYXBbZS5jaWRdLGUuY2lkPXZvaWQgMCl9LmJpbmQodGhpcykpLHRoaXMuY2FudmFzLmNsZWFyUmVjdCgwLDAsdGhpcy5jYW52YXNXaWR0aCx0aGlzLmNhbnZhc0hlaWdodCksdGhpcy5jYW52YXMuZHJhd0ltYWdlKGUsMCwwKX0sY3JlYXRlQ29tbWVudDpmdW5jdGlvbihlLHQpe2lmKHZvaWQgMD09PWUpcmV0dXJuITE7dmFyIGk9ci5tZWFzdXJlVGV4dChlLnRleHQpO3JldHVybntzdGFydFRpbWU6dCx0ZXh0OmUudGV4dCxjb2xvcjplLmNvbG9yLHdpZHRoOmkud2lkdGgrMjB9fSxjb21tZW50VG9wOmZ1bmN0aW9uKGUsdCxpKXt0aGlzLmNvbW1lbnRUb3BRdWV1ZS5mb3JFYWNoKGZ1bmN0aW9uKHQsbil7dm9pZCAwIT10JiYoaT50LnN0YXJ0VGltZStzP3RoaXMuY29tbWVudFRvcFF1ZXVlW25dPXZvaWQgMDp0aGlzLm5lZWREcmF3VGV4dCh0LChlLXQud2lkdGgpLzIsbypuKSl9LmJpbmQodGhpcykpO2Zvcih2YXIgbjtuPXRoaXMuY29tbWVudFRvcFByZVF1ZXVlLnNoaWZ0KCk7KW49dGhpcy5jcmVhdGVDb21tZW50KG4saSksdGhpcy5jb21tZW50VG9wUXVldWUuZm9yRWFjaChmdW5jdGlvbih0LGkpe24mJnZvaWQgMD09PXQmJih0PXRoaXMuY29tbWVudFRvcFF1ZXVlW2ldPW4sdGhpcy5uZWVkRHJhd1RleHQodCwoZS1uLndpZHRoKS8yLG8qaSksbj12b2lkIDApfS5iaW5kKHRoaXMpKSxuJiYodGhpcy5jb21tZW50VG9wUXVldWUucHVzaChuKSx0aGlzLm5lZWREcmF3VGV4dChuLChlLW4ud2lkdGgpLzIsbyp0aGlzLmNvbW1lbnRUb3BRdWV1ZS5sZW5ndGgtMSkpfSxjb21tZW50Qm90dG9tOmZ1bmN0aW9uKGUsdCxpKXt0LT0xMCx0aGlzLmNvbW1lbnRCdXR0b25RdWV1ZS5mb3JFYWNoKGZ1bmN0aW9uKG4scil7dm9pZCAwIT1uJiYoaT5uLnN0YXJ0VGltZStzP3RoaXMuY29tbWVudEJ1dHRvblF1ZXVlW3JdPXZvaWQgMDp0aGlzLm5lZWREcmF3VGV4dChuLChlLW4ud2lkdGgpLzIsdC1vKihyKzEpKSl9LmJpbmQodGhpcykpO2Zvcih2YXIgbjtuPXRoaXMuY29tbWVudEJ1dHRvblByZVF1ZXVlLnNoaWZ0KCk7KW49dGhpcy5jcmVhdGVDb21tZW50KG4saSksdGhpcy5jb21tZW50QnV0dG9uUXVldWUuZm9yRWFjaChmdW5jdGlvbihpLHMpe24mJnZvaWQgMD09PWkmJihpPXRoaXMuY29tbWVudEJ1dHRvblF1ZXVlW3NdPW4sdGhpcy5uZWVkRHJhd1RleHQoaSwoZS1uLndpZHRoKS8yLHQtbyoocysxKSksbj12b2lkIDApfS5iaW5kKHRoaXMpKSxuJiYodGhpcy5jb21tZW50QnV0dG9uUXVldWUucHVzaChuKSx0aGlzLm5lZWREcmF3VGV4dChuLChlLW4ud2lkdGgpLzIsdC1vKnRoaXMuY29tbWVudEJ1dHRvblF1ZXVlLmxlbmd0aCkpfSxjb21tZW50TG9vcDpmdW5jdGlvbihlLHQsaSl7Zm9yKHZhciBzPXQvb3wwLHI9LTE7KytyPHM7KXt2YXIgYT10aGlzLmNvbW1lbnRMb29wUXVldWVbcl07aWYodm9pZCAwPT09YSYmKGE9dGhpcy5jb21tZW50TG9vcFF1ZXVlW3JdPVtdKSx0aGlzLmNvbW1lbnRMb29wUHJlUXVldWUubGVuZ3RoPjApe3ZhciBsPTA9PT1hLmxlbmd0aD92b2lkIDA6YVthLmxlbmd0aC0xXTtpZih2b2lkIDA9PT1sfHwoaS1sLnN0YXJ0VGltZSkqbj5sLndpZHRoKXt2YXIgYz10aGlzLmNyZWF0ZUNvbW1lbnQodGhpcy5jb21tZW50TG9vcFByZVF1ZXVlLnNoaWZ0KCksaSk7YyYmYS5wdXNoKGMpfX10aGlzLmNvbW1lbnRMb29wUXVldWVbcl09YS5maWx0ZXIoZnVuY3Rpb24odCl7dmFyIHM9KGktdC5zdGFydFRpbWUpKm47cmV0dXJuIDA+c3x8cz50LndpZHRoK2U/ITE6KHRoaXMubmVlZERyYXdUZXh0KHQsZS1zLG8qciksITApfS5iaW5kKHRoaXMpKX1mb3IodmFyIGg9dGhpcy5jb21tZW50TG9vcFF1ZXVlLmxlbmd0aC1zO2gtLT4wOyl0aGlzLmNvbW1lbnRMb29wUXVldWUucG9wKCl9LHBhdXNlQ29tbWVudDpmdW5jdGlvbigpe3RoaXMucGF1c2VDb21tZW50QXQ9RGF0ZS5ub3coKX0scmVTdGFydENvbW1lbnQ6ZnVuY3Rpb24oKXtpZih0aGlzLnBhdXNlQ29tbWVudEF0KXt2YXIgZT1EYXRlLm5vdygpLXRoaXMucGF1c2VDb21tZW50QXQ7dGhpcy5jb21tZW50TG9vcFF1ZXVlLmZvckVhY2goZnVuY3Rpb24odCl7dC5mb3JFYWNoKGZ1bmN0aW9uKHQpe3QmJih0LnN0YXJ0VGltZSs9ZSl9KX0pLHRoaXMuY29tbWVudEJ1dHRvblF1ZXVlLmZvckVhY2goZnVuY3Rpb24odCl7dCYmKHQuc3RhcnRUaW1lKz1lKX0pLHRoaXMuY29tbWVudFRvcFF1ZXVlLmZvckVhY2goZnVuY3Rpb24odCl7dCYmKHQuc3RhcnRUaW1lKz1lKX0pfXRoaXMucGF1c2VDb21tZW50QXQ9dm9pZCAwfSxkcmF3Q29tbWVudDpmdW5jdGlvbigpe2lmKCF0aGlzLnBhdXNlQ29tbWVudEF0KXt2YXIgZT1EYXRlLm5vdygpLHQ9dGhpcy5ET01zW1widmlkZW8tZnJhbWVcIl0ub2Zmc2V0V2lkdGgsaT10aGlzLkRPTXNbXCJ2aWRlby1mcmFtZVwiXS5vZmZzZXRIZWlnaHQ7dCE9dGhpcy5jYW52YXNXaWR0aCYmKHRoaXMuRE9Ncy5jb21tZW50cy53aWR0aD10LHRoaXMuY2FudmFzV2lkdGg9dCksaSE9dGhpcy5jYW52YXNIZWlnaHQmJih0aGlzLkRPTXMuY29tbWVudHMuaGVpZ2h0PWksdGhpcy5jYW52YXNIZWlnaHQ9aSk7dmFyIG49dGhpcy52aWRlby5vZmZzZXRXaWR0aCxvPXRoaXMudmlkZW8ub2Zmc2V0SGVpZ2h0O3RoaXMuY29tbWVudExvb3AobixvLGUpLHRoaXMuY29tbWVudFRvcChuLG8sZSksdGhpcy5jb21tZW50Qm90dG9tKG4sbyxlKSx0aGlzLmRyYXdUZXh0KCl9fSxvbkNvbW1lbnRUaW1lVXBkYXRlOmZ1bmN0aW9uKCl7aWYodGhpcy5lbmFibGVDb21tZW50IT09ITEpe3ZhciBlPXRoaXMudmlkZW8uY3VycmVudFRpbWU7aWYoTWF0aC5hYnMoZS10aGlzLmxhc3RDb21tbmV0VXBkYXRlVGltZSk8PTEmJmU+dGhpcy5sYXN0Q29tbW5ldFVwZGF0ZVRpbWUpe3ZhciB0PTA7Zm9yKHRoaXMubGFzdENvbW1uZXRJbmRleCYmdGhpcy5jb21tZW50c1t0aGlzLmxhc3RDb21tbmV0SW5kZXhdLnRpbWU8PXRoaXMubGFzdENvbW1uZXRVcGRhdGVUaW1lJiYodD10aGlzLmxhc3RDb21tbmV0SW5kZXgpOysrdDx0aGlzLmNvbW1lbnRzLmxlbmd0aDspaWYoISh0aGlzLmNvbW1lbnRzW3RdLnRpbWU8PXRoaXMubGFzdENvbW1uZXRVcGRhdGVUaW1lKSl7aWYodGhpcy5jb21tZW50c1t0XS50aW1lPmUpYnJlYWs7c3dpdGNoKHRoaXMuY29tbWVudHNbdF0ucG9zKXtjYXNlXCJib3R0b21cIjp0aGlzLmNvbW1lbnRCdXR0b25QcmVRdWV1ZS5wdXNoKHRoaXMuY29tbWVudHNbdF0pO2JyZWFrO2Nhc2VcInRvcFwiOnRoaXMuY29tbWVudFRvcFByZVF1ZXVlLnB1c2godGhpcy5jb21tZW50c1t0XSk7YnJlYWs7ZGVmYXVsdDp0aGlzLmNvbW1lbnRMb29wUHJlUXVldWUucHVzaCh0aGlzLmNvbW1lbnRzW3RdKX10aGlzLmxhc3RDb21tbmV0SW5kZXg9dH19dHJ5e3RoaXMuZHJhd0NvbW1lbnQoKX1jYXRjaChpKXt9dGhpcy5sYXN0Q29tbW5ldFVwZGF0ZVRpbWU9ZX19fX0se1wiLi9jcmVhdGVFbGVtZW50XCI6N31dLDQ6W2Z1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gaShlKXtyZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZSl9ZnVuY3Rpb24gbihlLHQsaSxuKXtmdW5jdGlvbiBvKHQpe3ZhciBpPSh0LmNsaWVudFgtZS5wYXJlbnROb2RlLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQpL2UucGFyZW50Tm9kZS5vZmZzZXRXaWR0aDtyZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgoaSwwKSwxKX1mdW5jdGlvbiBzKHQpezE9PXQud2hpY2gmJihsPSEwLGUuZHJhZ2luZz0hMCxyKHQpKX1mdW5jdGlvbiByKGUpe2lmKDE9PWUud2hpY2gmJmw9PT0hMCl7dmFyIHQ9byhlKTtpKHQpfX1mdW5jdGlvbiBhKHQpe2lmKDE9PXQud2hpY2gmJmw9PT0hMCl7dmFyIHM9byh0KTtpKHMpLG4ocyksbD0hMSxkZWxldGUgZS5kcmFnaW5nfX12YXIgbD0hMTtpPWl8fGZ1bmN0aW9uKCl7fSxuPW58fGZ1bmN0aW9uKCl7fSxlLnBhcmVudE5vZGUuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLHMpLHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLHIpLHQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIixhKX12YXIgbz0oZShcIi4vY3JlYXRlRWxlbWVudFwiKSxlKFwiLi9kZWxlZ2F0ZUNsaWNrQnlDbGFzc05hbWVcIikpLHM9ZShcIi4vdGltZUZvcm1hdFwiKTt0LmV4cG9ydHM9e2luaXQ6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLmlmcmFtZS5jb250ZW50RG9jdW1lbnQsdD1vKGUpO3Qub24oXCJwbGF5XCIsdGhpcy5vblBsYXlDbGljayx0aGlzKSx0Lm9uKFwidmlkZW8tZnJhbWVcIix0aGlzLm9uVmlkZW9DbGljayx0aGlzKSx0Lm9uKFwic291cmNlXCIsdGhpcy5vblNvdXJjZUNsaWNrLHRoaXMpLHQub24oXCJhbGxzY3JlZW5cIix0aGlzLm9uQWxsU2NyZWVuQ2xpY2ssdGhpcyksdC5vbihcImZ1bGxzY3JlZW5cIix0aGlzLm9uZnVsbFNjcmVlbkNsaWNrLHRoaXMpLHQub24oXCJub3JtYWxzY3JlZW5cIix0aGlzLm9uTm9ybWFsU2NyZWVuQ2xpY2ssdGhpcyksdC5vbihcImNvbW1lbnRzLWJ0blwiLHRoaXMub25jb21tZW50c0J0bkNsaWNrLHRoaXMpLHQub24oXCJhaXJwbGF5XCIsdGhpcy5vbkFpcnBsYXlCdG5DbGljayx0aGlzKSxlLmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLHRoaXMub25LZXlEb3duLmJpbmQodGhpcyksITEpLHRoaXMuRE9Ncy5wbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLHRoaXMub25Nb3VzZUFjdGl2ZS5iaW5kKHRoaXMpKSxuKHRoaXMuRE9Ncy5wcm9ncmVzc19hbmNob3IsZSx0aGlzLm9uUHJvZ3Jlc3NBbmNob3JXaWxsU2V0LmJpbmQodGhpcyksdGhpcy5vblByb2dyZXNzQW5jaG9yU2V0LmJpbmQodGhpcykpLG4odGhpcy5ET01zLnZvbHVtZV9hbmNob3IsZSx0aGlzLm9uVm9sdW1lQW5jaG9yV2lsbFNldC5iaW5kKHRoaXMpKX0sb25LZXlEb3duOmZ1bmN0aW9uKGUpe3N3aXRjaChlLnByZXZlbnREZWZhdWx0KCksZS5rZXlDb2RlKXtjYXNlIDMyOnRoaXMub25QbGF5Q2xpY2soKTticmVhaztjYXNlIDM5OnRoaXMudmlkZW8uY3VycmVudFRpbWU9TWF0aC5taW4odGhpcy52aWRlby5kdXJhdGlvbix0aGlzLnZpZGVvLmN1cnJlbnRUaW1lKzEwKTticmVhaztjYXNlIDM3OnRoaXMudmlkZW8uY3VycmVudFRpbWU9TWF0aC5tYXgoMCx0aGlzLnZpZGVvLmN1cnJlbnRUaW1lLTEwKTticmVhaztjYXNlIDM4OnRoaXMudmlkZW8udm9sdW1lPU1hdGgubWluKDEsdGhpcy52aWRlby52b2x1bWUrLjEpLHRoaXMuRE9Ncy52b2x1bWVfYW5jaG9yLnN0eWxlLndpZHRoPTEwMCp0aGlzLnZpZGVvLnZvbHVtZStcIiVcIjticmVhaztjYXNlIDQwOnRoaXMudmlkZW8udm9sdW1lPU1hdGgubWF4KDAsdGhpcy52aWRlby52b2x1bWUtLjEpLHRoaXMuRE9Ncy52b2x1bWVfYW5jaG9yLnN0eWxlLndpZHRoPTEwMCp0aGlzLnZpZGVvLnZvbHVtZStcIiVcIjticmVhaztjYXNlIDY1OnRoaXMuRE9Ncy5wbGF5ZXIuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWxsc2NyZWVuXCIpP3RoaXMub25Ob3JtYWxTY3JlZW5DbGljaygpOnRoaXMub25BbGxTY3JlZW5DbGljaygpO2JyZWFrO2Nhc2UgNzA6dGhpcy5ET01zLnBsYXllci5jbGFzc0xpc3QuY29udGFpbnMoXCJmdWxsc2NyZWVuXCIpfHx0aGlzLm9uZnVsbFNjcmVlbkNsaWNrKCl9fSxvblZpZGVvQ2xpY2s6ZnVuY3Rpb24oKXt2b2lkIDA9PXRoaXMudmlkZW9DbGlja0RibFRpbWVyP3RoaXMudmlkZW9DbGlja0RibFRpbWVyPXNldFRpbWVvdXQoZnVuY3Rpb24oKXt0aGlzLnZpZGVvQ2xpY2tEYmxUaW1lcj12b2lkIDAsdGhpcy5vblBsYXlDbGljaygpfS5iaW5kKHRoaXMpLDMwMCk6KGNsZWFyVGltZW91dCh0aGlzLnZpZGVvQ2xpY2tEYmxUaW1lciksdGhpcy52aWRlb0NsaWNrRGJsVGltZXI9dm9pZCAwLGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50fHxkb2N1bWVudC5tb3pGdWxsU2NyZWVuRWxlbWVudHx8ZG9jdW1lbnQud2Via2l0RnVsbHNjcmVlbkVsZW1lbnQ/dGhpcy5vbk5vcm1hbFNjcmVlbkNsaWNrKCk6dGhpcy5vbmZ1bGxTY3JlZW5DbGljaygpKX0sb25Nb3VzZUFjdGl2ZTpmdW5jdGlvbigpe3RoaXMuRE9Ncy5wbGF5ZXIuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKSxjbGVhclRpbWVvdXQodGhpcy5Nb3VzZUFjdGl2ZVRpbWVyKSx0aGlzLk1vdXNlQWN0aXZlVGltZXI9c2V0VGltZW91dChmdW5jdGlvbigpe3RoaXMuRE9Ncy5wbGF5ZXIuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKX0uYmluZCh0aGlzKSwxZTMpfSxvblBsYXlDbGljazpmdW5jdGlvbigpe3RoaXMuRE9Ncy5wbGF5LmNsYXNzTGlzdC5jb250YWlucyhcInBhdXNlZFwiKT8odGhpcy52aWRlby5wbGF5KCksdGhpcy5ET01zLnBsYXkuY2xhc3NMaXN0LnJlbW92ZShcInBhdXNlZFwiKSk6KHRoaXMudmlkZW8ucGF1c2UoKSx0aGlzLkRPTXMucGxheS5jbGFzc0xpc3QuYWRkKFwicGF1c2VkXCIpKX0sb25Tb3VyY2VDbGljazpmdW5jdGlvbihlKXtlLmNsYXNzTGlzdC5jb250YWlucyhcImN1cnJcIil8fCh0aGlzLnZpZGVvLnByZWxvYWRTdGFydFRpbWU9dGhpcy52aWRlby5jdXJyZW50VGltZSx0aGlzLnZpZGVvLnNyYz10aGlzLnNvdXJjZUxpc3RbMHxlLmdldEF0dHJpYnV0ZShcInNvdXJjZUluZGV4XCIpXVsxXSxpKGUucGFyZW50Tm9kZS5jaGlsZE5vZGVzKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe2U9PT10P3QuY2xhc3NMaXN0LmFkZChcImN1cnJcIik6dC5jbGFzc0xpc3QucmVtb3ZlKFwiY3VyclwiKX0uYmluZCh0aGlzKSkpfSxvblByb2dyZXNzQW5jaG9yV2lsbFNldDpmdW5jdGlvbihlKXt2YXIgdD10aGlzLnZpZGVvLmR1cmF0aW9uLGk9dCplO3RoaXMuRE9Ncy5jdXJyZW50LmlubmVySFRNTD1zKGkpLHRoaXMuRE9Ncy5kdXJhdGlvbi5pbm5lckhUTUw9cyh0KSx0aGlzLkRPTXMucHJvZ3Jlc3NfYW5jaG9yLnN0eWxlLndpZHRoPTEwMCplK1wiJVwifSxvblByb2dyZXNzQW5jaG9yU2V0OmZ1bmN0aW9uKGUpe3RoaXMudmlkZW8uY3VycmVudFRpbWU9dGhpcy52aWRlby5kdXJhdGlvbiplfSxvblZvbHVtZUFuY2hvcldpbGxTZXQ6ZnVuY3Rpb24oZSl7dGhpcy52aWRlby52b2x1bWU9ZSx0aGlzLkRPTXMudm9sdW1lX2FuY2hvci5zdHlsZS53aWR0aD0xMDAqZStcIiVcIn0sb25BbGxTY3JlZW5DbGljazpmdW5jdGlvbigpe3ZhciBlPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCx0PWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7dGhpcy5pZnJhbWUuc3R5bGUuY3NzVGV4dD1cIjtwb3NpdGlvbjpmaXhlZDt0b3A6MDtsZWZ0OjA7d2lkdGg6XCIrZStcInB4O2hlaWdodDpcIit0K1wicHg7ei1pbmRleDo5OTk5OTk7XCIsdGhpcy5hbGxTY3JlZW5XaW5SZXNpemVGdW5jdGlvbj10aGlzLmFsbFNjcmVlbldpblJlc2l6ZUZ1bmN0aW9ufHxmdW5jdGlvbigpe3RoaXMuaWZyYW1lLnN0eWxlLndpZHRoPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCtcInB4XCIsdGhpcy5pZnJhbWUuc3R5bGUuaGVpZ2h0PWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQrXCJweFwifS5iaW5kKHRoaXMpLHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsdGhpcy5hbGxTY3JlZW5XaW5SZXNpemVGdW5jdGlvbiksd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIix0aGlzLmFsbFNjcmVlbldpblJlc2l6ZUZ1bmN0aW9uKSx0aGlzLkRPTXMucGxheWVyLmNsYXNzTGlzdC5hZGQoXCJhbGxzY3JlZW5cIil9LG9uZnVsbFNjcmVlbkNsaWNrOmZ1bmN0aW9uKCl7W1wid2Via2l0UmVxdWVzdEZ1bGxTY3JlZW5cIixcIm1velJlcXVlc3RGdWxsU2NyZWVuXCIsXCJyZXF1ZXN0RnVsbFNjcmVlblwiXS5mb3JFYWNoKGZ1bmN0aW9uKGUpe3RoaXMuRE9Ncy5wbGF5ZXJbZV0mJnRoaXMuRE9Ncy5wbGF5ZXJbZV0oKX0uYmluZCh0aGlzKSksdGhpcy5vbk1vdXNlQWN0aXZlKCl9LG9uTm9ybWFsU2NyZWVuQ2xpY2s6ZnVuY3Rpb24oKXt3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLHRoaXMuYWxsU2NyZWVuV2luUmVzaXplRnVuY3Rpb24pLHRoaXMuaWZyYW1lLnN0eWxlLmNzc1RleHQ9XCI7d2lkdGg6XCIrdGhpcy5zaXplWzBdK1wicHg7aGVpZ2h0OlwiK3RoaXMuc2l6ZVsxXStcInB4O1wiLFtcIndlYmtpdENhbmNlbEZ1bGxTY3JlZW5cIixcIm1vekNhbmNlbEZ1bGxTY3JlZW5cIixcImNhbmNlbEZ1bGxTY3JlZW5cIl0uZm9yRWFjaChmdW5jdGlvbihlKXtkb2N1bWVudFtlXSYmZG9jdW1lbnRbZV0oKX0pLHRoaXMuRE9Ncy5wbGF5ZXIuY2xhc3NMaXN0LnJlbW92ZShcImFsbHNjcmVlblwiKX0sb25jb21tZW50c0J0bkNsaWNrOmZ1bmN0aW9uKCl7dGhpcy5lbmFibGVDb21tZW50PSF0aGlzLkRPTXNbXCJjb21tZW50cy1idG5cIl0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiZW5hYmxlXCIpLHRoaXMuZW5hYmxlQ29tbWVudD8oc2V0VGltZW91dChmdW5jdGlvbigpe3RoaXMuRE9Ncy5jb21tZW50cy5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIn0uYmluZCh0aGlzKSw4MCksdGhpcy5ET01zW1wiY29tbWVudHMtYnRuXCJdLmNsYXNzTGlzdC5hZGQoXCJlbmFibGVcIikpOih0aGlzLkRPTXMuY29tbWVudHMuc3R5bGUuZGlzcGxheT1cIm5vbmVcIix0aGlzLkRPTXNbXCJjb21tZW50cy1idG5cIl0uY2xhc3NMaXN0LnJlbW92ZShcImVuYWJsZVwiKSl9LG9uQWlycGxheUJ0bkNsaWNrOmZ1bmN0aW9uKCl7dGhpcy52aWRlby53ZWJraXRTaG93UGxheWJhY2tUYXJnZXRQaWNrZXIoKX19fSx7XCIuL2NyZWF0ZUVsZW1lbnRcIjo3LFwiLi9kZWxlZ2F0ZUNsaWNrQnlDbGFzc05hbWVcIjo4LFwiLi90aW1lRm9ybWF0XCI6MTR9XSw1OltmdW5jdGlvbihlLHQpe3t2YXIgaT0oZShcIi4vZXh0ZW5kXCIpLGUoXCIuL2NyZWF0ZUVsZW1lbnRcIikpO2UoXCIuL3BhcnNlRE9NQnlDbGFzc05hbWVzXCIpfXQuZXhwb3J0cz17aW5pdDpmdW5jdGlvbigpe3ZhciBlPTA7dGhpcy5zb3VyY2VMaXN0LmZvckVhY2goZnVuY3Rpb24odCxuKXtpKFwibGlcIix7YXBwZW5kVG86dGhpcy5ET01zLmhkLHNvdXJjZUluZGV4Om4sY2xhc3NOYW1lOlwic291cmNlIFwiKyhuPT09ZT9cImN1cnJcIjpcIlwiKSxpbm5lckhUTUw6dFswXX0pfS5iaW5kKHRoaXMpKSx0aGlzLkRPTXMudmlkZW8uc3JjPXRoaXMuc291cmNlTGlzdFtlXVsxXX19fSx7XCIuL2NyZWF0ZUVsZW1lbnRcIjo3LFwiLi9leHRlbmRcIjo5LFwiLi9wYXJzZURPTUJ5Q2xhc3NOYW1lc1wiOjExfV0sNjpbZnVuY3Rpb24oZSx0KXt2YXIgaT1lKFwiLi90aW1lRm9ybWF0XCIpO3QuZXhwb3J0cz17aW5pdDpmdW5jdGlvbigpe3RoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcInRpbWV1cGRhdGVcIix0aGlzLm9uVmlkZW9UaW1lVXBkYXRlLmJpbmQodGhpcykpLHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcInBsYXlcIix0aGlzLm9uVmlkZW9QbGF5LmJpbmQodGhpcykpLHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcInBhdXNlXCIsdGhpcy5vblZpZGVvVGltZVBhdXNlLmJpbmQodGhpcykpLHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRlZG1ldGFkYXRhXCIsdGhpcy5vblZpZGVvTG9hZGVkTWV0YURhdGEuYmluZCh0aGlzKSksdGhpcy52aWRlby5hZGRFdmVudExpc3RlbmVyKFwid2Via2l0cGxheWJhY2t0YXJnZXRhdmFpbGFiaWxpdHljaGFuZ2VkXCIsdGhpcy5vblBsYXliYWNrVGFyZ2V0QXZhaWxhYmlsaXR5Q2hhbmdlZC5iaW5kKHRoaXMpKSxzZXRJbnRlcnZhbCh0aGlzLnZpZGVvQnVmZmVyZWQuYmluZCh0aGlzKSwxZTMpLHRoaXMuRE9Ncy52b2x1bWVfYW5jaG9yLnN0eWxlLndpZHRoPTEwMCp0aGlzLnZpZGVvLnZvbHVtZStcIiVcIn0sb25WaWRlb1RpbWVVcGRhdGU6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLnZpZGVvLmN1cnJlbnRUaW1lLHQ9dGhpcy52aWRlby5kdXJhdGlvbjt0aGlzLkRPTXMuY3VycmVudC5pbm5lckhUTUw9aShlKSx0aGlzLkRPTXMuZHVyYXRpb24uaW5uZXJIVE1MPWkodCksdGhpcy5ET01zLnByb2dyZXNzX2FuY2hvci5kcmFnaW5nfHwodGhpcy5ET01zLnByb2dyZXNzX2FuY2hvci5zdHlsZS53aWR0aD0xMDAqTWF0aC5taW4oTWF0aC5tYXgoZS90LDApLDEpK1wiJVwiKX0sdmlkZW9CdWZmZXJlZDpmdW5jdGlvbigpe3ZhciBlPXRoaXMudmlkZW8uYnVmZmVyZWQsdD10aGlzLnZpZGVvLmN1cnJlbnRUaW1lLGk9MD09ZS5sZW5ndGg/MDplLmVuZChlLmxlbmd0aC0xKTt0aGlzLkRPTXMuYnVmZmVyZWRfYW5jaG9yLnN0eWxlLndpZHRoPTEwMCpNYXRoLm1pbihNYXRoLm1heChpL3RoaXMudmlkZW8uZHVyYXRpb24sMCksMSkrXCIlXCIsMD09aXx8dD49aT90aGlzLkRPTXMucGxheWVyLmNsYXNzTGlzdC5hZGQoXCJsb2FkaW5nXCIpOnRoaXMuRE9Ncy5wbGF5ZXIuY2xhc3NMaXN0LnJlbW92ZShcImxvYWRpbmdcIil9LG9uVmlkZW9QbGF5OmZ1bmN0aW9uKCl7dGhpcy5ET01zLnBsYXkuY2xhc3NMaXN0LnJlbW92ZShcInBhdXNlZFwiKX0sb25WaWRlb1RpbWVQYXVzZTpmdW5jdGlvbigpe3RoaXMuRE9Ncy5wbGF5LmNsYXNzTGlzdC5hZGQoXCJwYXVzZWRcIil9LG9uVmlkZW9Mb2FkZWRNZXRhRGF0YTpmdW5jdGlvbigpe3RoaXMudmlkZW8ucHJlbG9hZFN0YXJ0VGltZSYmKHRoaXMudmlkZW8uY3VycmVudFRpbWU9dGhpcy52aWRlby5wcmVsb2FkU3RhcnRUaW1lLGRlbGV0ZSB0aGlzLnZpZGVvLnByZWxvYWRTdGFydFRpbWUpfSxvblBsYXliYWNrVGFyZ2V0QXZhaWxhYmlsaXR5Q2hhbmdlZDpmdW5jdGlvbihlKXt2YXIgdD1cInN1cHBvcnQtYWlycGxheVwiO1wiYXZhaWxhYmxlXCI9PT1lLmF2YWlsYWJpbGl0eT90aGlzLkRPTXMucGxheWVyLmNsYXNzTGlzdC5hZGQodCk6dGhpcy5ET01zLnBsYXllci5jbGFzc0xpc3QucmVtb3ZlKHQpfX19LHtcIi4vdGltZUZvcm1hdFwiOjE0fV0sNzpbZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBpKGUsdCl7dmFyIGk9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChlKTtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZiB0KXQuY2FsbChpKTtlbHNlIGZvcih2YXIgbiBpbiB0KWlmKHQuaGFzT3duUHJvcGVydHkobikpc3dpdGNoKG4pe2Nhc2VcImFwcGVuZFRvXCI6dFtuXS5hcHBlbmRDaGlsZChpKTticmVhaztjYXNlXCJ0ZXh0XCI6dmFyIG89ZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodFtuXSk7aS5pbm5lckhUTUw9XCJcIixpLmFwcGVuZENoaWxkKG8pO2JyZWFrO2Nhc2VcImlubmVySFRNTFwiOmNhc2VcImNsYXNzTmFtZVwiOmNhc2VcImlkXCI6aVtuXT10W25dO2JyZWFrO2Nhc2VcInN0eWxlXCI6dmFyIHM9dFtuXTtmb3IodmFyIHIgaW4gcylzLmhhc093blByb3BlcnR5KHIpJiYoaS5zdHlsZVtyXT1zW3JdKTticmVhaztkZWZhdWx0Omkuc2V0QXR0cmlidXRlKG4sdFtuXStcIlwiKX1yZXR1cm4gaX10LmV4cG9ydHM9aX0se31dLDg6W2Z1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gaShlKXtyZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZSl9ZnVuY3Rpb24gbihlKXt0aGlzLl9ldmVudE1hcD17fSx0aGlzLl9yb290RWxlbWVudD1lLHRoaXMuX2lzUm9vdEVsZW1lbnRCaW5kZWRDbGljaz0hMSx0aGlzLl9iaW5kQ2xpY2tGdW5jdGlvbj1mdW5jdGlvbihlKXshZnVuY3Rpb24gdChlLG4pe24mJm4ubm9kZU5hbWUmJihuLmNsYXNzTGlzdCYmaShuLmNsYXNzTGlzdCkuZm9yRWFjaChmdW5jdGlvbih0KXtlLnRyaWdnZXIodCxuKX0pLHQoZSxuLnBhcmVudE5vZGUpKX0odGhpcyxlLnRhcmdldCl9LmJpbmQodGhpcyl9dmFyIG89ZShcIi4vZXh0ZW5kXCIpO28obi5wcm90b3R5cGUse29uOmZ1bmN0aW9uKGUsdCxpKXt2b2lkIDA9PT10aGlzLl9ldmVudE1hcFtlXSYmKHRoaXMuX2V2ZW50TWFwW2VdPVtdKSx0aGlzLl9ldmVudE1hcFtlXS5wdXNoKFt0LGldKSx0aGlzLl9pc1Jvb3RFbGVtZW50QmluZGVkQ2xpY2t8fChfaXNSb290RWxlbWVudEJpbmRlZENsaWNrPSEwLHRoaXMuX3Jvb3RFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLHRoaXMuX2JpbmRDbGlja0Z1bmN0aW9uLCExKSl9LG9mZjpmdW5jdGlvbihlLHQpe2lmKHZvaWQgMCE9dGhpcy5fZXZlbnRNYXBbZV0pZm9yKHZhciBpPXRoaXMuX2V2ZW50TWFwW2VdLmxlbmd0aDtpLS07KWlmKHRoaXMuX2V2ZW50TWFwW2VdW2ldWzBdPT09dCl7dGhpcy5fZXZlbnRNYXBbZV0uc3BsaWNlKGksMSk7YnJlYWt9Zm9yKHZhciBuIGluIHRoaXMuX2V2ZW50TWFwKWJyZWFrO3ZvaWQgMD09PW4mJnRoaXMuX2lzUm9vdEVsZW1lbnRCaW5kZWRDbGljayYmKF9pc1Jvb3RFbGVtZW50QmluZGVkQ2xpY2s9ITEsdGhpcy5fcm9vdEVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsdGhpcy5fYmluZENsaWNrRnVuY3Rpb24sITEpKX0sdHJpZ2dlcjpmdW5jdGlvbihlLHQpe3Q9dm9pZCAwPT09dD90aGlzLl9yb290RWxlbWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZXMoZSk6W3RdLHQuZm9yRWFjaChmdW5jdGlvbih0KXsodGhpcy5fZXZlbnRNYXBbZV18fFtdKS5mb3JFYWNoKGZ1bmN0aW9uKGUpe2VbMF0uY2FsbChlWzFdLHQpfSl9LmJpbmQodGhpcykpfX0pLHQuZXhwb3J0cz1mdW5jdGlvbihlKXtyZXR1cm4gbmV3IG4oZSl9fSx7XCIuL2V4dGVuZFwiOjl9XSw5OltmdW5jdGlvbihlLHQpe2Z1bmN0aW9uIGkoZSl7Zm9yKHZhciB0LGk9YXJndW1lbnRzLmxlbmd0aCxuPTE7aT5uOyl7dD1hcmd1bWVudHNbbisrXTtmb3IodmFyIG8gaW4gdCl0Lmhhc093blByb3BlcnR5KG8pJiYoZVtvXT10W29dKX1yZXR1cm4gZX10LmV4cG9ydHM9aX0se31dLDEwOltmdW5jdGlvbihlKXtmdW5jdGlvbiB0KGUsdCxpLG4pe3RoaXMuaWQ9ZSx0aGlzLnNpemU9dC5zcGxpdChcInhcIiksdGhpcy5zb3VyY2VMaXN0PWl8fFtdLHRoaXMuY29tbWVudHM9bix0aGlzLmluaXQoKX1lKFwiLi9jb21wb25lbnRcIikodCxlKFwiLi9jb21wb25lbnRfYnVpbGRcIiksZShcIi4vY29tcG9uZW50X2V2ZW50XCIpLGUoXCIuL2NvbXBvbmVudF92aWRlb1wiKSxlKFwiLi9jb21wb25lbnRfc291cmNlXCIpLGUoXCIuL2NvbXBvbmVudF9jb21tZW50c1wiKSksTUFNQVBsYXllcj10fSx7XCIuL2NvbXBvbmVudFwiOjEsXCIuL2NvbXBvbmVudF9idWlsZFwiOjIsXCIuL2NvbXBvbmVudF9jb21tZW50c1wiOjMsXCIuL2NvbXBvbmVudF9ldmVudFwiOjQsXCIuL2NvbXBvbmVudF9zb3VyY2VcIjo1LFwiLi9jb21wb25lbnRfdmlkZW9cIjo2fV0sMTE6W2Z1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gaShlLHQpe3ZhciBpPXt9O3JldHVybiB0LmZvckVhY2goZnVuY3Rpb24odCl7aVt0XT1lLmdldEVsZW1lbnRzQnlDbGFzc05hbWUodClbMF19KSxpfXQuZXhwb3J0cz1pfSx7fV0sMTI6W2Z1bmN0aW9uKGUsdCl7dC5leHBvcnRzPScqIHsgbWFyZ2luOjA7IHBhZGRpbmc6MDsgfWJvZHkgeyBmb250LWZhbWlseTogXCJQaW5nSGVpXCIsXCJMdWNpZGEgR3JhbmRlXCIsIFwiTHVjaWRhIFNhbnMgVW5pY29kZVwiLCBcIlNUSGVpdGlcIiwgXCJIZWx2ZXRpY2FcIixcIkFyaWFsXCIsXCJWZXJkYW5hXCIsXCJzYW5zLXNlcmlmXCI7IGZvbnQtc2l6ZToxNnB4O31odG1sLCBib2R5LCAucGxheWVyIHsgaGVpZ2h0OiAxMDAlOyB9LnBsYXllcjotd2Via2l0LWZ1bGwtc2NyZWVuIHsgd2lkdGg6IDEwMCU7IGN1cnNvcjp1cmwoZGF0YTppbWFnZS9naWY7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBRUFBQUFCQ0FZQUFBQWZGY1NKQUFBQURVbEVRVlFJbVdOZ1lHQmdBQUFBQlFBQmg2Rk8xQUFBQUFCSlJVNUVya0pnZ2c9PSk7IH0ucGxheWVyOi1tb3otZnVsbC1zY3JlZW4geyB3aWR0aDogMTAwJTsgY3Vyc29yOnVybChkYXRhOmltYWdlL2dpZjtiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUFFQUFBQUJDQVlBQUFBZkZjU0pBQUFBRFVsRVFWUUltV05nWUdCZ0FBQUFCUUFCaDZGTzFBQUFBQUJKUlU1RXJrSmdnZz09KTsgfS5wbGF5ZXI6ZnVsbC1zY3JlZW4geyB3aWR0aDogMTAwJTsgY3Vyc29yOnVybChkYXRhOmltYWdlL2dpZjtiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUFFQUFBQUJDQVlBQUFBZkZjU0pBQUFBRFVsRVFWUUltV05nWUdCZ0FBQUFCUUFCaDZGTzFBQUFBQUJKUlU1RXJrSmdnZz09KTsgfS5wbGF5ZXIgeyBib3JkZXItcmFkaXVzOiAzcHg7IG92ZXJmbG93OiBoaWRkZW47IHBvc2l0aW9uOiByZWxhdGl2ZTsgY3Vyc29yOiBkZWZhdWx0OyAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTsgIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7IHVzZXItc2VsZWN0OiBub25lO30udmlkZW8tZnJhbWUgeyBib3gtc2l6aW5nOiBib3JkZXItYm94OyBwYWRkaW5nLWJvdHRvbTogNTBweDsgaGVpZ2h0OiAxMDAlOyBvdmVyZmxvdzogaGlkZGVuOyBwb3NpdGlvbjogcmVsYXRpdmU7fS52aWRlby1mcmFtZSAuY29tbWVudHN7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOjA7bGVmdDowOyB3aWR0aDoxMDAlOyBoZWlnaHQ6MTAwJTsgIC13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZVooMCk7ICAtbW96LXRyYW5zZm9ybTp0cmFuc2xhdGVaKDApOyB0cmFuc2Zvcm06dHJhbnNsYXRlWigwKTsgIHBvaW50ZXItZXZlbnRzOiBub25lO30ucGxheWVyOi13ZWJraXQtZnVsbC1zY3JlZW4gLnZpZGVvLWZyYW1lIHsgcGFkZGluZy1ib3R0b206IDBweDsgfS5wbGF5ZXI6LW1vei1mdWxsLXNjcmVlbiAudmlkZW8tZnJhbWUgeyBwYWRkaW5nLWJvdHRvbTogMHB4OyB9LnBsYXllcjpmdWxsLXNjcmVlbiAudmlkZW8tZnJhbWV7IHBhZGRpbmctYm90dG9tOiAwcHg7IH0udmlkZW8geyB3aWR0aDogMTAwJTsgIGhlaWdodDogMTAwJTsgYmFja2dyb3VuZDogIzAwMDAwMDt9LmNvbnRyb2xsZXIgeyAgcG9zaXRpb246IGFic29sdXRlOyBib3R0b206IDBweDsgIGxlZnQ6MDsgcmlnaHQ6MDsgIGJhY2tncm91bmQ6ICMyNDI3MkE7ICBoZWlnaHQ6IDUwcHg7fS5jb250cm9sbGVyIC5sb2FkaW5nLWljb24geyBkaXNwbGF5OiBub25lOyAgcG9zaXRpb246IGFic29sdXRlOyB3aWR0aDogMjBweDsgIGhlaWdodDogMjBweDsgbGluZS1oZWlnaHQ6IDIwcHg7ICB0ZXh0LWFsaWduOiBjZW50ZXI7IGZvbnQtc2l6ZTogMjBweDsgIGNvbG9yOiAjZmZmZmZmOyB0b3A6IC0zMHB4OyByaWdodDogMTBweDt9LnBsYXllci5sb2FkaW5nIC5jb250cm9sbGVyIC5sb2FkaW5nLWljb24geyAgZGlzcGxheTogYmxvY2s7fS5wbGF5ZXI6LXdlYmtpdC1mdWxsLXNjcmVlbiAuY29udHJvbGxlciB7IC13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZVkoNTBweCk7IC13ZWJraXQtdHJhbnNpdGlvbjogLXdlYmtpdC10cmFuc2Zvcm0gMC4zcyBlYXNlO30ucGxheWVyOi1tb3otZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgeyAtbW96LXRyYW5zZm9ybTp0cmFuc2xhdGVZKDUwcHgpOyAgLW1vei10cmFuc2l0aW9uOiAtbW96LXRyYW5zZm9ybSAwLjNzIGVhc2U7fS5wbGF5ZXI6ZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgeyAgdHJhbnNmb3JtOnRyYW5zbGF0ZVkoNTBweCk7IHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2U7fS5wbGF5ZXIuYWN0aXZlOi13ZWJraXQtZnVsbC1zY3JlZW4geyBjdXJzb3I6IGRlZmF1bHQ7fS5wbGF5ZXIuYWN0aXZlOi1tb3otZnVsbC1zY3JlZW4geyAgY3Vyc29yOiBkZWZhdWx0O30ucGxheWVyLmFjdGl2ZTpmdWxsLXNjcmVlbiB7IGN1cnNvcjogZGVmYXVsdDt9LnBsYXllci5hY3RpdmU6LXdlYmtpdC1mdWxsLXNjcmVlbiAuY29udHJvbGxlciwucGxheWVyOi13ZWJraXQtZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXI6aG92ZXIgeyAtd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGVZKDApOyAgY3Vyc29yOiBkZWZhdWx0O30ucGxheWVyLmFjdGl2ZTotbW96LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyLC5wbGF5ZXI6LW1vei1mdWxsLXNjcmVlbiAuY29udHJvbGxlcjpob3ZlciB7IC1tb3otdHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCk7IGN1cnNvcjogZGVmYXVsdDt9LnBsYXllci5hY3RpdmU6ZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIucGxheWVyOmZ1bGwtc2NyZWVuIC5jb250cm9sbGVyOmhvdmVyIHsgIHRyYW5zZm9ybTp0cmFuc2xhdGVZKDApOyAgY3Vyc29yOiBkZWZhdWx0O30ucGxheWVyLmFjdGl2ZTotd2Via2l0LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIC5wcm9ncmVzcyAucHJvZ3Jlc3NfYW5jaG9yOmFmdGVyLC5wbGF5ZXI6LXdlYmtpdC1mdWxsLXNjcmVlbiAuY29udHJvbGxlcjpob3ZlciAucHJvZ3Jlc3MgLnByb2dyZXNzX2FuY2hvcjphZnRlciB7IGhlaWdodDoxMnB4O30ucGxheWVyLmFjdGl2ZTotbW96LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIC5wcm9ncmVzcyAucHJvZ3Jlc3NfYW5jaG9yOmFmdGVyLC5wbGF5ZXI6LW1vei1mdWxsLXNjcmVlbiAuY29udHJvbGxlcjpob3ZlciAucHJvZ3Jlc3MgLnByb2dyZXNzX2FuY2hvcjphZnRlciB7IGhlaWdodDoxMnB4O30ucGxheWVyLmFjdGl2ZTpmdWxsLXNjcmVlbiAuY29udHJvbGxlciAucHJvZ3Jlc3MgLnByb2dyZXNzX2FuY2hvcjphZnRlciwucGxheWVyOmZ1bGwtc2NyZWVuIC5jb250cm9sbGVyOmhvdmVyIC5wcm9ncmVzcyAucHJvZ3Jlc3NfYW5jaG9yOmFmdGVyIHsgaGVpZ2h0OjEycHg7fS5wbGF5ZXI6LXdlYmtpdC1mdWxsLXNjcmVlbiAuY29udHJvbGxlciAucHJvZ3Jlc3MgLnByb2dyZXNzX2FuY2hvcjphZnRlciB7IGhlaWdodDo0cHg7fS5wbGF5ZXI6LW1vei1mdWxsLXNjcmVlbiAuY29udHJvbGxlciAucHJvZ3Jlc3MgLnByb2dyZXNzX2FuY2hvcjphZnRlciB7IGhlaWdodDo0cHg7fS5wbGF5ZXI6ZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgLnByb2dyZXNzIC5wcm9ncmVzc19hbmNob3I6YWZ0ZXIgeyAgaGVpZ2h0OjRweDt9LmNvbnRyb2xsZXIgLnByb2dyZXNzIHsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6MHB4OyAgbGVmdDowOyByaWdodDowOyAgYm9yZGVyLXJpZ2h0OiA0cHggc29saWQgIzE4MUExRDsgIGJvcmRlci1sZWZ0OiA4cHggc29saWQgI0RGNjU1ODsgaGVpZ2h0OiA0cHg7ICBiYWNrZ3JvdW5kOiAjMTgxQTFEOyAgei1pbmRleDoxOyAgLXdlYmtpdC10cmFuc2Zvcm06IHRyYW5zbGF0ZVooMCk7IC1tb3otdHJhbnNmb3JtOiB0cmFuc2xhdGVaKDApOyAgdHJhbnNmb3JtOiB0cmFuc2xhdGVaKDApO30uY29udHJvbGxlciAucHJvZ3Jlc3M6YWZ0ZXIgeyBjb250ZW50OlwiXCI7IGRpc3BsYXk6IGJsb2NrOyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDowcHg7ICBsZWZ0OjA7IHJpZ2h0OjA7ICBib3R0b206LTEwcHg7IGhlaWdodDogMTBweDt9LmNvbnRyb2xsZXIgLnByb2dyZXNzIC5hbmNob3IgeyBoZWlnaHQ6IDRweDsgIGJhY2tncm91bmQ6ICNERjY1NTg7ICBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDowO2xlZnQ6MDt9LmNvbnRyb2xsZXIgLnByb2dyZXNzIC5hbmNob3I6YWZ0ZXIgeyBjb250ZW50OlwiXCI7IGRpc3BsYXk6IGJsb2NrOyB3aWR0aDogMTJweDsgIGJhY2tncm91bmQ6ICNERjY1NTg7ICBwb3NpdGlvbjogYWJzb2x1dGU7IHJpZ2h0Oi00cHg7IHRvcDogNTAlOyBoZWlnaHQ6IDEycHg7IGJveC1zaGFkb3c6IDAgMCAycHggcmdiYSgwLDAsMCwgMC40KTsgYm9yZGVyLXJhZGl1czogMTJweDsgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpOyAgLW1vei10cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7IHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTt9LmNvbnRyb2xsZXIgLnByb2dyZXNzIC5hbmNob3IuYnVmZmVyZWRfYW5jaG9yIHsgIHBvc2l0aW9uOiByZWxhdGl2ZTsgYmFja2dyb3VuZDogcmdiYSgyNTUsMjU1LDI1NSwwLjEpO30uY29udHJvbGxlciAucHJvZ3Jlc3MgLmFuY2hvci5idWZmZXJlZF9hbmNob3I6YWZ0ZXIgeyAgYm94LXNoYWRvdzogbm9uZTsgaGVpZ2h0OiA0cHg7ICB3aWR0aDogNHB4OyBib3JkZXItcmFkaXVzOiAwOyBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwyNTUsMjU1LDAuMSk7fS5jb250cm9sbGVyIC5yaWdodCB7IGhlaWdodDogNTBweDsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6MDsgIGxlZnQ6MTBweDsgIHJpZ2h0OjEwcHg7IHBvaW50ZXItZXZlbnRzOiBub25lO30uY29udHJvbGxlciAucGxheSwuY29udHJvbGxlciAudm9sdW1lLC5jb250cm9sbGVyIC50aW1lLC5jb250cm9sbGVyIC5oZCwuY29udHJvbGxlciAuYWlycGxheSwuY29udHJvbGxlciAuYWxsc2NyZWVuLC5jb250cm9sbGVyIC5ub3JtYWxzY3JlZW4sLmNvbnRyb2xsZXIgLmNvbW1lbnRzLWJ0biwuY29udHJvbGxlciAuZnVsbHNjcmVlbiB7IHBhZGRpbmctdG9wOjRweDsgIGhlaWdodDogNDZweDsgbGluZS1oZWlnaHQ6IDUwcHg7ICB0ZXh0LWFsaWduOiBjZW50ZXI7IGNvbG9yOiAjZWVlZWVlOyBmbG9hdDpsZWZ0OyB0ZXh0LXNoYWRvdzowIDAgMnB4IHJnYmEoMCwwLDAsMC41KTsgIHBvaW50ZXItZXZlbnRzOiBhdXRvO30uY29udHJvbGxlciAuaGQsLmNvbnRyb2xsZXIgLmFpcnBsYXksLmNvbnRyb2xsZXIgLmFsbHNjcmVlbiwuY29udHJvbGxlciAubm9ybWFsc2NyZWVuLC5jb250cm9sbGVyIC5jb21tZW50cy1idG4sLmNvbnRyb2xsZXIgLmZ1bGxzY3JlZW4geyBmbG9hdDpyaWdodDt9LmNvbnRyb2xsZXIgLnBsYXkgeyAgd2lkdGg6IDM2cHg7ICBwYWRkaW5nLWxlZnQ6IDEwcHg7IGN1cnNvcjogcG9pbnRlcjt9LmNvbnRyb2xsZXIgLnBsYXk6YWZ0ZXIgeyAgZm9udC1mYW1pbHk6IFwiRm9udEF3ZXNvbWVcIjsgY29udGVudDogXCJcXFxcZjA0Y1wiO30uY29udHJvbGxlciAucGxheS5wYXVzZWQ6YWZ0ZXIgeyBjb250ZW50OiBcIlxcXFxmMDRiXCI7fS5jb250cm9sbGVyIC52b2x1bWUgeyAgbWluLXdpZHRoOiAzMHB4OyAgcG9zaXRpb246IHJlbGF0aXZlOyBvdmVyZmxvdzogaGlkZGVuOyAtd2Via2l0LXRyYW5zaXRpb246IG1pbi13aWR0aCAwLjNzIGVhc2UgMC41czsgLW1vei10cmFuc2l0aW9uOiBtaW4td2lkdGggMC4zcyBlYXNlIDAuNXM7ICB0cmFuc2l0aW9uOiBtaW4td2lkdGggMC4zcyBlYXNlIDAuNXM7fS5jb250cm9sbGVyIC52b2x1bWU6aG92ZXIgeyBtaW4td2lkdGg6IDEyOHB4O30uY29udHJvbGxlciAudm9sdW1lOmJlZm9yZSB7ICBmb250LWZhbWlseTogXCJGb250QXdlc29tZVwiOyBjb250ZW50OiBcIlxcXFxmMDI4XCI7ICB3aWR0aDogMzZweDsgIGRpc3BsYXk6IGJsb2NrO30uY29udHJvbGxlciAudm9sdW1lIC5wcm9ncmVzcyB7IHdpZHRoOiA3MHB4OyAgdG9wOiAyN3B4OyAgbGVmdDogNDBweDt9LmNvbnRyb2xsZXIgLnRpbWUgeyBmb250LXNpemU6IDEycHg7ICBmb250LXdlaWdodDogYm9sZDsgIHBhZGRpbmctbGVmdDogMTBweDt9LmNvbnRyb2xsZXIgLnRpbWUgLmN1cnJlbnQgeyAgY29sb3I6ICNERjY1NTg7fS5jb250cm9sbGVyIC5mdWxsc2NyZWVuLC5jb250cm9sbGVyIC5haXJwbGF5LC5jb250cm9sbGVyIC5hbGxzY3JlZW4sLmNvbnRyb2xsZXIgLmNvbW1lbnRzLWJ0biwuY29udHJvbGxlciAubm9ybWFsc2NyZWVuIHsgd2lkdGg6IDM2cHg7ICBjdXJzb3I6IHBvaW50ZXI7fS5jb250cm9sbGVyIC5jb21tZW50cy1idG4geyAgbWFyZ2luLXJpZ2h0OiAtMTVweDsgIGRpc3BsYXk6IG5vbmU7fS5wbGF5ZXIuaGFzLWNvbW1lbnRzIC5jb250cm9sbGVyIC5jb21tZW50cy1idG4geyBkaXNwbGF5OiBibG9jazt9LmNvbnRyb2xsZXIgLmNvbW1lbnRzLWJ0bjpiZWZvcmUgeyAgZm9udC1mYW1pbHk6IFwiRm9udEF3ZXNvbWVcIjsgY29udGVudDogXCJcXFxcZjA3NVwiO30uY29udHJvbGxlciAuY29tbWVudHMtYnRuLmVuYWJsZTpiZWZvcmUgeyAgY29sb3I6ICNERjY1NTg7fS5jb250cm9sbGVyIC5haXJwbGF5LC5jb250cm9sbGVyIC5ub3JtYWxzY3JlZW4geyAgZGlzcGxheTogbm9uZTt9LnBsYXllcjotd2Via2l0LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIC5mdWxsc2NyZWVuLC5wbGF5ZXI6LXdlYmtpdC1mdWxsLXNjcmVlbiAuY29udHJvbGxlciAuYWxsc2NyZWVuIHsgZGlzcGxheTogbm9uZTt9LnBsYXllcjotd2Via2l0LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIC5ub3JtYWxzY3JlZW4sLnBsYXllci5hbGxzY3JlZW4gLmNvbnRyb2xsZXIgLm5vcm1hbHNjcmVlbiwucGxheWVyLnN1cHBvcnQtYWlycGxheSAuY29udHJvbGxlciAuYWlycGxheSB7IGRpc3BsYXk6IGJsb2NrO30ucGxheWVyLmFsbHNjcmVlbiAuY29udHJvbGxlciAuYWxsc2NyZWVuIHsgIGRpc3BsYXk6IG5vbmU7fS5jb250cm9sbGVyIC5mdWxsc2NyZWVuOmJlZm9yZSB7IGZvbnQtZmFtaWx5OiBcIkZvbnRBd2Vzb21lXCI7IGNvbnRlbnQ6IFwiXFxcXGYwYjJcIjt9LmNvbnRyb2xsZXIgLmFsbHNjcmVlbjpiZWZvcmUgeyAgZm9udC1mYW1pbHk6IFwiRm9udEF3ZXNvbWVcIjsgY29udGVudDogXCJcXFxcZjA2NVwiO30uY29udHJvbGxlciAubm9ybWFsc2NyZWVuOmJlZm9yZSB7IGZvbnQtZmFtaWx5OiBcIkZvbnRBd2Vzb21lXCI7IGNvbnRlbnQ6IFwiXFxcXGYwNjZcIjt9LmNvbnRyb2xsZXIgLmFpcnBsYXkgeyBiYWNrZ3JvdW5kOiB1cmwoZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCxQRDk0Yld3Z2RtVnljMmx2YmowaU1TNHdJaUJsYm1OdlpHbHVaejBpZFhSbUxUZ2lQejQ4SVVSUFExUlpVRVVnYzNabklGQlZRa3hKUXlBaUxTOHZWek5ETHk5RVZFUWdVMVpISURFdU1TOHZSVTRpSUNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk5SGNtRndhR2xqY3k5VFZrY3ZNUzR4TDBSVVJDOXpkbWN4TVM1a2RHUWlQanh6ZG1jZ2RtVnljMmx2YmowaU1TNHhJaUJwWkQwaWJXRnRZUzFoYVhKd2JHRjVMV2xqYjI0aUlIaHRiRzV6UFNKb2RIUndPaTh2ZDNkM0xuY3pMbTl5Wnk4eU1EQXdMM04yWnlJZ2VHMXNibk02ZUd4cGJtczlJbWgwZEhBNkx5OTNkM2N1ZHpNdWIzSm5MekU1T1RrdmVHeHBibXNpSUhnOUlqQndlQ0lnZVQwaU1IQjRJaUIzYVdSMGFEMGlNakp3ZUNJZ2FHVnBaMmgwUFNJeE5uQjRJaUIyYVdWM1FtOTRQU0l3SURBZ01qSWdNVFlpSUhodGJEcHpjR0ZqWlQwaWNISmxjMlZ5ZG1VaVBqeHdiMng1YkdsdVpTQndiMmx1ZEhNOUlqVXNNVElnTVN3eE1pQXhMREVnTWpFc01TQXlNU3d4TWlBeE55d3hNaUlnYzNSNWJHVTlJbVpwYkd3NmRISmhibk53WVhKbGJuUTdjM1J5YjJ0bE9uZG9hWFJsTzNOMGNtOXJaUzEzYVdSMGFEb3hJaTgrUEhCdmJIbHNhVzVsSUhCdmFXNTBjejBpTkN3eE5pQXhNU3d4TUNBeE9Dd3hOaUlnYzNSNWJHVTlJbVpwYkd3NmQyaHBkR1U3YzNSeWIydGxPblJ5WVc1emNHRnlaVzUwTzNOMGNtOXJaUzEzYVdSMGFEb3dJaTgrUEM5emRtYytEUW89KSBuby1yZXBlYXQgY2VudGVyIDIwcHg7ICBiYWNrZ3JvdW5kLXNpemU6IDIycHggYXV0bzt9LmNvbnRyb2xsZXIgLmhkIHsgd2hpdGUtc3BhY2U6bm93cmFwOyBvdmVyZmxvdzogaGlkZGVuOyBtYXJnaW4tcmlnaHQ6IDEwcHg7IHRleHQtYWxpZ246IHJpZ2h0O30uY29udHJvbGxlciAuaGQ6aG92ZXIgbGkgeyBtYXgtd2lkdGg6IDMwMHB4O30uY29udHJvbGxlciAuaGQgbGkgeyAgZGlzcGxheTogaW5saW5lLWJsb2NrOyAgbWF4LXdpZHRoOiAwcHg7IC13ZWJraXQtdHJhbnNpdGlvbjogbWF4LXdpZHRoIDAuOHMgZWFzZSAwLjNzOyAtbW96LXRyYW5zaXRpb246IG1heC13aWR0aCAwLjhzIGVhc2UgMC4zczsgIHRyYW5zaXRpb246IG1heC13aWR0aCAwLjhzIGVhc2UgMC4zczsgb3ZlcmZsb3c6IGhpZGRlbjsgZm9udC1zaXplOiAxNHB4OyAgZm9udC13ZWlnaHQ6IGJvbGQ7ICBwb3NpdGlvbjogcmVsYXRpdmU7IGN1cnNvcjogcG9pbnRlcjt9LmNvbnRyb2xsZXIgLmhkIGxpOmJlZm9yZSB7ICBjb250ZW50OiBcIlwiOyAgZGlzcGxheTogaW5saW5lLWJsb2NrOyAgd2lkdGg6MjBweDt9LmNvbnRyb2xsZXIgLmhkIGxpOmJlZm9yZSB7IGNvbnRlbnQ6IFwiXCI7ICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7ICB3aWR0aDoyMHB4O30uY29udHJvbGxlciAuaGQgbGkuY3VyciB7IG1heC13aWR0aDogMzAwcHg7IGN1cnNvcjogZGVmYXVsdDsgIGNvbG9yOiAjREY2NTU4O30uY29udHJvbGxlciAuaGQgbGkuY3VycjphZnRlciB7IGNvbnRlbnQ6IFwiXCI7ICBkaXNwbGF5OiBibG9jazsgcG9zaXRpb246IGFic29sdXRlOyB3aWR0aDo0cHg7ICBoZWlnaHQ6NHB4OyBib3JkZXItcmFkaXVzOiA1MCU7IGJhY2tncm91bmQ6ICNmZmZmZmY7ICBsZWZ0OiAxMnB4OyB0b3A6IDIzcHg7ICBvcGFjaXR5OiAwOyAtd2Via2l0LXRyYW5zaXRpb246IG9wYWNpdHkgMC41cyBlYXNlIDAuM3M7IC1tb3otdHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzIGVhc2UgMC4zczsgIHRyYW5zaXRpb246IG9wYWNpdHkgMC41cyBlYXNlIDAuM3M7fSd9LHt9XSwxMzpbZnVuY3Rpb24oZSx0KXt0LmV4cG9ydHM9JzxkaXYgY2xhc3M9XCJwbGF5ZXJcIj4gIDxkaXYgY2xhc3M9XCJ2aWRlby1mcmFtZVwiPjx2aWRlbyBjbGFzcz1cInZpZGVvXCIgYXV0b3BsYXk9XCJhdXRvcGxheVwiPjwvdmlkZW8+PGNhbnZhcyBjbGFzcz1cImNvbW1lbnRzXCI+PC9jYW52YXM+PC9kaXY+ICA8ZGl2IGNsYXNzPVwiY29udHJvbGxlclwiPiAgICA8ZGl2IGNsYXNzPVwibG9hZGluZy1pY29uIGZhIGZhLXNwaW4gZmEtY2lyY2xlLW8tbm90Y2hcIj48L2Rpdj4gICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3NcIj4gICAgICA8ZGl2IGNsYXNzPVwiYW5jaG9yIGJ1ZmZlcmVkX2FuY2hvclwiIHN0eWxlPVwid2lkdGg6MCVcIj48L2Rpdj4gICAgIDxkaXYgY2xhc3M9XCJhbmNob3IgcHJvZ3Jlc3NfYW5jaG9yXCIgc3R5bGU9XCJ3aWR0aDowJVwiPjwvZGl2PiAgIDwvZGl2PiAgICA8ZGl2IGNsYXNzPVwicmlnaHRcIj4gICAgIDxkaXYgY2xhc3M9XCJmdWxsc2NyZWVuXCI+PC9kaXY+ICAgICAgPGRpdiBjbGFzcz1cImFsbHNjcmVlblwiPjwvZGl2PiAgICAgPGRpdiBjbGFzcz1cIm5vcm1hbHNjcmVlblwiPjwvZGl2PiAgICAgIDxkaXYgY2xhc3M9XCJhaXJwbGF5XCI+PC9kaXY+ICAgICA8dWwgY2xhc3M9XCJoZFwiPjwvdWw+ICAgICAgPGRpdiBjbGFzcz1cImNvbW1lbnRzLWJ0blwiPjwvZGl2PiAgICAgPC9kaXY+ICAgIDxkaXYgY2xhc3M9XCJsZWZ0XCI+ICAgICA8ZGl2IGNsYXNzPVwicGxheSBwYXVzZWRcIj48L2Rpdj4gICAgIDxkaXYgY2xhc3M9XCJ2b2x1bWVcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzc1wiPiAgICAgICAgICA8ZGl2IGNsYXNzPVwiYW5jaG9yIHZvbHVtZV9hbmNob3JcIiBzdHlsZT1cIndpZHRoOjAlXCI+PC9kaXY+ICAgICAgIDwvZGl2PiAgICAgIDwvZGl2PiAgICAgIDxkaXYgY2xhc3M9XCJ0aW1lXCI+ICAgICAgICA8c3BhbiBjbGFzcz1cImN1cnJlbnRcIj4wMDowMDowMDwvc3Bhbj4gLyA8c3BhbiBjbGFzcz1cImR1cmF0aW9uXCI+MDA6MDA6MDA8L3NwYW4+ICAgICAgPC9kaXY+ICAgICA8L2Rpdj4gPC9kaXY+PC9kaXY+J30se31dLDE0OltmdW5jdGlvbihlLHQpe2Z1bmN0aW9uIGkoZSx0KXtyZXR1cm4oQXJyYXkodCkuam9pbigwKStlKS5zbGljZSgtdCl9ZnVuY3Rpb24gbihlKXt2YXIgdCxuPVtdO3JldHVyblszNjAwLDYwLDFdLmZvckVhY2goZnVuY3Rpb24obyl7bi5wdXNoKGkodD1lL298MCwyKSksZS09dCpvfSksbi5qb2luKFwiOlwiKX10LmV4cG9ydHM9bn0se31dfSx7fSxbMTBdKTtcblxuLy9leHBvcnRzXG5tb2R1bGUuZXhwb3J0cyA9IE1BTUFQbGF5ZXI7IiwiLypcbiAqIFB1cmwgKEEgSmF2YVNjcmlwdCBVUkwgcGFyc2VyKSB2Mi4zLjFcbiAqIERldmVsb3BlZCBhbmQgbWFpbnRhbmluZWQgYnkgTWFyayBQZXJraW5zLCBtYXJrQGFsbG1hcmtlZHVwLmNvbVxuICogU291cmNlIHJlcG9zaXRvcnk6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbGxtYXJrZWR1cC9qUXVlcnktVVJMLVBhcnNlclxuICogTGljZW5zZWQgdW5kZXIgYW4gTUlULXN0eWxlIGxpY2Vuc2UuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYWxsbWFya2VkdXAvalF1ZXJ5LVVSTC1QYXJzZXIvYmxvYi9tYXN0ZXIvTElDRU5TRSBmb3IgZGV0YWlscy5cbiAqL1xuXG52YXIgdGFnMmF0dHIgPSB7XG4gICAgICAgIGEgICAgICAgOiAnaHJlZicsXG4gICAgICAgIGltZyAgICAgOiAnc3JjJyxcbiAgICAgICAgZm9ybSAgICA6ICdhY3Rpb24nLFxuICAgICAgICBiYXNlICAgIDogJ2hyZWYnLFxuICAgICAgICBzY3JpcHQgIDogJ3NyYycsXG4gICAgICAgIGlmcmFtZSAgOiAnc3JjJyxcbiAgICAgICAgbGluayAgICA6ICdocmVmJyxcbiAgICAgICAgZW1iZWQgICA6ICdzcmMnLFxuICAgICAgICBvYmplY3QgIDogJ2RhdGEnXG4gICAgfSxcblxuICAgIGtleSA9IFsnc291cmNlJywgJ3Byb3RvY29sJywgJ2F1dGhvcml0eScsICd1c2VySW5mbycsICd1c2VyJywgJ3Bhc3N3b3JkJywgJ2hvc3QnLCAncG9ydCcsICdyZWxhdGl2ZScsICdwYXRoJywgJ2RpcmVjdG9yeScsICdmaWxlJywgJ3F1ZXJ5JywgJ2ZyYWdtZW50J10sIC8vIGtleXMgYXZhaWxhYmxlIHRvIHF1ZXJ5XG5cbiAgICBhbGlhc2VzID0geyAnYW5jaG9yJyA6ICdmcmFnbWVudCcgfSwgLy8gYWxpYXNlcyBmb3IgYmFja3dhcmRzIGNvbXBhdGFiaWxpdHlcblxuICAgIHBhcnNlciA9IHtcbiAgICAgICAgc3RyaWN0IDogL14oPzooW146XFwvPyNdKyk6KT8oPzpcXC9cXC8oKD86KChbXjpAXSopOj8oW146QF0qKSk/QCk/KFteOlxcLz8jXSopKD86OihcXGQqKSk/KSk/KCgoKD86W14/I1xcL10qXFwvKSopKFtePyNdKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvLCAgLy9sZXNzIGludHVpdGl2ZSwgbW9yZSBhY2N1cmF0ZSB0byB0aGUgc3BlY3NcbiAgICAgICAgbG9vc2UgOiAgL14oPzooPyFbXjpAXSs6W146QFxcL10qQCkoW146XFwvPyMuXSspOik/KD86XFwvXFwvKT8oKD86KChbXjpAXSopOj8oW146QF0qKSk/QCk/KFteOlxcLz8jXSopKD86OihcXGQqKSk/KSgoKFxcLyg/OltePyNdKD8hW14/I1xcL10qXFwuW14/I1xcLy5dKyg/Ols/I118JCkpKSpcXC8/KT8oW14/I1xcL10qKSkoPzpcXD8oW14jXSopKT8oPzojKC4qKSk/KS8gLy8gbW9yZSBpbnR1aXRpdmUsIGZhaWxzIG9uIHJlbGF0aXZlIHBhdGhzIGFuZCBkZXZpYXRlcyBmcm9tIHNwZWNzXG4gICAgfSxcblxuICAgIGlzaW50ID0gL15bMC05XSskLztcblxuZnVuY3Rpb24gcGFyc2VVcmkoIHVybCwgc3RyaWN0TW9kZSApIHtcbiAgICB2YXIgc3RyID0gZGVjb2RlVVJJKCB1cmwgKSxcbiAgICByZXMgICA9IHBhcnNlclsgc3RyaWN0TW9kZSB8fCBmYWxzZSA/ICdzdHJpY3QnIDogJ2xvb3NlJyBdLmV4ZWMoIHN0ciApLFxuICAgIHVyaSA9IHsgYXR0ciA6IHt9LCBwYXJhbSA6IHt9LCBzZWcgOiB7fSB9LFxuICAgIGkgICA9IDE0O1xuXG4gICAgd2hpbGUgKCBpLS0gKSB7XG4gICAgICAgIHVyaS5hdHRyWyBrZXlbaV0gXSA9IHJlc1tpXSB8fCAnJztcbiAgICB9XG5cbiAgICAvLyBidWlsZCBxdWVyeSBhbmQgZnJhZ21lbnQgcGFyYW1ldGVyc1xuICAgIHVyaS5wYXJhbVsncXVlcnknXSA9IHBhcnNlU3RyaW5nKHVyaS5hdHRyWydxdWVyeSddKTtcbiAgICB1cmkucGFyYW1bJ2ZyYWdtZW50J10gPSBwYXJzZVN0cmluZyh1cmkuYXR0clsnZnJhZ21lbnQnXSk7XG5cbiAgICAvLyBzcGxpdCBwYXRoIGFuZCBmcmFnZW1lbnQgaW50byBzZWdtZW50c1xuICAgIHVyaS5zZWdbJ3BhdGgnXSA9IHVyaS5hdHRyLnBhdGgucmVwbGFjZSgvXlxcLyt8XFwvKyQvZywnJykuc3BsaXQoJy8nKTtcbiAgICB1cmkuc2VnWydmcmFnbWVudCddID0gdXJpLmF0dHIuZnJhZ21lbnQucmVwbGFjZSgvXlxcLyt8XFwvKyQvZywnJykuc3BsaXQoJy8nKTtcblxuICAgIC8vIGNvbXBpbGUgYSAnYmFzZScgZG9tYWluIGF0dHJpYnV0ZVxuICAgIHVyaS5hdHRyWydiYXNlJ10gPSB1cmkuYXR0ci5ob3N0ID8gKHVyaS5hdHRyLnByb3RvY29sID8gIHVyaS5hdHRyLnByb3RvY29sKyc6Ly8nK3VyaS5hdHRyLmhvc3QgOiB1cmkuYXR0ci5ob3N0KSArICh1cmkuYXR0ci5wb3J0ID8gJzonK3VyaS5hdHRyLnBvcnQgOiAnJykgOiAnJztcblxuICAgIHJldHVybiB1cmk7XG59XG5cbmZ1bmN0aW9uIGdldEF0dHJOYW1lKCBlbG0gKSB7XG4gICAgdmFyIHRuID0gZWxtLnRhZ05hbWU7XG4gICAgaWYgKCB0eXBlb2YgdG4gIT09ICd1bmRlZmluZWQnICkgcmV0dXJuIHRhZzJhdHRyW3RuLnRvTG93ZXJDYXNlKCldO1xuICAgIHJldHVybiB0bjtcbn1cblxuZnVuY3Rpb24gcHJvbW90ZShwYXJlbnQsIGtleSkge1xuICAgIGlmIChwYXJlbnRba2V5XS5sZW5ndGggPT09IDApIHJldHVybiBwYXJlbnRba2V5XSA9IHt9O1xuICAgIHZhciB0ID0ge307XG4gICAgZm9yICh2YXIgaSBpbiBwYXJlbnRba2V5XSkgdFtpXSA9IHBhcmVudFtrZXldW2ldO1xuICAgIHBhcmVudFtrZXldID0gdDtcbiAgICByZXR1cm4gdDtcbn1cblxuZnVuY3Rpb24gcGFyc2UocGFydHMsIHBhcmVudCwga2V5LCB2YWwpIHtcbiAgICB2YXIgcGFydCA9IHBhcnRzLnNoaWZ0KCk7XG4gICAgaWYgKCFwYXJ0KSB7XG4gICAgICAgIGlmIChpc0FycmF5KHBhcmVudFtrZXldKSkge1xuICAgICAgICAgICAgcGFyZW50W2tleV0ucHVzaCh2YWwpO1xuICAgICAgICB9IGVsc2UgaWYgKCdvYmplY3QnID09IHR5cGVvZiBwYXJlbnRba2V5XSkge1xuICAgICAgICAgICAgcGFyZW50W2tleV0gPSB2YWw7XG4gICAgICAgIH0gZWxzZSBpZiAoJ3VuZGVmaW5lZCcgPT0gdHlwZW9mIHBhcmVudFtrZXldKSB7XG4gICAgICAgICAgICBwYXJlbnRba2V5XSA9IHZhbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcmVudFtrZXldID0gW3BhcmVudFtrZXldLCB2YWxdO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG9iaiA9IHBhcmVudFtrZXldID0gcGFyZW50W2tleV0gfHwgW107XG4gICAgICAgIGlmICgnXScgPT0gcGFydCkge1xuICAgICAgICAgICAgaWYgKGlzQXJyYXkob2JqKSkge1xuICAgICAgICAgICAgICAgIGlmICgnJyAhPT0gdmFsKSBvYmoucHVzaCh2YWwpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgnb2JqZWN0JyA9PSB0eXBlb2Ygb2JqKSB7XG4gICAgICAgICAgICAgICAgb2JqW2tleXMob2JqKS5sZW5ndGhdID0gdmFsO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBvYmogPSBwYXJlbnRba2V5XSA9IFtwYXJlbnRba2V5XSwgdmFsXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmICh+cGFydC5pbmRleE9mKCddJykpIHtcbiAgICAgICAgICAgIHBhcnQgPSBwYXJ0LnN1YnN0cigwLCBwYXJ0Lmxlbmd0aCAtIDEpO1xuICAgICAgICAgICAgaWYgKCFpc2ludC50ZXN0KHBhcnQpICYmIGlzQXJyYXkob2JqKSkgb2JqID0gcHJvbW90ZShwYXJlbnQsIGtleSk7XG4gICAgICAgICAgICBwYXJzZShwYXJ0cywgb2JqLCBwYXJ0LCB2YWwpO1xuICAgICAgICAgICAgLy8ga2V5XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIWlzaW50LnRlc3QocGFydCkgJiYgaXNBcnJheShvYmopKSBvYmogPSBwcm9tb3RlKHBhcmVudCwga2V5KTtcbiAgICAgICAgICAgIHBhcnNlKHBhcnRzLCBvYmosIHBhcnQsIHZhbCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1lcmdlKHBhcmVudCwga2V5LCB2YWwpIHtcbiAgICBpZiAofmtleS5pbmRleE9mKCddJykpIHtcbiAgICAgICAgdmFyIHBhcnRzID0ga2V5LnNwbGl0KCdbJyk7XG4gICAgICAgIHBhcnNlKHBhcnRzLCBwYXJlbnQsICdiYXNlJywgdmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWlzaW50LnRlc3Qoa2V5KSAmJiBpc0FycmF5KHBhcmVudC5iYXNlKSkge1xuICAgICAgICAgICAgdmFyIHQgPSB7fTtcbiAgICAgICAgICAgIGZvciAodmFyIGsgaW4gcGFyZW50LmJhc2UpIHRba10gPSBwYXJlbnQuYmFzZVtrXTtcbiAgICAgICAgICAgIHBhcmVudC5iYXNlID0gdDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoa2V5ICE9PSAnJykge1xuICAgICAgICAgICAgc2V0KHBhcmVudC5iYXNlLCBrZXksIHZhbCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhcmVudDtcbn1cblxuZnVuY3Rpb24gcGFyc2VTdHJpbmcoc3RyKSB7XG4gICAgcmV0dXJuIHJlZHVjZShTdHJpbmcoc3RyKS5zcGxpdCgvJnw7LyksIGZ1bmN0aW9uKHJldCwgcGFpcikge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcGFpciA9IGRlY29kZVVSSUNvbXBvbmVudChwYWlyLnJlcGxhY2UoL1xcKy9nLCAnICcpKTtcbiAgICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgICAgICAvLyBpZ25vcmVcbiAgICAgICAgfVxuICAgICAgICB2YXIgZXFsID0gcGFpci5pbmRleE9mKCc9JyksXG4gICAgICAgICAgICBicmFjZSA9IGxhc3RCcmFjZUluS2V5KHBhaXIpLFxuICAgICAgICAgICAga2V5ID0gcGFpci5zdWJzdHIoMCwgYnJhY2UgfHwgZXFsKSxcbiAgICAgICAgICAgIHZhbCA9IHBhaXIuc3Vic3RyKGJyYWNlIHx8IGVxbCwgcGFpci5sZW5ndGgpO1xuXG4gICAgICAgIHZhbCA9IHZhbC5zdWJzdHIodmFsLmluZGV4T2YoJz0nKSArIDEsIHZhbC5sZW5ndGgpO1xuXG4gICAgICAgIGlmIChrZXkgPT09ICcnKSB7XG4gICAgICAgICAgICBrZXkgPSBwYWlyO1xuICAgICAgICAgICAgdmFsID0gJyc7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbWVyZ2UocmV0LCBrZXksIHZhbCk7XG4gICAgfSwgeyBiYXNlOiB7fSB9KS5iYXNlO1xufVxuXG5mdW5jdGlvbiBzZXQob2JqLCBrZXksIHZhbCkge1xuICAgIHZhciB2ID0gb2JqW2tleV07XG4gICAgaWYgKHR5cGVvZiB2ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICBvYmpba2V5XSA9IHZhbDtcbiAgICB9IGVsc2UgaWYgKGlzQXJyYXkodikpIHtcbiAgICAgICAgdi5wdXNoKHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb2JqW2tleV0gPSBbdiwgdmFsXTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxhc3RCcmFjZUluS2V5KHN0cikge1xuICAgIHZhciBsZW4gPSBzdHIubGVuZ3RoLFxuICAgICAgICBicmFjZSxcbiAgICAgICAgYztcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKSB7XG4gICAgICAgIGMgPSBzdHJbaV07XG4gICAgICAgIGlmICgnXScgPT0gYykgYnJhY2UgPSBmYWxzZTtcbiAgICAgICAgaWYgKCdbJyA9PSBjKSBicmFjZSA9IHRydWU7XG4gICAgICAgIGlmICgnPScgPT0gYyAmJiAhYnJhY2UpIHJldHVybiBpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gcmVkdWNlKG9iaiwgYWNjdW11bGF0b3Ipe1xuICAgIHZhciBpID0gMCxcbiAgICAgICAgbCA9IG9iai5sZW5ndGggPj4gMCxcbiAgICAgICAgY3VyciA9IGFyZ3VtZW50c1syXTtcbiAgICB3aGlsZSAoaSA8IGwpIHtcbiAgICAgICAgaWYgKGkgaW4gb2JqKSBjdXJyID0gYWNjdW11bGF0b3IuY2FsbCh1bmRlZmluZWQsIGN1cnIsIG9ialtpXSwgaSwgb2JqKTtcbiAgICAgICAgKytpO1xuICAgIH1cbiAgICByZXR1cm4gY3Vycjtcbn1cblxuZnVuY3Rpb24gaXNBcnJheSh2QXJnKSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2QXJnKSA9PT0gXCJbb2JqZWN0IEFycmF5XVwiO1xufVxuXG5mdW5jdGlvbiBrZXlzKG9iaikge1xuICAgIHZhciBrZXlfYXJyYXkgPSBbXTtcbiAgICBmb3IgKCB2YXIgcHJvcCBpbiBvYmogKSB7XG4gICAgICAgIGlmICggb2JqLmhhc093blByb3BlcnR5KHByb3ApICkga2V5X2FycmF5LnB1c2gocHJvcCk7XG4gICAgfVxuICAgIHJldHVybiBrZXlfYXJyYXk7XG59XG5cbmZ1bmN0aW9uIHB1cmwoIHVybCwgc3RyaWN0TW9kZSApIHtcbiAgICBpZiAoIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgdXJsID09PSB0cnVlICkge1xuICAgICAgICBzdHJpY3RNb2RlID0gdHJ1ZTtcbiAgICAgICAgdXJsID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBzdHJpY3RNb2RlID0gc3RyaWN0TW9kZSB8fCBmYWxzZTtcbiAgICB1cmwgPSB1cmwgfHwgd2luZG93LmxvY2F0aW9uLnRvU3RyaW5nKCk7XG5cbiAgICByZXR1cm4ge1xuXG4gICAgICAgIGRhdGEgOiBwYXJzZVVyaSh1cmwsIHN0cmljdE1vZGUpLFxuXG4gICAgICAgIC8vIGdldCB2YXJpb3VzIGF0dHJpYnV0ZXMgZnJvbSB0aGUgVVJJXG4gICAgICAgIGF0dHIgOiBmdW5jdGlvbiggYXR0ciApIHtcbiAgICAgICAgICAgIGF0dHIgPSBhbGlhc2VzW2F0dHJdIHx8IGF0dHI7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIGF0dHIgIT09ICd1bmRlZmluZWQnID8gdGhpcy5kYXRhLmF0dHJbYXR0cl0gOiB0aGlzLmRhdGEuYXR0cjtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyByZXR1cm4gcXVlcnkgc3RyaW5nIHBhcmFtZXRlcnNcbiAgICAgICAgcGFyYW0gOiBmdW5jdGlvbiggcGFyYW0gKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHBhcmFtICE9PSAndW5kZWZpbmVkJyA/IHRoaXMuZGF0YS5wYXJhbS5xdWVyeVtwYXJhbV0gOiB0aGlzLmRhdGEucGFyYW0ucXVlcnk7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gcmV0dXJuIGZyYWdtZW50IHBhcmFtZXRlcnNcbiAgICAgICAgZnBhcmFtIDogZnVuY3Rpb24oIHBhcmFtICkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBwYXJhbSAhPT0gJ3VuZGVmaW5lZCcgPyB0aGlzLmRhdGEucGFyYW0uZnJhZ21lbnRbcGFyYW1dIDogdGhpcy5kYXRhLnBhcmFtLmZyYWdtZW50O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHJldHVybiBwYXRoIHNlZ21lbnRzXG4gICAgICAgIHNlZ21lbnQgOiBmdW5jdGlvbiggc2VnICkge1xuICAgICAgICAgICAgaWYgKCB0eXBlb2Ygc2VnID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnNlZy5wYXRoO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWcgPSBzZWcgPCAwID8gdGhpcy5kYXRhLnNlZy5wYXRoLmxlbmd0aCArIHNlZyA6IHNlZyAtIDE7IC8vIG5lZ2F0aXZlIHNlZ21lbnRzIGNvdW50IGZyb20gdGhlIGVuZFxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEuc2VnLnBhdGhbc2VnXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvLyByZXR1cm4gZnJhZ21lbnQgc2VnbWVudHNcbiAgICAgICAgZnNlZ21lbnQgOiBmdW5jdGlvbiggc2VnICkge1xuICAgICAgICAgICAgaWYgKCB0eXBlb2Ygc2VnID09PSAndW5kZWZpbmVkJyApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnNlZy5mcmFnbWVudDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VnID0gc2VnIDwgMCA/IHRoaXMuZGF0YS5zZWcuZnJhZ21lbnQubGVuZ3RoICsgc2VnIDogc2VnIC0gMTsgLy8gbmVnYXRpdmUgc2VnbWVudHMgY291bnQgZnJvbSB0aGUgZW5kXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5zZWcuZnJhZ21lbnRbc2VnXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfTtcblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHB1cmw7XG4iLCIvKiAg77yDZnVuY3Rpb24gcXVlcnlTdHJpbmcjXG4gKiAgPCBPYmplY3QgICDkvovlpoIge2E6MSxiOjIsYzozfVxuICogID4gU3RyaW5nICAg5L6L5aaCIGE9MSZiPTImYz0zXG4gKiAg55So5LqO5ou86KOFdXJs5Zyw5Z2A55qEcXVlcnlcbiAqL1xuZnVuY3Rpb24gcXVlcnlTdHJpbmcgKG9iaikge1xuICB2YXIgcXVlcnkgPSBbXVxuICBmb3IgKG9uZSBpbiBvYmopIHtcbiAgICBpZiAob2JqLmhhc093blByb3BlcnR5KG9uZSkpIHtcbiAgICAgIHF1ZXJ5LnB1c2goW29uZSwgb2JqW29uZV1dLmpvaW4oJz0nKSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHF1ZXJ5LmpvaW4oJyYnKVxufVxubW9kdWxlLmV4cG9ydHMgPSBxdWVyeVN0cmluZyIsIi8qICA5MXBvcm4gXG4gKiAgQFNub296ZSAyMDE1LTctMjZcbiAqL1xudmFyIGNhblBsYXlNM1U4ID0gcmVxdWlyZSgnLi9jYW5QbGF5TTNVOCcpXG52YXIgYWpheCAgICAgICAgPSByZXF1aXJlKCcuL2FqYXgnKVxudmFyIGxvZyAgICAgICAgID0gcmVxdWlyZSgnLi9sb2cnKVxuXG5leHBvcnRzLm1hdGNoID0gZnVuY3Rpb24gKHVybCkge1xuICBpZiAod2luZG93LnNvICYmIHdpbmRvdy5zby52YXJpYWJsZXMpIHtcbiAgICB2YXIgZmlsZUlkID0gd2luZG93LnNvLnZhcmlhYmxlcy5maWxlXG4gICAgdmFyIHNlY0NvZGUgPSB3aW5kb3cuc28udmFyaWFibGVzLnNlY2NvZGVcbiAgICB2YXIgbWF4X3ZpZCA9IHdpbmRvdy5zby52YXJpYWJsZXMubWF4X3ZpZFxuICAgIHJldHVybiAhIWZpbGVJZCAmICEhc2VjQ29kZSAmICEhbWF4X3ZpZCAmIFxuICAgICAgL3ZpZXdfdmlkZW9cXC5waHBcXD92aWV3a2V5Ly50ZXN0KCB1cmwuYXR0cignc291cmNlJykgKVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0cy5nZXRWaWRlb3MgPSBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaykgeyAgXG4gIC8vdmFyIG1lZGlhU3BhY2VIVE1MID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtZWRpYXNwYWNlXCIpLmlubmVySFRNTFxuICAvL3ZhciBmaWxlSWQgPSAvZmlsZScsJyguKj8pJy9pLmV4ZWMobWVkaWFTcGFjZUhUTUwpWzFdXG4gIC8vdmFyIHNlY0NvZGUgPSAvc2VjY29kZScsJyguKj8pJy9pLmV4ZWMobWVkaWFTcGFjZUhUTUwpWzFdXG4gIC8vdmFyIG1heF92aWQgPSAvbWF4X2JpZCcsJyguKj8pJy9pLmV4ZWMobWVkaWFTcGFjZUhUTUwpWzFdXG4gIHZhciBmaWxlSWQgPSB3aW5kb3cuc28udmFyaWFibGVzLmZpbGVcbiAgdmFyIHNlY0NvZGUgPSB3aW5kb3cuc28udmFyaWFibGVzLnNlY2NvZGVcbiAgdmFyIG1heF92aWQgPSB3aW5kb3cuc28udmFyaWFibGVzLm1heF92aWRcbiAgXG5cbiAgdmFyIG1wNCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICBhamF4KHtcbiAgICAgIHVybDogJ2h0dHA6Ly93d3cuOTFwb3JuLmNvbS9nZXRmaWxlLnBocCcsXG4gICAgICBqc29ucDogZmFsc2UsXG4gICAgICBwYXJhbToge1xuICAgICAgICBWSUQ6IGZpbGVJZCxcbiAgICAgICAgbXA0OiAnMCcsXG4gICAgICAgIHNlY2NvZGU6IHNlY0NvZGUsXG4gICAgICAgIG1heF92aWQ6IG1heF92aWRcbiAgICAgIH0sXG4gICAgICBjb250ZW50VHlwZTogJ25vdEpTT04nLFxuICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKHBhcmFtKXtcbiAgICAgICAgaWYocGFyYW0gPT0gLTEgfHwgcGFyYW0uY29kZSA9PSAtMSkgcmV0dXJuIGxvZygn6Kej5p6QOTFwb3Ju6KeG6aKR5Zyw5Z2A5aSx6LSlJylcbiAgICAgICAgbXA0VXJsID0gcGFyYW0uc3BsaXQoJz0nKVsxXS5zcGxpdCgnJicpWzBdXG4gICAgICAgIHZhciB1cmxzID0gW11cbiAgICAgICAgdXJscy5wdXNoKFsn5L2O5riF54mIJywgbXA0VXJsXSlcbiAgICAgICAgbG9nKCfop6PmnpA5MXBvcm7op4bpopHlnLDlnYDmiJDlip8gJyArIHVybHMubWFwKGZ1bmN0aW9uIChpdGVtKSB7cmV0dXJuICc8YSBocmVmPScraXRlbVsxXSsnPicraXRlbVswXSsnPC9hPid9KS5qb2luKCcgJyksIDIpXG4gICAgICAgIC8vIGNvbnNvbGUuaW5mbyh1cmxzKVxuICAgICAgICByZXR1cm4gY2FsbGJhY2sodXJscyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG4gIG1wNChjYWxsYmFjaylcbn1cblxuXG5cbiIsIi8qICBiaWxpYmxpIFxuICogIEDmnLHkuIBcbiAqL1xudmFyIHB1cmwgICAgICA9IHJlcXVpcmUoJy4vcHVybCcpXG52YXIgbG9nICAgICAgID0gcmVxdWlyZSgnLi9sb2cnKVxudmFyIGh0dHBQcm94eSA9IHJlcXVpcmUoJy4vaHR0cFByb3h5JylcbnZhciBnZXRDb29raWUgPSByZXF1aXJlKCcuL2dldENvb2tpZScpXG5cbmZ1bmN0aW9uIHBhZChudW0sIG4pIHsgXG4gIHJldHVybiAoQXJyYXkobikuam9pbigwKSArIG51bSkuc2xpY2UoLW4pXG59XG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAodXJsKSB7XG4gIHJldHVybiB1cmwuYXR0cignaG9zdCcpLmluZGV4T2YoJ2JpbGliaWxpJykgPj0gMCAmJiAvXlxcL3ZpZGVvXFwvYXZcXGQrXFwvJC8udGVzdCh1cmwuYXR0cignZGlyZWN0b3J5JykpXG59XG5cbmV4cG9ydHMuZ2V0VmlkZW9zID0gZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHtcbiAgbG9nKCflvIDlp4vop6PmnpBiaWxpYmxp6KeG6aKR5Zyw5Z2AJylcbiAgdmFyIGFpZCA9IHVybC5hdHRyKCdkaXJlY3RvcnknKS5tYXRjaCgvXlxcL3ZpZGVvXFwvYXYoXFxkKylcXC8kLylbMV1cbiAgdmFyIHBhZ2UgPSAoZnVuY3Rpb24gKCkge1xuICAgIHBhZ2VNYXRjaCA9IHVybC5hdHRyKCdmaWxlJykubWF0Y2goL15pbmRleFxcXyhcXGQrKVxcLmh0bWwkLylcbiAgICByZXR1cm4gcGFnZU1hdGNoID8gcGFnZU1hdGNoWzFdIDogMVxuICB9KCkpXG4gIFxuICBodHRwUHJveHkoXG4gICAgJ2h0dHA6Ly93d3cuYmlsaWJpbGkuY29tL20vaHRtbDUnLCBcbiAgICAnZ2V0JywgXG4gICAge2FpZDogYWlkLCBwYWdlOiBwYWdlLCBzaWQ6IGdldENvb2tpZSgnc2lkJyl9LFxuICBmdW5jdGlvbiAocnMpIHtcbiAgICBpZiAocnMgJiYgcnMuc3JjKSB7XG4gICAgICBsb2coJ+iOt+WPluWIsDxhIGhyZWY9XCInK3JzLnNyYysnXCI+6KeG6aKR5Zyw5Z2APC9hPiwg5bm25byA5aeL6Kej5p6QYmlsaWJsaeW8ueW5lScpXG4gICAgICB2YXIgc291cmNlID0gWyBbJ2JpbGliaWxpJywgcnMuc3JjXSBdXG4gICAgICBodHRwUHJveHkocnMuY2lkLCAnZ2V0Jywge30sIGZ1bmN0aW9uIChycykge1xuXG4gICAgICAgIGlmIChycyAmJiBycy5pKSB7XG4gICAgICAgICAgdmFyIGNvbW1lbnRzID0gW10uY29uY2F0KHJzLmkuZCB8fCBbXSlcbiAgICAgICAgICBjb21tZW50cyA9IGNvbW1lbnRzLm1hcChmdW5jdGlvbiAoY29tbWVudCkge1xuICAgICAgICAgICAgdmFyIHAgPSBjb21tZW50WydAcCddLnNwbGl0KCcsJylcbiAgICAgICAgICAgIHN3aXRjaCAocFsxXSB8IDApIHtcbiAgICAgICAgICAgICAgY2FzZSA0OiAgcFsxXSA9ICdib3R0b20nOyBicmVha1xuICAgICAgICAgICAgICBjYXNlIDU6ICBwWzFdID0gICd0b3AnOyBicmVha1xuICAgICAgICAgICAgICBkZWZhdWx0OiBwWzFdID0gJ2xvb3AnXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICB0aW1lOiBwYXJzZUZsb2F0KHBbMF0pLFxuICAgICAgICAgICAgICBwb3M6ICBwWzFdLFxuICAgICAgICAgICAgICBjb2xvcjogJyMnICsgcGFkKChwWzNdIHwgMCkudG9TdHJpbmcoMTYpLCA2KSxcbiAgICAgICAgICAgICAgdGV4dDogY29tbWVudFsnI3RleHQnXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgIHJldHVybiBhLnRpbWUgLSBiLnRpbWVcbiAgICAgICAgICB9KVxuICAgICAgICAgIGxvZygn5LiA5YiH6aG65Yip5byA5aeL5pKt5pS+JywgMilcbiAgICAgICAgICBjYWxsYmFjayhzb3VyY2UsIGNvbW1lbnRzKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGxvZygn6Kej5p6QYmlsaWJsaeW8ueW5leWksei0pSwg5L2G5YuJ5by65Y+v5Lul5pKt5pS+JywgMilcbiAgICAgICAgICBjYWxsYmFjayhzb3VyY2UpXG4gICAgICAgIH1cblxuICAgICAgfSwge2d6aW5mbGF0ZToxLCB4bWw6MX0pXG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZygn6Kej5p6QYmlsaWJsaeinhumikeWcsOWdgOWksei0pScsIDIpXG4gICAgICBjYWxsYmFjayhmYWxzZSlcbiAgICB9XG4gIH0pXG59XG4iLCIvKiAgdHVkb3UgXG4gKiAgQOacseS4gFxuICovXG52YXIgY2FuUGxheU0zVTggPSByZXF1aXJlKCcuL2NhblBsYXlNM1U4JylcbnZhciBhamF4ICAgICAgICA9IHJlcXVpcmUoJy4vYWpheCcpXG52YXIgbG9nICAgICAgICAgPSByZXF1aXJlKCcuL2xvZycpXG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAodXJsKSB7XG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG4gIGFqYXgoe1xuICAgIHVybDogJ2h0dHA6Ly9hY2Z1bmZpeC5zaW5hYXBwLmNvbS9tYW1hLnBocCcsXG4gICAganNvbnA6IHRydWUsXG4gICAgcGFyYW06IHtcbiAgICAgIHVybDogdXJsLmF0dHIoJ3NvdXJjZScpXG4gICAgfSxcbiAgICBjYWxsYmFjazogZnVuY3Rpb24ocGFyYW0pIHtcbiAgICAgIGlmIChwYXJhbS5jb2RlICE9IDIwMCkge1xuICAgICAgICBjYWxsYmFjayhmYWxzZSk7XG4gICAgICB9XG4gICAgICB2YXIgc291cmNlID0gY2FuUGxheU0zVTggJiYgcGFyYW0ubTN1OCA/IHBhcmFtLm0zdTggOiBwYXJhbS5tcDQ7XG4gICAgICB2YXIgcnMgPSBbXTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yKHR5cGUgaW4gc291cmNlKSB7XG4gICAgICAgICAgcnMucHVzaChbdHlwZSwgc291cmNlW3R5cGVdXSk7XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2socnMpO1xuICAgICAgfVxuICAgIH1cbiAgfSlcbn0iLCIvKiAgaHVuYW50diBcbiAqICBA5oOF6L+35rW36b6fcGl6emFcbiAqL1xudmFyIGNhblBsYXlNM1U4ID0gcmVxdWlyZSgnLi9jYW5QbGF5TTNVOCcpXG52YXIgYWpheCAgICAgICAgPSByZXF1aXJlKCcuL2FqYXgnKVxudmFyIGxvZyAgICAgICAgID0gcmVxdWlyZSgnLi9sb2cnKVxuZXhwb3J0cy5tYXRjaCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgcmV0dXJuIC93d3dcXC5odW5hbnR2XFwuY29tLy50ZXN0KHVybC5hdHRyKCdob3N0JykpXG59XG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG4gIC8v6IqS5p6c5Y+w5rKh5pyJbXA0IG8o4pWv4pah4pWwKW9cbiAgaWYgKGNhblBsYXlNM1U4KSB7XG4gICAgdmFyIGdldFBhcmFtcyA9IGZ1bmN0aW9uKHJlcV91cmwpe1xuICAgICAgdmFyIHBhcmFtc191cmwgPSByZXFfdXJsLnNwbGl0KFwiP1wiKVsxXTtcbiAgICAgIHZhciBwYXJhbXNfdG1wID0gbmV3IEFycmF5KCk7XG4gICAgICBwYXJhbXNfdG1wID0gcGFyYW1zX3VybC5zcGxpdChcIiZcIik7XG4gICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICBmb3Ioa2V5IGluIHBhcmFtc190bXApe1xuICAgICAgICBwYXJhbSA9IHBhcmFtc190bXBba2V5XTtcbiAgICAgICAgaXRlbSA9IG5ldyBBcnJheSgpO1xuICAgICAgICBpdGVtID0gcGFyYW1zX3RtcFtrZXldLnNwbGl0KFwiPVwiKTtcbiAgICAgICAgaWYgKGl0ZW1bMF0gIT0gJycpIHtcbiAgICAgICAgICAgIHBhcmFtc1tpdGVtWzBdXSA9IGl0ZW1bMV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgfVxuXG4gICAgdmFyIG0zdThfcmVxX3Bhcm1zID0gJyZmbXQ9NiZwbm89NyZtM3U4PTEnO1xuICAgIHZhciBzdHJfb3JpZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdGbGFzaFZhcnMnKVswXS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG4gICAgdmFyIHN0cl90bXAgPSBzdHJfb3JpZy5zcGxpdChcIiZmaWxlPVwiKVsxXTtcbiAgICB2YXIgcmVxX3VybCA9IHN0cl90bXAuc3BsaXQoXCIlMjZmbXRcIilbMF07XG4gICAgcmVxX3VybCA9IHJlcV91cmwgKyBtM3U4X3JlcV9wYXJtcztcbiAgICByZXFfdXJsID0gZGVjb2RlVVJJQ29tcG9uZW50KHJlcV91cmwpO1xuICAgIHBhcmFtcyA9IGdldFBhcmFtcyhyZXFfdXJsKTtcblxuICAgIC8v6I635Y+W5LiJ56eN5riF5pmw5bqmXG4gICAgdmFyIGxpbWl0cmF0ZSA9IG5ldyBBcnJheSgpO1xuICAgIGxpbWl0cmF0ZSA9IFsnNTcwJywgJzEwNTYnLCAnMTYxNSddO1xuICAgIHVybHMgPSBuZXcgQXJyYXkoKTtcbiAgICBwYXJhbXMubGltaXRyYXRlID0gbGltaXRyYXRlWzBdO1xuICAgIHRleHQgPSBcIuagh+a4hVwiO1xuICAgIGFqYXgoe1xuICAgICAgICB1cmw6ICdodHRwOi8vcGN2Y3IuY2RuLmltZ28udHYvbmNycy92b2QuZG8nLFxuICAgICAgICBqc29ucDogdHJ1ZSxcbiAgICAgICAgcGFyYW06IHBhcmFtcyxcbiAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgIGlmIChkYXRhLnN0YXR1cyA9PSAnb2snKSB1cmxzLnB1c2goW3RleHQsIGRhdGEuaW5mb10pXG4gICAgICAgICAgcGFyYW1zLmxpbWl0cmF0ZSA9IGxpbWl0cmF0ZVsxXTtcbiAgICAgICAgICB0ZXh0ID0gXCLpq5jmuIVcIjtcbiAgICAgICAgICBhamF4KHtcbiAgICAgICAgICAgICAgdXJsOiAnaHR0cDovL3BjdmNyLmNkbi5pbWdvLnR2L25jcnMvdm9kLmRvJyxcbiAgICAgICAgICAgICAganNvbnA6IHRydWUsXG4gICAgICAgICAgICAgIHBhcmFtOiBwYXJhbXMsXG4gICAgICAgICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT0gJ29rJykgdXJscy5wdXNoKFt0ZXh0LCBkYXRhLmluZm9dKVxuICAgICAgICAgICAgICAgIHBhcmFtcy5saW1pdHJhdGUgPSBsaW1pdHJhdGVbMl07XG4gICAgICAgICAgICAgICAgdGV4dCA9IFwi6LaF5riFXCI7XG4gICAgICAgICAgICAgICAgYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9wY3Zjci5jZG4uaW1nby50di9uY3JzL3ZvZC5kbycsXG4gICAgICAgICAgICAgICAgICAgIGpzb25wOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBwYXJhbTogcGFyYW1zLFxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09ICdvaycpIHVybHMucHVzaChbdGV4dCwgZGF0YS5pbmZvXSlcbiAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sodXJscyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gIH1lbHNle1xuICAgIGxvZygn6K+35L2/55SoU2FmYXJp6KeC55yL5pys6KeG6aKRJyk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgfSwgMjAwMCk7XG4gIH1cbn0iLCIvKiAgaXFpeWkgXG4gKiAgQOacseS4gFxuICovXG52YXIgY2FuUGxheU0zVTggPSByZXF1aXJlKCcuL2NhblBsYXlNM1U4JylcbnZhciBxdWVyeVN0cmluZyA9IHJlcXVpcmUoJy4vcXVlcnlTdHJpbmcnKVxudmFyIGdldENvb2tpZSA9IHJlcXVpcmUoJy4vZ2V0Q29va2llJylcbnZhciBhamF4ID0gcmVxdWlyZSgnLi9hamF4JylcbnZhciBodHRwUHJveHkgPSByZXF1aXJlKCcuL2h0dHBQcm94eScpXG52YXIgbG9nID0gcmVxdWlyZSgnLi9sb2cnKVxuXG5leHBvcnRzLm1hdGNoID0gZnVuY3Rpb24gKHVybCkge1xuICAgIHJldHVybiAvXmh0dHA6XFwvXFwvd3d3XFwuaXFpeWlcXC5jb20vLnRlc3QodXJsLmF0dHIoJ3NvdXJjZScpKSAmJiAhIXdpbmRvdy5RLlBhZ2VJbmZvXG59XG5cbmV4cG9ydHMuZ2V0VmlkZW9zID0gZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHtcbiAgICB2YXIgdWlkID0gJyc7XG4gICAgdHJ5e1xuICAgIHVpZCA9IEpTT04ucGFyc2UoZ2V0Q29va2llKCdQMDAwMDInKSkudWlkXG4gICAgfWNhdGNoKGUpIHt9XG4gICAgdmFyIGN1cGlkID0gJ3FjXzEwMDAwMV8xMDAxMDInIC8v6L+Z5Liq5YaZ5q275ZCnXG4gICAgdmFyIHR2SWQgPSB3aW5kb3cuUS5QYWdlSW5mby5wbGF5UGFnZUluZm8udHZJZFxuICAgIHZhciBhbGJ1bUlkID0gd2luZG93LlEuUGFnZUluZm8ucGxheVBhZ2VJbmZvLmFsYnVtSWRcbiAgICB2YXIgdmlkID0gd2luZG93LlEuUGFnZUluZm8ucGxheVBhZ2VJbmZvLnZpZCB8fFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZmxhc2hib3gnKS5nZXRBdHRyaWJ1dGUoJ2RhdGEtcGxheWVyLXZpZGVvaWQnKVxuXG4gICAgdmFyIGh0dHBQcm94eU9wdHMgPSB7dGV4dDogdHJ1ZSwgdWE6ICdNb3ppbGxhLzUuMCAoaVBhZDsgQ1BVIGlQaG9uZSBPUyA4XzEgbGlrZSBNYWMgT1MgWCkgQXBwbGVXZWJLaXQvNjAwLjEuNCAoS0hUTUwsIGxpa2UgR2Vja28pIFZlcnNpb24vOC4wIE1vYmlsZS8xMkI0MTAgU2FmYXJpLzYwMC4xLjQnfVxuXG4gICAgaHR0cFByb3h5KGxvY2F0aW9uLmhyZWYsICdnZXQnLCB7fSwgZnVuY3Rpb24ocnMpIHtcbiAgICAgICAgdmFyIG0gPSBycy5tYXRjaCgvPHNjcmlwdFtePl0qPlxccyooZXZhbC4qOylcXHMqKD89PFxcL3NjcmlwdD4pPFxcL3NjcmlwdD4vKVxuICAgICAgICB3aW5kb3cuX19xbHQgPSB3aW5kb3cuX19xbHQgfHwge01BTUEyUGxhY2VIb2xkZXI6IHRydWV9XG4gICAgICAgIHdpbmRvdy5RUCA9IHdpbmRvdy5RUCB8fCB7fVxuICAgICAgICB3aW5kb3cuUVAuX3JlYWR5ID0gZnVuY3Rpb24gKGUpIHtpZih0aGlzLl9pc1JlYWR5KXtlJiZlKCl9ZWxzZXtlJiZ0aGlzLl93YWl0cy5wdXNoKGUpfX1cbiAgICAgICAgZXZhbChtWzFdKVxuICAgICAgICB2YXIgcGFyYW0gPSB3ZW9yamppZ2godHZJZClcbiAgICAgICAgcGFyYW0udWlkID0gdWlkXG4gICAgICAgIHBhcmFtLmN1cGlkID0gY3VwaWRcbiAgICAgICAgcGFyYW0ucGxhdEZvcm0gPSAnaDUnXG4gICAgICAgIHBhcmFtLnR5cGUgPSBjYW5QbGF5TTNVOCA/ICdtM3U4JyA6ICdtcDQnLFxuICAgICAgICBwYXJhbS5xeXBpZCA9IHR2SWQgKyAnXzIxJ1xuICAgICAgICBhamF4KHtcbiAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9jYWNoZS5tLmlxaXlpLmNvbS9qcC90bXRzLycrdHZJZCsnLycrdmlkKycvJyxcbiAgICAgICAgICAgIGpzb25wOiB0cnVlLFxuICAgICAgICAgICAgcGFyYW06IHBhcmFtLFxuICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uIChycykge1xuICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBbXVxuICAgICAgICAgICAgICAgIGlmIChycy5kYXRhLm0zdXR4Lmxlbmd0aCA+IDApIHNvdXJjZS5wdXNoKFsn6auY5riFJywgcnMuZGF0YS5tM3V0eF0pXG4gICAgICAgICAgICAgICAgaWYgKHJzLmRhdGEubTN1Lmxlbmd0aCA+IDApIHNvdXJjZS5wdXNoKFsn5qCH5riFJywgcnMuZGF0YS5tM3VdKVxuICAgICAgICAgICAgICAgIGNhbGxiYWNrKHNvdXJjZSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICB9LCBodHRwUHJveHlPcHRzKVxufVxuIiwiLyogIHR1ZG91IFxuICogIEDmnLHkuIBcbiAqL1xudmFyIGNhblBsYXlNM1U4ID0gcmVxdWlyZSgnLi9jYW5QbGF5TTNVOCcpXG52YXIgYWpheCAgICAgICAgPSByZXF1aXJlKCcuL2FqYXgnKVxudmFyIGxvZyAgICAgICAgID0gcmVxdWlyZSgnLi9sb2cnKVxudmFyIHlvdWt1ICAgICAgID0gcmVxdWlyZSgnLi9zZWVrZXJfeW91a3UnKVxuXG5leHBvcnRzLm1hdGNoID0gZnVuY3Rpb24gKHVybCkge1xuICB2YXIgX2lkID0gd2luZG93LmlpZCB8fCAod2luZG93LnBhZ2VDb25maWcgJiYgd2luZG93LnBhZ2VDb25maWcuaWlkKSB8fCAod2luZG93Lml0ZW1EYXRhICYmIHdpbmRvdy5pdGVtRGF0YS5paWQpXG4gIHZhciB5b3VrdUNvZGUgPSB3aW5kb3cuaXRlbURhdGEgJiYgd2luZG93Lml0ZW1EYXRhLnZjb2RlXG4gIHJldHVybiAvdHVkb3VcXC5jb20vLnRlc3QodXJsLmF0dHIoJ2hvc3QnKSkgJiYgKHlvdWt1Q29kZSB8fCBfaWQpXG59XG5cbmV4cG9ydHMuZ2V0VmlkZW9zID0gZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHsgIFxuICB2YXIgeW91a3VDb2RlID0gd2luZG93Lml0ZW1EYXRhICYmIHdpbmRvdy5pdGVtRGF0YS52Y29kZVxuICBpZiAoeW91a3VDb2RlKSB7XG4gICAgcmV0dXJuIHlvdWt1LnBhcnNlWW91a3VDb2RlKHlvdWt1Q29kZSwgY2FsbGJhY2spXG4gIH1cbiAgdmFyIF9pZCA9IHdpbmRvdy5paWQgfHwgKHdpbmRvdy5wYWdlQ29uZmlnICYmIHdpbmRvdy5wYWdlQ29uZmlnLmlpZCkgfHwgKHdpbmRvdy5pdGVtRGF0YSAmJiB3aW5kb3cuaXRlbURhdGEuaWlkKTtcbiAgdmFyIG0zdTggPSBmdW5jdGlvbihjYWxsYmFjayl7ICAgIFxuICAgIHZhciB1cmxzID0gW1xuICAgICAgWyfljp/nlLsnLCAnaHR0cDovL3ZyLnR1ZG91LmNvbS92MnByb3h5L3YyLm0zdTg/aXQ9JyArIF9pZCArICcmc3Q9NSddLFxuICAgICAgWyfotoXmuIUnLCAnaHR0cDovL3ZyLnR1ZG91LmNvbS92MnByb3h5L3YyLm0zdTg/aXQ9JyArIF9pZCArICcmc3Q9NCddLFxuICAgICAgWyfpq5jmuIUnLCAnaHR0cDovL3ZyLnR1ZG91LmNvbS92MnByb3h5L3YyLm0zdTg/aXQ9JyArIF9pZCArICcmc3Q9MyddLFxuICAgICAgWyfmoIfmuIUnLCAnaHR0cDovL3ZyLnR1ZG91LmNvbS92MnByb3h5L3YyLm0zdTg/aXQ9JyArIF9pZCArICcmc3Q9MiddXG4gICAgXVxuICAgIHZhciBfc1xuICAgIGlmKHdpbmRvdy5pdGVtRGF0YSAmJiB3aW5kb3cuaXRlbURhdGEuc2Vncyl7XG4gICAgICB1cmxzID0gW11cbiAgICAgIF9zICAgPSBKU09OLnBhcnNlKHdpbmRvdy5pdGVtRGF0YS5zZWdzKVxuICAgICAgaWYoX3NbNV0pIHVybHMucHVzaChbJ+WOn+eUuycsICdodHRwOi8vdnIudHVkb3UuY29tL3YycHJveHkvdjIubTN1OD9pdD0nICsgX2lkICsgJyZzdD01J10pXG4gICAgICBpZihfc1s0XSkgdXJscy5wdXNoKFsn6LaF5riFJywgJ2h0dHA6Ly92ci50dWRvdS5jb20vdjJwcm94eS92Mi5tM3U4P2l0PScgKyBfaWQgKyAnJnN0PTQnXSlcbiAgICAgIGlmKF9zWzNdKSB1cmxzLnB1c2goWyfpq5jmuIUnLCAnaHR0cDovL3ZyLnR1ZG91LmNvbS92MnByb3h5L3YyLm0zdTg/aXQ9JyArIF9pZCArICcmc3Q9MyddKVxuICAgICAgaWYoX3NbMl0pIHVybHMucHVzaChbJ+agh+a4hScsICdodHRwOi8vdnIudHVkb3UuY29tL3YycHJveHkvdjIubTN1OD9pdD0nICsgX2lkICsgJyZzdD0yJ10pXG4gICAgfSAgIFxuICAgIGxvZygn6Kej5p6QdHVkb3Xop4bpopHlnLDlnYDmiJDlip8gJyArIHVybHMubWFwKGZ1bmN0aW9uIChpdGVtKSB7cmV0dXJuICc8YSBocmVmPScraXRlbVsxXSsnPicraXRlbVswXSsnPC9hPid9KS5qb2luKCcgJyksIDIpXG4gICAgY2FsbGJhY2sodXJscylcbiAgfTtcbiAgdmFyIG1wNCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcbiAgICBhamF4KHtcbiAgICAgIHVybDogJ2h0dHA6Ly92ci50dWRvdS5jb20vdjJwcm94eS92Mi5qcycsXG4gICAgICBwYXJhbToge1xuICAgICAgICBpdDogX2lkLFxuICAgICAgICBzdDogJzUyJTJDNTMlMkM1NCdcbiAgICAgIH0sXG4gICAgICBqc29ucDogJ2pzb25wJyxcbiAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihwYXJhbSl7XG4gICAgICAgIGlmKHBhcmFtID09PSAtMSB8fCBwYXJhbS5jb2RlID09IC0xKSByZXR1cm4gbG9nKCfop6PmnpB0dWRvdeinhumikeWcsOWdgOWksei0pScpXG4gICAgICAgIGZvcih2YXIgdXJscz1bXSxpPTAsbGVuPXBhcmFtLnVybHMubGVuZ3RoOyBpPGxlbjsgaSsrKXsgdXJscy5wdXNoKFtpLCBwYXJhbS51cmxzW2ldXSk7IH1cbiAgICAgICAgbG9nKCfop6PmnpB0dWRvdeinhumikeWcsOWdgOaIkOWKnyAnICsgdXJscy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtyZXR1cm4gJzxhIGhyZWY9JytpdGVtWzFdKyc+JytpdGVtWzBdKyc8L2E+J30pLmpvaW4oJyAnKSwgMilcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrKHVybHMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuICBjYW5QbGF5TTNVOCA/IG0zdTgoY2FsbGJhY2spIDogbXA0KGNhbGxiYWNrKVxufSIsIi8qICB5b3VrdSBcbiAqICBA5pyx5LiAXG4gKi9cbnZhciBjYW5QbGF5TTNVOCA9IHJlcXVpcmUoJy4vY2FuUGxheU0zVTgnKVxudmFyIGFqYXggICAgICAgID0gcmVxdWlyZSgnLi9hamF4JylcbnZhciBsb2cgICAgICAgICA9IHJlcXVpcmUoJy4vbG9nJylcbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAodXJsKSB7XG4gIHJldHVybiAvdlxcLnlvdWt1XFwuY29tLy50ZXN0KHVybC5hdHRyKCdob3N0JykpICYmICEhd2luZG93LnZpZGVvSWRcbn1cbnZhciBwYXJzZVlvdWt1Q29kZSA9IGV4cG9ydHMucGFyc2VZb3VrdUNvZGUgPSBmdW5jdGlvbiAoX2lkLCBjYWxsYmFjaykge1xuICBsb2coJ+W8gOWni+ino+aekHlvdWt16KeG6aKR5Zyw5Z2AJykgIFxuICB2YXIgbWtfYTMgPSAnYjRldCc7XG4gIHZhciBta19hNCA9ICdib2E0JztcbiAgdmFyIHVzZXJDYWNoZV9hMSA9ICc0JztcbiAgdmFyIHVzZXJDYWNoZV9hMiA9ICcxJztcbiAgdmFyIHJzO1xuICB2YXIgc2lkO1xuICB2YXIgdG9rZW47XG4gIGZ1bmN0aW9uIGRlY29kZTY0KGEpIHtcbiAgICBpZiAoIWEpXG4gICAgICByZXR1cm4gXCJcIjtcbiAgICBhID0gYS50b1N0cmluZygpO1xuICAgIHZhciBiLCBjLCBkLCBlLCBmLCBnLCBoLCBpID0gbmV3IEFycmF5KC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCA2MiwgLTEsIC0xLCAtMSwgNjMsIDUyLCA1MywgNTQsIDU1LCA1NiwgNTcsIDU4LCA1OSwgNjAsIDYxLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSwgMTYsIDE3LCAxOCwgMTksIDIwLCAyMSwgMjIsIDIzLCAyNCwgMjUsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIDI2LCAyNywgMjgsIDI5LCAzMCwgMzEsIDMyLCAzMywgMzQsIDM1LCAzNiwgMzcsIDM4LCAzOSwgNDAsIDQxLCA0MiwgNDMsIDQ0LCA0NSwgNDYsIDQ3LCA0OCwgNDksIDUwLCA1MSwgLTEsIC0xLCAtMSwgLTEsIC0xKTtcbiAgICBmb3IgKGcgPSBhLmxlbmd0aCwgZiA9IDAsIGggPSBcIlwiOyBnID4gZjspIHtcbiAgICAgIGRvXG4gICAgICAgIGIgPSBpWzI1NSAmIGEuY2hhckNvZGVBdChmKyspXTtcbiAgICAgIHdoaWxlIChnID4gZiAmJiAtMSA9PSBiKTtcbiAgICAgIGlmICgtMSA9PSBiKVxuICAgICAgICBicmVhaztcbiAgICAgIGRvXG4gICAgICAgIGMgPSBpWzI1NSAmIGEuY2hhckNvZGVBdChmKyspXTtcbiAgICAgIHdoaWxlIChnID4gZiAmJiAtMSA9PSBjKTtcbiAgICAgIGlmICgtMSA9PSBjKVxuICAgICAgICBicmVhaztcbiAgICAgIGggKz0gU3RyaW5nLmZyb21DaGFyQ29kZShiIDw8IDIgfCAoNDggJiBjKSA+PiA0KTtcbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKGQgPSAyNTUgJiBhLmNoYXJDb2RlQXQoZisrKSwgNjEgPT0gZClcbiAgICAgICAgICByZXR1cm4gaDtcbiAgICAgICAgZCA9IGlbZF1cbiAgICAgIH1cbiAgICAgIHdoaWxlIChnID4gZiAmJiAtMSA9PSBkKTtcbiAgICAgIGlmICgtMSA9PSBkKVxuICAgICAgICBicmVhaztcbiAgICAgIGggKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoMTUgJiBjKSA8PCA0IHwgKDYwICYgZCkgPj4gMik7XG4gICAgICBkbyB7XG4gICAgICAgIGlmIChlID0gMjU1ICYgYS5jaGFyQ29kZUF0KGYrKyksIDYxID09IGUpXG4gICAgICAgICAgcmV0dXJuIGg7XG4gICAgICAgIGUgPSBpW2VdXG4gICAgICB9XG4gICAgICB3aGlsZSAoZyA+IGYgJiYgLTEgPT0gZSk7XG4gICAgICBpZiAoLTEgPT0gZSlcbiAgICAgICAgYnJlYWs7XG4gICAgICBoICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKDMgJiBkKSA8PCA2IHwgZSlcbiAgICB9XG4gICAgcmV0dXJuIGhcbiAgfVxuXG4gIGZ1bmN0aW9uIEQoYSkge1xuICAgIGlmICghYSkgcmV0dXJuIFwiXCI7XG4gICAgdmFyIGEgPSBhLnRvU3RyaW5nKCksXG4gICAgICBjLCBiLCBmLCBlLCBnLCBoO1xuICAgIGYgPSBhLmxlbmd0aDtcbiAgICBiID0gMDtcbiAgICBmb3IgKGMgPSBcIlwiOyBiIDwgZjspIHtcbiAgICAgIGUgPSBhLmNoYXJDb2RlQXQoYisrKSAmIDI1NTtcbiAgICAgIGlmIChiID09IGYpIHtcbiAgICAgICAgYyArPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIi5jaGFyQXQoZSA+PiAyKTtcbiAgICAgICAgYyArPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIi5jaGFyQXQoKGUgJiAzKSA8PCA0KTtcbiAgICAgICAgYyArPSBcIj09XCI7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgICBnID0gYS5jaGFyQ29kZUF0KGIrKyk7XG4gICAgICBpZiAoYiA9PSBmKSB7XG4gICAgICAgIGMgKz0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCIuY2hhckF0KGUgPj4gMik7XG4gICAgICAgIGMgKz0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCIuY2hhckF0KChlICYgMykgPDwgNCB8IChnICYgMjQwKSA+PiA0KTtcbiAgICAgICAgYyArPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIi5jaGFyQXQoKGcgJlxuICAgICAgICAgIDE1KSA8PCAyKTtcbiAgICAgICAgYyArPSBcIj1cIjtcbiAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICAgIGggPSBhLmNoYXJDb2RlQXQoYisrKTtcbiAgICAgIGMgKz0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCIuY2hhckF0KGUgPj4gMik7XG4gICAgICBjICs9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrL1wiLmNoYXJBdCgoZSAmIDMpIDw8IDQgfCAoZyAmIDI0MCkgPj4gNCk7XG4gICAgICBjICs9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrL1wiLmNoYXJBdCgoZyAmIDE1KSA8PCAyIHwgKGggJiAxOTIpID4+IDYpO1xuICAgICAgYyArPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIi5jaGFyQXQoaCAmIDYzKVxuICAgIH1cbiAgICByZXR1cm4gY1xuICB9XG5cbiAgZnVuY3Rpb24gRShhLCBjKSB7XG4gICAgZm9yICh2YXIgYiA9IFtdLCBmID0gMCwgaSwgZSA9IFwiXCIsIGggPSAwOyAyNTYgPiBoOyBoKyspIGJbaF0gPSBoO1xuICAgIGZvciAoaCA9IDA7IDI1NiA+IGg7IGgrKykgZiA9IChmICsgYltoXSArIGEuY2hhckNvZGVBdChoICUgYS5sZW5ndGgpKSAlIDI1NiwgaSA9IGJbaF0sIGJbaF0gPSBiW2ZdLCBiW2ZdID0gaTtcbiAgICBmb3IgKHZhciBxID0gZiA9IGggPSAwOyBxIDwgYy5sZW5ndGg7IHErKykgaCA9IChoICsgMSkgJSAyNTYsIGYgPSAoZiArIGJbaF0pICUgMjU2LCBpID0gYltoXSwgYltoXSA9IGJbZl0sIGJbZl0gPSBpLCBlICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYy5jaGFyQ29kZUF0KHEpIF4gYlsoYltoXSArIGJbZl0pICUgMjU2XSk7XG4gICAgcmV0dXJuIGVcbiAgfVxuXG4gIGZ1bmN0aW9uIEYoYSwgYykge1xuICAgIGZvciAodmFyIGIgPSBbXSwgZiA9IDA7IGYgPCBhLmxlbmd0aDsgZisrKSB7XG4gICAgICBmb3IgKHZhciBpID0gMCwgaSA9IFwiYVwiIDw9IGFbZl0gJiYgXCJ6XCIgPj0gYVtmXSA/IGFbZl0uY2hhckNvZGVBdCgwKSAtIDk3IDogYVtmXSAtIDAgKyAyNiwgZSA9IDA7IDM2ID4gZTsgZSsrKVxuICAgICAgICBpZiAoY1tlXSA9PSBpKSB7XG4gICAgICAgICAgaSA9IGU7XG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgfVxuICAgICAgYltmXSA9IDI1IDwgaSA/IGkgLSAyNiA6IFN0cmluZy5mcm9tQ2hhckNvZGUoaSArIDk3KVxuICAgIH1cbiAgICByZXR1cm4gYi5qb2luKFwiXCIpXG4gIH1cbiAgXG4gIHZhciBQbGF5TGlzdERhdGEgPSBmdW5jdGlvbihhLCBiLCBjKSB7XG4gICAgICB2YXIgZCA9IHRoaXM7XG4gICAgICBuZXcgRGF0ZTtcbiAgICAgIHRoaXMuX3NpZCA9IHNpZCwgdGhpcy5fZmlsZVR5cGUgPSBjLCB0aGlzLl92aWRlb1NlZ3NEaWMgPSB7fTtcbiAgICAgIHRoaXMuX2lwID0gYS5zZWN1cml0eS5pcDtcbiAgICAgIHZhciBlID0gKG5ldyBSYW5kb21Qcm94eSwgW10pLFxuICAgICAgICBmID0gW107XG4gICAgICBmLnN0cmVhbXMgPSB7fSwgZi5sb2dvcyA9IHt9LCBmLnR5cGVBcnIgPSB7fSwgZi50b3RhbFRpbWUgPSB7fTtcbiAgICAgIGZvciAodmFyIGcgPSAwOyBnIDwgYi5sZW5ndGg7IGcrKykge1xuICAgICAgICBmb3IgKHZhciBoID0gYltnXS5hdWRpb19sYW5nLCBpID0gITEsIGogPSAwOyBqIDwgZS5sZW5ndGg7IGorKylcbiAgICAgICAgICBpZiAoZVtqXSA9PSBoKSB7XG4gICAgICAgICAgICBpID0gITA7XG4gICAgICAgICAgICBicmVha1xuICAgICAgICAgIH1cbiAgICAgICAgaSB8fCBlLnB1c2goaClcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGcgPSAwOyBnIDwgZS5sZW5ndGg7IGcrKykge1xuICAgICAgICBmb3IgKHZhciBrID0gZVtnXSwgbCA9IHt9LCBtID0ge30sIG4gPSBbXSwgaiA9IDA7IGogPCBiLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgdmFyIG8gPSBiW2pdO1xuICAgICAgICAgIGlmIChrID09IG8uYXVkaW9fbGFuZykge1xuICAgICAgICAgICAgaWYgKCFkLmlzVmFsaWRUeXBlKG8uc3RyZWFtX3R5cGUpKVxuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIHZhciBwID0gZC5jb252ZXJ0VHlwZShvLnN0cmVhbV90eXBlKSxcbiAgICAgICAgICAgICAgcSA9IDA7XG4gICAgICAgICAgICBcIm5vbmVcIiAhPSBvLmxvZ28gJiYgKHEgPSAxKSwgbVtwXSA9IHE7XG4gICAgICAgICAgICB2YXIgciA9ICExO1xuICAgICAgICAgICAgZm9yICh2YXIgcyBpbiBuKVxuICAgICAgICAgICAgICBwID09IG5bc10gJiYgKHIgPSAhMCk7XG4gICAgICAgICAgICByIHx8IG4ucHVzaChwKTtcbiAgICAgICAgICAgIHZhciB0ID0gby5zZWdzO1xuICAgICAgICAgICAgaWYgKG51bGwgPT0gdClcbiAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB2YXIgdSA9IFtdO1xuICAgICAgICAgICAgciAmJiAodSA9IGxbcF0pO1xuICAgICAgICAgICAgZm9yICh2YXIgdiA9IDA7IHYgPCB0Lmxlbmd0aDsgdisrKSB7XG4gICAgICAgICAgICAgIHZhciB3ID0gdFt2XTtcbiAgICAgICAgICAgICAgaWYgKG51bGwgPT0gdylcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgdmFyIHggPSB7fTtcbiAgICAgICAgICAgICAgeC5ubyA9IHYsIFxuICAgICAgICAgICAgICB4LnNpemUgPSB3LnNpemUsIFxuICAgICAgICAgICAgICB4LnNlY29uZHMgPSBOdW1iZXIody50b3RhbF9taWxsaXNlY29uZHNfdmlkZW8pIC8gMWUzLCBcbiAgICAgICAgICAgICAgeC5taWxsaXNlY29uZHNfdmlkZW8gPSBOdW1iZXIoby5taWxsaXNlY29uZHNfdmlkZW8pIC8gMWUzLCBcbiAgICAgICAgICAgICAgeC5rZXkgPSB3LmtleSwgeC5maWxlSWQgPSB0aGlzLmdldEZpbGVJZChvLnN0cmVhbV9maWxlaWQsIHYpLCBcbiAgICAgICAgICAgICAgeC5zcmMgPSB0aGlzLmdldFZpZGVvU3JjKGosIHYsIGEsIG8uc3RyZWFtX3R5cGUsIHguZmlsZUlkKSwgXG4gICAgICAgICAgICAgIHgudHlwZSA9IHAsIFxuICAgICAgICAgICAgICB1LnB1c2goeClcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxbcF0gPSB1XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHZhciB5ID0gdGhpcy5sYW5nQ29kZVRvQ04oaykua2V5O1xuICAgICAgICBmLmxvZ29zW3ldID0gbSwgZi5zdHJlYW1zW3ldID0gbCwgZi50eXBlQXJyW3ldID0gbiAgICAgICAgXG4gICAgICB9XG4gICAgICB0aGlzLl92aWRlb1NlZ3NEaWMgPSBmLCB0aGlzLl92aWRlb1NlZ3NEaWMubGFuZyA9IHRoaXMubGFuZ0NvZGVUb0NOKGVbMF0pLmtleVxuICAgIH0sXG4gICAgUmFuZG9tUHJveHkgPSBmdW5jdGlvbihhKSB7XG4gICAgICB0aGlzLl9yYW5kb21TZWVkID0gYSwgdGhpcy5jZ19odW4oKVxuICAgIH07XG4gIFJhbmRvbVByb3h5LnByb3RvdHlwZSA9IHtcbiAgICBjZ19odW46IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5fY2dTdHIgPSBcIlwiO1xuICAgICAgZm9yICh2YXIgYSA9IFwiYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWi9cXFxcOi5fLTEyMzQ1Njc4OTBcIiwgYiA9IGEubGVuZ3RoLCBjID0gMDsgYiA+IGM7IGMrKykge1xuICAgICAgICB2YXIgZCA9IHBhcnNlSW50KHRoaXMucmFuKCkgKiBhLmxlbmd0aCk7XG4gICAgICAgIHRoaXMuX2NnU3RyICs9IGEuY2hhckF0KGQpLCBhID0gYS5zcGxpdChhLmNoYXJBdChkKSkuam9pbihcIlwiKVxuICAgICAgfVxuICAgIH0sXG4gICAgY2dfZnVuOiBmdW5jdGlvbihhKSB7XG4gICAgICBmb3IgKHZhciBiID0gYS5zcGxpdChcIipcIiksIGMgPSBcIlwiLCBkID0gMDsgZCA8IGIubGVuZ3RoIC0gMTsgZCsrKVxuICAgICAgICBjICs9IHRoaXMuX2NnU3RyLmNoYXJBdChiW2RdKTtcbiAgICAgIHJldHVybiBjXG4gICAgfSxcbiAgICByYW46IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX3JhbmRvbVNlZWQgPSAoMjExICogdGhpcy5fcmFuZG9tU2VlZCArIDMwMDMxKSAlIDY1NTM2LCB0aGlzLl9yYW5kb21TZWVkIC8gNjU1MzZcbiAgICB9XG4gIH0sIFBsYXlMaXN0RGF0YS5wcm90b3R5cGUgPSB7XG4gICAgZ2V0RmlsZUlkOiBmdW5jdGlvbihhLCBiKSB7XG4gICAgICBpZiAobnVsbCA9PSBhIHx8IFwiXCIgPT0gYSlcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgICB2YXIgYyA9IFwiXCIsXG4gICAgICAgIGQgPSBhLnNsaWNlKDAsIDgpLFxuICAgICAgICBlID0gYi50b1N0cmluZygxNik7XG4gICAgICAxID09IGUubGVuZ3RoICYmIChlID0gXCIwXCIgKyBlKSwgZSA9IGUudG9VcHBlckNhc2UoKTtcbiAgICAgIHZhciBmID0gYS5zbGljZSgxMCwgYS5sZW5ndGgpO1xuICAgICAgcmV0dXJuIGMgPSBkICsgZSArIGZcbiAgICB9LFxuICAgIGlzVmFsaWRUeXBlOiBmdW5jdGlvbihhKSB7XG4gICAgICByZXR1cm4gXCIzZ3BoZFwiID09IGEgfHwgXCJmbHZcIiA9PSBhIHx8IFwiZmx2aGRcIiA9PSBhIHx8IFwibXA0aGRcIiA9PSBhIHx8IFwibXA0aGQyXCIgPT0gYSB8fCBcIm1wNGhkM1wiID09IGEgPyAhMCA6ICExXG4gICAgfSxcbiAgICBjb252ZXJ0VHlwZTogZnVuY3Rpb24oYSkge1xuICAgICAgdmFyIGIgPSBhO1xuICAgICAgc3dpdGNoIChhKSB7XG4gICAgICAgIGNhc2UgXCJtM3U4XCI6XG4gICAgICAgICAgYiA9IFwibXA0XCI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCIzZ3BoZFwiOlxuICAgICAgICAgIGIgPSBcIjNncGhkXCI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmbHZcIjpcbiAgICAgICAgICBiID0gXCJmbHZcIjtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImZsdmhkXCI6XG4gICAgICAgICAgYiA9IFwiZmx2XCI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJtcDRoZFwiOlxuICAgICAgICAgIGIgPSBcIm1wNFwiO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibXA0aGQyXCI6XG4gICAgICAgICAgYiA9IFwiaGQyXCI7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJtcDRoZDNcIjpcbiAgICAgICAgICBiID0gXCJoZDNcIlxuICAgICAgfVxuICAgICAgcmV0dXJuIGJcbiAgICB9LFxuICAgIGxhbmdDb2RlVG9DTjogZnVuY3Rpb24oYSkge1xuICAgICAgdmFyIGIgPSBcIlwiO1xuICAgICAgc3dpdGNoIChhKSB7XG4gICAgICAgIGNhc2UgXCJkZWZhdWx0XCI6XG4gICAgICAgICAgYiA9IHtcbiAgICAgICAgICAgIGtleTogXCJndW95dVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwi5Zu96K+tXCJcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiZ3VveXVcIjpcbiAgICAgICAgICBiID0ge1xuICAgICAgICAgICAga2V5OiBcImd1b3l1XCIsXG4gICAgICAgICAgICB2YWx1ZTogXCLlm73or61cIlxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ5dWVcIjpcbiAgICAgICAgICBiID0ge1xuICAgICAgICAgICAga2V5OiBcInl1ZVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwi57Kk6K+tXCJcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiY2h1YW5cIjpcbiAgICAgICAgICBiID0ge1xuICAgICAgICAgICAga2V5OiBcImNodWFuXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCLlt53or51cIlxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJ0YWlcIjpcbiAgICAgICAgICBiID0ge1xuICAgICAgICAgICAga2V5OiBcInRhaVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwi5Y+w5rm+XCJcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwibWluXCI6XG4gICAgICAgICAgYiA9IHtcbiAgICAgICAgICAgIGtleTogXCJtaW5cIixcbiAgICAgICAgICAgIHZhbHVlOiBcIumXveWNl1wiXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImVuXCI6XG4gICAgICAgICAgYiA9IHtcbiAgICAgICAgICAgIGtleTogXCJlblwiLFxuICAgICAgICAgICAgdmFsdWU6IFwi6Iux6K+tXCJcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiamFcIjpcbiAgICAgICAgICBiID0ge1xuICAgICAgICAgICAga2V5OiBcImphXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCLml6Xor61cIlxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJrclwiOlxuICAgICAgICAgIGIgPSB7XG4gICAgICAgICAgICBrZXk6IFwia3JcIixcbiAgICAgICAgICAgIHZhbHVlOiBcIumfqeivrVwiXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImluXCI6XG4gICAgICAgICAgYiA9IHtcbiAgICAgICAgICAgIGtleTogXCJpblwiLFxuICAgICAgICAgICAgdmFsdWU6IFwi5Y2w5bqmXCJcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwicnVcIjpcbiAgICAgICAgICBiID0ge1xuICAgICAgICAgICAga2V5OiBcInJ1XCIsXG4gICAgICAgICAgICB2YWx1ZTogXCLkv4Tor61cIlxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJmclwiOlxuICAgICAgICAgIGIgPSB7XG4gICAgICAgICAgICBrZXk6IFwiZnJcIixcbiAgICAgICAgICAgIHZhbHVlOiBcIuazleivrVwiXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcImRlXCI6XG4gICAgICAgICAgYiA9IHtcbiAgICAgICAgICAgIGtleTogXCJkZVwiLFxuICAgICAgICAgICAgdmFsdWU6IFwi5b636K+tXCJcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwiaXRcIjpcbiAgICAgICAgICBiID0ge1xuICAgICAgICAgICAga2V5OiBcIml0XCIsXG4gICAgICAgICAgICB2YWx1ZTogXCLmhI/or61cIlxuICAgICAgICAgIH07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJlc1wiOlxuICAgICAgICAgIGIgPSB7XG4gICAgICAgICAgICBrZXk6IFwiZXNcIixcbiAgICAgICAgICAgIHZhbHVlOiBcIuilv+ivrVwiXG4gICAgICAgICAgfTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcInBvXCI6XG4gICAgICAgICAgYiA9IHtcbiAgICAgICAgICAgIGtleTogXCJwb1wiLFxuICAgICAgICAgICAgdmFsdWU6IFwi6JGh6K+tXCJcbiAgICAgICAgICB9O1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwidGhcIjpcbiAgICAgICAgICBiID0ge1xuICAgICAgICAgICAga2V5OiBcInRoXCIsXG4gICAgICAgICAgICB2YWx1ZTogXCLms7Dor61cIlxuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBiXG4gICAgfSxcbiAgICBnZXRWaWRlb1NyYzogZnVuY3Rpb24oYSwgYiwgYywgZCwgZSwgZiwgZykge1xuICAgICAgdmFyIGggPSBjLnN0cmVhbVthXSxcbiAgICAgICAgaSA9IGMudmlkZW8uZW5jb2RlaWQ7XG4gICAgICBpZiAoIWkgfHwgIWQpXG4gICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgdmFyIGogPSB7XG4gICAgICAgICAgZmx2OiAwLFxuICAgICAgICAgIGZsdmhkOiAwLFxuICAgICAgICAgIG1wNDogMSxcbiAgICAgICAgICBoZDI6IDIsXG4gICAgICAgICAgXCIzZ3BoZFwiOiAxLFxuICAgICAgICAgIFwiM2dwXCI6IDBcbiAgICAgICAgfSxcbiAgICAgICAgayA9IGpbZF0sXG4gICAgICAgIGwgPSB7XG4gICAgICAgICAgZmx2OiBcImZsdlwiLFxuICAgICAgICAgIG1wNDogXCJtcDRcIixcbiAgICAgICAgICBoZDI6IFwiZmx2XCIsXG4gICAgICAgICAgbXA0aGQ6IFwibXA0XCIsXG4gICAgICAgICAgbXA0aGQyOiBcIm1wNFwiLFxuICAgICAgICAgIFwiM2dwaGRcIjogXCJtcDRcIixcbiAgICAgICAgICBcIjNncFwiOiBcImZsdlwiLFxuICAgICAgICAgIGZsdmhkOiBcImZsdlwiXG4gICAgICAgIH0sXG4gICAgICAgIG0gPSBsW2RdLFxuICAgICAgICBuID0gYi50b1N0cmluZygxNik7XG4gICAgICAxID09IG4ubGVuZ3RoICYmIChuID0gXCIwXCIgKyBuKTtcbiAgICAgIHZhciBvID0gaC5zZWdzW2JdLnRvdGFsX21pbGxpc2Vjb25kc192aWRlbyAvIDFlMyxcbiAgICAgICAgcCA9IGguc2Vnc1tiXS5rZXk7XG4gICAgICAoXCJcIiA9PSBwIHx8IC0xID09IHApICYmIChwID0gaC5rZXkyICsgaC5rZXkxKTtcbiAgICAgIHZhciBxID0gXCJcIjtcbiAgICAgIGMuc2hvdyAmJiAocSA9IGMuc2hvdy5wYXkgPyBcIiZ5cHJlbWl1bT0xXCIgOiBcIiZ5bW92aWU9MVwiKTtcbiAgICAgIHZhciByID0gXCIvcGxheWVyL2dldEZsdlBhdGgvc2lkL1wiICsgc2lkICsgXCJfXCIgKyBuICsgXCIvc3QvXCIgKyBtICsgXCIvZmlsZWlkL1wiICsgZSArIFwiP0s9XCIgKyBwICsgXCImaGQ9XCIgKyBrICsgXCImbXlwPTAmdHM9XCIgKyBvICsgXCImeXBwPTBcIiArIHEsXG4gICAgICAgIHMgPSBbMTksIDEsIDQsIDcsIDMwLCAxNCwgMjgsIDgsIDI0LCAxNywgNiwgMzUsIDM0LCAxNiwgOSwgMTAsIDEzLCAyMiwgMzIsIDI5LCAzMSwgMjEsIDE4LCAzLCAyLCAyMywgMjUsIDI3LCAxMSwgMjAsIDUsIDE1LCAxMiwgMCwgMzMsIDI2XSxcbiAgICAgICAgdCA9IGVuY29kZVVSSUNvbXBvbmVudChlbmNvZGU2NChFKEYobWtfYTQgKyBcInBvelwiICsgdXNlckNhY2hlX2EyLCBzKS50b1N0cmluZygpLCBzaWQgKyBcIl9cIiArIGUgKyBcIl9cIiArIHRva2VuKSkpO1xuICAgICAgcmV0dXJuIHIgKz0gXCImZXA9XCIgKyB0LCByICs9IFwiJmN0eXBlPTEyXCIsIHIgKz0gXCImZXY9MVwiLCByICs9IFwiJnRva2VuPVwiICsgdG9rZW4sIHIgKz0gXCImb2lwPVwiICsgdGhpcy5faXAsIHIgKz0gKGYgPyBcIi9wYXNzd29yZC9cIiArIGYgOiBcIlwiKSArIChnID8gZyA6IFwiXCIpLCByID0gXCJodHRwOi8vay55b3VrdS5jb21cIiArIHJcbiAgICB9XG4gIH07XG5cbiAgYWpheCh7XG4gICAgdXJsOiAnaHR0cDovL3BsYXkueW91a3UuY29tL3BsYXkvZ2V0Lmpzb24/dmlkPScgKyBfaWQgKyAnJmN0PTEyJyxcbiAgICBqc29ucDogdHJ1ZSxcbiAgICBjYWxsYmFjazogZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICBpZihwYXJhbSA9PSAtMSkge1xuICAgICAgICBsb2coJ+ino+aekHlvdWt16KeG6aKR5Zyw5Z2A5aSx6LSlJywgMilcbiAgICAgIH1cbiAgICAgIHJzID0gcGFyYW07XG4gICAgICB2YXIgYSA9IHBhcmFtLmRhdGEsXG4gICAgICAgIGMgPSBFKEYobWtfYTMgKyBcIm8wYlwiICsgdXNlckNhY2hlX2ExLCBbMTksIDEsIDQsIDcsIDMwLCAxNCwgMjgsIDgsIDI0LFxuICAgICAgICAgIDE3LCA2LCAzNSwgMzQsIDE2LCA5LCAxMCwgMTMsIDIyLCAzMiwgMjksIDMxLCAyMSwgMTgsIDMsIDIsIDIzLCAyNSwgMjcsIDExLCAyMCwgNSwgMTUsIDEyLCAwLCAzMywgMjZcbiAgICAgICAgXSkudG9TdHJpbmcoKSwgZGVjb2RlNjQoYS5zZWN1cml0eS5lbmNyeXB0X3N0cmluZykpO1xuICAgICAgYyAgICAgPSBjLnNwbGl0KFwiX1wiKTtcbiAgICAgIHNpZCAgID0gY1swXTtcbiAgICAgIHRva2VuID0gY1sxXTtcbiAgICAgIGlmICggY2FuUGxheU0zVTggJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdQbGF5U3RhdGlvbicpID09PSAtMSApIHtcbiAgICAgICAgdmFyIGVwICA9IGVuY29kZVVSSUNvbXBvbmVudChEKEUoRihta19hNCArIFwicG96XCIgKyB1c2VyQ2FjaGVfYTIsIFsxOSwgMSwgNCwgNywgMzAsIDE0LCAyOCwgOCwgMjQsIDE3LCA2LCAzNSwgMzQsIDE2LCA5LCAxMCwgMTMsIDIyLCAzMiwgMjksIDMxLCAyMSwgMTgsIDMsIDIsIDIzLCAyNSwgMjcsIDExLCAyMCwgNSwgMTUsIDEyLCAwLCAzMywgMjZdKS50b1N0cmluZygpLCBzaWQgKyBcIl9cIiArIF9pZCArIFwiX1wiICsgdG9rZW4pKSk7XG4gICAgICAgIHZhciBvaXAgPSBhLnNlY3VyaXR5LmlwO1xuICAgICAgICB2YXIgc291cmNlID0gW1xuICAgICAgICAgIFsn6LaF5riFJywgJ2h0dHA6Ly9wbC55b3VrdS5jb20vcGxheWxpc3QvbTN1OD92aWQ9JytfaWQrJyZ0eXBlPWhkMiZjdHlwZT0xMiZrZXlmcmFtZT0xJmVwPScrZXArJyZzaWQ9JytzaWQrJyZ0b2tlbj0nK3Rva2VuKycmZXY9MSZvaXA9JytvaXBdLFxuICAgICAgICAgIFsn6auY5riFJywgJ2h0dHA6Ly9wbC55b3VrdS5jb20vcGxheWxpc3QvbTN1OD92aWQ9JytfaWQrJyZ0eXBlPW1wNCZjdHlwZT0xMiZrZXlmcmFtZT0xJmVwPScrZXArJyZzaWQ9JytzaWQrJyZ0b2tlbj0nK3Rva2VuKycmZXY9MSZvaXA9JytvaXBdLFxuICAgICAgICAgIFsn5qCH5riFJywgJ2h0dHA6Ly9wbC55b3VrdS5jb20vcGxheWxpc3QvbTN1OD92aWQ9JytfaWQrJyZ0eXBlPWZsdiZjdHlwZT0xMiZrZXlmcmFtZT0xJmVwPScrZXArJyZzaWQ9JytzaWQrJyZ0b2tlbj0nK3Rva2VuKycmZXY9MSZvaXA9JytvaXBdXG4gICAgICAgIF07XG4gICAgICAgIGxvZygn6Kej5p6QeW91a3Xop4bpopHlnLDlnYDmiJDlip8gJyArIHNvdXJjZS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtyZXR1cm4gJzxhIGhyZWY9JytpdGVtWzFdKyc+JytpdGVtWzBdKyc8L2E+J30pLmpvaW4oJyAnKSwgMilcbiAgICAgICAgY2FsbGJhY2soc291cmNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciB0ID0gbmV3IFBsYXlMaXN0RGF0YShhLCBhLnN0cmVhbSwgJ21wNCcpXG4gICAgICAgIHZhciBzb3VyY2UgPSBbXG4gICAgICAgICAgWyfmoIfmuIUnLCB0Ll92aWRlb1NlZ3NEaWMuc3RyZWFtc1snZ3VveXUnXVsnM2dwaGQnXVswXS5zcmNdXG4gICAgICAgIF07XG4gICAgICAgIGxvZygn6Kej5p6QeW91a3Xop4bpopHlnLDlnYDmiJDlip8gJyArIHNvdXJjZS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtyZXR1cm4gJzxhIGhyZWY9JytpdGVtWzFdKyc+JytpdGVtWzBdKyc8L2E+J30pLmpvaW4oJyAnKSwgMilcbiAgICAgICAgY2FsbGJhY2soc291cmNlKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pXG59XG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG4gIHBhcnNlWW91a3VDb2RlKHdpbmRvdy52aWRlb0lkLCBjYWxsYmFjaylcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IFtcbiAgcmVxdWlyZSgnLi9zZWVrZXJfYmlsaWJpbGknKSxcbiAgcmVxdWlyZSgnLi9zZWVrZXJfeW91a3UnKSxcbiAgcmVxdWlyZSgnLi9zZWVrZXJfdHVkb3UnKSxcbiAgcmVxdWlyZSgnLi9zZWVrZXJfaXFpeWknKSxcbiAgcmVxdWlyZSgnLi9zZWVrZXJfaHVuYW50dicpLFxuICByZXF1aXJlKCcuL3NlZWtlcl85MXBvcm4nKVxuICAvLyAscmVxdWlyZSgnLi9zZWVrZXJfZXhhbXBsZScpXG5dXG4iXX0=
