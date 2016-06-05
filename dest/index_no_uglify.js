(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var flashBlocker  = require('./flashBlocker')
var createElement = require('./createElement')
var MAMAPlayer    = require('./player')
var log           = require('./log')
var purl          = require('./purl')
var mamaKey       = require('./mamakey')
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
},{"./createElement":4,"./flashBlocker":5,"./log":10,"./mamakey":11,"./player":13,"./purl":14,"./seeker_flvsp":20,"./seekers":28}],2:[function(require,module,exports){
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

},{"./jsonp":9,"./noop":12,"./queryString":15}],3:[function(require,module,exports){
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
var hasFlash = false;
try {
  var flashObject = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
  if (flashObject) {
    hasFlash = true;
  }
} catch (e) {
  if (navigator.mimeTypes && navigator.mimeTypes['application/x-shockwave-flash'] != undefined && 
    navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
    hasFlash = true;
  }
}
module.exports = hasFlash;
},{}],8:[function(require,module,exports){
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
      referrer: encodeURIComponent((opts.referrer || location.href).split('#')[0]),
      url: encodeURIComponent(url.split('#')[0]),
      post: type === 'post' ? 1 : 0,
      xml: opts.xml ? 1 : 0,
      text: opts.text ? 1 : 0,
      gzinflate: opts.gzinflate ? 1 : 0,
      ua: encodeURIComponent(opts.ua || navigator.userAgent)
    },
    jsonp: true,
    callback: callback,
    context: opts.context
  })
}

module.exports = httpProxy
},{"./ajax":2,"./createElement":4,"./queryString":15}],9:[function(require,module,exports){
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
},{"./createElement":4,"./noop":12}],10:[function(require,module,exports){
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
},{"./createElement":4}],11:[function(require,module,exports){
//\u5988\u5988\u8ba1\u5212\u552f\u4e00\u503c
module.exports = 'MAMAKEY_\u7530\u7434\u662f\u8fd9\u4e2a\u4e16\u754c\u4e0a\u6700\u53ef\u7231\u7684\u5973\u5b69\u5b50\u5475\u5475\u5475\u5475\uff0c\u6211\u8981\u8ba9\u5168\u4e16\u754c\u90fd\u5728\u77e5\u9053'
},{}],12:[function(require,module,exports){
//\u7a7a\u65b9\u6cd5
module.exports = function () {}
},{}],13:[function(require,module,exports){
var MAMAPlayer;

// MAMAPlayer 
// https://github.com/zythum/mamaplayer
!function e(t,i,n){function o(r,a){if(!i[r]){if(!t[r]){var l="function"==typeof require&&require;if(!a&&l)return l(r,!0);if(s)return s(r,!0);throw new Error("Cannot find module '"+r+"'")}var c=i[r]={exports:{}};t[r][0].call(c.exports,function(e){var i=t[r][1][e];return o(i?i:e)},c,c.exports,e,t,i,n)}return i[r].exports}for(var s="function"==typeof require&&require,r=0;r<n.length;r++)o(n[r]);return o}({1:[function(e,t){function i(e){for(var t=[],i=1;i<arguments.length;i++){var o=arguments[i],s=o.init;t.push(s),delete o.init,n(e.prototype,o)}e.prototype.init=function(){t.forEach(function(e){e.call(this)}.bind(this))}}var n=e("./extend");t.exports=i},{"./extend":9}],2:[function(e,t){var i=e("./player.css"),n=e("./player.html"),o=(e("./extend"),e("./createElement")),s=e("./parseDOMByClassNames");t.exports={init:function(){var e=function(){var e=this.iframe.contentDocument.getElementsByTagName("head")[0],t=this.iframe.contentDocument.body;o("style",function(){e.appendChild(this);try{this.styleSheet.cssText=i}catch(t){this.appendChild(document.createTextNode(i))}}),o("link",{appendTo:e,href:"http://libs.cncdn.cn/font-awesome/4.3.0/css/font-awesome.min.css",rel:"stylesheet",type:"text/css"}),t.innerHTML=n,this.DOMs=s(t,["player","video","video-frame","comments","comments-btn","play","progress_anchor","buffered_anchor","fullscreen","allscreen","hd","volume_anchor","current","duration"]),this.video=this.DOMs.video}.bind(this),t=document.getElementById(this.id),r=this.iframe=o("iframe",{allowTransparency:!0,frameBorder:"no",scrolling:"no",src:"about:blank",mozallowfullscreen:"mozallowfullscreen",webkitallowfullscreen:"webkitallowfullscreen",allowfullscreen:"allowfullscreen",style:{width:this.size[0]+"px",height:this.size[1]+"px",overflow:"hidden"}});t&&t.parentNode?(t.parentNode.replaceChild(r,t),e()):(document.body.appendChild(r),e(),document.body.removeChild(r))}}},{"./createElement":7,"./extend":9,"./parseDOMByClassNames":11,"./player.css":12,"./player.html":13}],3:[function(e,t){function i(e){e.strokeStyle="black",e.lineWidth=3,e.font='bold 20px "PingHei","Lucida Grande", "Lucida Sans Unicode", "STHeiti", "Helvetica","Arial","Verdana","sans-serif"'}var n=(e("./createElement"),.1),o=25,s=4e3,r=document.createElement("canvas").getContext("2d");i(r);var a=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame||function(e){setTimeout(e,1e3/60)};t.exports={init:function(){this.video.addEventListener("play",this.reStartComment.bind(this)),this.video.addEventListener("pause",this.pauseComment.bind(this)),this.lastCommnetUpdateTime=0,this.lastCommnetIndex=0,this.commentLoopPreQueue=[],this.commentLoopQueue=[],this.commentButtonPreQueue=[],this.commentButtonQueue=[],this.commentTopPreQueue=[],this.commentTopQueue=[],this.drawQueue=[],this.preRenders=[],this.preRenderMap={},this.enableComment=void 0===this.comments?!1:!0,this.prevDrawCanvas=document.createElement("canvas"),this.canvas=this.DOMs.comments.getContext("2d"),this.comments&&this.DOMs.player.classList.add("has-comments"),this.DOMs["comments-btn"].classList.add("enable"),this.DOMs.comments.display=this.enableComment?"block":"none";var e=0,t=function(){(e=~e)&&this.onCommentTimeUpdate(),a(t)}.bind(this);t()},needDrawText:function(e,t,i){this.drawQueue.push([e,t,i])},drawText:function(){var e=this.prevDrawCanvas,t=this.prevDrawCanvas.getContext("2d");e.width=this.canvasWidth,e.height=this.canvasHeight,t.clearRect(0,0,this.canvasWidth,this.canvasHeight);var n=[];this.preRenders.forEach(function(e,t){e.used=!1,void 0===e.cid&&n.push(t)});for(var s;s=this.drawQueue.shift();)!function(e,s){var r,a=e[0].text+e[0].color,l=s.preRenderMap[a];if(void 0===l){var l=n.shift();void 0===l?(r=document.createElement("canvas"),l=s.preRenders.push(r)-1):r=s.preRenders[l];var c=r.width=e[0].width,h=r.height=o+10,d=r.getContext("2d");d.clearRect(0,0,c,h),i(d),d.fillStyle=e[0].color,d.strokeText(e[0].text,0,o),d.fillText(e[0].text,0,o),r.cid=a,s.preRenderMap[a]=l}else r=s.preRenders[l];r.used=!0,t.drawImage(r,e[1],e[2])}(s,this);this.preRenders.forEach(function(e){e.used===!1&&(delete this.preRenderMap[e.cid],e.cid=void 0)}.bind(this)),this.canvas.clearRect(0,0,this.canvasWidth,this.canvasHeight),this.canvas.drawImage(e,0,0)},createComment:function(e,t){if(void 0===e)return!1;var i=r.measureText(e.text);return{startTime:t,text:e.text,color:e.color,width:i.width+20}},commentTop:function(e,t,i){this.commentTopQueue.forEach(function(t,n){void 0!=t&&(i>t.startTime+s?this.commentTopQueue[n]=void 0:this.needDrawText(t,(e-t.width)/2,o*n))}.bind(this));for(var n;n=this.commentTopPreQueue.shift();)n=this.createComment(n,i),this.commentTopQueue.forEach(function(t,i){n&&void 0===t&&(t=this.commentTopQueue[i]=n,this.needDrawText(t,(e-n.width)/2,o*i),n=void 0)}.bind(this)),n&&(this.commentTopQueue.push(n),this.needDrawText(n,(e-n.width)/2,o*this.commentTopQueue.length-1))},commentBottom:function(e,t,i){t-=10,this.commentButtonQueue.forEach(function(n,r){void 0!=n&&(i>n.startTime+s?this.commentButtonQueue[r]=void 0:this.needDrawText(n,(e-n.width)/2,t-o*(r+1)))}.bind(this));for(var n;n=this.commentButtonPreQueue.shift();)n=this.createComment(n,i),this.commentButtonQueue.forEach(function(i,s){n&&void 0===i&&(i=this.commentButtonQueue[s]=n,this.needDrawText(i,(e-n.width)/2,t-o*(s+1)),n=void 0)}.bind(this)),n&&(this.commentButtonQueue.push(n),this.needDrawText(n,(e-n.width)/2,t-o*this.commentButtonQueue.length))},commentLoop:function(e,t,i){for(var s=t/o|0,r=-1;++r<s;){var a=this.commentLoopQueue[r];if(void 0===a&&(a=this.commentLoopQueue[r]=[]),this.commentLoopPreQueue.length>0){var l=0===a.length?void 0:a[a.length-1];if(void 0===l||(i-l.startTime)*n>l.width){var c=this.createComment(this.commentLoopPreQueue.shift(),i);c&&a.push(c)}}this.commentLoopQueue[r]=a.filter(function(t){var s=(i-t.startTime)*n;return 0>s||s>t.width+e?!1:(this.needDrawText(t,e-s,o*r),!0)}.bind(this))}for(var h=this.commentLoopQueue.length-s;h-->0;)this.commentLoopQueue.pop()},pauseComment:function(){this.pauseCommentAt=Date.now()},reStartComment:function(){if(this.pauseCommentAt){var e=Date.now()-this.pauseCommentAt;this.commentLoopQueue.forEach(function(t){t.forEach(function(t){t&&(t.startTime+=e)})}),this.commentButtonQueue.forEach(function(t){t&&(t.startTime+=e)}),this.commentTopQueue.forEach(function(t){t&&(t.startTime+=e)})}this.pauseCommentAt=void 0},drawComment:function(){if(!this.pauseCommentAt){var e=Date.now(),t=this.DOMs["video-frame"].offsetWidth,i=this.DOMs["video-frame"].offsetHeight;t!=this.canvasWidth&&(this.DOMs.comments.width=t,this.canvasWidth=t),i!=this.canvasHeight&&(this.DOMs.comments.height=i,this.canvasHeight=i);var n=this.video.offsetWidth,o=this.video.offsetHeight;this.commentLoop(n,o,e),this.commentTop(n,o,e),this.commentBottom(n,o,e),this.drawText()}},onCommentTimeUpdate:function(){if(this.enableComment!==!1){var e=this.video.currentTime;if(Math.abs(e-this.lastCommnetUpdateTime)<=1&&e>this.lastCommnetUpdateTime){var t=0;for(this.lastCommnetIndex&&this.comments[this.lastCommnetIndex].time<=this.lastCommnetUpdateTime&&(t=this.lastCommnetIndex);++t<this.comments.length;)if(!(this.comments[t].time<=this.lastCommnetUpdateTime)){if(this.comments[t].time>e)break;switch(this.comments[t].pos){case"bottom":this.commentButtonPreQueue.push(this.comments[t]);break;case"top":this.commentTopPreQueue.push(this.comments[t]);break;default:this.commentLoopPreQueue.push(this.comments[t])}this.lastCommnetIndex=t}}try{this.drawComment()}catch(i){}this.lastCommnetUpdateTime=e}}}},{"./createElement":7}],4:[function(e,t){function i(e){return Array.prototype.slice.call(e)}function n(e,t,i,n){function o(t){var i=(t.clientX-e.parentNode.getBoundingClientRect().left)/e.parentNode.offsetWidth;return Math.min(Math.max(i,0),1)}function s(t){1==t.which&&(l=!0,e.draging=!0,r(t))}function r(e){if(1==e.which&&l===!0){var t=o(e);i(t)}}function a(t){if(1==t.which&&l===!0){var s=o(t);i(s),n(s),l=!1,delete e.draging}}var l=!1;i=i||function(){},n=n||function(){},e.parentNode.addEventListener("mousedown",s),t.addEventListener("mousemove",r),t.addEventListener("mouseup",a)}var o=(e("./createElement"),e("./delegateClickByClassName")),s=e("./timeFormat");t.exports={init:function(){var e=this.iframe.contentDocument,t=o(e);t.on("play",this.onPlayClick,this),t.on("video-frame",this.onVideoClick,this),t.on("source",this.onSourceClick,this),t.on("allscreen",this.onAllScreenClick,this),t.on("fullscreen",this.onfullScreenClick,this),t.on("normalscreen",this.onNormalScreenClick,this),t.on("comments-btn",this.oncommentsBtnClick,this),t.on("airplay",this.onAirplayBtnClick,this),e.documentElement.addEventListener("keydown",this.onKeyDown.bind(this),!1),this.DOMs.player.addEventListener("mousemove",this.onMouseActive.bind(this)),n(this.DOMs.progress_anchor,e,this.onProgressAnchorWillSet.bind(this),this.onProgressAnchorSet.bind(this)),n(this.DOMs.volume_anchor,e,this.onVolumeAnchorWillSet.bind(this))},onKeyDown:function(e){switch(e.preventDefault(),e.keyCode){case 32:this.onPlayClick();break;case 39:this.video.currentTime=Math.min(this.video.duration,this.video.currentTime+10);break;case 37:this.video.currentTime=Math.max(0,this.video.currentTime-10);break;case 38:this.video.volume=Math.min(1,this.video.volume+.1),this.DOMs.volume_anchor.style.width=100*this.video.volume+"%";break;case 40:this.video.volume=Math.max(0,this.video.volume-.1),this.DOMs.volume_anchor.style.width=100*this.video.volume+"%";break;case 65:this.DOMs.player.classList.contains("allscreen")?this.onNormalScreenClick():this.onAllScreenClick();break;case 70:this.DOMs.player.classList.contains("fullscreen")||this.onfullScreenClick()}},onVideoClick:function(){void 0==this.videoClickDblTimer?this.videoClickDblTimer=setTimeout(function(){this.videoClickDblTimer=void 0,this.onPlayClick()}.bind(this),300):(clearTimeout(this.videoClickDblTimer),this.videoClickDblTimer=void 0,document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement?this.onNormalScreenClick():this.onfullScreenClick())},onMouseActive:function(){this.DOMs.player.classList.add("active"),clearTimeout(this.MouseActiveTimer),this.MouseActiveTimer=setTimeout(function(){this.DOMs.player.classList.remove("active")}.bind(this),1e3)},onPlayClick:function(){this.DOMs.play.classList.contains("paused")?(this.video.play(),this.DOMs.play.classList.remove("paused")):(this.video.pause(),this.DOMs.play.classList.add("paused"))},onSourceClick:function(e){e.classList.contains("curr")||(this.video.preloadStartTime=this.video.currentTime,this.video.src=this.sourceList[0|e.getAttribute("sourceIndex")][1],i(e.parentNode.childNodes).forEach(function(t){e===t?t.classList.add("curr"):t.classList.remove("curr")}.bind(this)))},onProgressAnchorWillSet:function(e){var t=this.video.duration,i=t*e;this.DOMs.current.innerHTML=s(i),this.DOMs.duration.innerHTML=s(t),this.DOMs.progress_anchor.style.width=100*e+"%"},onProgressAnchorSet:function(e){this.video.currentTime=this.video.duration*e},onVolumeAnchorWillSet:function(e){this.video.volume=e,this.DOMs.volume_anchor.style.width=100*e+"%"},onAllScreenClick:function(){var e=document.documentElement.clientWidth,t=document.documentElement.clientHeight;this.iframe.style.cssText=";position:fixed;top:0;left:0;width:"+e+"px;height:"+t+"px;z-index:999999;",this.allScreenWinResizeFunction=this.allScreenWinResizeFunction||function(){this.iframe.style.width=document.documentElement.clientWidth+"px",this.iframe.style.height=document.documentElement.clientHeight+"px"}.bind(this),window.removeEventListener("resize",this.allScreenWinResizeFunction),window.addEventListener("resize",this.allScreenWinResizeFunction),this.DOMs.player.classList.add("allscreen")},onfullScreenClick:function(){["webkitRequestFullScreen","mozRequestFullScreen","requestFullScreen"].forEach(function(e){this.DOMs.player[e]&&this.DOMs.player[e]()}.bind(this)),this.onMouseActive()},onNormalScreenClick:function(){window.removeEventListener("resize",this.allScreenWinResizeFunction),this.iframe.style.cssText=";width:"+this.size[0]+"px;height:"+this.size[1]+"px;",["webkitCancelFullScreen","mozCancelFullScreen","cancelFullScreen"].forEach(function(e){document[e]&&document[e]()}),this.DOMs.player.classList.remove("allscreen")},oncommentsBtnClick:function(){this.enableComment=!this.DOMs["comments-btn"].classList.contains("enable"),this.enableComment?(setTimeout(function(){this.DOMs.comments.style.display="block"}.bind(this),80),this.DOMs["comments-btn"].classList.add("enable")):(this.DOMs.comments.style.display="none",this.DOMs["comments-btn"].classList.remove("enable"))},onAirplayBtnClick:function(){this.video.webkitShowPlaybackTargetPicker()}}},{"./createElement":7,"./delegateClickByClassName":8,"./timeFormat":14}],5:[function(e,t){{var i=(e("./extend"),e("./createElement"));e("./parseDOMByClassNames")}t.exports={init:function(){var e=0;this.sourceList.forEach(function(t,n){i("li",{appendTo:this.DOMs.hd,sourceIndex:n,className:"source "+(n===e?"curr":""),innerHTML:t[0]})}.bind(this)),this.DOMs.video.src=this.sourceList[e][1]}}},{"./createElement":7,"./extend":9,"./parseDOMByClassNames":11}],6:[function(e,t){var i=e("./timeFormat");t.exports={init:function(){this.video.addEventListener("timeupdate",this.onVideoTimeUpdate.bind(this)),this.video.addEventListener("play",this.onVideoPlay.bind(this)),this.video.addEventListener("pause",this.onVideoTimePause.bind(this)),this.video.addEventListener("loadedmetadata",this.onVideoLoadedMetaData.bind(this)),this.video.addEventListener("webkitplaybacktargetavailabilitychanged",this.onPlaybackTargetAvailabilityChanged.bind(this)),setInterval(this.videoBuffered.bind(this),1e3),this.DOMs.volume_anchor.style.width=100*this.video.volume+"%"},onVideoTimeUpdate:function(){var e=this.video.currentTime,t=this.video.duration;this.DOMs.current.innerHTML=i(e),this.DOMs.duration.innerHTML=i(t),this.DOMs.progress_anchor.draging||(this.DOMs.progress_anchor.style.width=100*Math.min(Math.max(e/t,0),1)+"%")},videoBuffered:function(){var e=this.video.buffered,t=this.video.currentTime,i=0==e.length?0:e.end(e.length-1);this.DOMs.buffered_anchor.style.width=100*Math.min(Math.max(i/this.video.duration,0),1)+"%",0==i||t>=i?this.DOMs.player.classList.add("loading"):this.DOMs.player.classList.remove("loading")},onVideoPlay:function(){this.DOMs.play.classList.remove("paused")},onVideoTimePause:function(){this.DOMs.play.classList.add("paused")},onVideoLoadedMetaData:function(){this.video.preloadStartTime&&(this.video.currentTime=this.video.preloadStartTime,delete this.video.preloadStartTime)},onPlaybackTargetAvailabilityChanged:function(e){var t="support-airplay";"available"===e.availability?this.DOMs.player.classList.add(t):this.DOMs.player.classList.remove(t)}}},{"./timeFormat":14}],7:[function(e,t){function i(e,t){var i=document.createElement(e);if("function"==typeof t)t.call(i);else for(var n in t)if(t.hasOwnProperty(n))switch(n){case"appendTo":t[n].appendChild(i);break;case"text":var o=document.createTextNode(t[n]);i.innerHTML="",i.appendChild(o);break;case"innerHTML":case"className":case"id":i[n]=t[n];break;case"style":var s=t[n];for(var r in s)s.hasOwnProperty(r)&&(i.style[r]=s[r]);break;default:i.setAttribute(n,t[n]+"")}return i}t.exports=i},{}],8:[function(e,t){function i(e){return Array.prototype.slice.call(e)}function n(e){this._eventMap={},this._rootElement=e,this._isRootElementBindedClick=!1,this._bindClickFunction=function(e){!function t(e,n){n&&n.nodeName&&(n.classList&&i(n.classList).forEach(function(t){e.trigger(t,n)}),t(e,n.parentNode))}(this,e.target)}.bind(this)}var o=e("./extend");o(n.prototype,{on:function(e,t,i){void 0===this._eventMap[e]&&(this._eventMap[e]=[]),this._eventMap[e].push([t,i]),this._isRootElementBindedClick||(_isRootElementBindedClick=!0,this._rootElement.addEventListener("click",this._bindClickFunction,!1))},off:function(e,t){if(void 0!=this._eventMap[e])for(var i=this._eventMap[e].length;i--;)if(this._eventMap[e][i][0]===t){this._eventMap[e].splice(i,1);break}for(var n in this._eventMap)break;void 0===n&&this._isRootElementBindedClick&&(_isRootElementBindedClick=!1,this._rootElement.removeEventListener("click",this._bindClickFunction,!1))},trigger:function(e,t){t=void 0===t?this._rootElement.getElementsByTagNames(e):[t],t.forEach(function(t){(this._eventMap[e]||[]).forEach(function(e){e[0].call(e[1],t)})}.bind(this))}}),t.exports=function(e){return new n(e)}},{"./extend":9}],9:[function(e,t){function i(e){for(var t,i=arguments.length,n=1;i>n;){t=arguments[n++];for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o])}return e}t.exports=i},{}],10:[function(e){function t(e,t,i,n){this.id=e,this.size=t.split("x"),this.sourceList=i||[],this.comments=n,this.init()}e("./component")(t,e("./component_build"),e("./component_event"),e("./component_video"),e("./component_source"),e("./component_comments")),MAMAPlayer=t},{"./component":1,"./component_build":2,"./component_comments":3,"./component_event":4,"./component_source":5,"./component_video":6}],11:[function(e,t){function i(e,t){var i={};return t.forEach(function(t){i[t]=e.getElementsByClassName(t)[0]}),i}t.exports=i},{}],12:[function(e,t){t.exports='* { margin:0; padding:0; }body { font-family: "PingHei","Lucida Grande", "Lucida Sans Unicode", "STHeiti", "Helvetica","Arial","Verdana","sans-serif"; font-size:16px;}html, body, .player { height: 100%; }.player:-webkit-full-screen { width: 100%; cursor:url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==); }.player:-moz-full-screen { width: 100%; cursor:url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==); }.player:full-screen { width: 100%; cursor:url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==); }.player { border-radius: 3px; overflow: hidden; position: relative; cursor: default;  -webkit-user-select: none;  -moz-user-select: none; user-select: none;}.video-frame { box-sizing: border-box; padding-bottom: 50px; height: 100%; overflow: hidden; position: relative;}.video-frame .comments{ position: absolute; top:0;left:0; width:100%; height:100%;  -webkit-transform:translateZ(0);  -moz-transform:translateZ(0); transform:translateZ(0);  pointer-events: none;}.player:-webkit-full-screen .video-frame { padding-bottom: 0px; }.player:-moz-full-screen .video-frame { padding-bottom: 0px; }.player:full-screen .video-frame{ padding-bottom: 0px; }.video { width: 100%;  height: 100%; background: #000000;}.controller {  position: absolute; bottom: 0px;  left:0; right:0;  background: #24272A;  height: 50px;}.controller .loading-icon { display: none;  position: absolute; width: 20px;  height: 20px; line-height: 20px;  text-align: center; font-size: 20px;  color: #ffffff; top: -30px; right: 10px;}.player.loading .controller .loading-icon {  display: block;}.player:-webkit-full-screen .controller { -webkit-transform:translateY(50px); -webkit-transition: -webkit-transform 0.3s ease;}.player:-moz-full-screen .controller { -moz-transform:translateY(50px);  -moz-transition: -moz-transform 0.3s ease;}.player:full-screen .controller {  transform:translateY(50px); transition: transform 0.3s ease;}.player.active:-webkit-full-screen { cursor: default;}.player.active:-moz-full-screen {  cursor: default;}.player.active:full-screen { cursor: default;}.player.active:-webkit-full-screen .controller,.player:-webkit-full-screen .controller:hover { -webkit-transform:translateY(0);  cursor: default;}.player.active:-moz-full-screen .controller,.player:-moz-full-screen .controller:hover { -moz-transform:translateY(0); cursor: default;}.player.active:full-screen .controller.player:full-screen .controller:hover {  transform:translateY(0);  cursor: default;}.player.active:-webkit-full-screen .controller .progress .progress_anchor:after,.player:-webkit-full-screen .controller:hover .progress .progress_anchor:after { height:12px;}.player.active:-moz-full-screen .controller .progress .progress_anchor:after,.player:-moz-full-screen .controller:hover .progress .progress_anchor:after { height:12px;}.player.active:full-screen .controller .progress .progress_anchor:after,.player:full-screen .controller:hover .progress .progress_anchor:after { height:12px;}.player:-webkit-full-screen .controller .progress .progress_anchor:after { height:4px;}.player:-moz-full-screen .controller .progress .progress_anchor:after { height:4px;}.player:full-screen .controller .progress .progress_anchor:after {  height:4px;}.controller .progress { position: absolute; top:0px;  left:0; right:0;  border-right: 4px solid #181A1D;  border-left: 8px solid #DF6558; height: 4px;  background: #181A1D;  z-index:1;  -webkit-transform: translateZ(0); -moz-transform: translateZ(0);  transform: translateZ(0);}.controller .progress:after { content:""; display: block; position: absolute; top:0px;  left:0; right:0;  bottom:-10px; height: 10px;}.controller .progress .anchor { height: 4px;  background: #DF6558;  position: absolute; top:0;left:0;}.controller .progress .anchor:after { content:""; display: block; width: 12px;  background: #DF6558;  position: absolute; right:-4px; top: 50%; height: 12px; box-shadow: 0 0 2px rgba(0,0,0, 0.4); border-radius: 12px;  -webkit-transform: translateY(-50%);  -moz-transform: translateY(-50%); transform: translateY(-50%);}.controller .progress .anchor.buffered_anchor {  position: relative; background: rgba(255,255,255,0.1);}.controller .progress .anchor.buffered_anchor:after {  box-shadow: none; height: 4px;  width: 4px; border-radius: 0; background: rgba(255,255,255,0.1);}.controller .right { height: 50px; position: absolute; top:0;  left:10px;  right:10px; pointer-events: none;}.controller .play,.controller .volume,.controller .time,.controller .hd,.controller .airplay,.controller .allscreen,.controller .normalscreen,.controller .comments-btn,.controller .fullscreen { padding-top:4px;  height: 46px; line-height: 50px;  text-align: center; color: #eeeeee; float:left; text-shadow:0 0 2px rgba(0,0,0,0.5);  pointer-events: auto;}.controller .hd,.controller .airplay,.controller .allscreen,.controller .normalscreen,.controller .comments-btn,.controller .fullscreen { float:right;}.controller .play {  width: 36px;  padding-left: 10px; cursor: pointer;}.controller .play:after {  font-family: "FontAwesome"; content: "\\f04c";}.controller .play.paused:after { content: "\\f04b";}.controller .volume {  min-width: 30px;  position: relative; overflow: hidden; -webkit-transition: min-width 0.3s ease 0.5s; -moz-transition: min-width 0.3s ease 0.5s;  transition: min-width 0.3s ease 0.5s;}.controller .volume:hover { min-width: 128px;}.controller .volume:before {  font-family: "FontAwesome"; content: "\\f028";  width: 36px;  display: block;}.controller .volume .progress { width: 70px;  top: 27px;  left: 40px;}.controller .time { font-size: 12px;  font-weight: bold;  padding-left: 10px;}.controller .time .current {  color: #DF6558;}.controller .fullscreen,.controller .airplay,.controller .allscreen,.controller .comments-btn,.controller .normalscreen { width: 36px;  cursor: pointer;}.controller .comments-btn {  margin-right: -15px;  display: none;}.player.has-comments .controller .comments-btn { display: block;}.controller .comments-btn:before {  font-family: "FontAwesome"; content: "\\f075";}.controller .comments-btn.enable:before {  color: #DF6558;}.controller .airplay,.controller .normalscreen {  display: none;}.player:-webkit-full-screen .controller .fullscreen,.player:-webkit-full-screen .controller .allscreen { display: none;}.player:-webkit-full-screen .controller .normalscreen,.player.allscreen .controller .normalscreen,.player.support-airplay .controller .airplay { display: block;}.player.allscreen .controller .allscreen {  display: none;}.controller .fullscreen:before { font-family: "FontAwesome"; content: "\\f0b2";}.controller .allscreen:before {  font-family: "FontAwesome"; content: "\\f065";}.controller .normalscreen:before { font-family: "FontAwesome"; content: "\\f066";}.controller .airplay { background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0ibWFtYS1haXJwbGF5LWljb24iIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB3aWR0aD0iMjJweCIgaGVpZ2h0PSIxNnB4IiB2aWV3Qm94PSIwIDAgMjIgMTYiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxwb2x5bGluZSBwb2ludHM9IjUsMTIgMSwxMiAxLDEgMjEsMSAyMSwxMiAxNywxMiIgc3R5bGU9ImZpbGw6dHJhbnNwYXJlbnQ7c3Ryb2tlOndoaXRlO3N0cm9rZS13aWR0aDoxIi8+PHBvbHlsaW5lIHBvaW50cz0iNCwxNiAxMSwxMCAxOCwxNiIgc3R5bGU9ImZpbGw6d2hpdGU7c3Ryb2tlOnRyYW5zcGFyZW50O3N0cm9rZS13aWR0aDowIi8+PC9zdmc+DQo=) no-repeat center 20px;  background-size: 22px auto;}.controller .hd { white-space:nowrap; overflow: hidden; margin-right: 10px; text-align: right;}.controller .hd:hover li { max-width: 300px;}.controller .hd li {  display: inline-block;  max-width: 0px; -webkit-transition: max-width 0.8s ease 0.3s; -moz-transition: max-width 0.8s ease 0.3s;  transition: max-width 0.8s ease 0.3s; overflow: hidden; font-size: 14px;  font-weight: bold;  position: relative; cursor: pointer;}.controller .hd li:before {  content: "";  display: inline-block;  width:20px;}.controller .hd li:before { content: "";  display: inline-block;  width:20px;}.controller .hd li.curr { max-width: 300px; cursor: default;  color: #DF6558;}.controller .hd li.curr:after { content: "";  display: block; position: absolute; width:4px;  height:4px; border-radius: 50%; background: #ffffff;  left: 12px; top: 23px;  opacity: 0; -webkit-transition: opacity 0.5s ease 0.3s; -moz-transition: opacity 0.5s ease 0.3s;  transition: opacity 0.5s ease 0.3s;}'},{}],13:[function(e,t){t.exports='<div class="player">  <div class="video-frame"><video class="video" autoplay="autoplay"></video><canvas class="comments"></canvas></div>  <div class="controller">    <div class="loading-icon fa fa-spin fa-circle-o-notch"></div>   <div class="progress">      <div class="anchor buffered_anchor" style="width:0%"></div>     <div class="anchor progress_anchor" style="width:0%"></div>   </div>    <div class="right">     <div class="fullscreen"></div>      <div class="allscreen"></div>     <div class="normalscreen"></div>      <div class="airplay"></div>     <ul class="hd"></ul>      <div class="comments-btn"></div>     </div>    <div class="left">     <div class="play paused"></div>     <div class="volume">        <div class="progress">          <div class="anchor volume_anchor" style="width:0%"></div>       </div>      </div>      <div class="time">        <span class="current">00:00:00</span> / <span class="duration">00:00:00</span>      </div>     </div> </div></div>'},{}],14:[function(e,t){function i(e,t){return(Array(t).join(0)+e).slice(-t)}function n(e){var t,n=[];return[3600,60,1].forEach(function(o){n.push(i(t=e/o|0,2)),e-=t*o}),n.join(":")}t.exports=n},{}]},{},[10]);

//exports
module.exports = MAMAPlayer;
},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
/*  \uff03function queryString#
 *  < Object   \u4f8b\u5982 {a:1,b:2,c:3}
 *  > String   \u4f8b\u5982 a=1&b=2&c=3
 *  \u7528\u4e8e\u62fc\u88c5url\u5730\u5740\u7684query
 */
function queryString (obj) {
  var query = []
  for (var one in obj) {
    if (obj.hasOwnProperty(one)) {
      query.push([one, obj[one]].join('='))
    }
  }
  return query.join('&')
}
module.exports = queryString
},{}],16:[function(require,module,exports){
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




},{"./ajax":2,"./canPlayM3U8":3,"./log":10}],17:[function(require,module,exports){
/*  \u767e\u5ea6\u76d8 
 *  @\u6731\u4e00 \u683c\u5f0f\u5173\u7cfb\u53ea\u80fd\u64ad\u653e\u53ef\u64ad\u653e\u7684\u683c\u5f0f。\u8fd9\u8fb9\u5f3a\u5236\u5224\u65admp4\u53ef\u64ad\u653e。\u5176\u4ed6\u4e0d\u884c。
 */
var canPlayM3U8 = require('./canPlayM3U8')
var ajax        = require('./ajax')
var log         = require('./log')

function getFilePath (url) {
  var fileName = url.attr('source').split('/')
  fileName = fileName[fileName.length - 1]
  fileName = fileName.split('&')
  for (var i = 0, t; i < fileName.length; i++) {
    t = fileName[i].split('=')
    if (t[0] === 'path') return t[1]
  }
  return false
}

exports.match = function (url) {
  return url.attr('host').indexOf('pan.baidu.com') >= 0 && window.yunData && getFilePath(url)
}

exports.getVideos = function (url, callback) {
  function encodeBase64(G) {
    var C = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      B, A, _, F, D, E;
    _ = G.length;
    A = 0;
    B = "";
    while (A < _) {
      F = G.charCodeAt(A++) & 255;
      if (A == _) {
        B += C.charAt(F >> 2);
        B += C.charAt((F & 3) << 4);
        B += "==";
        break;
      }
      D = G.charCodeAt(A++);
      if (A == _) {
        B += C.charAt(F >> 2);
        B += C.charAt(((F & 3) << 4) | ((D & 240) >> 4));
        B += C.charAt((D & 15) << 2);
        B += "=";
        break;
      }
      E = G.charCodeAt(A++);
      B += C.charAt(F >> 2);
      B += C.charAt(((F & 3) << 4) | ((D & 240) >> 4));
      B += C.charAt(((D & 15) << 2) | ((E & 192) >> 6));
      B += C.charAt(E & 63);
    }
    return B;
  };
  var bdstoken = yunData.MYBDSTOKEN
  var timeStamp = yunData.timestamp
  var sign1 = yunData.sign1
  var sign2; eval('sign2 = ' + yunData.sign2)
  var sign3 = yunData.sign3
  var sign = encodeBase64(sign2(sign3, sign1))
  var filePath = getFilePath(url)
  if (!filePath) {
    log('\u6ca1\u6709\u68c0\u6d4b\u5230\u64ad\u653e\u5185\u5bb9', 2)
    return;
  }

  var pathArray = decodeURIComponent(filePath).split('/')
  var fileName = pathArray.pop()
  var parentPath = pathArray.join('/')

  if (fileName.split('.').pop() !== 'mp4') {
    log('\u53ea\u80fd\u64ad\u653emp4\u683c\u5f0f\u7684\u6587\u4ef6', 2)
    return;
  }

  function getVideoFromFsid (fsid) {
    ajax({
      url: '/api/download',
      method: 'POST',
      param: {sign: encodeURIComponent(sign), timestamp: timeStamp, fidlist: '["'+fsid+'"]', type: 'dlink'}, 
      callback: function (res) {
        if (res.dlink && res.dlink[0] && res.dlink[0].dlink)
          callback([["\u767e\u6bd2\u76d8", decodeURIComponent(res.dlink[0].dlink)]])
      }
    })
  }

  ajax({
    url: '/api/categorylist',
    param: {parent_path: parentPath, page: 1, num: 500, category: 1, bdstoken: bdstoken, channel: 'chunlei', web: 1, app_id: '250528'}, 
    callback: function (res) {
      if (!res.info) return;
      for (var i = 0, len = res.info.length; i < len; i++) {
        if (res.info[i].server_filename === fileName) {
          getVideoFromFsid(res.info[i].fs_id)
          break
        }
      }
    }
  })
}




},{"./ajax":2,"./canPlayM3U8":3,"./log":10}],18:[function(require,module,exports){
/*  bilibli
 * appkey from https://github.com/zacyu/bilibili-helper/
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

      var commentSrc = rs.cid
      var cid = commentSrc.split('/')
      cid = cid[cid.length - 1].split('.')[0]

      httpProxy(
        'http://interface.bilibili.com/playurl',
        'get',
        {otype: 'json', appkey: 'f3bb208b3d081dc8', cid: cid, quality: 4, type: 'mp4'},
      function (rs) {
        if (rs && rs.durl && rs.durl[0] && rs.durl[0].backup_url && rs.durl[0].backup_url[0]) {
          source.unshift(['bilibili HD', rs.durl[0].backup_url[0]])
        } else if (rs && rs.durl && rs.durl[0] && rs.durl[0].url) {
          source.unshift(['bilibili HD', rs.durl[0].url])
        }

        httpProxy(commentSrc, 'get', {}, function (rs) {
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
      })
    } else {
      log('\u89e3\u6790bilibli\u89c6\u9891\u5730\u5740\u5931\u8d25', 2)
      callback(false)
    }
  })
}

},{"./getCookie":6,"./httpProxy":8,"./log":10,"./purl":14}],19:[function(require,module,exports){
/*  douyu
 *  @\u6731\u4e00
 */
var canPlayM3U8 = require('./canPlayM3U8')
var ajax        = require('./ajax')
var log         = require('./log')
var httpProxy   = require('./httpProxy')

exports.match = function (url) {
  return canPlayM3U8 && url.attr('host').indexOf('douyu') >= 0 && window.$ROOM && window.$ROOM.room_id
}

exports.getVideos = function (url, callback) {
  httpProxy(
    'http://m.douyu.com/html5/live', 
    'get', 
    {roomId: window.$ROOM.room_id},
  function (rs) {
    callback([["\u6597\u9c7c", rs.data.hls_url]])
  })
}
},{"./ajax":2,"./canPlayM3U8":3,"./httpProxy":8,"./log":10}],20:[function(require,module,exports){
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
},{"./ajax":2,"./canPlayM3U8":3,"./log":10}],21:[function(require,module,exports){
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
},{"./ajax":2,"./canPlayM3U8":3,"./log":10}],22:[function(require,module,exports){
/*  iqiyi 
 *  @\u6731\u4e00
 */
var canPlayM3U8 = require('./canPlayM3U8')
var hasFlash = require('./hasFlash')
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

  log('\u56e0\u4e3a\u7231\u5947\u827a\u7684\u67d0\u4e9b\u539f\u56e0\u4e0d\u8ba9\u64ad, \u6240\u4ee5\u4f60\u70ed\u5c31\u70ed\u5427。');
  return;

  var uid = ''
  try{
    uid = JSON.parse(getCookie('P00002')).uid
  }catch(e) {}
  var cupid = 'qc_100001_100102' //\u8fd9\u4e2a\u5199\u6b7b\u5427
  var tvId = window.Q.PageInfo.playPageInfo.tvId
  var albumId = window.Q.PageInfo.playPageInfo.albumId
  var vid = window.Q.PageInfo.playPageInfo.vid ||
    document.getElementById('flashbox').getAttribute('data-player-videoid')

  function getVideoURL () {
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
        if (rs.data.vidl && rs.data.vidl[0] && rs.data.vidl[0].m3u) {
          source = rs.data.vidl
            .map(function (data) {
              var vData = formatVd(data.vd)
              vData.m3u = data.m3u
              return vData;
            })
            .sort(function (dataA, dataB) {
              return dataB.index - dataA.index
            })
            .map(function (data) {
              return [data.text, data.m3u]
            })
        } else {
          if (rs.data.m3u.length > 0) source = [['\u6807\u6e05', rs.data.m3u]]
        }
        callback(source)
      }
    })
  }

  if (window.weorjjigh) {
    getVideoURL()
  } else {
    var httpProxyOpts = {text: true, ua: 'Mozilla/5.0 (iPad; CPU iPhone OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B410 Safari/600.1.4'}
    httpProxy(location.href, 'get', {}, function(rs) {
      var m = rs.match(/<script[^>]*>\s*(eval.*;)\s*(?=<\/script>)<\/script>/)
      window.__qlt = window.__qlt || {MAMA2PlaceHolder: true}
      window.QP = window.QP || {}
      window.QP._ready = function (e) {if(this._isReady){e&&e()}else{e&&this._waits.push(e)}}
      eval(m[1])
      window.weorjjigh = weorjjigh
      getVideoURL()
    }, httpProxyOpts)
  }
}

},{"./ajax":2,"./canPlayM3U8":3,"./getCookie":6,"./hasFlash":7,"./httpProxy":8,"./log":10,"./queryString":15}],23:[function(require,module,exports){
/*  \u79d2\u62cd
 *  @\u6731\u4e00
 */
var canPlayM3U8 = require('./canPlayM3U8')
var queryString = require('./queryString')
var httpProxy = require('./httpProxy')
var log = require('./log')


exports.match = function (url) {
  return /\.miaopai\.com\/show/.test(url.attr('source'))
}

exports.getVideos = function (url, callback) {
  var httpProxyOpts = {text: true, ua: 'Mozilla/5.0 (iPad; CPU iPhone OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B410 Safari/600.1.4'}  
  httpProxy(location.href, 'get', {}, function(rs) {
    var url = rs.match(/<video(?:.*?)src=[\"\'](.+?)[\"\'](?!<)(?:.*)\>(?:[\n\r\s]*?)(?:<\/video>)*/)
    if (url && url[1]) callback([['\u79d2\u62cd', url[1]]])
  }, httpProxyOpts)
}
},{"./canPlayM3U8":3,"./httpProxy":8,"./log":10,"./queryString":15}],24:[function(require,module,exports){
/*  pandatv
 *
 *  @pczb
 */
var log       = require('./log')
var canPlayM3U8 = require('./canPlayM3U8')
var ajax = require('./ajax')
var httpProxy = require('./httpProxy')

exports.match = function () {
  return /^http\:\/\/www\.panda\.tv\/[0-9]+$/.test(location.href)
}

exports.getVideos = function (url, callback) {
  if(!canPlayM3U8){
    log('use safari please')
    callback(false);
    return;
  }

  var room_id = url.attr('path').match(/^\/([0-9]+)$/)[1]
  var m3u8_api = 'http://room.api.m.panda.tv/index.php?method=room.shareapi&roomid='
  httpProxy(
        m3u8_api + room_id,
        "GET",
        {},
        function(result){
          if(result === -1){
            callback(false)
          }
          jsonobj = eval(result)
          if(jsonobj.errno == 0 && jsonobj.data.videoinfo.address != ""){
            var arry = new Array()
            var baseaddr = jsonobj.data.videoinfo.address;
            arry.push(['\u8d85\u6e05', baseaddr.replace('_small\.m3u8', "\.m3u8")])
            arry.push(['\u9ad8\u6e05', baseaddr.replace('_small\.m3u8', "_mid\.m3u8")])
            arry.push(['\u6807\u6e05', baseaddr])
            callback(arry)
          }else {
            callback(false)
          }
        })
}

},{"./ajax":2,"./canPlayM3U8":3,"./httpProxy":8,"./log":10}],25:[function(require,module,exports){
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
},{"./ajax":2,"./canPlayM3U8":3,"./log":10,"./seeker_youku":27}],26:[function(require,module,exports){
var log = require('./log');
var ajax = require(('./ajax'));


// \u60a8\u597d\uff1a
// 	\u6211\u662f\u4e00\u540d\u524d\u7aef\u521d\u5b66\u8005\uff0c\u6c34\u5e73\u6709\u9650\uff0c\u8fd8\u8bf7\u89c1\u8c05。
// 	\u4ee5\u4e0b\u662f\u5b58\u5728\u7684\u4e00\u4e9b\u95ee\u9898\uff0c\u6211\u59cb\u7ec8\u6ca1\u80fd\u89e3\u51b3\uff0c\u4e0d\u77e5\u9053\u8fd8\u6709\u6ca1\u6709\u53ef\u7528\u4ef7\u503c\uff0c\u5982\u679c\u5b9e\u5728\u96be\u582a\uff0c\u5c31\u8bf7\u5ffd\u7565\u8fd9\u4e2a\u811a\u672c\u5427。

// 		1 \u4ece\u7f51\u7ad9\u62ff\u5230\u7684h5\u8d44\u6e90\u57fa\u672c\u90fd\u662fflv\u683c\u5f0f\uff0c\u5c11\u6570\u4f1a\u5458\u7ea7\u522b\u7684\u662fMP4\u683c\u5f0f\uff0c\u4e0d\u8fc7\u5b9e\u9645\u6d4b\u8bd5flv\u683c\u5f0f\u64ad\u653e\u65f6\u7684\u8d44\u6e90\u5360\u7528\u7387\u4e0d\u662f\u5f88\u591a\uff1b
// 		2 \u7ecf\u5e38\u51fa\u73b0\u4e00\u4f1a\u80fd\u64ad\u653e\u4e00\u4f1a\u4e0d\u80fd\u64ad\u7684\u95ee\u9898\uff0c\u5373\u4f7f\u662f\u540c\u4e00\u4e2a\u89c6\u9891\uff0c\u7136\u800c\u5728\u5730\u5740\u680f\u4e2d\u6253\u5f00\u603b\u662f\u53ef\u4ee5\u64ad\u653e。\u53ef\u80fd\u7531\u4e8esourcemap\u5728\u6211\u7684\u673a\u5b50\u4e0a\u6709\u70b9\u95ee\u9898\uff0c\u65e0\u6cd5\u5b9a\u4f4d\u5230\u5177\u4f53\u51fa\u9519\u7684\u5730\u65b9\uff0c\u6240\u4ee5\u6211\u4e5f\u4e0d\u77e5\u9053\u53d1\u751f\u4e86\u4ec0\u4e48。
	
//  \u9ebb\u70e6\u60a8\u4e86
// 	\u8054\u7cfb\u65b9\u5f0f\uff1amhcgrq@gmail.com

exports.match = function (url) {
  log(url.attr('host').indexOf('v.yinyuetai.com') >= 0 && /^\/video\/\d+/.test(url.attr('directory')));
  // log(/^\/video\/h5\/\d+/.test(url.attr('directory')));
  // log(url.attr('directory'));
  return url.attr('host').indexOf('v.yinyuetai.com') >= 0 && /^\/video\/\d+/.test(url.attr('directory'));
}

exports.getVideos = function (url, callback) {
	var h5 = "html5";
	var vid = /\d+$/.exec(url.attr('directory'));
	var ts =+ (new Date);
	var url = 'http://ext.yinyuetai.com/main/get-h-mv-info?json=true&videoId=' + vid + '&_=' + ts;
	 // + '&v=' + h5

	var data = [];

	ajax({
		url: url,
		jsonp: true,
		callback: function(res) {
			console.log(res);
			var video = res.videoInfo.coreVideoInfo.videoUrlModels;
			var mode = ['\u666e\u6e05', '\u9ad8\u6e05', '\u8d85\u6e05', '\u4f1a\u5458'];
			for (var i = 0; i < video.length; i++) {
				var index = video[i].videoUrl.search(/(flv|mp4)/) + 3;
				data.push([mode[i], video[i].videoUrl.slice(0, index)]);
			}
			console.log(data);
			callback(data);
		}
	});
}

//	\u5c11\u6570\u60c5\u51b5\u4e0b\u4f1a\u51fa\u73b0\u5982\u4e0b\u9519\u8bef\uff0c\u76ee\u524d\u4e0d\u6e05\u695a\u662f\u600e\u4e48\u56de\u4e8b\uff0c\u6709\u65f6\u5019\u51fa\u73b0\u8fd9\u79cd\u60c5\u51b5\u540e\uff0c\u91cd\u65b0\u6253\u5f00\u4e00\u904d\u5c31\u53c8\u53ef\u4ee5\u64ad\u653e\u4e86
// GET http://120.192.249.220:9090/data4/1/c/3a/c/a38df997fecc82d251482b4bcf6c3ac1/hc.yinyuetai.com/CDD8015436C4EAFED49290FE1AA16449.flv?type=data 404 (Not Found)
// index.js:480 Uncaught (in promise) DOMException: The element has no supported sources.

},{"./ajax":2,"./log":10}],27:[function(require,module,exports){
/*  youku 
 *  @\u6731\u4e00
 */
var canPlayM3U8 = require('./canPlayM3U8')
var ajax        = require('./ajax')
var log         = require('./log')


var dic = [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]
var mk = {a3: 'b4et', a4: 'boa4'}
var userCache = { a1: "4", a2: "1" }

function urlParameter (query) {
    var search = []
    for (var item in query) search.push(item + "=" + query[item])
    return search.join("&")
}

exports.match = function (url) {
  return /v\.youku\.com/.test(url.attr('host')) && !!window.videoId
}
exports.parseYoukuCode = function (videoId, callback) {
  ajax({
    url: 'http://play.youku.com/play/get.json?vid=' + videoId + '&ct=12', jsonp: true,
    callback: function (param) {
      if(param == -1) log('\u89e3\u6790youku\u89c6\u9891\u5730\u5740\u5931\u8d25', 2)
      var data = param.data;            
      
      var sid_token = rc4(translate(mk.a3 + "o0b" + userCache.a1, dic).toString(), decode64(data.security.encrypt_string)).split("_");
      userCache.sid = sid_token[0];
      userCache.token = sid_token[1]; 

      if ( canPlayM3U8 ) {
        var urlquery = {
          vid: window.videoId,
          type: '[[type]]',
          ts: parseInt((new Date).getTime() / 1e3),
          keyframe: 0,
          ep: encodeURIComponent(encode64(rc4(translate(mk.a4 + "poz" + userCache.a2, dic).toString(), userCache.sid + "_" + videoId + "_" + userCache.token))),
          sid: userCache.sid,
          token: userCache.token,
          ctype: 12,
          ev: 1,
          oip: data.security.ip,
          client_id: "youkumobileplaypage"
        }

        var videoSource = "http://pl.youku.com/playlist/m3u8?" + urlParameter(urlquery);
        callback([
          ['\u8d85\u6e05', videoSource.replace('[[type]]', 'hd2')],
          ['\u9ad8\u6e05', videoSource.replace('[[type]]', 'mp4')],
          ['\u6807\u6e05', videoSource.replace('[[type]]', 'flv')]
        ])
      } else {
        var playListData = new PlayListData(data, data.stream, 'mp4')
        console.log(playListData._videoSegsDic.streams)
        callback([['\u6807\u6e05', playListData._videoSegsDic.streams['guoyu']['3gphd'][0].src]])
      }
    }
  })
}
exports.getVideos = function (url, callback) {
  exports.parseYoukuCode(window.videoId, callback)
}

//\u4f18\u9177\u81ea\u5df1\u52a0\u5bc6\u7b97\u6cd5
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

function encode64(a) {
  if (!a)
    return "";
  a = a.toString();
  var b, c, d, e, f, g, h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (d = a.length, c = 0, b = ""; d > c;) {
    if (e = 255 & a.charCodeAt(c++), c == d) {
      b += h.charAt(e >> 2), b += h.charAt((3 & e) << 4), b += "==";
      break
    }
    if (f = a.charCodeAt(c++), c == d) {
      b += h.charAt(e >> 2), b += h.charAt((3 & e) << 4 | (240 & f) >> 4), b += h.charAt((15 & f) << 2), b += "=";
      break
    }
    g = a.charCodeAt(c++), b += h.charAt(e >> 2), b += h.charAt((3 & e) << 4 | (240 & f) >> 4), b += h.charAt((15 & f) << 2 | (192 & g) >> 6), b += h.charAt(63 & g)
  }
  return b
}

function rc4(a, b) {
  for (var c, d = [], e = 0, f = "", g = 0; 256 > g; g++)
    d[g] = g;
  for (g = 0; 256 > g; g++)
    e = (e + d[g] + a.charCodeAt(g % a.length)) % 256, c = d[g], d[g] = d[e], d[e] = c;
  g = 0, e = 0;
  for (var h = 0; h < b.length; h++)
    g = (g + 1) % 256, e = (e + d[g]) % 256, c = d[g], d[g] = d[e], d[e] = c, f += String.fromCharCode(b.charCodeAt(h) ^ d[(d[g] + d[e]) % 256]);
  return f
}

function translate(a, b) {
  for (var c = [], d = 0; d < a.length; d++) {
    var e = 0;
    e = a[d] >= "a" && a[d] <= "z" ? a[d].charCodeAt(0) - "a".charCodeAt(0) : a[d] - "0" + 26;
    for (var f = 0; 36 > f; f++)
      if (b[f] == e) {
        e = f;
        break
      }
    e > 25 ? c[d] = e - 26 : c[d] = String.fromCharCode(e + 97)
  }
  return c.join("")
}

//mp4 \u83b7\u53d6\u64ad\u653e\u5730\u5740
function PlayListData (a, b, c) {
  var d = this;
  new Date;
  this._sid = userCache.sid, this._fileType = c, this._videoSegsDic = {};
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
}

function RandomProxy (a) {
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
    var r = "/player/getFlvPath/sid/" + userCache.sid + "_" + n + "/st/" + m + "/fileid/" + e + "?K=" + p + "&hd=" + k + "&myp=0&ts=" + o + "&ypp=0" + q,
      s = [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26],
      t = encodeURIComponent(encode64(rc4(translate(mk.a4 + "poz" + userCache.a2, dic).toString(), userCache.sid + "_" + e + "_" + userCache.token)));
    return r += "&ep=" + t, r += "&ctype=12", r += "&ev=1", r += "&token=" + userCache.token, r += "&oip=" + this._ip, r += (f ? "/password/" + f : "") + (g ? g : ""), r = "http://k.youku.com" + r
  }
}
},{"./ajax":2,"./canPlayM3U8":3,"./log":10}],28:[function(require,module,exports){
module.exports = [
  require('./seeker_bilibili'),
  require('./seeker_youku'),
  require('./seeker_tudou'),
  require('./seeker_iqiyi'),
  require('./seeker_hunantv'),
  require('./seeker_baidupan'),
  require('./seeker_91porn'),
  require('./seeker_pandatv'),
  require('./seeker_yinyuetai'),
  require('./seeker_douyu'),
  require('./seeker_miaopai')
  // ,require('./seeker_example')
]

},{"./seeker_91porn":16,"./seeker_baidupan":17,"./seeker_bilibili":18,"./seeker_douyu":19,"./seeker_hunantv":21,"./seeker_iqiyi":22,"./seeker_miaopai":23,"./seeker_pandatv":24,"./seeker_tudou":25,"./seeker_yinyuetai":26,"./seeker_youku":27}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvYWpheC5qcyIsInNyYy9jYW5QbGF5TTNVOC5qcyIsInNyYy9jcmVhdGVFbGVtZW50LmpzIiwic3JjL2ZsYXNoQmxvY2tlci5qcyIsInNyYy9nZXRDb29raWUuanMiLCJzcmMvaGFzRmxhc2guanMiLCJzcmMvaHR0cFByb3h5LmpzIiwic3JjL2pzb25wLmpzIiwic3JjL2xvZy5qcyIsInNyYy9tYW1ha2V5LmpzIiwic3JjL25vb3AuanMiLCJzcmMvcGxheWVyLmpzIiwic3JjL3B1cmwuanMiLCJzcmMvcXVlcnlTdHJpbmcuanMiLCJzcmMvc2Vla2VyXzkxcG9ybi5qcyIsInNyYy9zZWVrZXJfYmFpZHVwYW4uanMiLCJzcmMvc2Vla2VyX2JpbGliaWxpLmpzIiwic3JjL3NlZWtlcl9kb3V5dS5qcyIsInNyYy9zZWVrZXJfZmx2c3AuanMiLCJzcmMvc2Vla2VyX2h1bmFudHYuanMiLCJzcmMvc2Vla2VyX2lxaXlpLmpzIiwic3JjL3NlZWtlcl9taWFvcGFpLmpzIiwic3JjL3NlZWtlcl9wYW5kYXR2LmpzIiwic3JjL3NlZWtlcl90dWRvdS5qcyIsInNyYy9zZWVrZXJfeWlueXVldGFpLmpzIiwic3JjL3NlZWtlcl95b3VrdS5qcyIsInNyYy9zZWVrZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7O0FDREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgZmxhc2hCbG9ja2VyICA9IHJlcXVpcmUoJy4vZmxhc2hCbG9ja2VyJylcbnZhciBjcmVhdGVFbGVtZW50ID0gcmVxdWlyZSgnLi9jcmVhdGVFbGVtZW50JylcbnZhciBNQU1BUGxheWVyICAgID0gcmVxdWlyZSgnLi9wbGF5ZXInKVxudmFyIGxvZyAgICAgICAgICAgPSByZXF1aXJlKCcuL2xvZycpXG52YXIgcHVybCAgICAgICAgICA9IHJlcXVpcmUoJy4vcHVybCcpXG52YXIgbWFtYUtleSAgICAgICA9IHJlcXVpcmUoJy4vbWFtYWtleScpXG52YXIgc2Vla2VycyAgICAgICA9IHJlcXVpcmUoJy4vc2Vla2VycycpXG52YXIgZmx2c3AgICAgICAgICA9IHJlcXVpcmUoJy4vc2Vla2VyX2ZsdnNwJyk7XG52YXIgbWF0Y2hlZFxuXG5pZiAod2luZG93W21hbWFLZXldICE9IHRydWUpIHtcblxuZnVuY3Rpb24gc2Vla2VkIChzb3VyY2UsIGNvbW1lbnRzKSB7XG4gIGlmICghc291cmNlKSB7XG4gICAgbG9nKCfop6PmnpDlhoXlrrnlnLDlnYDlpLHotKUnLCAyKVxuICAgIGRlbGV0ZSB3aW5kb3dbbWFtYUtleV1cbiAgICByZXR1cm5cbiAgfSBcbiAgbG9nKCfop6PmnpDlhoXlrrnlnLDlnYDlrozmiJAnK3NvdXJjZS5tYXAoZnVuY3Rpb24gKGkpIHtyZXR1cm4gJzxhIGhyZWY9XCInK2lbMV0rJ1wiIHRhcmdldD1cIl9ibGFua1wiPicraVswXSsnPC9hPid9KS5qb2luKCcgJyksIDIpXG4gIHZhciBtYXNrID0gY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgIGFwcGVuZFRvOiBkb2N1bWVudC5ib2R5LFxuICAgIHN0eWxlOiB7XG4gICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgIGJhY2tncm91bmQ6ICdyZ2JhKDAsMCwwLDAuOCknLFxuICAgICAgdG9wOiAnMCcsXG4gICAgICBsZWZ0OiAnMCcsXG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICB6SW5kZXg6ICc5OTk5OTknXG4gICAgfVxuICB9KVxuICBjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG4gICAgYXBwZW5kVG86IG1hc2ssXG4gICAgc3R5bGU6IHtcbiAgICAgIHdpZHRoOiAnMTAwMHB4JyxcbiAgICAgIGhlaWdodDogJzUwMHB4JyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgdG9wOiAnNTAlJyxcbiAgICAgIGxlZnQ6ICc1MCUnLFxuICAgICAgbWFyZ2luVG9wOiAnLTI1MHB4JyxcbiAgICAgIG1hcmdpbkxlZnQ6ICctNTAwcHgnLFxuICAgICAgYm9yZGVyUmFkaXVzOiAnMnB4JyxcbiAgICAgIGJveFNoYWRvdzogJzAgMCAycHggIzAwMDAwMCwgMCAwIDIwMHB4ICMwMDAwMDAnLFxuICAgIH1cbiAgfSlcbiAgY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgIGFwcGVuZFRvOiBtYXNrLFxuICAgIGlubmVySFRNTDogJzxhIHN0eWxlPVwiY29sb3I6IzU1NTU1NTtcIiBocmVmPVwiaHR0cDovL3p5dGh1bS5zaW5hYXBwLmNvbS9tYW1hMi9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5NQU1BMjog5aaI5aaI5YaN5Lmf5LiN55So5ouF5b+D5oiR55qEIE1hY0Jvb2sg5Y+R54Ot6K6h5YiSPC9hPicsXG4gICAgc3R5bGU6IHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgYm90dG9tOiAnMTBweCcsXG4gICAgICBsZWZ0OiAnMCcsXG4gICAgICByaWdodDogJzAnLFxuICAgICAgaGVpZ2h0OiAnMjBweCcsXG4gICAgICBsaW5lSGVpZ2h0OiAnMjBweCcsXG4gICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgZm9udFNpemU6JzEycHgnLFxuICAgICAgZm9udEZhbWlseTogJ2FyaWFsLCBzYW5zLXNlcmlmJ1xuICAgIH1cbiAgfSlcbiAgdmFyIGNvbnRhaW5lciA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICBhcHBlbmRUbzogbWFzayxcbiAgICBpbm5lckhUTUw6ICc8ZGl2IGlkPVwiTUFNQTJfdmlkZW9fcGxhY2VIb2xkZXJcIj48L2Rpdj4nLFxuICAgIHN0eWxlOiB7XG4gICAgICB3aWR0aDogJzEwMDBweCcsXG4gICAgICBoZWlnaHQ6ICc1MDBweCcsXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIGJhY2tncm91bmRDb2xvcjogJyMwMDAwMDAnLFxuICAgICAgdG9wOiAnNTAlJyxcbiAgICAgIGxlZnQ6ICc1MCUnLFxuICAgICAgbWFyZ2luVG9wOiAnLTI1MHB4JyxcbiAgICAgIG1hcmdpbkxlZnQ6ICctNTAwcHgnLFxuICAgICAgYm9yZGVyUmFkaXVzOiAnMnB4JyxcbiAgICAgIG92ZXJmbG93OiAnaGlkZGVuJ1xuICAgIH1cbiAgfSlcbiAgY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuICAgIGFwcGVuZFRvOiBjb250YWluZXIsXG4gICAgaW5uZXJIVE1MOiAnJnRpbWVzOycsXG4gICAgc3R5bGU6IHtcbiAgICAgIHdpZHRoOiAnMjBweCcsXG4gICAgICBoZWlnaHQ6ICcyMHB4JyxcbiAgICAgIGxpbmVIZWlnaHQ6ICcyMHB4JyxcbiAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICBmb250U2l6ZTogJzIwcHgnLFxuICAgICAgdG9wOiAnNXB4JyxcbiAgICAgIHJpZ2h0OiAnNXB4JyxcbiAgICAgIHRleHRTaGFkb3c6ICcwIDAgMnB4ICMwMDAwMDAnLFxuICAgICAgZm9udFdlaWdodDogJ2JvbGQnLFxuICAgICAgZm9udEZhbWlseTogJ0dhcmFtb25kLCBcIkFwcGxlIEdhcmFtb25kXCInLFxuICAgICAgY3Vyc29yOiAncG9pbnRlcidcbiAgICB9XG4gIH0pLm9uY2xpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChtYXNrKVxuICAgIHBsYXllci52aWRlby5zcmMgPSAnYWJvdXQ6YmxhbmsnXG4gICAgZGVsZXRlIHdpbmRvd1ttYW1hS2V5XVxuICB9XG4gIHZhciBwbGF5ZXIgPSBuZXcgTUFNQVBsYXllcignTUFNQTJfdmlkZW9fcGxhY2VIb2xkZXInLCAnMTAwMHg1MDAnLCBzb3VyY2UsIGNvbW1lbnRzKVxuICBwbGF5ZXIuaWZyYW1lLmNvbnRlbnRXaW5kb3cuZm9jdXMoKVxuICBmbGFzaEJsb2NrZXIoKVxuICBwbGF5ZXIuaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snXG4gIHdpbmRvd1ttYW1hS2V5XSA9IHRydWVcbn1cblxudmFyIHVybCA9IHB1cmwobG9jYXRpb24uaHJlZilcbmlmICh1cmwuYXR0cignaG9zdCcpID09PSAnenl0aHVtLnNpbmFhcHAuY29tJyAmJiBcbiAgdXJsLmF0dHIoJ2RpcmVjdG9yeScpID09PSAnL21hbWEyL3BzNC8nICYmIHVybC5wYXJhbSgndXJsJykgKSB7XG4gIHVybCA9IHB1cmwodXJsLnBhcmFtKCd1cmwnKSlcbn1cblxuc2Vla2Vycy5mb3JFYWNoKGZ1bmN0aW9uIChzZWVrZXIpIHtcbiAgaWYgKG1hdGNoZWQgPT09IHRydWUpIHJldHVyblxuICBpZiAoISFzZWVrZXIubWF0Y2godXJsKSA9PT0gdHJ1ZSkge1xuICAgIGxvZygn5byA5aeL6Kej5p6Q5YaF5a655Zyw5Z2AJylcbiAgICBtYXRjaGVkID0gdHJ1ZVxuICAgIHNlZWtlci5nZXRWaWRlb3ModXJsLCBzZWVrZWQpICAgXG4gIH1cbn0pXG5cbmlmIChtYXRjaGVkID09PSB1bmRlZmluZWQpIHtcbiAgbG9nKCflsJ3or5Xkvb/nlKg8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiaHR0cDovL3dlaWJvLmNvbS9qdXN0YXNoaXRcIj7kuIDnjq/lkIzlraY8L2E+5o+Q5L6b55qE6Kej5p6Q5pyN5YqhJywgMilcbiAgZmx2c3AuZ2V0VmlkZW9zKHVybCwgc2Vla2VkKVxufVxuXG59IiwiLyogIO+8g2Z1bmN0aW9uIGFqYXgjXG4gKiAgPCB7XG4gKiAgICB1cmw6ICAgICAgICAgIFN0cmluZyAgIOivt+axguWcsOWdgFxuICogICAgcGFyYW06ICAgICAgICBPYmplY3QgICDor7fmsYLlj4LmlbAu5Y+v57y655yBXG4gKiAgICBtZXRob2Q6ICAgICAgIFN0cmluZyAgIOivt+axguaWueazlUdFVCxQT1NULGV0Yy4g5Y+v57y655yB77yM6buY6K6k5pivR0VUIFxuICogICAgY2FsbGJhY2s6ICAgICBGdW5jdGlvbiDor7fmsYLnmoRjYWxsYmFjaywg5aaC5p6c5aSx6LSl6L+U5Zue77yNMe+8jCDmiJDlip/ov5Tlm57lhoXlrrlcbiAqICAgIGNvbnRlbnRUeXBlOiAgU3RyaW5nICAg6L+U5Zue5YaF5a6555qE5qC85byP44CC5aaC5p6c5pivSk9TTuS8muWBmkpTT04gUGFyc2XvvIwg5Y+v57y655yBLOm7mOiupOaYr2pzb25cbiAqICAgIGNvbnRleHQ6ICAgICAgQW55ICAgICAgY2FsbGJhY2vlm57osIPlh73mlbDnmoR0aGlz5oyH5ZCR44CC5Y+v57y655yBXG4gKiAgfVxuICogIOeUqOS6juWPkei1t2FqYXjmiJbogIVqc29ucOivt+axglxuICovXG5cbnZhciBqc29ucCAgICAgICA9IHJlcXVpcmUoJy4vanNvbnAnKVxudmFyIG5vb3AgICAgICAgID0gcmVxdWlyZSgnLi9ub29wJylcbnZhciBxdWVyeVN0cmluZyA9IHJlcXVpcmUoJy4vcXVlcnlTdHJpbmcnKVxuXG5mdW5jdGlvbiBkZWZhbHV0T3B0aW9uIChvcHRpb24sIGRlZmFsdXRWYWx1ZSkge1xuICByZXR1cm4gb3B0aW9uID09PSB1bmRlZmluZWQgPyBkZWZhbHV0VmFsdWUgOiBvcHRpb25cbn1cblxuZnVuY3Rpb24gam9pblVybCAodXJsLCBxdWVyeVN0cmluZykge1xuICBpZiAocXVlcnlTdHJpbmcubGVuZ3RoID09PSAwKSByZXR1cm4gdXJsXG4gIHJldHVybiB1cmwgKyAodXJsLmluZGV4T2YoJz8nKSA9PT0gLTEgPyAnPycgOiAnJicpICsgcXVlcnlTdHJpbmdcbn1cblxuZnVuY3Rpb24gYWpheCAob3B0aW9ucykge1xuICB2YXIgdXJsICAgICAgICAgPSBkZWZhbHV0T3B0aW9uKG9wdGlvbnMudXJsLCAnJylcbiAgdmFyIHF1ZXJ5ICAgICAgID0gcXVlcnlTdHJpbmcoIGRlZmFsdXRPcHRpb24ob3B0aW9ucy5wYXJhbSwge30pIClcbiAgdmFyIG1ldGhvZCAgICAgID0gZGVmYWx1dE9wdGlvbihvcHRpb25zLm1ldGhvZCwgJ0dFVCcpXG4gIHZhciBjYWxsYmFjayAgICA9IGRlZmFsdXRPcHRpb24ob3B0aW9ucy5jYWxsYmFjaywgbm9vcClcbiAgdmFyIGNvbnRlbnRUeXBlID0gZGVmYWx1dE9wdGlvbihvcHRpb25zLmNvbnRlbnRUeXBlLCAnanNvbicpXG4gIHZhciBjb250ZXh0ICAgICA9IGRlZmFsdXRPcHRpb24ob3B0aW9ucy5jb250ZXh0LCBudWxsKVxuXG4gIGlmIChvcHRpb25zLmpzb25wKSB7XG4gICAgcmV0dXJuIGpzb25wKFxuICAgICAgam9pblVybCh1cmwsIHF1ZXJ5KSxcbiAgICAgIGNhbGxiYWNrLmJpbmQoY29udGV4dCksXG4gICAgICB0eXBlb2Ygb3B0aW9ucy5qc29ucCA9PT0gJ3N0cmluZycgPyBvcHRpb25zLmpzb25wIDogdW5kZWZpbmVkXG4gICAgKVxuICB9XG5cbiAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG4gIGlmIChtZXRob2QudG9Mb3dlckNhc2UoKSA9PT0gJ2dldCcpIHtcbiAgICB1cmwgPSBqb2luVXJsKHVybCwgcXVlcnkpXG4gICAgcXVlcnkgPSAnJ1xuICB9XG4gIHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKVxuICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCcpXG4gIHhoci5zZW5kKHF1ZXJ5KVxuICB4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh4aHIucmVhZHlTdGF0ZSA9PT0gNCApIHtcbiAgICAgIGlmICh4aHIuc3RhdHVzID09PSAyMDApIHtcbiAgICAgICAgdmFyIGRhdGEgPSB4aHIucmVzcG9uc2VUZXh0XG4gICAgICAgIGlmIChjb250ZW50VHlwZS50b0xvd2VyQ2FzZSgpID09PSAnanNvbicpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgZGF0YSA9IEpTT04ucGFyc2UoZGF0YSlcbiAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIGRhdGEgPSAtMVxuICAgICAgICAgIH0gICAgICAgICBcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FsbGJhY2suY2FsbChjb250ZXh0LCBkYXRhKVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgLTEpXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGFqYXg7XG4iLCIvKiAg77yDQm9vbCBjYW5QbGF5TTNVOO+8g1xuICogIOi/lOWbnua1j+iniOWZqOaYr+WQpuaUr+aMgW0zdTjmoLzlvI/nmoTop4bpopHmkq3mlL7jgIJcbiAqICDnm67liY1jaHJvbWUsZmlyZWZveOWPquaUr+aMgW1wNFxuICovXG5tb2R1bGUuZXhwb3J0cyA9ICEhZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKS5jYW5QbGF5VHlwZSgnYXBwbGljYXRpb24veC1tcGVnVVJMJykiLCIvKlxuICog55So5LqO566A5Y2V5Yib5bu6aHRtbOiKgueCuVxuICovXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50ICh0YWdOYW1lLCBhdHRyaWJ1dGVzKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKVxuICBpZiAoIHR5cGVvZiBhdHRyaWJ1dGVzID09PSAnZnVuY3Rpb24nICkge1xuICAgIGF0dHJpYnV0ZXMuY2FsbChlbGVtZW50KVxuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGF0dHJpYnV0ZSBpbiBhdHRyaWJ1dGVzKSB7XG4gICAgICBpZiAoIGF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoYXR0cmlidXRlKSApIHtcbiAgICAgICAgc3dpdGNoIChhdHRyaWJ1dGUpIHtcbiAgICAgICAgY2FzZSAnYXBwZW5kVG8nOlxuICAgICAgICAgIGF0dHJpYnV0ZXNbYXR0cmlidXRlXS5hcHBlbmRDaGlsZChlbGVtZW50KVxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2lubmVySFRNTCc6XG4gICAgICAgIGNhc2UgJ2NsYXNzTmFtZSc6XG4gICAgICAgIGNhc2UgJ2lkJzpcbiAgICAgICAgICBlbGVtZW50W2F0dHJpYnV0ZV0gPSBhdHRyaWJ1dGVzW2F0dHJpYnV0ZV1cbiAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdzdHlsZSc6XG4gICAgICAgICAgdmFyIHN0eWxlcyA9IGF0dHJpYnV0ZXNbYXR0cmlidXRlXVxuICAgICAgICAgIGZvciAodmFyIG5hbWUgaW4gc3R5bGVzKVxuICAgICAgICAgICAgaWYgKCBzdHlsZXMuaGFzT3duUHJvcGVydHkobmFtZSkgKVxuICAgICAgICAgICAgICBlbGVtZW50LnN0eWxlW25hbWVdID0gc3R5bGVzW25hbWVdXG4gICAgICAgICAgYnJlYWtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIGF0dHJpYnV0ZXNbYXR0cmlidXRlXSArICcnKVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBlbGVtZW50XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlRWxlbWVudCIsIi8qICBcbiAqICDnlKjkuo7lsY/olL3pobXpnaLkuIrnmoTmiYDmnIlmbGFzaFxuICovXG52YXIgZmxhc2hUZXh0ID0gJzxkaXYgc3R5bGU9XCJ0ZXh0LXNoYWRvdzowIDAgMnB4ICNlZWU7bGV0dGVyLXNwYWNpbmc6LTFweDtiYWNrZ3JvdW5kOiNlZWU7Zm9udC13ZWlnaHQ6Ym9sZDtwYWRkaW5nOjA7Zm9udC1mYW1pbHk6YXJpYWwsc2Fucy1zZXJpZjtmb250LXNpemU6MzBweDtjb2xvcjojY2NjO3dpZHRoOjE1MnB4O2hlaWdodDo1MnB4O2JvcmRlcjo0cHggc29saWQgI2NjYztib3JkZXItcmFkaXVzOjEycHg7cG9zaXRpb246YWJzb2x1dGU7dG9wOjUwJTtsZWZ0OjUwJTttYXJnaW46LTMwcHggMCAwIC04MHB4O3RleHQtYWxpZ246Y2VudGVyO2xpbmUtaGVpZ2h0OjUycHg7XCI+Rmxhc2g8L2Rpdj4nO1xuXG52YXIgY291bnQgPSAwO1xudmFyIGZsYXNoQmxvY2tzID0ge307XG4vL+eCueWHu+aXtumXtOinpuWPkVxudmFyIGNsaWNrMlNob3dGbGFzaCA9IGZ1bmN0aW9uKGUpe1xuICB2YXIgaW5kZXggPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1mbGFzaC1pbmRleCcpO1xuICB2YXIgZmxhc2ggPSBmbGFzaEJsb2Nrc1tpbmRleF07XG4gIGZsYXNoLnNldEF0dHJpYnV0ZSgnZGF0YS1mbGFzaC1zaG93JywnaXNzaG93Jyk7XG4gIHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZmxhc2gsIHRoaXMpO1xuICB0aGlzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcyk7XG4gIHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGljazJTaG93Rmxhc2gsIGZhbHNlKTtcbn07XG5cbnZhciBjcmVhdGVBUGxhY2VIb2xkZXIgPSBmdW5jdGlvbihmbGFzaCwgd2lkdGgsIGhlaWdodCl7XG4gIHZhciBpbmRleCA9IGNvdW50Kys7XG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUoZmxhc2gsIG51bGwpO1xuICB2YXIgcG9zaXRpb25UeXBlID0gc3R5bGUucG9zaXRpb247XG4gICAgcG9zaXRpb25UeXBlID0gcG9zaXRpb25UeXBlID09PSAnc3RhdGljJyA/ICdyZWxhdGl2ZScgOiBwb3NpdGlvblR5cGU7XG4gIHZhciBtYXJnaW4gICAgICAgPSBzdHlsZVsnbWFyZ2luJ107XG4gIHZhciBkaXNwbGF5ICAgICAgPSBzdHlsZVsnZGlzcGxheSddID09ICdpbmxpbmUnID8gJ2lubGluZS1ibG9jaycgOiBzdHlsZVsnZGlzcGxheSddO1xuICB2YXIgc3R5bGUgPSBbXG4gICAgJycsXG4gICAgJ3dpZHRoOicgICAgKyB3aWR0aCAgKydweCcsXG4gICAgJ2hlaWdodDonICAgKyBoZWlnaHQgKydweCcsXG4gICAgJ3Bvc2l0aW9uOicgKyBwb3NpdGlvblR5cGUsXG4gICAgJ21hcmdpbjonICAgKyBtYXJnaW4sXG4gICAgJ2Rpc3BsYXk6JyAgKyBkaXNwbGF5LFxuICAgICdtYXJnaW46MCcsXG4gICAgJ3BhZGRpbmc6MCcsXG4gICAgJ2JvcmRlcjowJyxcbiAgICAnYm9yZGVyLXJhZGl1czoxcHgnLFxuICAgICdjdXJzb3I6cG9pbnRlcicsXG4gICAgJ2JhY2tncm91bmQ6LXdlYmtpdC1saW5lYXItZ3JhZGllbnQodG9wLCByZ2JhKDI0MCwyNDAsMjQwLDEpMCUscmdiYSgyMjAsMjIwLDIyMCwxKTEwMCUpJywgICAgIFxuICAgICcnXG4gIF1cbiAgZmxhc2hCbG9ja3NbaW5kZXhdID0gZmxhc2g7XG4gIHZhciBwbGFjZUhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBwbGFjZUhvbGRlci5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJyYjeDcwQjk7JiN4NjIxMTsmI3g4RkQ4OyYjeDUzOUY7Rmxhc2gnKTtcbiAgcGxhY2VIb2xkZXIuc2V0QXR0cmlidXRlKCdkYXRhLWZsYXNoLWluZGV4JywgJycgKyBpbmRleCk7XG4gIGZsYXNoLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHBsYWNlSG9sZGVyLCBmbGFzaCk7XG4gIGZsYXNoLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZmxhc2gpO1xuICBwbGFjZUhvbGRlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsaWNrMlNob3dGbGFzaCwgZmFsc2UpO1xuICBwbGFjZUhvbGRlci5zdHlsZS5jc3NUZXh0ICs9IHN0eWxlLmpvaW4oJzsnKTtcbiAgcGxhY2VIb2xkZXIuaW5uZXJIVE1MID0gZmxhc2hUZXh0O1xuICByZXR1cm4gcGxhY2VIb2xkZXI7XG59O1xuXG52YXIgcGFyc2VGbGFzaCA9IGZ1bmN0aW9uKHRhcmdldCl7XG4gIGlmKHRhcmdldCBpbnN0YW5jZW9mIEhUTUxPYmplY3RFbGVtZW50KSB7XG4gICAgaWYodGFyZ2V0LmlubmVySFRNTC50cmltKCkgPT0gJycpIHJldHVybjtcbiAgICBpZih0YXJnZXQuZ2V0QXR0cmlidXRlKFwiY2xhc3NpZFwiKSAmJiAhL15qYXZhOi8udGVzdCh0YXJnZXQuZ2V0QXR0cmlidXRlKFwiY2xhc3NpZFwiKSkpIHJldHVybjsgICAgICBcbiAgfSBlbHNlIGlmKCEodGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVtYmVkRWxlbWVudCkpIHJldHVybjtcblxuICB2YXIgd2lkdGggPSB0YXJnZXQub2Zmc2V0V2lkdGg7XG4gIHZhciBoZWlnaHQgPSB0YXJnZXQub2Zmc2V0SGVpZ2h0O1xuXG4gIGlmKHdpZHRoID4gMTYwICYmIGhlaWdodCA+IDYwKXtcbiAgICBjcmVhdGVBUGxhY2VIb2xkZXIodGFyZ2V0LCB3aWR0aCwgaGVpZ2h0KTtcbiAgfVxufTtcblxudmFyIGhhbmRsZUJlZm9yZUxvYWRFdmVudCA9IGZ1bmN0aW9uKGUpe1xuICB2YXIgdGFyZ2V0ID0gZS50YXJnZXRcbiAgaWYodGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1mbGFzaC1zaG93JykgPT0gJ2lzc2hvdycpIHJldHVybjtcbiAgcGFyc2VGbGFzaCh0YXJnZXQpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHsgXG4gIHZhciBlbWJlZHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZW1iZWQnKTtcbiAgdmFyIG9iamVjdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnb2JqZWN0Jyk7XG4gIGZvcih2YXIgaT0wLGxlbj1vYmplY3RzLmxlbmd0aDsgaTxsZW47IGkrKykgb2JqZWN0c1tpXSAmJiBwYXJzZUZsYXNoKG9iamVjdHNbaV0pO1xuICBmb3IodmFyIGk9MCxsZW49ZW1iZWRzLmxlbmd0aDsgaTxsZW47IGkrKykgIGVtYmVkc1tpXSAmJiBwYXJzZUZsYXNoKGVtYmVkc1tpXSk7XG59XG4vLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiYmVmb3JlbG9hZFwiLCBoYW5kbGVCZWZvcmVMb2FkRXZlbnQsIHRydWUpO1xuIiwiLyogIO+8g2Z1bmN0aW9uIGdldENvb2tpZXMjXG4gKiAgPCBTdHJpbmcgIGNvb2tpZeWQjVxuICogID4gU3RyaW5nICBjb29raWXlgLxcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldENvb2tpZShjX25hbWUpIHtcbiAgICBpZiAoZG9jdW1lbnQuY29va2llLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY19zdGFydCA9IGRvY3VtZW50LmNvb2tpZS5pbmRleE9mKGNfbmFtZSArIFwiPVwiKVxuICAgICAgICBpZiAoY19zdGFydCAhPSAtMSkge1xuICAgICAgICAgICAgY19zdGFydCA9IGNfc3RhcnQgKyBjX25hbWUubGVuZ3RoICsgMVxuICAgICAgICAgICAgY19lbmQgPSBkb2N1bWVudC5jb29raWUuaW5kZXhPZihcIjtcIiwgY19zdGFydClcbiAgICAgICAgICAgIGlmIChjX2VuZCA9PSAtMSkgY19lbmQgPSBkb2N1bWVudC5jb29raWUubGVuZ3RoXG4gICAgICAgICAgICByZXR1cm4gdW5lc2NhcGUoZG9jdW1lbnQuY29va2llLnN1YnN0cmluZyhjX3N0YXJ0LCBjX2VuZCkpXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFwiXCJcbn0iLCJ2YXIgaGFzRmxhc2ggPSBmYWxzZTtcbnRyeSB7XG4gIHZhciBmbGFzaE9iamVjdCA9IG5ldyBBY3RpdmVYT2JqZWN0KCdTaG9ja3dhdmVGbGFzaC5TaG9ja3dhdmVGbGFzaCcpO1xuICBpZiAoZmxhc2hPYmplY3QpIHtcbiAgICBoYXNGbGFzaCA9IHRydWU7XG4gIH1cbn0gY2F0Y2ggKGUpIHtcbiAgaWYgKG5hdmlnYXRvci5taW1lVHlwZXMgJiYgbmF2aWdhdG9yLm1pbWVUeXBlc1snYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnXSAhPSB1bmRlZmluZWQgJiYgXG4gICAgbmF2aWdhdG9yLm1pbWVUeXBlc1snYXBwbGljYXRpb24veC1zaG9ja3dhdmUtZmxhc2gnXS5lbmFibGVkUGx1Z2luKSB7XG4gICAgaGFzRmxhc2ggPSB0cnVlO1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGhhc0ZsYXNoOyIsIi8qICDvvINmdW5jdGlvbiBodHRwUHJveHkjXG4gKiAgPCBTdHJpbmcgICAgICAgIOivt+axguWcsOWdgFxuICogIDwgU3RyaW5nICAgICAgICDor7fmsYLmlrnms5VHRVQsUE9TVCxldGMuXG4gKiAgPCBPYmplY3QgICAgICAgIOivt+axguWPguaVsFxuICogIDwgRnVuY3Rpb24gICAgICDor7fmsYLnmoRjYWxsYmFjaywg5aaC5p6c5aSx6LSl6L+U5Zue77yNMe+8jCDmiJDlip/ov5Tlm57lhoXlrrlcbiAqICA8IHtcbiAqICAgICAgeG1sOiAgICAgICBCb29sICAg5piv5ZCm6ZyA6KaB5YGaeG1sMmpzb24g5Y+v57y655yBLCDpu5jorqRmYXNsZVxuICogICAgICBnemluZmxhdGU6IEJvb2wgICDmmK/lkKbpnIDopoHlgZpnemluZmxhdGUg5Y+v57y655yBLCDpu5jorqRmYXNsZVxuICogICAgICBjb250ZXh0OiAgIEFueSAgICBjYWxsYmFja+Wbnuiwg+eahHRoaXPmjIflkJEg5Y+v57y655yBXG4gKiAgICB9XG4gKiAgfVxuICogIOeUqOS6juWPkei1t+i3qOWfn+eahGFqYXjor7fmsYLjgILml6LmjqXlj6Pov5Tlm57ot6jln5/lj4jkuI3mlK/mjIFqc29ucOWNj+iurueahFxuICovXG5cbnZhciBjcmVhdGVFbGVtZW50ID0gcmVxdWlyZSgnLi9jcmVhdGVFbGVtZW50JylcbnZhciBhamF4ICAgICAgICAgID0gcmVxdWlyZSgnLi9hamF4JylcbnZhciBxdWVyeVN0cmluZyAgID0gcmVxdWlyZSgnLi9xdWVyeVN0cmluZycpXG5cbnZhciBwcm94eVVybCA9ICdodHRwOi8venl0aHVtLnNpbmFhcHAuY29tL21hbWEyL3Byb3h5LnBocCdcblxuZnVuY3Rpb24gaHR0cFByb3h5ICh1cmwsIHR5cGUsIHBhcmFtcywgY2FsbGJhY2ssIG9wdHMpIHtcbiAgb3B0cyA9IG9wdHMgfHwge31cbiAgYWpheCh7XG4gICAgdXJsOiBwcm94eVVybCxcbiAgICBwYXJhbSA6IHtcbiAgICAgIHBhcmFtczogZW5jb2RlVVJJQ29tcG9uZW50KHF1ZXJ5U3RyaW5nKHBhcmFtcykpLC8v5LiK6KGM5Y+C5pWwXG4gICAgICByZWZlcnJlcjogZW5jb2RlVVJJQ29tcG9uZW50KChvcHRzLnJlZmVycmVyIHx8IGxvY2F0aW9uLmhyZWYpLnNwbGl0KCcjJylbMF0pLFxuICAgICAgdXJsOiBlbmNvZGVVUklDb21wb25lbnQodXJsLnNwbGl0KCcjJylbMF0pLFxuICAgICAgcG9zdDogdHlwZSA9PT0gJ3Bvc3QnID8gMSA6IDAsXG4gICAgICB4bWw6IG9wdHMueG1sID8gMSA6IDAsXG4gICAgICB0ZXh0OiBvcHRzLnRleHQgPyAxIDogMCxcbiAgICAgIGd6aW5mbGF0ZTogb3B0cy5nemluZmxhdGUgPyAxIDogMCxcbiAgICAgIHVhOiBlbmNvZGVVUklDb21wb25lbnQob3B0cy51YSB8fCBuYXZpZ2F0b3IudXNlckFnZW50KVxuICAgIH0sXG4gICAganNvbnA6IHRydWUsXG4gICAgY2FsbGJhY2s6IGNhbGxiYWNrLFxuICAgIGNvbnRleHQ6IG9wdHMuY29udGV4dFxuICB9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGh0dHBQcm94eSIsIi8qICDvvINmdW5jdGlvbiBqc29ucCNcbiAqICBqc29ucOaWueazleOAguaOqOiNkOS9v+eUqGFqYXjmlrnms5XjgIJhamF45YyF5ZCr5LqGanNvbnBcbiAqL1xudmFyIGNyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKCcuL2NyZWF0ZUVsZW1lbnQnKVxudmFyIG5vb3AgICAgICAgICAgPSByZXF1aXJlKCcuL25vb3AnKVxuXG52YXIgY2FsbGJhY2tQcmVmaXggPSAnTUFNQTJfSFRUUF9KU09OUF9DQUxMQkFDSydcbnZhciBjYWxsYmFja0NvdW50ICA9IDBcbnZhciB0aW1lb3V0RGVsYXkgICA9IDEwMDAwXG5cbmZ1bmN0aW9uIGNhbGxiYWNrSGFuZGxlICgpIHtcbiAgcmV0dXJuIGNhbGxiYWNrUHJlZml4ICsgY2FsbGJhY2tDb3VudCsrXG59XG5cbmZ1bmN0aW9uIGpzb25wICh1cmwsIGNhbGxiYWNrLCBjYWxsYmFja0tleSkge1xuXG4gIGNhbGxiYWNrS2V5ID0gY2FsbGJhY2tLZXkgfHwgJ2NhbGxiYWNrJ1xuXG4gIHZhciBfY2FsbGJhY2tIYW5kbGUgPSBjYWxsYmFja0hhbmRsZSgpICBcbiAgd2luZG93W19jYWxsYmFja0hhbmRsZV0gPSBmdW5jdGlvbiAocnMpIHtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dFRpbWVyKVxuICAgIHdpbmRvd1tfY2FsbGJhY2tIYW5kbGVdID0gbm9vcFxuICAgIGNhbGxiYWNrKHJzKVxuICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc2NyaXB0KVxuICB9XG4gIHZhciB0aW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICB3aW5kb3dbX2NhbGxiYWNrSGFuZGxlXSgtMSlcbiAgfSwgdGltZW91dERlbGF5KVxuXG4gIHZhciBzY3JpcHQgPSBjcmVhdGVFbGVtZW50KCdzY3JpcHQnLCB7XG4gICAgYXBwZW5kVG86IGRvY3VtZW50LmJvZHksXG4gICAgc3JjOiB1cmwgKyAodXJsLmluZGV4T2YoJz8nKSA+PSAwID8gJyYnIDogJz8nKSArIGNhbGxiYWNrS2V5ICsgJz0nICsgX2NhbGxiYWNrSGFuZGxlXG4gIH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0ganNvbnAiLCIvKiAg77yDZnVuY3Rpb24gbG9n77yDXG4gKiAgPCBTdHJpbmdcbiAqICBsb2csIOS8muWcqOmhtemdouWSjGNvbnNvbGXkuK3ovpPlh7psb2dcbiAqL1xuXG52YXIgY3JlYXRlRWxlbWVudCA9IHJlcXVpcmUoJy4vY3JlYXRlRWxlbWVudCcpXG52YXIgTUFNQUxvZ0RPTVxudmFyIGxvZ1RpbWVyXG52YXIgbG9nRGVsYXkgPSAxMDAwMFxuXG5mdW5jdGlvbiBsb2cgKG1zZywgZGVsYXkpIHtcbiAgaWYgKCBNQU1BTG9nRE9NID09PSB1bmRlZmluZWQgKSB7XG4gICAgTUFNQUxvZ0RPTSA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcbiAgICAgIHN0eWxlOiB7XG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJyMyNDI3MkEnLFxuICAgICAgICBjb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgICAgekluZGV4OiAnMTAwMDAwMCcsXG4gICAgICAgIHRvcDogJzAnLFxuICAgICAgICBsZWZ0OiAnMCcsXG4gICAgICAgIHBhZGRpbmc6ICc1cHggMTBweCcsXG4gICAgICAgIGZvbnRTaXplOiAnMTRweCdcbiAgICAgIH1cbiAgICB9KVxuICB9XG4gIGNsZWFyVGltZW91dChsb2dUaW1lcilcbiAgXG4gIE1BTUFMb2dET00uaW5uZXJIVE1MID0gJzxzcGFuIHN0eWxlPVwiY29sb3I6I0RGNjU1OFwiPk1BTUEyICZndDs8L3NwYW4+ICcgKyBtc2dcbiAgY29uc29sZSAmJiBjb25zb2xlLmxvZyAmJiBjb25zb2xlLmxvZygnJWMgTUFNQTIgJWMgJXMnLCAnYmFja2dyb3VuZDojMjQyNzJBOyBjb2xvcjojZmZmZmZmJywgJycsIG1zZylcblxuICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKE1BTUFMb2dET00pXG4gIGxvZ1RpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChNQU1BTG9nRE9NKVxuICB9LCBkZWxheSoxMDAwIHx8IGxvZ0RlbGF5KVxufVxubW9kdWxlLmV4cG9ydHMgPSBsb2ciLCIvL+WmiOWmiOiuoeWIkuWUr+S4gOWAvFxubW9kdWxlLmV4cG9ydHMgPSAnTUFNQUtFWV/nlLDnkLTmmK/ov5nkuKrkuJbnlYzkuIrmnIDlj6/niLHnmoTlpbPlranlrZDlkbXlkbXlkbXlkbXvvIzmiJHopoHorqnlhajkuJbnlYzpg73lnKjnn6XpgZMnIiwiLy/nqbrmlrnms5Vcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge30iLCJ2YXIgTUFNQVBsYXllcjtcblxuLy8gTUFNQVBsYXllciBcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96eXRodW0vbWFtYXBsYXllclxuIWZ1bmN0aW9uIGUodCxpLG4pe2Z1bmN0aW9uIG8ocixhKXtpZighaVtyXSl7aWYoIXRbcl0pe3ZhciBsPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWEmJmwpcmV0dXJuIGwociwhMCk7aWYocylyZXR1cm4gcyhyLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK3IrXCInXCIpfXZhciBjPWlbcl09e2V4cG9ydHM6e319O3Rbcl1bMF0uY2FsbChjLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIGk9dFtyXVsxXVtlXTtyZXR1cm4gbyhpP2k6ZSl9LGMsYy5leHBvcnRzLGUsdCxpLG4pfXJldHVybiBpW3JdLmV4cG9ydHN9Zm9yKHZhciBzPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUscj0wO3I8bi5sZW5ndGg7cisrKW8obltyXSk7cmV0dXJuIG99KHsxOltmdW5jdGlvbihlLHQpe2Z1bmN0aW9uIGkoZSl7Zm9yKHZhciB0PVtdLGk9MTtpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXt2YXIgbz1hcmd1bWVudHNbaV0scz1vLmluaXQ7dC5wdXNoKHMpLGRlbGV0ZSBvLmluaXQsbihlLnByb3RvdHlwZSxvKX1lLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7dC5mb3JFYWNoKGZ1bmN0aW9uKGUpe2UuY2FsbCh0aGlzKX0uYmluZCh0aGlzKSl9fXZhciBuPWUoXCIuL2V4dGVuZFwiKTt0LmV4cG9ydHM9aX0se1wiLi9leHRlbmRcIjo5fV0sMjpbZnVuY3Rpb24oZSx0KXt2YXIgaT1lKFwiLi9wbGF5ZXIuY3NzXCIpLG49ZShcIi4vcGxheWVyLmh0bWxcIiksbz0oZShcIi4vZXh0ZW5kXCIpLGUoXCIuL2NyZWF0ZUVsZW1lbnRcIikpLHM9ZShcIi4vcGFyc2VET01CeUNsYXNzTmFtZXNcIik7dC5leHBvcnRzPXtpbml0OmZ1bmN0aW9uKCl7dmFyIGU9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLmlmcmFtZS5jb250ZW50RG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLHQ9dGhpcy5pZnJhbWUuY29udGVudERvY3VtZW50LmJvZHk7byhcInN0eWxlXCIsZnVuY3Rpb24oKXtlLmFwcGVuZENoaWxkKHRoaXMpO3RyeXt0aGlzLnN0eWxlU2hlZXQuY3NzVGV4dD1pfWNhdGNoKHQpe3RoaXMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaSkpfX0pLG8oXCJsaW5rXCIse2FwcGVuZFRvOmUsaHJlZjpcImh0dHA6Ly9saWJzLmNuY2RuLmNuL2ZvbnQtYXdlc29tZS80LjMuMC9jc3MvZm9udC1hd2Vzb21lLm1pbi5jc3NcIixyZWw6XCJzdHlsZXNoZWV0XCIsdHlwZTpcInRleHQvY3NzXCJ9KSx0LmlubmVySFRNTD1uLHRoaXMuRE9Ncz1zKHQsW1wicGxheWVyXCIsXCJ2aWRlb1wiLFwidmlkZW8tZnJhbWVcIixcImNvbW1lbnRzXCIsXCJjb21tZW50cy1idG5cIixcInBsYXlcIixcInByb2dyZXNzX2FuY2hvclwiLFwiYnVmZmVyZWRfYW5jaG9yXCIsXCJmdWxsc2NyZWVuXCIsXCJhbGxzY3JlZW5cIixcImhkXCIsXCJ2b2x1bWVfYW5jaG9yXCIsXCJjdXJyZW50XCIsXCJkdXJhdGlvblwiXSksdGhpcy52aWRlbz10aGlzLkRPTXMudmlkZW99LmJpbmQodGhpcyksdD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKSxyPXRoaXMuaWZyYW1lPW8oXCJpZnJhbWVcIix7YWxsb3dUcmFuc3BhcmVuY3k6ITAsZnJhbWVCb3JkZXI6XCJub1wiLHNjcm9sbGluZzpcIm5vXCIsc3JjOlwiYWJvdXQ6YmxhbmtcIixtb3phbGxvd2Z1bGxzY3JlZW46XCJtb3phbGxvd2Z1bGxzY3JlZW5cIix3ZWJraXRhbGxvd2Z1bGxzY3JlZW46XCJ3ZWJraXRhbGxvd2Z1bGxzY3JlZW5cIixhbGxvd2Z1bGxzY3JlZW46XCJhbGxvd2Z1bGxzY3JlZW5cIixzdHlsZTp7d2lkdGg6dGhpcy5zaXplWzBdK1wicHhcIixoZWlnaHQ6dGhpcy5zaXplWzFdK1wicHhcIixvdmVyZmxvdzpcImhpZGRlblwifX0pO3QmJnQucGFyZW50Tm9kZT8odC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChyLHQpLGUoKSk6KGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQociksZSgpLGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQocikpfX19LHtcIi4vY3JlYXRlRWxlbWVudFwiOjcsXCIuL2V4dGVuZFwiOjksXCIuL3BhcnNlRE9NQnlDbGFzc05hbWVzXCI6MTEsXCIuL3BsYXllci5jc3NcIjoxMixcIi4vcGxheWVyLmh0bWxcIjoxM31dLDM6W2Z1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gaShlKXtlLnN0cm9rZVN0eWxlPVwiYmxhY2tcIixlLmxpbmVXaWR0aD0zLGUuZm9udD0nYm9sZCAyMHB4IFwiUGluZ0hlaVwiLFwiTHVjaWRhIEdyYW5kZVwiLCBcIkx1Y2lkYSBTYW5zIFVuaWNvZGVcIiwgXCJTVEhlaXRpXCIsIFwiSGVsdmV0aWNhXCIsXCJBcmlhbFwiLFwiVmVyZGFuYVwiLFwic2Fucy1zZXJpZlwiJ312YXIgbj0oZShcIi4vY3JlYXRlRWxlbWVudFwiKSwuMSksbz0yNSxzPTRlMyxyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIikuZ2V0Q29udGV4dChcIjJkXCIpO2kocik7dmFyIGE9d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZXx8d2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZXx8d2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZXx8d2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lfHx3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZXx8ZnVuY3Rpb24oZSl7c2V0VGltZW91dChlLDFlMy82MCl9O3QuZXhwb3J0cz17aW5pdDpmdW5jdGlvbigpe3RoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcInBsYXlcIix0aGlzLnJlU3RhcnRDb21tZW50LmJpbmQodGhpcykpLHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcInBhdXNlXCIsdGhpcy5wYXVzZUNvbW1lbnQuYmluZCh0aGlzKSksdGhpcy5sYXN0Q29tbW5ldFVwZGF0ZVRpbWU9MCx0aGlzLmxhc3RDb21tbmV0SW5kZXg9MCx0aGlzLmNvbW1lbnRMb29wUHJlUXVldWU9W10sdGhpcy5jb21tZW50TG9vcFF1ZXVlPVtdLHRoaXMuY29tbWVudEJ1dHRvblByZVF1ZXVlPVtdLHRoaXMuY29tbWVudEJ1dHRvblF1ZXVlPVtdLHRoaXMuY29tbWVudFRvcFByZVF1ZXVlPVtdLHRoaXMuY29tbWVudFRvcFF1ZXVlPVtdLHRoaXMuZHJhd1F1ZXVlPVtdLHRoaXMucHJlUmVuZGVycz1bXSx0aGlzLnByZVJlbmRlck1hcD17fSx0aGlzLmVuYWJsZUNvbW1lbnQ9dm9pZCAwPT09dGhpcy5jb21tZW50cz8hMTohMCx0aGlzLnByZXZEcmF3Q2FudmFzPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiksdGhpcy5jYW52YXM9dGhpcy5ET01zLmNvbW1lbnRzLmdldENvbnRleHQoXCIyZFwiKSx0aGlzLmNvbW1lbnRzJiZ0aGlzLkRPTXMucGxheWVyLmNsYXNzTGlzdC5hZGQoXCJoYXMtY29tbWVudHNcIiksdGhpcy5ET01zW1wiY29tbWVudHMtYnRuXCJdLmNsYXNzTGlzdC5hZGQoXCJlbmFibGVcIiksdGhpcy5ET01zLmNvbW1lbnRzLmRpc3BsYXk9dGhpcy5lbmFibGVDb21tZW50P1wiYmxvY2tcIjpcIm5vbmVcIjt2YXIgZT0wLHQ9ZnVuY3Rpb24oKXsoZT1+ZSkmJnRoaXMub25Db21tZW50VGltZVVwZGF0ZSgpLGEodCl9LmJpbmQodGhpcyk7dCgpfSxuZWVkRHJhd1RleHQ6ZnVuY3Rpb24oZSx0LGkpe3RoaXMuZHJhd1F1ZXVlLnB1c2goW2UsdCxpXSl9LGRyYXdUZXh0OmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5wcmV2RHJhd0NhbnZhcyx0PXRoaXMucHJldkRyYXdDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO2Uud2lkdGg9dGhpcy5jYW52YXNXaWR0aCxlLmhlaWdodD10aGlzLmNhbnZhc0hlaWdodCx0LmNsZWFyUmVjdCgwLDAsdGhpcy5jYW52YXNXaWR0aCx0aGlzLmNhbnZhc0hlaWdodCk7dmFyIG49W107dGhpcy5wcmVSZW5kZXJzLmZvckVhY2goZnVuY3Rpb24oZSx0KXtlLnVzZWQ9ITEsdm9pZCAwPT09ZS5jaWQmJm4ucHVzaCh0KX0pO2Zvcih2YXIgcztzPXRoaXMuZHJhd1F1ZXVlLnNoaWZ0KCk7KSFmdW5jdGlvbihlLHMpe3ZhciByLGE9ZVswXS50ZXh0K2VbMF0uY29sb3IsbD1zLnByZVJlbmRlck1hcFthXTtpZih2b2lkIDA9PT1sKXt2YXIgbD1uLnNoaWZ0KCk7dm9pZCAwPT09bD8ocj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLGw9cy5wcmVSZW5kZXJzLnB1c2gociktMSk6cj1zLnByZVJlbmRlcnNbbF07dmFyIGM9ci53aWR0aD1lWzBdLndpZHRoLGg9ci5oZWlnaHQ9bysxMCxkPXIuZ2V0Q29udGV4dChcIjJkXCIpO2QuY2xlYXJSZWN0KDAsMCxjLGgpLGkoZCksZC5maWxsU3R5bGU9ZVswXS5jb2xvcixkLnN0cm9rZVRleHQoZVswXS50ZXh0LDAsbyksZC5maWxsVGV4dChlWzBdLnRleHQsMCxvKSxyLmNpZD1hLHMucHJlUmVuZGVyTWFwW2FdPWx9ZWxzZSByPXMucHJlUmVuZGVyc1tsXTtyLnVzZWQ9ITAsdC5kcmF3SW1hZ2UocixlWzFdLGVbMl0pfShzLHRoaXMpO3RoaXMucHJlUmVuZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2UudXNlZD09PSExJiYoZGVsZXRlIHRoaXMucHJlUmVuZGVyTWFwW2UuY2lkXSxlLmNpZD12b2lkIDApfS5iaW5kKHRoaXMpKSx0aGlzLmNhbnZhcy5jbGVhclJlY3QoMCwwLHRoaXMuY2FudmFzV2lkdGgsdGhpcy5jYW52YXNIZWlnaHQpLHRoaXMuY2FudmFzLmRyYXdJbWFnZShlLDAsMCl9LGNyZWF0ZUNvbW1lbnQ6ZnVuY3Rpb24oZSx0KXtpZih2b2lkIDA9PT1lKXJldHVybiExO3ZhciBpPXIubWVhc3VyZVRleHQoZS50ZXh0KTtyZXR1cm57c3RhcnRUaW1lOnQsdGV4dDplLnRleHQsY29sb3I6ZS5jb2xvcix3aWR0aDppLndpZHRoKzIwfX0sY29tbWVudFRvcDpmdW5jdGlvbihlLHQsaSl7dGhpcy5jb21tZW50VG9wUXVldWUuZm9yRWFjaChmdW5jdGlvbih0LG4pe3ZvaWQgMCE9dCYmKGk+dC5zdGFydFRpbWUrcz90aGlzLmNvbW1lbnRUb3BRdWV1ZVtuXT12b2lkIDA6dGhpcy5uZWVkRHJhd1RleHQodCwoZS10LndpZHRoKS8yLG8qbikpfS5iaW5kKHRoaXMpKTtmb3IodmFyIG47bj10aGlzLmNvbW1lbnRUb3BQcmVRdWV1ZS5zaGlmdCgpOyluPXRoaXMuY3JlYXRlQ29tbWVudChuLGkpLHRoaXMuY29tbWVudFRvcFF1ZXVlLmZvckVhY2goZnVuY3Rpb24odCxpKXtuJiZ2b2lkIDA9PT10JiYodD10aGlzLmNvbW1lbnRUb3BRdWV1ZVtpXT1uLHRoaXMubmVlZERyYXdUZXh0KHQsKGUtbi53aWR0aCkvMixvKmkpLG49dm9pZCAwKX0uYmluZCh0aGlzKSksbiYmKHRoaXMuY29tbWVudFRvcFF1ZXVlLnB1c2gobiksdGhpcy5uZWVkRHJhd1RleHQobiwoZS1uLndpZHRoKS8yLG8qdGhpcy5jb21tZW50VG9wUXVldWUubGVuZ3RoLTEpKX0sY29tbWVudEJvdHRvbTpmdW5jdGlvbihlLHQsaSl7dC09MTAsdGhpcy5jb21tZW50QnV0dG9uUXVldWUuZm9yRWFjaChmdW5jdGlvbihuLHIpe3ZvaWQgMCE9biYmKGk+bi5zdGFydFRpbWUrcz90aGlzLmNvbW1lbnRCdXR0b25RdWV1ZVtyXT12b2lkIDA6dGhpcy5uZWVkRHJhd1RleHQobiwoZS1uLndpZHRoKS8yLHQtbyoocisxKSkpfS5iaW5kKHRoaXMpKTtmb3IodmFyIG47bj10aGlzLmNvbW1lbnRCdXR0b25QcmVRdWV1ZS5zaGlmdCgpOyluPXRoaXMuY3JlYXRlQ29tbWVudChuLGkpLHRoaXMuY29tbWVudEJ1dHRvblF1ZXVlLmZvckVhY2goZnVuY3Rpb24oaSxzKXtuJiZ2b2lkIDA9PT1pJiYoaT10aGlzLmNvbW1lbnRCdXR0b25RdWV1ZVtzXT1uLHRoaXMubmVlZERyYXdUZXh0KGksKGUtbi53aWR0aCkvMix0LW8qKHMrMSkpLG49dm9pZCAwKX0uYmluZCh0aGlzKSksbiYmKHRoaXMuY29tbWVudEJ1dHRvblF1ZXVlLnB1c2gobiksdGhpcy5uZWVkRHJhd1RleHQobiwoZS1uLndpZHRoKS8yLHQtbyp0aGlzLmNvbW1lbnRCdXR0b25RdWV1ZS5sZW5ndGgpKX0sY29tbWVudExvb3A6ZnVuY3Rpb24oZSx0LGkpe2Zvcih2YXIgcz10L298MCxyPS0xOysrcjxzOyl7dmFyIGE9dGhpcy5jb21tZW50TG9vcFF1ZXVlW3JdO2lmKHZvaWQgMD09PWEmJihhPXRoaXMuY29tbWVudExvb3BRdWV1ZVtyXT1bXSksdGhpcy5jb21tZW50TG9vcFByZVF1ZXVlLmxlbmd0aD4wKXt2YXIgbD0wPT09YS5sZW5ndGg/dm9pZCAwOmFbYS5sZW5ndGgtMV07aWYodm9pZCAwPT09bHx8KGktbC5zdGFydFRpbWUpKm4+bC53aWR0aCl7dmFyIGM9dGhpcy5jcmVhdGVDb21tZW50KHRoaXMuY29tbWVudExvb3BQcmVRdWV1ZS5zaGlmdCgpLGkpO2MmJmEucHVzaChjKX19dGhpcy5jb21tZW50TG9vcFF1ZXVlW3JdPWEuZmlsdGVyKGZ1bmN0aW9uKHQpe3ZhciBzPShpLXQuc3RhcnRUaW1lKSpuO3JldHVybiAwPnN8fHM+dC53aWR0aCtlPyExOih0aGlzLm5lZWREcmF3VGV4dCh0LGUtcyxvKnIpLCEwKX0uYmluZCh0aGlzKSl9Zm9yKHZhciBoPXRoaXMuY29tbWVudExvb3BRdWV1ZS5sZW5ndGgtcztoLS0+MDspdGhpcy5jb21tZW50TG9vcFF1ZXVlLnBvcCgpfSxwYXVzZUNvbW1lbnQ6ZnVuY3Rpb24oKXt0aGlzLnBhdXNlQ29tbWVudEF0PURhdGUubm93KCl9LHJlU3RhcnRDb21tZW50OmZ1bmN0aW9uKCl7aWYodGhpcy5wYXVzZUNvbW1lbnRBdCl7dmFyIGU9RGF0ZS5ub3coKS10aGlzLnBhdXNlQ29tbWVudEF0O3RoaXMuY29tbWVudExvb3BRdWV1ZS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3QuZm9yRWFjaChmdW5jdGlvbih0KXt0JiYodC5zdGFydFRpbWUrPWUpfSl9KSx0aGlzLmNvbW1lbnRCdXR0b25RdWV1ZS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3QmJih0LnN0YXJ0VGltZSs9ZSl9KSx0aGlzLmNvbW1lbnRUb3BRdWV1ZS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3QmJih0LnN0YXJ0VGltZSs9ZSl9KX10aGlzLnBhdXNlQ29tbWVudEF0PXZvaWQgMH0sZHJhd0NvbW1lbnQ6ZnVuY3Rpb24oKXtpZighdGhpcy5wYXVzZUNvbW1lbnRBdCl7dmFyIGU9RGF0ZS5ub3coKSx0PXRoaXMuRE9Nc1tcInZpZGVvLWZyYW1lXCJdLm9mZnNldFdpZHRoLGk9dGhpcy5ET01zW1widmlkZW8tZnJhbWVcIl0ub2Zmc2V0SGVpZ2h0O3QhPXRoaXMuY2FudmFzV2lkdGgmJih0aGlzLkRPTXMuY29tbWVudHMud2lkdGg9dCx0aGlzLmNhbnZhc1dpZHRoPXQpLGkhPXRoaXMuY2FudmFzSGVpZ2h0JiYodGhpcy5ET01zLmNvbW1lbnRzLmhlaWdodD1pLHRoaXMuY2FudmFzSGVpZ2h0PWkpO3ZhciBuPXRoaXMudmlkZW8ub2Zmc2V0V2lkdGgsbz10aGlzLnZpZGVvLm9mZnNldEhlaWdodDt0aGlzLmNvbW1lbnRMb29wKG4sbyxlKSx0aGlzLmNvbW1lbnRUb3AobixvLGUpLHRoaXMuY29tbWVudEJvdHRvbShuLG8sZSksdGhpcy5kcmF3VGV4dCgpfX0sb25Db21tZW50VGltZVVwZGF0ZTpmdW5jdGlvbigpe2lmKHRoaXMuZW5hYmxlQ29tbWVudCE9PSExKXt2YXIgZT10aGlzLnZpZGVvLmN1cnJlbnRUaW1lO2lmKE1hdGguYWJzKGUtdGhpcy5sYXN0Q29tbW5ldFVwZGF0ZVRpbWUpPD0xJiZlPnRoaXMubGFzdENvbW1uZXRVcGRhdGVUaW1lKXt2YXIgdD0wO2Zvcih0aGlzLmxhc3RDb21tbmV0SW5kZXgmJnRoaXMuY29tbWVudHNbdGhpcy5sYXN0Q29tbW5ldEluZGV4XS50aW1lPD10aGlzLmxhc3RDb21tbmV0VXBkYXRlVGltZSYmKHQ9dGhpcy5sYXN0Q29tbW5ldEluZGV4KTsrK3Q8dGhpcy5jb21tZW50cy5sZW5ndGg7KWlmKCEodGhpcy5jb21tZW50c1t0XS50aW1lPD10aGlzLmxhc3RDb21tbmV0VXBkYXRlVGltZSkpe2lmKHRoaXMuY29tbWVudHNbdF0udGltZT5lKWJyZWFrO3N3aXRjaCh0aGlzLmNvbW1lbnRzW3RdLnBvcyl7Y2FzZVwiYm90dG9tXCI6dGhpcy5jb21tZW50QnV0dG9uUHJlUXVldWUucHVzaCh0aGlzLmNvbW1lbnRzW3RdKTticmVhaztjYXNlXCJ0b3BcIjp0aGlzLmNvbW1lbnRUb3BQcmVRdWV1ZS5wdXNoKHRoaXMuY29tbWVudHNbdF0pO2JyZWFrO2RlZmF1bHQ6dGhpcy5jb21tZW50TG9vcFByZVF1ZXVlLnB1c2godGhpcy5jb21tZW50c1t0XSl9dGhpcy5sYXN0Q29tbW5ldEluZGV4PXR9fXRyeXt0aGlzLmRyYXdDb21tZW50KCl9Y2F0Y2goaSl7fXRoaXMubGFzdENvbW1uZXRVcGRhdGVUaW1lPWV9fX19LHtcIi4vY3JlYXRlRWxlbWVudFwiOjd9XSw0OltmdW5jdGlvbihlLHQpe2Z1bmN0aW9uIGkoZSl7cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGUpfWZ1bmN0aW9uIG4oZSx0LGksbil7ZnVuY3Rpb24gbyh0KXt2YXIgaT0odC5jbGllbnRYLWUucGFyZW50Tm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0KS9lLnBhcmVudE5vZGUub2Zmc2V0V2lkdGg7cmV0dXJuIE1hdGgubWluKE1hdGgubWF4KGksMCksMSl9ZnVuY3Rpb24gcyh0KXsxPT10LndoaWNoJiYobD0hMCxlLmRyYWdpbmc9ITAscih0KSl9ZnVuY3Rpb24gcihlKXtpZigxPT1lLndoaWNoJiZsPT09ITApe3ZhciB0PW8oZSk7aSh0KX19ZnVuY3Rpb24gYSh0KXtpZigxPT10LndoaWNoJiZsPT09ITApe3ZhciBzPW8odCk7aShzKSxuKHMpLGw9ITEsZGVsZXRlIGUuZHJhZ2luZ319dmFyIGw9ITE7aT1pfHxmdW5jdGlvbigpe30sbj1ufHxmdW5jdGlvbigpe30sZS5wYXJlbnROb2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIixzKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIixyKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsYSl9dmFyIG89KGUoXCIuL2NyZWF0ZUVsZW1lbnRcIiksZShcIi4vZGVsZWdhdGVDbGlja0J5Q2xhc3NOYW1lXCIpKSxzPWUoXCIuL3RpbWVGb3JtYXRcIik7dC5leHBvcnRzPXtpbml0OmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5pZnJhbWUuY29udGVudERvY3VtZW50LHQ9byhlKTt0Lm9uKFwicGxheVwiLHRoaXMub25QbGF5Q2xpY2ssdGhpcyksdC5vbihcInZpZGVvLWZyYW1lXCIsdGhpcy5vblZpZGVvQ2xpY2ssdGhpcyksdC5vbihcInNvdXJjZVwiLHRoaXMub25Tb3VyY2VDbGljayx0aGlzKSx0Lm9uKFwiYWxsc2NyZWVuXCIsdGhpcy5vbkFsbFNjcmVlbkNsaWNrLHRoaXMpLHQub24oXCJmdWxsc2NyZWVuXCIsdGhpcy5vbmZ1bGxTY3JlZW5DbGljayx0aGlzKSx0Lm9uKFwibm9ybWFsc2NyZWVuXCIsdGhpcy5vbk5vcm1hbFNjcmVlbkNsaWNrLHRoaXMpLHQub24oXCJjb21tZW50cy1idG5cIix0aGlzLm9uY29tbWVudHNCdG5DbGljayx0aGlzKSx0Lm9uKFwiYWlycGxheVwiLHRoaXMub25BaXJwbGF5QnRuQ2xpY2ssdGhpcyksZS5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIix0aGlzLm9uS2V5RG93bi5iaW5kKHRoaXMpLCExKSx0aGlzLkRPTXMucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIix0aGlzLm9uTW91c2VBY3RpdmUuYmluZCh0aGlzKSksbih0aGlzLkRPTXMucHJvZ3Jlc3NfYW5jaG9yLGUsdGhpcy5vblByb2dyZXNzQW5jaG9yV2lsbFNldC5iaW5kKHRoaXMpLHRoaXMub25Qcm9ncmVzc0FuY2hvclNldC5iaW5kKHRoaXMpKSxuKHRoaXMuRE9Ncy52b2x1bWVfYW5jaG9yLGUsdGhpcy5vblZvbHVtZUFuY2hvcldpbGxTZXQuYmluZCh0aGlzKSl9LG9uS2V5RG93bjpmdW5jdGlvbihlKXtzd2l0Y2goZS5wcmV2ZW50RGVmYXVsdCgpLGUua2V5Q29kZSl7Y2FzZSAzMjp0aGlzLm9uUGxheUNsaWNrKCk7YnJlYWs7Y2FzZSAzOTp0aGlzLnZpZGVvLmN1cnJlbnRUaW1lPU1hdGgubWluKHRoaXMudmlkZW8uZHVyYXRpb24sdGhpcy52aWRlby5jdXJyZW50VGltZSsxMCk7YnJlYWs7Y2FzZSAzNzp0aGlzLnZpZGVvLmN1cnJlbnRUaW1lPU1hdGgubWF4KDAsdGhpcy52aWRlby5jdXJyZW50VGltZS0xMCk7YnJlYWs7Y2FzZSAzODp0aGlzLnZpZGVvLnZvbHVtZT1NYXRoLm1pbigxLHRoaXMudmlkZW8udm9sdW1lKy4xKSx0aGlzLkRPTXMudm9sdW1lX2FuY2hvci5zdHlsZS53aWR0aD0xMDAqdGhpcy52aWRlby52b2x1bWUrXCIlXCI7YnJlYWs7Y2FzZSA0MDp0aGlzLnZpZGVvLnZvbHVtZT1NYXRoLm1heCgwLHRoaXMudmlkZW8udm9sdW1lLS4xKSx0aGlzLkRPTXMudm9sdW1lX2FuY2hvci5zdHlsZS53aWR0aD0xMDAqdGhpcy52aWRlby52b2x1bWUrXCIlXCI7YnJlYWs7Y2FzZSA2NTp0aGlzLkRPTXMucGxheWVyLmNsYXNzTGlzdC5jb250YWlucyhcImFsbHNjcmVlblwiKT90aGlzLm9uTm9ybWFsU2NyZWVuQ2xpY2soKTp0aGlzLm9uQWxsU2NyZWVuQ2xpY2soKTticmVhaztjYXNlIDcwOnRoaXMuRE9Ncy5wbGF5ZXIuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZnVsbHNjcmVlblwiKXx8dGhpcy5vbmZ1bGxTY3JlZW5DbGljaygpfX0sb25WaWRlb0NsaWNrOmZ1bmN0aW9uKCl7dm9pZCAwPT10aGlzLnZpZGVvQ2xpY2tEYmxUaW1lcj90aGlzLnZpZGVvQ2xpY2tEYmxUaW1lcj1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhpcy52aWRlb0NsaWNrRGJsVGltZXI9dm9pZCAwLHRoaXMub25QbGF5Q2xpY2soKX0uYmluZCh0aGlzKSwzMDApOihjbGVhclRpbWVvdXQodGhpcy52aWRlb0NsaWNrRGJsVGltZXIpLHRoaXMudmlkZW9DbGlja0RibFRpbWVyPXZvaWQgMCxkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudHx8ZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnR8fGRvY3VtZW50LndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50P3RoaXMub25Ob3JtYWxTY3JlZW5DbGljaygpOnRoaXMub25mdWxsU2NyZWVuQ2xpY2soKSl9LG9uTW91c2VBY3RpdmU6ZnVuY3Rpb24oKXt0aGlzLkRPTXMucGxheWVyLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIiksY2xlYXJUaW1lb3V0KHRoaXMuTW91c2VBY3RpdmVUaW1lciksdGhpcy5Nb3VzZUFjdGl2ZVRpbWVyPXNldFRpbWVvdXQoZnVuY3Rpb24oKXt0aGlzLkRPTXMucGxheWVyLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIil9LmJpbmQodGhpcyksMWUzKX0sb25QbGF5Q2xpY2s6ZnVuY3Rpb24oKXt0aGlzLkRPTXMucGxheS5jbGFzc0xpc3QuY29udGFpbnMoXCJwYXVzZWRcIik/KHRoaXMudmlkZW8ucGxheSgpLHRoaXMuRE9Ncy5wbGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJwYXVzZWRcIikpOih0aGlzLnZpZGVvLnBhdXNlKCksdGhpcy5ET01zLnBsYXkuY2xhc3NMaXN0LmFkZChcInBhdXNlZFwiKSl9LG9uU291cmNlQ2xpY2s6ZnVuY3Rpb24oZSl7ZS5jbGFzc0xpc3QuY29udGFpbnMoXCJjdXJyXCIpfHwodGhpcy52aWRlby5wcmVsb2FkU3RhcnRUaW1lPXRoaXMudmlkZW8uY3VycmVudFRpbWUsdGhpcy52aWRlby5zcmM9dGhpcy5zb3VyY2VMaXN0WzB8ZS5nZXRBdHRyaWJ1dGUoXCJzb3VyY2VJbmRleFwiKV1bMV0saShlLnBhcmVudE5vZGUuY2hpbGROb2RlcykuZm9yRWFjaChmdW5jdGlvbih0KXtlPT09dD90LmNsYXNzTGlzdC5hZGQoXCJjdXJyXCIpOnQuY2xhc3NMaXN0LnJlbW92ZShcImN1cnJcIil9LmJpbmQodGhpcykpKX0sb25Qcm9ncmVzc0FuY2hvcldpbGxTZXQ6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy52aWRlby5kdXJhdGlvbixpPXQqZTt0aGlzLkRPTXMuY3VycmVudC5pbm5lckhUTUw9cyhpKSx0aGlzLkRPTXMuZHVyYXRpb24uaW5uZXJIVE1MPXModCksdGhpcy5ET01zLnByb2dyZXNzX2FuY2hvci5zdHlsZS53aWR0aD0xMDAqZStcIiVcIn0sb25Qcm9ncmVzc0FuY2hvclNldDpmdW5jdGlvbihlKXt0aGlzLnZpZGVvLmN1cnJlbnRUaW1lPXRoaXMudmlkZW8uZHVyYXRpb24qZX0sb25Wb2x1bWVBbmNob3JXaWxsU2V0OmZ1bmN0aW9uKGUpe3RoaXMudmlkZW8udm9sdW1lPWUsdGhpcy5ET01zLnZvbHVtZV9hbmNob3Iuc3R5bGUud2lkdGg9MTAwKmUrXCIlXCJ9LG9uQWxsU2NyZWVuQ2xpY2s6ZnVuY3Rpb24oKXt2YXIgZT1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsdD1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O3RoaXMuaWZyYW1lLnN0eWxlLmNzc1RleHQ9XCI7cG9zaXRpb246Zml4ZWQ7dG9wOjA7bGVmdDowO3dpZHRoOlwiK2UrXCJweDtoZWlnaHQ6XCIrdCtcInB4O3otaW5kZXg6OTk5OTk5O1wiLHRoaXMuYWxsU2NyZWVuV2luUmVzaXplRnVuY3Rpb249dGhpcy5hbGxTY3JlZW5XaW5SZXNpemVGdW5jdGlvbnx8ZnVuY3Rpb24oKXt0aGlzLmlmcmFtZS5zdHlsZS53aWR0aD1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgrXCJweFwiLHRoaXMuaWZyYW1lLnN0eWxlLmhlaWdodD1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0K1wicHhcIn0uYmluZCh0aGlzKSx3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLHRoaXMuYWxsU2NyZWVuV2luUmVzaXplRnVuY3Rpb24pLHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsdGhpcy5hbGxTY3JlZW5XaW5SZXNpemVGdW5jdGlvbiksdGhpcy5ET01zLnBsYXllci5jbGFzc0xpc3QuYWRkKFwiYWxsc2NyZWVuXCIpfSxvbmZ1bGxTY3JlZW5DbGljazpmdW5jdGlvbigpe1tcIndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuXCIsXCJtb3pSZXF1ZXN0RnVsbFNjcmVlblwiLFwicmVxdWVzdEZ1bGxTY3JlZW5cIl0uZm9yRWFjaChmdW5jdGlvbihlKXt0aGlzLkRPTXMucGxheWVyW2VdJiZ0aGlzLkRPTXMucGxheWVyW2VdKCl9LmJpbmQodGhpcykpLHRoaXMub25Nb3VzZUFjdGl2ZSgpfSxvbk5vcm1hbFNjcmVlbkNsaWNrOmZ1bmN0aW9uKCl7d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIix0aGlzLmFsbFNjcmVlbldpblJlc2l6ZUZ1bmN0aW9uKSx0aGlzLmlmcmFtZS5zdHlsZS5jc3NUZXh0PVwiO3dpZHRoOlwiK3RoaXMuc2l6ZVswXStcInB4O2hlaWdodDpcIit0aGlzLnNpemVbMV0rXCJweDtcIixbXCJ3ZWJraXRDYW5jZWxGdWxsU2NyZWVuXCIsXCJtb3pDYW5jZWxGdWxsU2NyZWVuXCIsXCJjYW5jZWxGdWxsU2NyZWVuXCJdLmZvckVhY2goZnVuY3Rpb24oZSl7ZG9jdW1lbnRbZV0mJmRvY3VtZW50W2VdKCl9KSx0aGlzLkRPTXMucGxheWVyLmNsYXNzTGlzdC5yZW1vdmUoXCJhbGxzY3JlZW5cIil9LG9uY29tbWVudHNCdG5DbGljazpmdW5jdGlvbigpe3RoaXMuZW5hYmxlQ29tbWVudD0hdGhpcy5ET01zW1wiY29tbWVudHMtYnRuXCJdLmNsYXNzTGlzdC5jb250YWlucyhcImVuYWJsZVwiKSx0aGlzLmVuYWJsZUNvbW1lbnQ/KHNldFRpbWVvdXQoZnVuY3Rpb24oKXt0aGlzLkRPTXMuY29tbWVudHMuc3R5bGUuZGlzcGxheT1cImJsb2NrXCJ9LmJpbmQodGhpcyksODApLHRoaXMuRE9Nc1tcImNvbW1lbnRzLWJ0blwiXS5jbGFzc0xpc3QuYWRkKFwiZW5hYmxlXCIpKToodGhpcy5ET01zLmNvbW1lbnRzLnN0eWxlLmRpc3BsYXk9XCJub25lXCIsdGhpcy5ET01zW1wiY29tbWVudHMtYnRuXCJdLmNsYXNzTGlzdC5yZW1vdmUoXCJlbmFibGVcIikpfSxvbkFpcnBsYXlCdG5DbGljazpmdW5jdGlvbigpe3RoaXMudmlkZW8ud2Via2l0U2hvd1BsYXliYWNrVGFyZ2V0UGlja2VyKCl9fX0se1wiLi9jcmVhdGVFbGVtZW50XCI6NyxcIi4vZGVsZWdhdGVDbGlja0J5Q2xhc3NOYW1lXCI6OCxcIi4vdGltZUZvcm1hdFwiOjE0fV0sNTpbZnVuY3Rpb24oZSx0KXt7dmFyIGk9KGUoXCIuL2V4dGVuZFwiKSxlKFwiLi9jcmVhdGVFbGVtZW50XCIpKTtlKFwiLi9wYXJzZURPTUJ5Q2xhc3NOYW1lc1wiKX10LmV4cG9ydHM9e2luaXQ6ZnVuY3Rpb24oKXt2YXIgZT0wO3RoaXMuc291cmNlTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHQsbil7aShcImxpXCIse2FwcGVuZFRvOnRoaXMuRE9Ncy5oZCxzb3VyY2VJbmRleDpuLGNsYXNzTmFtZTpcInNvdXJjZSBcIisobj09PWU/XCJjdXJyXCI6XCJcIiksaW5uZXJIVE1MOnRbMF19KX0uYmluZCh0aGlzKSksdGhpcy5ET01zLnZpZGVvLnNyYz10aGlzLnNvdXJjZUxpc3RbZV1bMV19fX0se1wiLi9jcmVhdGVFbGVtZW50XCI6NyxcIi4vZXh0ZW5kXCI6OSxcIi4vcGFyc2VET01CeUNsYXNzTmFtZXNcIjoxMX1dLDY6W2Z1bmN0aW9uKGUsdCl7dmFyIGk9ZShcIi4vdGltZUZvcm1hdFwiKTt0LmV4cG9ydHM9e2luaXQ6ZnVuY3Rpb24oKXt0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJ0aW1ldXBkYXRlXCIsdGhpcy5vblZpZGVvVGltZVVwZGF0ZS5iaW5kKHRoaXMpKSx0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJwbGF5XCIsdGhpcy5vblZpZGVvUGxheS5iaW5kKHRoaXMpKSx0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJwYXVzZVwiLHRoaXMub25WaWRlb1RpbWVQYXVzZS5iaW5kKHRoaXMpKSx0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkZWRtZXRhZGF0YVwiLHRoaXMub25WaWRlb0xvYWRlZE1ldGFEYXRhLmJpbmQodGhpcykpLHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcIndlYmtpdHBsYXliYWNrdGFyZ2V0YXZhaWxhYmlsaXR5Y2hhbmdlZFwiLHRoaXMub25QbGF5YmFja1RhcmdldEF2YWlsYWJpbGl0eUNoYW5nZWQuYmluZCh0aGlzKSksc2V0SW50ZXJ2YWwodGhpcy52aWRlb0J1ZmZlcmVkLmJpbmQodGhpcyksMWUzKSx0aGlzLkRPTXMudm9sdW1lX2FuY2hvci5zdHlsZS53aWR0aD0xMDAqdGhpcy52aWRlby52b2x1bWUrXCIlXCJ9LG9uVmlkZW9UaW1lVXBkYXRlOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy52aWRlby5jdXJyZW50VGltZSx0PXRoaXMudmlkZW8uZHVyYXRpb247dGhpcy5ET01zLmN1cnJlbnQuaW5uZXJIVE1MPWkoZSksdGhpcy5ET01zLmR1cmF0aW9uLmlubmVySFRNTD1pKHQpLHRoaXMuRE9Ncy5wcm9ncmVzc19hbmNob3IuZHJhZ2luZ3x8KHRoaXMuRE9Ncy5wcm9ncmVzc19hbmNob3Iuc3R5bGUud2lkdGg9MTAwKk1hdGgubWluKE1hdGgubWF4KGUvdCwwKSwxKStcIiVcIil9LHZpZGVvQnVmZmVyZWQ6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLnZpZGVvLmJ1ZmZlcmVkLHQ9dGhpcy52aWRlby5jdXJyZW50VGltZSxpPTA9PWUubGVuZ3RoPzA6ZS5lbmQoZS5sZW5ndGgtMSk7dGhpcy5ET01zLmJ1ZmZlcmVkX2FuY2hvci5zdHlsZS53aWR0aD0xMDAqTWF0aC5taW4oTWF0aC5tYXgoaS90aGlzLnZpZGVvLmR1cmF0aW9uLDApLDEpK1wiJVwiLDA9PWl8fHQ+PWk/dGhpcy5ET01zLnBsYXllci5jbGFzc0xpc3QuYWRkKFwibG9hZGluZ1wiKTp0aGlzLkRPTXMucGxheWVyLmNsYXNzTGlzdC5yZW1vdmUoXCJsb2FkaW5nXCIpfSxvblZpZGVvUGxheTpmdW5jdGlvbigpe3RoaXMuRE9Ncy5wbGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJwYXVzZWRcIil9LG9uVmlkZW9UaW1lUGF1c2U6ZnVuY3Rpb24oKXt0aGlzLkRPTXMucGxheS5jbGFzc0xpc3QuYWRkKFwicGF1c2VkXCIpfSxvblZpZGVvTG9hZGVkTWV0YURhdGE6ZnVuY3Rpb24oKXt0aGlzLnZpZGVvLnByZWxvYWRTdGFydFRpbWUmJih0aGlzLnZpZGVvLmN1cnJlbnRUaW1lPXRoaXMudmlkZW8ucHJlbG9hZFN0YXJ0VGltZSxkZWxldGUgdGhpcy52aWRlby5wcmVsb2FkU3RhcnRUaW1lKX0sb25QbGF5YmFja1RhcmdldEF2YWlsYWJpbGl0eUNoYW5nZWQ6ZnVuY3Rpb24oZSl7dmFyIHQ9XCJzdXBwb3J0LWFpcnBsYXlcIjtcImF2YWlsYWJsZVwiPT09ZS5hdmFpbGFiaWxpdHk/dGhpcy5ET01zLnBsYXllci5jbGFzc0xpc3QuYWRkKHQpOnRoaXMuRE9Ncy5wbGF5ZXIuY2xhc3NMaXN0LnJlbW92ZSh0KX19fSx7XCIuL3RpbWVGb3JtYXRcIjoxNH1dLDc6W2Z1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gaShlLHQpe3ZhciBpPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZSk7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgdCl0LmNhbGwoaSk7ZWxzZSBmb3IodmFyIG4gaW4gdClpZih0Lmhhc093blByb3BlcnR5KG4pKXN3aXRjaChuKXtjYXNlXCJhcHBlbmRUb1wiOnRbbl0uYXBwZW5kQ2hpbGQoaSk7YnJlYWs7Y2FzZVwidGV4dFwiOnZhciBvPWRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRbbl0pO2kuaW5uZXJIVE1MPVwiXCIsaS5hcHBlbmRDaGlsZChvKTticmVhaztjYXNlXCJpbm5lckhUTUxcIjpjYXNlXCJjbGFzc05hbWVcIjpjYXNlXCJpZFwiOmlbbl09dFtuXTticmVhaztjYXNlXCJzdHlsZVwiOnZhciBzPXRbbl07Zm9yKHZhciByIGluIHMpcy5oYXNPd25Qcm9wZXJ0eShyKSYmKGkuc3R5bGVbcl09c1tyXSk7YnJlYWs7ZGVmYXVsdDppLnNldEF0dHJpYnV0ZShuLHRbbl0rXCJcIil9cmV0dXJuIGl9dC5leHBvcnRzPWl9LHt9XSw4OltmdW5jdGlvbihlLHQpe2Z1bmN0aW9uIGkoZSl7cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGUpfWZ1bmN0aW9uIG4oZSl7dGhpcy5fZXZlbnRNYXA9e30sdGhpcy5fcm9vdEVsZW1lbnQ9ZSx0aGlzLl9pc1Jvb3RFbGVtZW50QmluZGVkQ2xpY2s9ITEsdGhpcy5fYmluZENsaWNrRnVuY3Rpb249ZnVuY3Rpb24oZSl7IWZ1bmN0aW9uIHQoZSxuKXtuJiZuLm5vZGVOYW1lJiYobi5jbGFzc0xpc3QmJmkobi5jbGFzc0xpc3QpLmZvckVhY2goZnVuY3Rpb24odCl7ZS50cmlnZ2VyKHQsbil9KSx0KGUsbi5wYXJlbnROb2RlKSl9KHRoaXMsZS50YXJnZXQpfS5iaW5kKHRoaXMpfXZhciBvPWUoXCIuL2V4dGVuZFwiKTtvKG4ucHJvdG90eXBlLHtvbjpmdW5jdGlvbihlLHQsaSl7dm9pZCAwPT09dGhpcy5fZXZlbnRNYXBbZV0mJih0aGlzLl9ldmVudE1hcFtlXT1bXSksdGhpcy5fZXZlbnRNYXBbZV0ucHVzaChbdCxpXSksdGhpcy5faXNSb290RWxlbWVudEJpbmRlZENsaWNrfHwoX2lzUm9vdEVsZW1lbnRCaW5kZWRDbGljaz0hMCx0aGlzLl9yb290RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIix0aGlzLl9iaW5kQ2xpY2tGdW5jdGlvbiwhMSkpfSxvZmY6ZnVuY3Rpb24oZSx0KXtpZih2b2lkIDAhPXRoaXMuX2V2ZW50TWFwW2VdKWZvcih2YXIgaT10aGlzLl9ldmVudE1hcFtlXS5sZW5ndGg7aS0tOylpZih0aGlzLl9ldmVudE1hcFtlXVtpXVswXT09PXQpe3RoaXMuX2V2ZW50TWFwW2VdLnNwbGljZShpLDEpO2JyZWFrfWZvcih2YXIgbiBpbiB0aGlzLl9ldmVudE1hcClicmVhazt2b2lkIDA9PT1uJiZ0aGlzLl9pc1Jvb3RFbGVtZW50QmluZGVkQ2xpY2smJihfaXNSb290RWxlbWVudEJpbmRlZENsaWNrPSExLHRoaXMuX3Jvb3RFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLHRoaXMuX2JpbmRDbGlja0Z1bmN0aW9uLCExKSl9LHRyaWdnZXI6ZnVuY3Rpb24oZSx0KXt0PXZvaWQgMD09PXQ/dGhpcy5fcm9vdEVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWVzKGUpOlt0XSx0LmZvckVhY2goZnVuY3Rpb24odCl7KHRoaXMuX2V2ZW50TWFwW2VdfHxbXSkuZm9yRWFjaChmdW5jdGlvbihlKXtlWzBdLmNhbGwoZVsxXSx0KX0pfS5iaW5kKHRoaXMpKX19KSx0LmV4cG9ydHM9ZnVuY3Rpb24oZSl7cmV0dXJuIG5ldyBuKGUpfX0se1wiLi9leHRlbmRcIjo5fV0sOTpbZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBpKGUpe2Zvcih2YXIgdCxpPWFyZ3VtZW50cy5sZW5ndGgsbj0xO2k+bjspe3Q9YXJndW1lbnRzW24rK107Zm9yKHZhciBvIGluIHQpdC5oYXNPd25Qcm9wZXJ0eShvKSYmKGVbb109dFtvXSl9cmV0dXJuIGV9dC5leHBvcnRzPWl9LHt9XSwxMDpbZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdChlLHQsaSxuKXt0aGlzLmlkPWUsdGhpcy5zaXplPXQuc3BsaXQoXCJ4XCIpLHRoaXMuc291cmNlTGlzdD1pfHxbXSx0aGlzLmNvbW1lbnRzPW4sdGhpcy5pbml0KCl9ZShcIi4vY29tcG9uZW50XCIpKHQsZShcIi4vY29tcG9uZW50X2J1aWxkXCIpLGUoXCIuL2NvbXBvbmVudF9ldmVudFwiKSxlKFwiLi9jb21wb25lbnRfdmlkZW9cIiksZShcIi4vY29tcG9uZW50X3NvdXJjZVwiKSxlKFwiLi9jb21wb25lbnRfY29tbWVudHNcIikpLE1BTUFQbGF5ZXI9dH0se1wiLi9jb21wb25lbnRcIjoxLFwiLi9jb21wb25lbnRfYnVpbGRcIjoyLFwiLi9jb21wb25lbnRfY29tbWVudHNcIjozLFwiLi9jb21wb25lbnRfZXZlbnRcIjo0LFwiLi9jb21wb25lbnRfc291cmNlXCI6NSxcIi4vY29tcG9uZW50X3ZpZGVvXCI6Nn1dLDExOltmdW5jdGlvbihlLHQpe2Z1bmN0aW9uIGkoZSx0KXt2YXIgaT17fTtyZXR1cm4gdC5mb3JFYWNoKGZ1bmN0aW9uKHQpe2lbdF09ZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHQpWzBdfSksaX10LmV4cG9ydHM9aX0se31dLDEyOltmdW5jdGlvbihlLHQpe3QuZXhwb3J0cz0nKiB7IG1hcmdpbjowOyBwYWRkaW5nOjA7IH1ib2R5IHsgZm9udC1mYW1pbHk6IFwiUGluZ0hlaVwiLFwiTHVjaWRhIEdyYW5kZVwiLCBcIkx1Y2lkYSBTYW5zIFVuaWNvZGVcIiwgXCJTVEhlaXRpXCIsIFwiSGVsdmV0aWNhXCIsXCJBcmlhbFwiLFwiVmVyZGFuYVwiLFwic2Fucy1zZXJpZlwiOyBmb250LXNpemU6MTZweDt9aHRtbCwgYm9keSwgLnBsYXllciB7IGhlaWdodDogMTAwJTsgfS5wbGF5ZXI6LXdlYmtpdC1mdWxsLXNjcmVlbiB7IHdpZHRoOiAxMDAlOyBjdXJzb3I6dXJsKGRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQUVBQUFBQkNBWUFBQUFmRmNTSkFBQUFEVWxFUVZRSW1XTmdZR0JnQUFBQUJRQUJoNkZPMUFBQUFBQkpSVTVFcmtKZ2dnPT0pOyB9LnBsYXllcjotbW96LWZ1bGwtc2NyZWVuIHsgd2lkdGg6IDEwMCU7IGN1cnNvcjp1cmwoZGF0YTppbWFnZS9naWY7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBRUFBQUFCQ0FZQUFBQWZGY1NKQUFBQURVbEVRVlFJbVdOZ1lHQmdBQUFBQlFBQmg2Rk8xQUFBQUFCSlJVNUVya0pnZ2c9PSk7IH0ucGxheWVyOmZ1bGwtc2NyZWVuIHsgd2lkdGg6IDEwMCU7IGN1cnNvcjp1cmwoZGF0YTppbWFnZS9naWY7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBRUFBQUFCQ0FZQUFBQWZGY1NKQUFBQURVbEVRVlFJbVdOZ1lHQmdBQUFBQlFBQmg2Rk8xQUFBQUFCSlJVNUVya0pnZ2c9PSk7IH0ucGxheWVyIHsgYm9yZGVyLXJhZGl1czogM3B4OyBvdmVyZmxvdzogaGlkZGVuOyBwb3NpdGlvbjogcmVsYXRpdmU7IGN1cnNvcjogZGVmYXVsdDsgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7ICAtbW96LXVzZXItc2VsZWN0OiBub25lOyB1c2VyLXNlbGVjdDogbm9uZTt9LnZpZGVvLWZyYW1lIHsgYm94LXNpemluZzogYm9yZGVyLWJveDsgcGFkZGluZy1ib3R0b206IDUwcHg7IGhlaWdodDogMTAwJTsgb3ZlcmZsb3c6IGhpZGRlbjsgcG9zaXRpb246IHJlbGF0aXZlO30udmlkZW8tZnJhbWUgLmNvbW1lbnRzeyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDowO2xlZnQ6MDsgd2lkdGg6MTAwJTsgaGVpZ2h0OjEwMCU7ICAtd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGVaKDApOyAgLW1vei10cmFuc2Zvcm06dHJhbnNsYXRlWigwKTsgdHJhbnNmb3JtOnRyYW5zbGF0ZVooMCk7ICBwb2ludGVyLWV2ZW50czogbm9uZTt9LnBsYXllcjotd2Via2l0LWZ1bGwtc2NyZWVuIC52aWRlby1mcmFtZSB7IHBhZGRpbmctYm90dG9tOiAwcHg7IH0ucGxheWVyOi1tb3otZnVsbC1zY3JlZW4gLnZpZGVvLWZyYW1lIHsgcGFkZGluZy1ib3R0b206IDBweDsgfS5wbGF5ZXI6ZnVsbC1zY3JlZW4gLnZpZGVvLWZyYW1leyBwYWRkaW5nLWJvdHRvbTogMHB4OyB9LnZpZGVvIHsgd2lkdGg6IDEwMCU7ICBoZWlnaHQ6IDEwMCU7IGJhY2tncm91bmQ6ICMwMDAwMDA7fS5jb250cm9sbGVyIHsgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgYm90dG9tOiAwcHg7ICBsZWZ0OjA7IHJpZ2h0OjA7ICBiYWNrZ3JvdW5kOiAjMjQyNzJBOyAgaGVpZ2h0OiA1MHB4O30uY29udHJvbGxlciAubG9hZGluZy1pY29uIHsgZGlzcGxheTogbm9uZTsgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgd2lkdGg6IDIwcHg7ICBoZWlnaHQ6IDIwcHg7IGxpbmUtaGVpZ2h0OiAyMHB4OyAgdGV4dC1hbGlnbjogY2VudGVyOyBmb250LXNpemU6IDIwcHg7ICBjb2xvcjogI2ZmZmZmZjsgdG9wOiAtMzBweDsgcmlnaHQ6IDEwcHg7fS5wbGF5ZXIubG9hZGluZyAuY29udHJvbGxlciAubG9hZGluZy1pY29uIHsgIGRpc3BsYXk6IGJsb2NrO30ucGxheWVyOi13ZWJraXQtZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgeyAtd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGVZKDUwcHgpOyAtd2Via2l0LXRyYW5zaXRpb246IC13ZWJraXQtdHJhbnNmb3JtIDAuM3MgZWFzZTt9LnBsYXllcjotbW96LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIHsgLW1vei10cmFuc2Zvcm06dHJhbnNsYXRlWSg1MHB4KTsgIC1tb3otdHJhbnNpdGlvbjogLW1vei10cmFuc2Zvcm0gMC4zcyBlYXNlO30ucGxheWVyOmZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIHsgIHRyYW5zZm9ybTp0cmFuc2xhdGVZKDUwcHgpOyB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlO30ucGxheWVyLmFjdGl2ZTotd2Via2l0LWZ1bGwtc2NyZWVuIHsgY3Vyc29yOiBkZWZhdWx0O30ucGxheWVyLmFjdGl2ZTotbW96LWZ1bGwtc2NyZWVuIHsgIGN1cnNvcjogZGVmYXVsdDt9LnBsYXllci5hY3RpdmU6ZnVsbC1zY3JlZW4geyBjdXJzb3I6IGRlZmF1bHQ7fS5wbGF5ZXIuYWN0aXZlOi13ZWJraXQtZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIsLnBsYXllcjotd2Via2l0LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyOmhvdmVyIHsgLXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlWSgwKTsgIGN1cnNvcjogZGVmYXVsdDt9LnBsYXllci5hY3RpdmU6LW1vei1mdWxsLXNjcmVlbiAuY29udHJvbGxlciwucGxheWVyOi1tb3otZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXI6aG92ZXIgeyAtbW96LXRyYW5zZm9ybTp0cmFuc2xhdGVZKDApOyBjdXJzb3I6IGRlZmF1bHQ7fS5wbGF5ZXIuYWN0aXZlOmZ1bGwtc2NyZWVuIC5jb250cm9sbGVyLnBsYXllcjpmdWxsLXNjcmVlbiAuY29udHJvbGxlcjpob3ZlciB7ICB0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKTsgIGN1cnNvcjogZGVmYXVsdDt9LnBsYXllci5hY3RpdmU6LXdlYmtpdC1mdWxsLXNjcmVlbiAuY29udHJvbGxlciAucHJvZ3Jlc3MgLnByb2dyZXNzX2FuY2hvcjphZnRlciwucGxheWVyOi13ZWJraXQtZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXI6aG92ZXIgLnByb2dyZXNzIC5wcm9ncmVzc19hbmNob3I6YWZ0ZXIgeyBoZWlnaHQ6MTJweDt9LnBsYXllci5hY3RpdmU6LW1vei1mdWxsLXNjcmVlbiAuY29udHJvbGxlciAucHJvZ3Jlc3MgLnByb2dyZXNzX2FuY2hvcjphZnRlciwucGxheWVyOi1tb3otZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXI6aG92ZXIgLnByb2dyZXNzIC5wcm9ncmVzc19hbmNob3I6YWZ0ZXIgeyBoZWlnaHQ6MTJweDt9LnBsYXllci5hY3RpdmU6ZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgLnByb2dyZXNzIC5wcm9ncmVzc19hbmNob3I6YWZ0ZXIsLnBsYXllcjpmdWxsLXNjcmVlbiAuY29udHJvbGxlcjpob3ZlciAucHJvZ3Jlc3MgLnByb2dyZXNzX2FuY2hvcjphZnRlciB7IGhlaWdodDoxMnB4O30ucGxheWVyOi13ZWJraXQtZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgLnByb2dyZXNzIC5wcm9ncmVzc19hbmNob3I6YWZ0ZXIgeyBoZWlnaHQ6NHB4O30ucGxheWVyOi1tb3otZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgLnByb2dyZXNzIC5wcm9ncmVzc19hbmNob3I6YWZ0ZXIgeyBoZWlnaHQ6NHB4O30ucGxheWVyOmZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIC5wcm9ncmVzcyAucHJvZ3Jlc3NfYW5jaG9yOmFmdGVyIHsgIGhlaWdodDo0cHg7fS5jb250cm9sbGVyIC5wcm9ncmVzcyB7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOjBweDsgIGxlZnQ6MDsgcmlnaHQ6MDsgIGJvcmRlci1yaWdodDogNHB4IHNvbGlkICMxODFBMUQ7ICBib3JkZXItbGVmdDogOHB4IHNvbGlkICNERjY1NTg7IGhlaWdodDogNHB4OyAgYmFja2dyb3VuZDogIzE4MUExRDsgIHotaW5kZXg6MTsgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVaKDApOyAtbW96LXRyYW5zZm9ybTogdHJhbnNsYXRlWigwKTsgIHRyYW5zZm9ybTogdHJhbnNsYXRlWigwKTt9LmNvbnRyb2xsZXIgLnByb2dyZXNzOmFmdGVyIHsgY29udGVudDpcIlwiOyBkaXNwbGF5OiBibG9jazsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6MHB4OyAgbGVmdDowOyByaWdodDowOyAgYm90dG9tOi0xMHB4OyBoZWlnaHQ6IDEwcHg7fS5jb250cm9sbGVyIC5wcm9ncmVzcyAuYW5jaG9yIHsgaGVpZ2h0OiA0cHg7ICBiYWNrZ3JvdW5kOiAjREY2NTU4OyAgcG9zaXRpb246IGFic29sdXRlOyB0b3A6MDtsZWZ0OjA7fS5jb250cm9sbGVyIC5wcm9ncmVzcyAuYW5jaG9yOmFmdGVyIHsgY29udGVudDpcIlwiOyBkaXNwbGF5OiBibG9jazsgd2lkdGg6IDEycHg7ICBiYWNrZ3JvdW5kOiAjREY2NTU4OyAgcG9zaXRpb246IGFic29sdXRlOyByaWdodDotNHB4OyB0b3A6IDUwJTsgaGVpZ2h0OiAxMnB4OyBib3gtc2hhZG93OiAwIDAgMnB4IHJnYmEoMCwwLDAsIDAuNCk7IGJvcmRlci1yYWRpdXM6IDEycHg7ICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTsgIC1tb3otdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7fS5jb250cm9sbGVyIC5wcm9ncmVzcyAuYW5jaG9yLmJ1ZmZlcmVkX2FuY2hvciB7ICBwb3NpdGlvbjogcmVsYXRpdmU7IGJhY2tncm91bmQ6IHJnYmEoMjU1LDI1NSwyNTUsMC4xKTt9LmNvbnRyb2xsZXIgLnByb2dyZXNzIC5hbmNob3IuYnVmZmVyZWRfYW5jaG9yOmFmdGVyIHsgIGJveC1zaGFkb3c6IG5vbmU7IGhlaWdodDogNHB4OyAgd2lkdGg6IDRweDsgYm9yZGVyLXJhZGl1czogMDsgYmFja2dyb3VuZDogcmdiYSgyNTUsMjU1LDI1NSwwLjEpO30uY29udHJvbGxlciAucmlnaHQgeyBoZWlnaHQ6IDUwcHg7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOjA7ICBsZWZ0OjEwcHg7ICByaWdodDoxMHB4OyBwb2ludGVyLWV2ZW50czogbm9uZTt9LmNvbnRyb2xsZXIgLnBsYXksLmNvbnRyb2xsZXIgLnZvbHVtZSwuY29udHJvbGxlciAudGltZSwuY29udHJvbGxlciAuaGQsLmNvbnRyb2xsZXIgLmFpcnBsYXksLmNvbnRyb2xsZXIgLmFsbHNjcmVlbiwuY29udHJvbGxlciAubm9ybWFsc2NyZWVuLC5jb250cm9sbGVyIC5jb21tZW50cy1idG4sLmNvbnRyb2xsZXIgLmZ1bGxzY3JlZW4geyBwYWRkaW5nLXRvcDo0cHg7ICBoZWlnaHQ6IDQ2cHg7IGxpbmUtaGVpZ2h0OiA1MHB4OyAgdGV4dC1hbGlnbjogY2VudGVyOyBjb2xvcjogI2VlZWVlZTsgZmxvYXQ6bGVmdDsgdGV4dC1zaGFkb3c6MCAwIDJweCByZ2JhKDAsMCwwLDAuNSk7ICBwb2ludGVyLWV2ZW50czogYXV0bzt9LmNvbnRyb2xsZXIgLmhkLC5jb250cm9sbGVyIC5haXJwbGF5LC5jb250cm9sbGVyIC5hbGxzY3JlZW4sLmNvbnRyb2xsZXIgLm5vcm1hbHNjcmVlbiwuY29udHJvbGxlciAuY29tbWVudHMtYnRuLC5jb250cm9sbGVyIC5mdWxsc2NyZWVuIHsgZmxvYXQ6cmlnaHQ7fS5jb250cm9sbGVyIC5wbGF5IHsgIHdpZHRoOiAzNnB4OyAgcGFkZGluZy1sZWZ0OiAxMHB4OyBjdXJzb3I6IHBvaW50ZXI7fS5jb250cm9sbGVyIC5wbGF5OmFmdGVyIHsgIGZvbnQtZmFtaWx5OiBcIkZvbnRBd2Vzb21lXCI7IGNvbnRlbnQ6IFwiXFxcXGYwNGNcIjt9LmNvbnRyb2xsZXIgLnBsYXkucGF1c2VkOmFmdGVyIHsgY29udGVudDogXCJcXFxcZjA0YlwiO30uY29udHJvbGxlciAudm9sdW1lIHsgIG1pbi13aWR0aDogMzBweDsgIHBvc2l0aW9uOiByZWxhdGl2ZTsgb3ZlcmZsb3c6IGhpZGRlbjsgLXdlYmtpdC10cmFuc2l0aW9uOiBtaW4td2lkdGggMC4zcyBlYXNlIDAuNXM7IC1tb3otdHJhbnNpdGlvbjogbWluLXdpZHRoIDAuM3MgZWFzZSAwLjVzOyAgdHJhbnNpdGlvbjogbWluLXdpZHRoIDAuM3MgZWFzZSAwLjVzO30uY29udHJvbGxlciAudm9sdW1lOmhvdmVyIHsgbWluLXdpZHRoOiAxMjhweDt9LmNvbnRyb2xsZXIgLnZvbHVtZTpiZWZvcmUgeyAgZm9udC1mYW1pbHk6IFwiRm9udEF3ZXNvbWVcIjsgY29udGVudDogXCJcXFxcZjAyOFwiOyAgd2lkdGg6IDM2cHg7ICBkaXNwbGF5OiBibG9jazt9LmNvbnRyb2xsZXIgLnZvbHVtZSAucHJvZ3Jlc3MgeyB3aWR0aDogNzBweDsgIHRvcDogMjdweDsgIGxlZnQ6IDQwcHg7fS5jb250cm9sbGVyIC50aW1lIHsgZm9udC1zaXplOiAxMnB4OyAgZm9udC13ZWlnaHQ6IGJvbGQ7ICBwYWRkaW5nLWxlZnQ6IDEwcHg7fS5jb250cm9sbGVyIC50aW1lIC5jdXJyZW50IHsgIGNvbG9yOiAjREY2NTU4O30uY29udHJvbGxlciAuZnVsbHNjcmVlbiwuY29udHJvbGxlciAuYWlycGxheSwuY29udHJvbGxlciAuYWxsc2NyZWVuLC5jb250cm9sbGVyIC5jb21tZW50cy1idG4sLmNvbnRyb2xsZXIgLm5vcm1hbHNjcmVlbiB7IHdpZHRoOiAzNnB4OyAgY3Vyc29yOiBwb2ludGVyO30uY29udHJvbGxlciAuY29tbWVudHMtYnRuIHsgIG1hcmdpbi1yaWdodDogLTE1cHg7ICBkaXNwbGF5OiBub25lO30ucGxheWVyLmhhcy1jb21tZW50cyAuY29udHJvbGxlciAuY29tbWVudHMtYnRuIHsgZGlzcGxheTogYmxvY2s7fS5jb250cm9sbGVyIC5jb21tZW50cy1idG46YmVmb3JlIHsgIGZvbnQtZmFtaWx5OiBcIkZvbnRBd2Vzb21lXCI7IGNvbnRlbnQ6IFwiXFxcXGYwNzVcIjt9LmNvbnRyb2xsZXIgLmNvbW1lbnRzLWJ0bi5lbmFibGU6YmVmb3JlIHsgIGNvbG9yOiAjREY2NTU4O30uY29udHJvbGxlciAuYWlycGxheSwuY29udHJvbGxlciAubm9ybWFsc2NyZWVuIHsgIGRpc3BsYXk6IG5vbmU7fS5wbGF5ZXI6LXdlYmtpdC1mdWxsLXNjcmVlbiAuY29udHJvbGxlciAuZnVsbHNjcmVlbiwucGxheWVyOi13ZWJraXQtZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgLmFsbHNjcmVlbiB7IGRpc3BsYXk6IG5vbmU7fS5wbGF5ZXI6LXdlYmtpdC1mdWxsLXNjcmVlbiAuY29udHJvbGxlciAubm9ybWFsc2NyZWVuLC5wbGF5ZXIuYWxsc2NyZWVuIC5jb250cm9sbGVyIC5ub3JtYWxzY3JlZW4sLnBsYXllci5zdXBwb3J0LWFpcnBsYXkgLmNvbnRyb2xsZXIgLmFpcnBsYXkgeyBkaXNwbGF5OiBibG9jazt9LnBsYXllci5hbGxzY3JlZW4gLmNvbnRyb2xsZXIgLmFsbHNjcmVlbiB7ICBkaXNwbGF5OiBub25lO30uY29udHJvbGxlciAuZnVsbHNjcmVlbjpiZWZvcmUgeyBmb250LWZhbWlseTogXCJGb250QXdlc29tZVwiOyBjb250ZW50OiBcIlxcXFxmMGIyXCI7fS5jb250cm9sbGVyIC5hbGxzY3JlZW46YmVmb3JlIHsgIGZvbnQtZmFtaWx5OiBcIkZvbnRBd2Vzb21lXCI7IGNvbnRlbnQ6IFwiXFxcXGYwNjVcIjt9LmNvbnRyb2xsZXIgLm5vcm1hbHNjcmVlbjpiZWZvcmUgeyBmb250LWZhbWlseTogXCJGb250QXdlc29tZVwiOyBjb250ZW50OiBcIlxcXFxmMDY2XCI7fS5jb250cm9sbGVyIC5haXJwbGF5IHsgYmFja2dyb3VuZDogdXJsKGRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEQ5NGJXd2dkbVZ5YzJsdmJqMGlNUzR3SWlCbGJtTnZaR2x1WnowaWRYUm1MVGdpUHo0OElVUlBRMVJaVUVVZ2MzWm5JRkJWUWt4SlF5QWlMUzh2VnpOREx5OUVWRVFnVTFaSElERXVNUzh2UlU0aUlDSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OUhjbUZ3YUdsamN5OVRWa2N2TVM0eEwwUlVSQzl6ZG1jeE1TNWtkR1FpUGp4emRtY2dkbVZ5YzJsdmJqMGlNUzR4SWlCcFpEMGliV0Z0WVMxaGFYSndiR0Y1TFdsamIyNGlJSGh0Ykc1elBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMlp5SWdlRzFzYm5NNmVHeHBibXM5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZlR3hwYm1zaUlIZzlJakJ3ZUNJZ2VUMGlNSEI0SWlCM2FXUjBhRDBpTWpKd2VDSWdhR1ZwWjJoMFBTSXhObkI0SWlCMmFXVjNRbTk0UFNJd0lEQWdNaklnTVRZaUlIaHRiRHB6Y0dGalpUMGljSEpsYzJWeWRtVWlQanh3YjJ4NWJHbHVaU0J3YjJsdWRITTlJalVzTVRJZ01Td3hNaUF4TERFZ01qRXNNU0F5TVN3eE1pQXhOeXd4TWlJZ2MzUjViR1U5SW1acGJHdzZkSEpoYm5Od1lYSmxiblE3YzNSeWIydGxPbmRvYVhSbE8zTjBjbTlyWlMxM2FXUjBhRG94SWk4K1BIQnZiSGxzYVc1bElIQnZhVzUwY3owaU5Dd3hOaUF4TVN3eE1DQXhPQ3d4TmlJZ2MzUjViR1U5SW1acGJHdzZkMmhwZEdVN2MzUnliMnRsT25SeVlXNXpjR0Z5Wlc1ME8zTjBjbTlyWlMxM2FXUjBhRG93SWk4K1BDOXpkbWMrRFFvPSkgbm8tcmVwZWF0IGNlbnRlciAyMHB4OyAgYmFja2dyb3VuZC1zaXplOiAyMnB4IGF1dG87fS5jb250cm9sbGVyIC5oZCB7IHdoaXRlLXNwYWNlOm5vd3JhcDsgb3ZlcmZsb3c6IGhpZGRlbjsgbWFyZ2luLXJpZ2h0OiAxMHB4OyB0ZXh0LWFsaWduOiByaWdodDt9LmNvbnRyb2xsZXIgLmhkOmhvdmVyIGxpIHsgbWF4LXdpZHRoOiAzMDBweDt9LmNvbnRyb2xsZXIgLmhkIGxpIHsgIGRpc3BsYXk6IGlubGluZS1ibG9jazsgIG1heC13aWR0aDogMHB4OyAtd2Via2l0LXRyYW5zaXRpb246IG1heC13aWR0aCAwLjhzIGVhc2UgMC4zczsgLW1vei10cmFuc2l0aW9uOiBtYXgtd2lkdGggMC44cyBlYXNlIDAuM3M7ICB0cmFuc2l0aW9uOiBtYXgtd2lkdGggMC44cyBlYXNlIDAuM3M7IG92ZXJmbG93OiBoaWRkZW47IGZvbnQtc2l6ZTogMTRweDsgIGZvbnQtd2VpZ2h0OiBib2xkOyAgcG9zaXRpb246IHJlbGF0aXZlOyBjdXJzb3I6IHBvaW50ZXI7fS5jb250cm9sbGVyIC5oZCBsaTpiZWZvcmUgeyAgY29udGVudDogXCJcIjsgIGRpc3BsYXk6IGlubGluZS1ibG9jazsgIHdpZHRoOjIwcHg7fS5jb250cm9sbGVyIC5oZCBsaTpiZWZvcmUgeyBjb250ZW50OiBcIlwiOyAgZGlzcGxheTogaW5saW5lLWJsb2NrOyAgd2lkdGg6MjBweDt9LmNvbnRyb2xsZXIgLmhkIGxpLmN1cnIgeyBtYXgtd2lkdGg6IDMwMHB4OyBjdXJzb3I6IGRlZmF1bHQ7ICBjb2xvcjogI0RGNjU1ODt9LmNvbnRyb2xsZXIgLmhkIGxpLmN1cnI6YWZ0ZXIgeyBjb250ZW50OiBcIlwiOyAgZGlzcGxheTogYmxvY2s7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgd2lkdGg6NHB4OyAgaGVpZ2h0OjRweDsgYm9yZGVyLXJhZGl1czogNTAlOyBiYWNrZ3JvdW5kOiAjZmZmZmZmOyAgbGVmdDogMTJweDsgdG9wOiAyM3B4OyAgb3BhY2l0eTogMDsgLXdlYmtpdC10cmFuc2l0aW9uOiBvcGFjaXR5IDAuNXMgZWFzZSAwLjNzOyAtbW96LXRyYW5zaXRpb246IG9wYWNpdHkgMC41cyBlYXNlIDAuM3M7ICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuNXMgZWFzZSAwLjNzO30nfSx7fV0sMTM6W2Z1bmN0aW9uKGUsdCl7dC5leHBvcnRzPSc8ZGl2IGNsYXNzPVwicGxheWVyXCI+ICA8ZGl2IGNsYXNzPVwidmlkZW8tZnJhbWVcIj48dmlkZW8gY2xhc3M9XCJ2aWRlb1wiIGF1dG9wbGF5PVwiYXV0b3BsYXlcIj48L3ZpZGVvPjxjYW52YXMgY2xhc3M9XCJjb21tZW50c1wiPjwvY2FudmFzPjwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbnRyb2xsZXJcIj4gICAgPGRpdiBjbGFzcz1cImxvYWRpbmctaWNvbiBmYSBmYS1zcGluIGZhLWNpcmNsZS1vLW5vdGNoXCI+PC9kaXY+ICAgPGRpdiBjbGFzcz1cInByb2dyZXNzXCI+ICAgICAgPGRpdiBjbGFzcz1cImFuY2hvciBidWZmZXJlZF9hbmNob3JcIiBzdHlsZT1cIndpZHRoOjAlXCI+PC9kaXY+ICAgICA8ZGl2IGNsYXNzPVwiYW5jaG9yIHByb2dyZXNzX2FuY2hvclwiIHN0eWxlPVwid2lkdGg6MCVcIj48L2Rpdj4gICA8L2Rpdj4gICAgPGRpdiBjbGFzcz1cInJpZ2h0XCI+ICAgICA8ZGl2IGNsYXNzPVwiZnVsbHNjcmVlblwiPjwvZGl2PiAgICAgIDxkaXYgY2xhc3M9XCJhbGxzY3JlZW5cIj48L2Rpdj4gICAgIDxkaXYgY2xhc3M9XCJub3JtYWxzY3JlZW5cIj48L2Rpdj4gICAgICA8ZGl2IGNsYXNzPVwiYWlycGxheVwiPjwvZGl2PiAgICAgPHVsIGNsYXNzPVwiaGRcIj48L3VsPiAgICAgIDxkaXYgY2xhc3M9XCJjb21tZW50cy1idG5cIj48L2Rpdj4gICAgIDwvZGl2PiAgICA8ZGl2IGNsYXNzPVwibGVmdFwiPiAgICAgPGRpdiBjbGFzcz1cInBsYXkgcGF1c2VkXCI+PC9kaXY+ICAgICA8ZGl2IGNsYXNzPVwidm9sdW1lXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3NcIj4gICAgICAgICAgPGRpdiBjbGFzcz1cImFuY2hvciB2b2x1bWVfYW5jaG9yXCIgc3R5bGU9XCJ3aWR0aDowJVwiPjwvZGl2PiAgICAgICA8L2Rpdj4gICAgICA8L2Rpdj4gICAgICA8ZGl2IGNsYXNzPVwidGltZVwiPiAgICAgICAgPHNwYW4gY2xhc3M9XCJjdXJyZW50XCI+MDA6MDA6MDA8L3NwYW4+IC8gPHNwYW4gY2xhc3M9XCJkdXJhdGlvblwiPjAwOjAwOjAwPC9zcGFuPiAgICAgIDwvZGl2PiAgICAgPC9kaXY+IDwvZGl2PjwvZGl2Pid9LHt9XSwxNDpbZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBpKGUsdCl7cmV0dXJuKEFycmF5KHQpLmpvaW4oMCkrZSkuc2xpY2UoLXQpfWZ1bmN0aW9uIG4oZSl7dmFyIHQsbj1bXTtyZXR1cm5bMzYwMCw2MCwxXS5mb3JFYWNoKGZ1bmN0aW9uKG8pe24ucHVzaChpKHQ9ZS9vfDAsMikpLGUtPXQqb30pLG4uam9pbihcIjpcIil9dC5leHBvcnRzPW59LHt9XX0se30sWzEwXSk7XG5cbi8vZXhwb3J0c1xubW9kdWxlLmV4cG9ydHMgPSBNQU1BUGxheWVyOyIsIi8qXG4gKiBQdXJsIChBIEphdmFTY3JpcHQgVVJMIHBhcnNlcikgdjIuMy4xXG4gKiBEZXZlbG9wZWQgYW5kIG1haW50YW5pbmVkIGJ5IE1hcmsgUGVya2lucywgbWFya0BhbGxtYXJrZWR1cC5jb21cbiAqIFNvdXJjZSByZXBvc2l0b3J5OiBodHRwczovL2dpdGh1Yi5jb20vYWxsbWFya2VkdXAvalF1ZXJ5LVVSTC1QYXJzZXJcbiAqIExpY2Vuc2VkIHVuZGVyIGFuIE1JVC1zdHlsZSBsaWNlbnNlLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FsbG1hcmtlZHVwL2pRdWVyeS1VUkwtUGFyc2VyL2Jsb2IvbWFzdGVyL0xJQ0VOU0UgZm9yIGRldGFpbHMuXG4gKi9cblxudmFyIHRhZzJhdHRyID0ge1xuICAgICAgICBhICAgICAgIDogJ2hyZWYnLFxuICAgICAgICBpbWcgICAgIDogJ3NyYycsXG4gICAgICAgIGZvcm0gICAgOiAnYWN0aW9uJyxcbiAgICAgICAgYmFzZSAgICA6ICdocmVmJyxcbiAgICAgICAgc2NyaXB0ICA6ICdzcmMnLFxuICAgICAgICBpZnJhbWUgIDogJ3NyYycsXG4gICAgICAgIGxpbmsgICAgOiAnaHJlZicsXG4gICAgICAgIGVtYmVkICAgOiAnc3JjJyxcbiAgICAgICAgb2JqZWN0ICA6ICdkYXRhJ1xuICAgIH0sXG5cbiAgICBrZXkgPSBbJ3NvdXJjZScsICdwcm90b2NvbCcsICdhdXRob3JpdHknLCAndXNlckluZm8nLCAndXNlcicsICdwYXNzd29yZCcsICdob3N0JywgJ3BvcnQnLCAncmVsYXRpdmUnLCAncGF0aCcsICdkaXJlY3RvcnknLCAnZmlsZScsICdxdWVyeScsICdmcmFnbWVudCddLCAvLyBrZXlzIGF2YWlsYWJsZSB0byBxdWVyeVxuXG4gICAgYWxpYXNlcyA9IHsgJ2FuY2hvcicgOiAnZnJhZ21lbnQnIH0sIC8vIGFsaWFzZXMgZm9yIGJhY2t3YXJkcyBjb21wYXRhYmlsaXR5XG5cbiAgICBwYXJzZXIgPSB7XG4gICAgICAgIHN0cmljdCA6IC9eKD86KFteOlxcLz8jXSspOik/KD86XFwvXFwvKCg/OigoW146QF0qKTo/KFteOkBdKikpP0ApPyhbXjpcXC8/I10qKSg/OjooXFxkKikpPykpPygoKCg/OltePyNcXC9dKlxcLykqKShbXj8jXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLywgIC8vbGVzcyBpbnR1aXRpdmUsIG1vcmUgYWNjdXJhdGUgdG8gdGhlIHNwZWNzXG4gICAgICAgIGxvb3NlIDogIC9eKD86KD8hW146QF0rOlteOkBcXC9dKkApKFteOlxcLz8jLl0rKTopPyg/OlxcL1xcLyk/KCg/OigoW146QF0qKTo/KFteOkBdKikpP0ApPyhbXjpcXC8/I10qKSg/OjooXFxkKikpPykoKChcXC8oPzpbXj8jXSg/IVtePyNcXC9dKlxcLltePyNcXC8uXSsoPzpbPyNdfCQpKSkqXFwvPyk/KFtePyNcXC9dKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvIC8vIG1vcmUgaW50dWl0aXZlLCBmYWlscyBvbiByZWxhdGl2ZSBwYXRocyBhbmQgZGV2aWF0ZXMgZnJvbSBzcGVjc1xuICAgIH0sXG5cbiAgICBpc2ludCA9IC9eWzAtOV0rJC87XG5cbmZ1bmN0aW9uIHBhcnNlVXJpKCB1cmwsIHN0cmljdE1vZGUgKSB7XG4gICAgdmFyIHN0ciA9IGRlY29kZVVSSSggdXJsICksXG4gICAgcmVzICAgPSBwYXJzZXJbIHN0cmljdE1vZGUgfHwgZmFsc2UgPyAnc3RyaWN0JyA6ICdsb29zZScgXS5leGVjKCBzdHIgKSxcbiAgICB1cmkgPSB7IGF0dHIgOiB7fSwgcGFyYW0gOiB7fSwgc2VnIDoge30gfSxcbiAgICBpICAgPSAxNDtcblxuICAgIHdoaWxlICggaS0tICkge1xuICAgICAgICB1cmkuYXR0clsga2V5W2ldIF0gPSByZXNbaV0gfHwgJyc7XG4gICAgfVxuXG4gICAgLy8gYnVpbGQgcXVlcnkgYW5kIGZyYWdtZW50IHBhcmFtZXRlcnNcbiAgICB1cmkucGFyYW1bJ3F1ZXJ5J10gPSBwYXJzZVN0cmluZyh1cmkuYXR0clsncXVlcnknXSk7XG4gICAgdXJpLnBhcmFtWydmcmFnbWVudCddID0gcGFyc2VTdHJpbmcodXJpLmF0dHJbJ2ZyYWdtZW50J10pO1xuXG4gICAgLy8gc3BsaXQgcGF0aCBhbmQgZnJhZ2VtZW50IGludG8gc2VnbWVudHNcbiAgICB1cmkuc2VnWydwYXRoJ10gPSB1cmkuYXR0ci5wYXRoLnJlcGxhY2UoL15cXC8rfFxcLyskL2csJycpLnNwbGl0KCcvJyk7XG4gICAgdXJpLnNlZ1snZnJhZ21lbnQnXSA9IHVyaS5hdHRyLmZyYWdtZW50LnJlcGxhY2UoL15cXC8rfFxcLyskL2csJycpLnNwbGl0KCcvJyk7XG5cbiAgICAvLyBjb21waWxlIGEgJ2Jhc2UnIGRvbWFpbiBhdHRyaWJ1dGVcbiAgICB1cmkuYXR0clsnYmFzZSddID0gdXJpLmF0dHIuaG9zdCA/ICh1cmkuYXR0ci5wcm90b2NvbCA/ICB1cmkuYXR0ci5wcm90b2NvbCsnOi8vJyt1cmkuYXR0ci5ob3N0IDogdXJpLmF0dHIuaG9zdCkgKyAodXJpLmF0dHIucG9ydCA/ICc6Jyt1cmkuYXR0ci5wb3J0IDogJycpIDogJyc7XG5cbiAgICByZXR1cm4gdXJpO1xufVxuXG5mdW5jdGlvbiBnZXRBdHRyTmFtZSggZWxtICkge1xuICAgIHZhciB0biA9IGVsbS50YWdOYW1lO1xuICAgIGlmICggdHlwZW9mIHRuICE9PSAndW5kZWZpbmVkJyApIHJldHVybiB0YWcyYXR0clt0bi50b0xvd2VyQ2FzZSgpXTtcbiAgICByZXR1cm4gdG47XG59XG5cbmZ1bmN0aW9uIHByb21vdGUocGFyZW50LCBrZXkpIHtcbiAgICBpZiAocGFyZW50W2tleV0ubGVuZ3RoID09PSAwKSByZXR1cm4gcGFyZW50W2tleV0gPSB7fTtcbiAgICB2YXIgdCA9IHt9O1xuICAgIGZvciAodmFyIGkgaW4gcGFyZW50W2tleV0pIHRbaV0gPSBwYXJlbnRba2V5XVtpXTtcbiAgICBwYXJlbnRba2V5XSA9IHQ7XG4gICAgcmV0dXJuIHQ7XG59XG5cbmZ1bmN0aW9uIHBhcnNlKHBhcnRzLCBwYXJlbnQsIGtleSwgdmFsKSB7XG4gICAgdmFyIHBhcnQgPSBwYXJ0cy5zaGlmdCgpO1xuICAgIGlmICghcGFydCkge1xuICAgICAgICBpZiAoaXNBcnJheShwYXJlbnRba2V5XSkpIHtcbiAgICAgICAgICAgIHBhcmVudFtrZXldLnB1c2godmFsKTtcbiAgICAgICAgfSBlbHNlIGlmICgnb2JqZWN0JyA9PSB0eXBlb2YgcGFyZW50W2tleV0pIHtcbiAgICAgICAgICAgIHBhcmVudFtrZXldID0gdmFsO1xuICAgICAgICB9IGVsc2UgaWYgKCd1bmRlZmluZWQnID09IHR5cGVvZiBwYXJlbnRba2V5XSkge1xuICAgICAgICAgICAgcGFyZW50W2tleV0gPSB2YWw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnRba2V5XSA9IFtwYXJlbnRba2V5XSwgdmFsXTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBvYmogPSBwYXJlbnRba2V5XSA9IHBhcmVudFtrZXldIHx8IFtdO1xuICAgICAgICBpZiAoJ10nID09IHBhcnQpIHtcbiAgICAgICAgICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgICAgICAgICAgICBpZiAoJycgIT09IHZhbCkgb2JqLnB1c2godmFsKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJ29iamVjdCcgPT0gdHlwZW9mIG9iaikge1xuICAgICAgICAgICAgICAgIG9ialtrZXlzKG9iaikubGVuZ3RoXSA9IHZhbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb2JqID0gcGFyZW50W2tleV0gPSBbcGFyZW50W2tleV0sIHZhbF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAofnBhcnQuaW5kZXhPZignXScpKSB7XG4gICAgICAgICAgICBwYXJ0ID0gcGFydC5zdWJzdHIoMCwgcGFydC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIGlmICghaXNpbnQudGVzdChwYXJ0KSAmJiBpc0FycmF5KG9iaikpIG9iaiA9IHByb21vdGUocGFyZW50LCBrZXkpO1xuICAgICAgICAgICAgcGFyc2UocGFydHMsIG9iaiwgcGFydCwgdmFsKTtcbiAgICAgICAgICAgIC8vIGtleVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFpc2ludC50ZXN0KHBhcnQpICYmIGlzQXJyYXkob2JqKSkgb2JqID0gcHJvbW90ZShwYXJlbnQsIGtleSk7XG4gICAgICAgICAgICBwYXJzZShwYXJ0cywgb2JqLCBwYXJ0LCB2YWwpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBtZXJnZShwYXJlbnQsIGtleSwgdmFsKSB7XG4gICAgaWYgKH5rZXkuaW5kZXhPZignXScpKSB7XG4gICAgICAgIHZhciBwYXJ0cyA9IGtleS5zcGxpdCgnWycpO1xuICAgICAgICBwYXJzZShwYXJ0cywgcGFyZW50LCAnYmFzZScsIHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFpc2ludC50ZXN0KGtleSkgJiYgaXNBcnJheShwYXJlbnQuYmFzZSkpIHtcbiAgICAgICAgICAgIHZhciB0ID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBrIGluIHBhcmVudC5iYXNlKSB0W2tdID0gcGFyZW50LmJhc2Vba107XG4gICAgICAgICAgICBwYXJlbnQuYmFzZSA9IHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleSAhPT0gJycpIHtcbiAgICAgICAgICAgIHNldChwYXJlbnQuYmFzZSwga2V5LCB2YWwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXJlbnQ7XG59XG5cbmZ1bmN0aW9uIHBhcnNlU3RyaW5nKHN0cikge1xuICAgIHJldHVybiByZWR1Y2UoU3RyaW5nKHN0cikuc3BsaXQoLyZ8Oy8pLCBmdW5jdGlvbihyZXQsIHBhaXIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHBhaXIgPSBkZWNvZGVVUklDb21wb25lbnQocGFpci5yZXBsYWNlKC9cXCsvZywgJyAnKSk7XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgLy8gaWdub3JlXG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVxbCA9IHBhaXIuaW5kZXhPZignPScpLFxuICAgICAgICAgICAgYnJhY2UgPSBsYXN0QnJhY2VJbktleShwYWlyKSxcbiAgICAgICAgICAgIGtleSA9IHBhaXIuc3Vic3RyKDAsIGJyYWNlIHx8IGVxbCksXG4gICAgICAgICAgICB2YWwgPSBwYWlyLnN1YnN0cihicmFjZSB8fCBlcWwsIHBhaXIubGVuZ3RoKTtcblxuICAgICAgICB2YWwgPSB2YWwuc3Vic3RyKHZhbC5pbmRleE9mKCc9JykgKyAxLCB2YWwubGVuZ3RoKTtcblxuICAgICAgICBpZiAoa2V5ID09PSAnJykge1xuICAgICAgICAgICAga2V5ID0gcGFpcjtcbiAgICAgICAgICAgIHZhbCA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1lcmdlKHJldCwga2V5LCB2YWwpO1xuICAgIH0sIHsgYmFzZToge30gfSkuYmFzZTtcbn1cblxuZnVuY3Rpb24gc2V0KG9iaiwga2V5LCB2YWwpIHtcbiAgICB2YXIgdiA9IG9ialtrZXldO1xuICAgIGlmICh0eXBlb2YgdiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgb2JqW2tleV0gPSB2YWw7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHYpKSB7XG4gICAgICAgIHYucHVzaCh2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG9ialtrZXldID0gW3YsIHZhbF07XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsYXN0QnJhY2VJbktleShzdHIpIHtcbiAgICB2YXIgbGVuID0gc3RyLmxlbmd0aCxcbiAgICAgICAgYnJhY2UsXG4gICAgICAgIGM7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBjID0gc3RyW2ldO1xuICAgICAgICBpZiAoJ10nID09IGMpIGJyYWNlID0gZmFsc2U7XG4gICAgICAgIGlmICgnWycgPT0gYykgYnJhY2UgPSB0cnVlO1xuICAgICAgICBpZiAoJz0nID09IGMgJiYgIWJyYWNlKSByZXR1cm4gaTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlZHVjZShvYmosIGFjY3VtdWxhdG9yKXtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGwgPSBvYmoubGVuZ3RoID4+IDAsXG4gICAgICAgIGN1cnIgPSBhcmd1bWVudHNbMl07XG4gICAgd2hpbGUgKGkgPCBsKSB7XG4gICAgICAgIGlmIChpIGluIG9iaikgY3VyciA9IGFjY3VtdWxhdG9yLmNhbGwodW5kZWZpbmVkLCBjdXJyLCBvYmpbaV0sIGksIG9iaik7XG4gICAgICAgICsraTtcbiAgICB9XG4gICAgcmV0dXJuIGN1cnI7XG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkodkFyZykge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodkFyZykgPT09IFwiW29iamVjdCBBcnJheV1cIjtcbn1cblxuZnVuY3Rpb24ga2V5cyhvYmopIHtcbiAgICB2YXIga2V5X2FycmF5ID0gW107XG4gICAgZm9yICggdmFyIHByb3AgaW4gb2JqICkge1xuICAgICAgICBpZiAoIG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSApIGtleV9hcnJheS5wdXNoKHByb3ApO1xuICAgIH1cbiAgICByZXR1cm4ga2V5X2FycmF5O1xufVxuXG5mdW5jdGlvbiBwdXJsKCB1cmwsIHN0cmljdE1vZGUgKSB7XG4gICAgaWYgKCBhcmd1bWVudHMubGVuZ3RoID09PSAxICYmIHVybCA9PT0gdHJ1ZSApIHtcbiAgICAgICAgc3RyaWN0TW9kZSA9IHRydWU7XG4gICAgICAgIHVybCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgc3RyaWN0TW9kZSA9IHN0cmljdE1vZGUgfHwgZmFsc2U7XG4gICAgdXJsID0gdXJsIHx8IHdpbmRvdy5sb2NhdGlvbi50b1N0cmluZygpO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICBkYXRhIDogcGFyc2VVcmkodXJsLCBzdHJpY3RNb2RlKSxcblxuICAgICAgICAvLyBnZXQgdmFyaW91cyBhdHRyaWJ1dGVzIGZyb20gdGhlIFVSSVxuICAgICAgICBhdHRyIDogZnVuY3Rpb24oIGF0dHIgKSB7XG4gICAgICAgICAgICBhdHRyID0gYWxpYXNlc1thdHRyXSB8fCBhdHRyO1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBhdHRyICE9PSAndW5kZWZpbmVkJyA/IHRoaXMuZGF0YS5hdHRyW2F0dHJdIDogdGhpcy5kYXRhLmF0dHI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gcmV0dXJuIHF1ZXJ5IHN0cmluZyBwYXJhbWV0ZXJzXG4gICAgICAgIHBhcmFtIDogZnVuY3Rpb24oIHBhcmFtICkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBwYXJhbSAhPT0gJ3VuZGVmaW5lZCcgPyB0aGlzLmRhdGEucGFyYW0ucXVlcnlbcGFyYW1dIDogdGhpcy5kYXRhLnBhcmFtLnF1ZXJ5O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHJldHVybiBmcmFnbWVudCBwYXJhbWV0ZXJzXG4gICAgICAgIGZwYXJhbSA6IGZ1bmN0aW9uKCBwYXJhbSApIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgcGFyYW0gIT09ICd1bmRlZmluZWQnID8gdGhpcy5kYXRhLnBhcmFtLmZyYWdtZW50W3BhcmFtXSA6IHRoaXMuZGF0YS5wYXJhbS5mcmFnbWVudDtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyByZXR1cm4gcGF0aCBzZWdtZW50c1xuICAgICAgICBzZWdtZW50IDogZnVuY3Rpb24oIHNlZyApIHtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIHNlZyA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5zZWcucGF0aDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VnID0gc2VnIDwgMCA/IHRoaXMuZGF0YS5zZWcucGF0aC5sZW5ndGggKyBzZWcgOiBzZWcgLSAxOyAvLyBuZWdhdGl2ZSBzZWdtZW50cyBjb3VudCBmcm9tIHRoZSBlbmRcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnNlZy5wYXRoW3NlZ107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gcmV0dXJuIGZyYWdtZW50IHNlZ21lbnRzXG4gICAgICAgIGZzZWdtZW50IDogZnVuY3Rpb24oIHNlZyApIHtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIHNlZyA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5zZWcuZnJhZ21lbnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlZyA9IHNlZyA8IDAgPyB0aGlzLmRhdGEuc2VnLmZyYWdtZW50Lmxlbmd0aCArIHNlZyA6IHNlZyAtIDE7IC8vIG5lZ2F0aXZlIHNlZ21lbnRzIGNvdW50IGZyb20gdGhlIGVuZFxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEuc2VnLmZyYWdtZW50W3NlZ107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwdXJsO1xuIiwiLyogIO+8g2Z1bmN0aW9uIHF1ZXJ5U3RyaW5nI1xuICogIDwgT2JqZWN0ICAg5L6L5aaCIHthOjEsYjoyLGM6M31cbiAqICA+IFN0cmluZyAgIOS+i+WmgiBhPTEmYj0yJmM9M1xuICogIOeUqOS6juaLvOijhXVybOWcsOWdgOeahHF1ZXJ5XG4gKi9cbmZ1bmN0aW9uIHF1ZXJ5U3RyaW5nIChvYmopIHtcbiAgdmFyIHF1ZXJ5ID0gW11cbiAgZm9yICh2YXIgb25lIGluIG9iaikge1xuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkob25lKSkge1xuICAgICAgcXVlcnkucHVzaChbb25lLCBvYmpbb25lXV0uam9pbignPScpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gcXVlcnkuam9pbignJicpXG59XG5tb2R1bGUuZXhwb3J0cyA9IHF1ZXJ5U3RyaW5nIiwiLyogIDkxcG9ybiBcbiAqICBAU25vb3plIDIwMTUtNy0yNlxuICovXG52YXIgY2FuUGxheU0zVTggPSByZXF1aXJlKCcuL2NhblBsYXlNM1U4JylcbnZhciBhamF4ICAgICAgICA9IHJlcXVpcmUoJy4vYWpheCcpXG52YXIgbG9nICAgICAgICAgPSByZXF1aXJlKCcuL2xvZycpXG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAodXJsKSB7XG4gIGlmICh3aW5kb3cuc28gJiYgd2luZG93LnNvLnZhcmlhYmxlcykge1xuICAgIHZhciBmaWxlSWQgPSB3aW5kb3cuc28udmFyaWFibGVzLmZpbGVcbiAgICB2YXIgc2VjQ29kZSA9IHdpbmRvdy5zby52YXJpYWJsZXMuc2VjY29kZVxuICAgIHZhciBtYXhfdmlkID0gd2luZG93LnNvLnZhcmlhYmxlcy5tYXhfdmlkXG4gICAgcmV0dXJuICEhZmlsZUlkICYgISFzZWNDb2RlICYgISFtYXhfdmlkICYgXG4gICAgICAvdmlld192aWRlb1xcLnBocFxcP3ZpZXdrZXkvLnRlc3QoIHVybC5hdHRyKCdzb3VyY2UnKSApXG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7ICBcbiAgLy92YXIgbWVkaWFTcGFjZUhUTUwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lZGlhc3BhY2VcIikuaW5uZXJIVE1MXG4gIC8vdmFyIGZpbGVJZCA9IC9maWxlJywnKC4qPyknL2kuZXhlYyhtZWRpYVNwYWNlSFRNTClbMV1cbiAgLy92YXIgc2VjQ29kZSA9IC9zZWNjb2RlJywnKC4qPyknL2kuZXhlYyhtZWRpYVNwYWNlSFRNTClbMV1cbiAgLy92YXIgbWF4X3ZpZCA9IC9tYXhfYmlkJywnKC4qPyknL2kuZXhlYyhtZWRpYVNwYWNlSFRNTClbMV1cbiAgdmFyIGZpbGVJZCA9IHdpbmRvdy5zby52YXJpYWJsZXMuZmlsZVxuICB2YXIgc2VjQ29kZSA9IHdpbmRvdy5zby52YXJpYWJsZXMuc2VjY29kZVxuICB2YXIgbWF4X3ZpZCA9IHdpbmRvdy5zby52YXJpYWJsZXMubWF4X3ZpZFxuICBcblxuICB2YXIgbXA0ID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuICAgIGFqYXgoe1xuICAgICAgdXJsOiAnaHR0cDovL3d3dy45MXBvcm4uY29tL2dldGZpbGUucGhwJyxcbiAgICAgIGpzb25wOiBmYWxzZSxcbiAgICAgIHBhcmFtOiB7XG4gICAgICAgIFZJRDogZmlsZUlkLFxuICAgICAgICBtcDQ6ICcwJyxcbiAgICAgICAgc2VjY29kZTogc2VjQ29kZSxcbiAgICAgICAgbWF4X3ZpZDogbWF4X3ZpZFxuICAgICAgfSxcbiAgICAgIGNvbnRlbnRUeXBlOiAnbm90SlNPTicsXG4gICAgICBjYWxsYmFjazogZnVuY3Rpb24ocGFyYW0pe1xuICAgICAgICBpZihwYXJhbSA9PSAtMSB8fCBwYXJhbS5jb2RlID09IC0xKSByZXR1cm4gbG9nKCfop6PmnpA5MXBvcm7op4bpopHlnLDlnYDlpLHotKUnKVxuICAgICAgICBtcDRVcmwgPSBwYXJhbS5zcGxpdCgnPScpWzFdLnNwbGl0KCcmJylbMF1cbiAgICAgICAgdmFyIHVybHMgPSBbXVxuICAgICAgICB1cmxzLnB1c2goWyfkvY7muIXniYgnLCBtcDRVcmxdKVxuICAgICAgICBsb2coJ+ino+aekDkxcG9ybuinhumikeWcsOWdgOaIkOWKnyAnICsgdXJscy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtyZXR1cm4gJzxhIGhyZWY9JytpdGVtWzFdKyc+JytpdGVtWzBdKyc8L2E+J30pLmpvaW4oJyAnKSwgMilcbiAgICAgICAgLy8gY29uc29sZS5pbmZvKHVybHMpXG4gICAgICAgIHJldHVybiBjYWxsYmFjayh1cmxzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgbXA0KGNhbGxiYWNrKVxufVxuXG5cblxuIiwiLyogIOeZvuW6puebmCBcbiAqICBA5pyx5LiAIOagvOW8j+WFs+ezu+WPquiDveaSreaUvuWPr+aSreaUvueahOagvOW8j+OAgui/mei+ueW8uuWItuWIpOaWrW1wNOWPr+aSreaUvuOAguWFtuS7luS4jeihjOOAglxuICovXG52YXIgY2FuUGxheU0zVTggPSByZXF1aXJlKCcuL2NhblBsYXlNM1U4JylcbnZhciBhamF4ICAgICAgICA9IHJlcXVpcmUoJy4vYWpheCcpXG52YXIgbG9nICAgICAgICAgPSByZXF1aXJlKCcuL2xvZycpXG5cbmZ1bmN0aW9uIGdldEZpbGVQYXRoICh1cmwpIHtcbiAgdmFyIGZpbGVOYW1lID0gdXJsLmF0dHIoJ3NvdXJjZScpLnNwbGl0KCcvJylcbiAgZmlsZU5hbWUgPSBmaWxlTmFtZVtmaWxlTmFtZS5sZW5ndGggLSAxXVxuICBmaWxlTmFtZSA9IGZpbGVOYW1lLnNwbGl0KCcmJylcbiAgZm9yICh2YXIgaSA9IDAsIHQ7IGkgPCBmaWxlTmFtZS5sZW5ndGg7IGkrKykge1xuICAgIHQgPSBmaWxlTmFtZVtpXS5zcGxpdCgnPScpXG4gICAgaWYgKHRbMF0gPT09ICdwYXRoJykgcmV0dXJuIHRbMV1cbiAgfVxuICByZXR1cm4gZmFsc2Vcbn1cblxuZXhwb3J0cy5tYXRjaCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgcmV0dXJuIHVybC5hdHRyKCdob3N0JykuaW5kZXhPZigncGFuLmJhaWR1LmNvbScpID49IDAgJiYgd2luZG93Lnl1bkRhdGEgJiYgZ2V0RmlsZVBhdGgodXJsKVxufVxuXG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG4gIGZ1bmN0aW9uIGVuY29kZUJhc2U2NChHKSB7XG4gICAgdmFyIEMgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIixcbiAgICAgIEIsIEEsIF8sIEYsIEQsIEU7XG4gICAgXyA9IEcubGVuZ3RoO1xuICAgIEEgPSAwO1xuICAgIEIgPSBcIlwiO1xuICAgIHdoaWxlIChBIDwgXykge1xuICAgICAgRiA9IEcuY2hhckNvZGVBdChBKyspICYgMjU1O1xuICAgICAgaWYgKEEgPT0gXykge1xuICAgICAgICBCICs9IEMuY2hhckF0KEYgPj4gMik7XG4gICAgICAgIEIgKz0gQy5jaGFyQXQoKEYgJiAzKSA8PCA0KTtcbiAgICAgICAgQiArPSBcIj09XCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgRCA9IEcuY2hhckNvZGVBdChBKyspO1xuICAgICAgaWYgKEEgPT0gXykge1xuICAgICAgICBCICs9IEMuY2hhckF0KEYgPj4gMik7XG4gICAgICAgIEIgKz0gQy5jaGFyQXQoKChGICYgMykgPDwgNCkgfCAoKEQgJiAyNDApID4+IDQpKTtcbiAgICAgICAgQiArPSBDLmNoYXJBdCgoRCAmIDE1KSA8PCAyKTtcbiAgICAgICAgQiArPSBcIj1cIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBFID0gRy5jaGFyQ29kZUF0KEErKyk7XG4gICAgICBCICs9IEMuY2hhckF0KEYgPj4gMik7XG4gICAgICBCICs9IEMuY2hhckF0KCgoRiAmIDMpIDw8IDQpIHwgKChEICYgMjQwKSA+PiA0KSk7XG4gICAgICBCICs9IEMuY2hhckF0KCgoRCAmIDE1KSA8PCAyKSB8ICgoRSAmIDE5MikgPj4gNikpO1xuICAgICAgQiArPSBDLmNoYXJBdChFICYgNjMpO1xuICAgIH1cbiAgICByZXR1cm4gQjtcbiAgfTtcbiAgdmFyIGJkc3Rva2VuID0geXVuRGF0YS5NWUJEU1RPS0VOXG4gIHZhciB0aW1lU3RhbXAgPSB5dW5EYXRhLnRpbWVzdGFtcFxuICB2YXIgc2lnbjEgPSB5dW5EYXRhLnNpZ24xXG4gIHZhciBzaWduMjsgZXZhbCgnc2lnbjIgPSAnICsgeXVuRGF0YS5zaWduMilcbiAgdmFyIHNpZ24zID0geXVuRGF0YS5zaWduM1xuICB2YXIgc2lnbiA9IGVuY29kZUJhc2U2NChzaWduMihzaWduMywgc2lnbjEpKVxuICB2YXIgZmlsZVBhdGggPSBnZXRGaWxlUGF0aCh1cmwpXG4gIGlmICghZmlsZVBhdGgpIHtcbiAgICBsb2coJ+ayoeacieajgOa1i+WIsOaSreaUvuWGheWuuScsIDIpXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHBhdGhBcnJheSA9IGRlY29kZVVSSUNvbXBvbmVudChmaWxlUGF0aCkuc3BsaXQoJy8nKVxuICB2YXIgZmlsZU5hbWUgPSBwYXRoQXJyYXkucG9wKClcbiAgdmFyIHBhcmVudFBhdGggPSBwYXRoQXJyYXkuam9pbignLycpXG5cbiAgaWYgKGZpbGVOYW1lLnNwbGl0KCcuJykucG9wKCkgIT09ICdtcDQnKSB7XG4gICAgbG9nKCflj6rog73mkq3mlL5tcDTmoLzlvI/nmoTmlofku7YnLCAyKVxuICAgIHJldHVybjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGdldFZpZGVvRnJvbUZzaWQgKGZzaWQpIHtcbiAgICBhamF4KHtcbiAgICAgIHVybDogJy9hcGkvZG93bmxvYWQnLFxuICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICBwYXJhbToge3NpZ246IGVuY29kZVVSSUNvbXBvbmVudChzaWduKSwgdGltZXN0YW1wOiB0aW1lU3RhbXAsIGZpZGxpc3Q6ICdbXCInK2ZzaWQrJ1wiXScsIHR5cGU6ICdkbGluayd9LCBcbiAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmIChyZXMuZGxpbmsgJiYgcmVzLmRsaW5rWzBdICYmIHJlcy5kbGlua1swXS5kbGluaylcbiAgICAgICAgICBjYWxsYmFjayhbW1wi55m+5q+S55uYXCIsIGRlY29kZVVSSUNvbXBvbmVudChyZXMuZGxpbmtbMF0uZGxpbmspXV0pXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGFqYXgoe1xuICAgIHVybDogJy9hcGkvY2F0ZWdvcnlsaXN0JyxcbiAgICBwYXJhbToge3BhcmVudF9wYXRoOiBwYXJlbnRQYXRoLCBwYWdlOiAxLCBudW06IDUwMCwgY2F0ZWdvcnk6IDEsIGJkc3Rva2VuOiBiZHN0b2tlbiwgY2hhbm5lbDogJ2NodW5sZWknLCB3ZWI6IDEsIGFwcF9pZDogJzI1MDUyOCd9LCBcbiAgICBjYWxsYmFjazogZnVuY3Rpb24gKHJlcykge1xuICAgICAgaWYgKCFyZXMuaW5mbykgcmV0dXJuO1xuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHJlcy5pbmZvLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGlmIChyZXMuaW5mb1tpXS5zZXJ2ZXJfZmlsZW5hbWUgPT09IGZpbGVOYW1lKSB7XG4gICAgICAgICAgZ2V0VmlkZW9Gcm9tRnNpZChyZXMuaW5mb1tpXS5mc19pZClcbiAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KVxufVxuXG5cblxuIiwiLyogIGJpbGlibGlcbiAqIGFwcGtleSBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS96YWN5dS9iaWxpYmlsaS1oZWxwZXIvXG4gKiAgQOacseS4gFxuICovXG52YXIgcHVybCAgICAgID0gcmVxdWlyZSgnLi9wdXJsJylcbnZhciBsb2cgICAgICAgPSByZXF1aXJlKCcuL2xvZycpXG52YXIgaHR0cFByb3h5ID0gcmVxdWlyZSgnLi9odHRwUHJveHknKVxudmFyIGdldENvb2tpZSA9IHJlcXVpcmUoJy4vZ2V0Q29va2llJylcblxuZnVuY3Rpb24gcGFkKG51bSwgbikge1xuICByZXR1cm4gKEFycmF5KG4pLmpvaW4oMCkgKyBudW0pLnNsaWNlKC1uKVxufVxuXG5leHBvcnRzLm1hdGNoID0gZnVuY3Rpb24gKHVybCkge1xuICByZXR1cm4gdXJsLmF0dHIoJ2hvc3QnKS5pbmRleE9mKCdiaWxpYmlsaScpID49IDAgJiYgL15cXC92aWRlb1xcL2F2XFxkK1xcLyQvLnRlc3QodXJsLmF0dHIoJ2RpcmVjdG9yeScpKVxufVxuXG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG4gIGxvZygn5byA5aeL6Kej5p6QYmlsaWJsaeinhumikeWcsOWdgCcpXG4gIHZhciBhaWQgPSB1cmwuYXR0cignZGlyZWN0b3J5JykubWF0Y2goL15cXC92aWRlb1xcL2F2KFxcZCspXFwvJC8pWzFdXG4gIHZhciBwYWdlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBwYWdlTWF0Y2ggPSB1cmwuYXR0cignZmlsZScpLm1hdGNoKC9eaW5kZXhcXF8oXFxkKylcXC5odG1sJC8pXG4gICAgcmV0dXJuIHBhZ2VNYXRjaCA/IHBhZ2VNYXRjaFsxXSA6IDFcbiAgfSgpKVxuXG4gIGh0dHBQcm94eShcbiAgICAnaHR0cDovL3d3dy5iaWxpYmlsaS5jb20vbS9odG1sNScsXG4gICAgJ2dldCcsXG4gICAge2FpZDogYWlkLCBwYWdlOiBwYWdlLCBzaWQ6IGdldENvb2tpZSgnc2lkJyl9LFxuICBmdW5jdGlvbiAocnMpIHtcbiAgICBpZiAocnMgJiYgcnMuc3JjKSB7XG4gICAgICBsb2coJ+iOt+WPluWIsDxhIGhyZWY9XCInK3JzLnNyYysnXCI+6KeG6aKR5Zyw5Z2APC9hPiwg5bm25byA5aeL6Kej5p6QYmlsaWJsaeW8ueW5lScpXG4gICAgICB2YXIgc291cmNlID0gWyBbJ2JpbGliaWxpJywgcnMuc3JjXSBdXG5cbiAgICAgIHZhciBjb21tZW50U3JjID0gcnMuY2lkXG4gICAgICB2YXIgY2lkID0gY29tbWVudFNyYy5zcGxpdCgnLycpXG4gICAgICBjaWQgPSBjaWRbY2lkLmxlbmd0aCAtIDFdLnNwbGl0KCcuJylbMF1cblxuICAgICAgaHR0cFByb3h5KFxuICAgICAgICAnaHR0cDovL2ludGVyZmFjZS5iaWxpYmlsaS5jb20vcGxheXVybCcsXG4gICAgICAgICdnZXQnLFxuICAgICAgICB7b3R5cGU6ICdqc29uJywgYXBwa2V5OiAnZjNiYjIwOGIzZDA4MWRjOCcsIGNpZDogY2lkLCBxdWFsaXR5OiA0LCB0eXBlOiAnbXA0J30sXG4gICAgICBmdW5jdGlvbiAocnMpIHtcbiAgICAgICAgaWYgKHJzICYmIHJzLmR1cmwgJiYgcnMuZHVybFswXSAmJiBycy5kdXJsWzBdLmJhY2t1cF91cmwgJiYgcnMuZHVybFswXS5iYWNrdXBfdXJsWzBdKSB7XG4gICAgICAgICAgc291cmNlLnVuc2hpZnQoWydiaWxpYmlsaSBIRCcsIHJzLmR1cmxbMF0uYmFja3VwX3VybFswXV0pXG4gICAgICAgIH0gZWxzZSBpZiAocnMgJiYgcnMuZHVybCAmJiBycy5kdXJsWzBdICYmIHJzLmR1cmxbMF0udXJsKSB7XG4gICAgICAgICAgc291cmNlLnVuc2hpZnQoWydiaWxpYmlsaSBIRCcsIHJzLmR1cmxbMF0udXJsXSlcbiAgICAgICAgfVxuXG4gICAgICAgIGh0dHBQcm94eShjb21tZW50U3JjLCAnZ2V0Jywge30sIGZ1bmN0aW9uIChycykge1xuICAgICAgICAgIGlmIChycyAmJiBycy5pKSB7XG4gICAgICAgICAgICB2YXIgY29tbWVudHMgPSBbXS5jb25jYXQocnMuaS5kIHx8IFtdKVxuICAgICAgICAgICAgY29tbWVudHMgPSBjb21tZW50cy5tYXAoZnVuY3Rpb24gKGNvbW1lbnQpIHtcbiAgICAgICAgICAgICAgdmFyIHAgPSBjb21tZW50WydAcCddLnNwbGl0KCcsJylcbiAgICAgICAgICAgICAgc3dpdGNoIChwWzFdIHwgMCkge1xuICAgICAgICAgICAgICAgIGNhc2UgNDogIHBbMV0gPSAnYm90dG9tJzsgYnJlYWtcbiAgICAgICAgICAgICAgICBjYXNlIDU6ICBwWzFdID0gICd0b3AnOyBicmVha1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6IHBbMV0gPSAnbG9vcCdcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgICAgIHRpbWU6IHBhcnNlRmxvYXQocFswXSksXG4gICAgICAgICAgICAgICAgcG9zOiAgcFsxXSxcbiAgICAgICAgICAgICAgICBjb2xvcjogJyMnICsgcGFkKChwWzNdIHwgMCkudG9TdHJpbmcoMTYpLCA2KSxcbiAgICAgICAgICAgICAgICB0ZXh0OiBjb21tZW50WycjdGV4dCddXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGEudGltZSAtIGIudGltZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIGxvZygn5LiA5YiH6aG65Yip5byA5aeL5pKt5pS+JywgMilcbiAgICAgICAgICAgIGNhbGxiYWNrKHNvdXJjZSwgY29tbWVudHMpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxvZygn6Kej5p6QYmlsaWJsaeW8ueW5leWksei0pSwg5L2G5YuJ5by65Y+v5Lul5pKt5pS+JywgMilcbiAgICAgICAgICAgIGNhbGxiYWNrKHNvdXJjZSlcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSwge2d6aW5mbGF0ZToxLCB4bWw6MX0pXG4gICAgICB9KVxuICAgIH0gZWxzZSB7XG4gICAgICBsb2coJ+ino+aekGJpbGlibGnop4bpopHlnLDlnYDlpLHotKUnLCAyKVxuICAgICAgY2FsbGJhY2soZmFsc2UpXG4gICAgfVxuICB9KVxufVxuIiwiLyogIGRvdXl1XG4gKiAgQOacseS4gFxuICovXG52YXIgY2FuUGxheU0zVTggPSByZXF1aXJlKCcuL2NhblBsYXlNM1U4JylcbnZhciBhamF4ICAgICAgICA9IHJlcXVpcmUoJy4vYWpheCcpXG52YXIgbG9nICAgICAgICAgPSByZXF1aXJlKCcuL2xvZycpXG52YXIgaHR0cFByb3h5ICAgPSByZXF1aXJlKCcuL2h0dHBQcm94eScpXG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAodXJsKSB7XG4gIHJldHVybiBjYW5QbGF5TTNVOCAmJiB1cmwuYXR0cignaG9zdCcpLmluZGV4T2YoJ2RvdXl1JykgPj0gMCAmJiB3aW5kb3cuJFJPT00gJiYgd2luZG93LiRST09NLnJvb21faWRcbn1cblxuZXhwb3J0cy5nZXRWaWRlb3MgPSBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaykge1xuICBodHRwUHJveHkoXG4gICAgJ2h0dHA6Ly9tLmRvdXl1LmNvbS9odG1sNS9saXZlJywgXG4gICAgJ2dldCcsIFxuICAgIHtyb29tSWQ6IHdpbmRvdy4kUk9PTS5yb29tX2lkfSxcbiAgZnVuY3Rpb24gKHJzKSB7XG4gICAgY2FsbGJhY2soW1tcIuaWl+mxvFwiLCBycy5kYXRhLmhsc191cmxdXSlcbiAgfSlcbn0iLCIvKiAgdHVkb3UgXG4gKiAgQOacseS4gFxuICovXG52YXIgY2FuUGxheU0zVTggPSByZXF1aXJlKCcuL2NhblBsYXlNM1U4JylcbnZhciBhamF4ICAgICAgICA9IHJlcXVpcmUoJy4vYWpheCcpXG52YXIgbG9nICAgICAgICAgPSByZXF1aXJlKCcuL2xvZycpXG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAodXJsKSB7XG4gIHJldHVybiB0cnVlO1xufVxuXG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG4gIGFqYXgoe1xuICAgIHVybDogJ2h0dHA6Ly9hY2Z1bmZpeC5zaW5hYXBwLmNvbS9tYW1hLnBocCcsXG4gICAganNvbnA6IHRydWUsXG4gICAgcGFyYW06IHtcbiAgICAgIHVybDogdXJsLmF0dHIoJ3NvdXJjZScpXG4gICAgfSxcbiAgICBjYWxsYmFjazogZnVuY3Rpb24ocGFyYW0pIHtcbiAgICAgIGlmIChwYXJhbS5jb2RlICE9IDIwMCkge1xuICAgICAgICBjYWxsYmFjayhmYWxzZSk7XG4gICAgICB9XG4gICAgICB2YXIgc291cmNlID0gY2FuUGxheU0zVTggJiYgcGFyYW0ubTN1OCA/IHBhcmFtLm0zdTggOiBwYXJhbS5tcDQ7XG4gICAgICB2YXIgcnMgPSBbXTtcbiAgICAgIGlmIChzb3VyY2UpIHtcbiAgICAgICAgZm9yKHR5cGUgaW4gc291cmNlKSB7XG4gICAgICAgICAgcnMucHVzaChbdHlwZSwgc291cmNlW3R5cGVdXSk7XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2socnMpO1xuICAgICAgfVxuICAgIH1cbiAgfSlcbn0iLCIvKiAgaHVuYW50diBcbiAqICBA5oOF6L+35rW36b6fcGl6emFcbiAqL1xudmFyIGNhblBsYXlNM1U4ID0gcmVxdWlyZSgnLi9jYW5QbGF5TTNVOCcpXG52YXIgYWpheCAgICAgICAgPSByZXF1aXJlKCcuL2FqYXgnKVxudmFyIGxvZyAgICAgICAgID0gcmVxdWlyZSgnLi9sb2cnKVxuZXhwb3J0cy5tYXRjaCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgcmV0dXJuIC93d3dcXC5odW5hbnR2XFwuY29tLy50ZXN0KHVybC5hdHRyKCdob3N0JykpXG59XG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG4gIC8v6IqS5p6c5Y+w5rKh5pyJbXA0IG8o4pWv4pah4pWwKW9cbiAgaWYgKGNhblBsYXlNM1U4KSB7XG4gICAgdmFyIGdldFBhcmFtcyA9IGZ1bmN0aW9uKHJlcV91cmwpe1xuICAgICAgdmFyIHBhcmFtc191cmwgPSByZXFfdXJsLnNwbGl0KFwiP1wiKVsxXTtcbiAgICAgIHZhciBwYXJhbXNfdG1wID0gbmV3IEFycmF5KCk7XG4gICAgICBwYXJhbXNfdG1wID0gcGFyYW1zX3VybC5zcGxpdChcIiZcIik7XG4gICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICBmb3Ioa2V5IGluIHBhcmFtc190bXApe1xuICAgICAgICBwYXJhbSA9IHBhcmFtc190bXBba2V5XTtcbiAgICAgICAgaXRlbSA9IG5ldyBBcnJheSgpO1xuICAgICAgICBpdGVtID0gcGFyYW1zX3RtcFtrZXldLnNwbGl0KFwiPVwiKTtcbiAgICAgICAgaWYgKGl0ZW1bMF0gIT0gJycpIHtcbiAgICAgICAgICAgIHBhcmFtc1tpdGVtWzBdXSA9IGl0ZW1bMV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBwYXJhbXM7XG4gICAgfVxuXG4gICAgdmFyIG0zdThfcmVxX3Bhcm1zID0gJyZmbXQ9NiZwbm89NyZtM3U4PTEnO1xuICAgIHZhciBzdHJfb3JpZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdGbGFzaFZhcnMnKVswXS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG4gICAgdmFyIHN0cl90bXAgPSBzdHJfb3JpZy5zcGxpdChcIiZmaWxlPVwiKVsxXTtcbiAgICB2YXIgcmVxX3VybCA9IHN0cl90bXAuc3BsaXQoXCIlMjZmbXRcIilbMF07XG4gICAgcmVxX3VybCA9IHJlcV91cmwgKyBtM3U4X3JlcV9wYXJtcztcbiAgICByZXFfdXJsID0gZGVjb2RlVVJJQ29tcG9uZW50KHJlcV91cmwpO1xuICAgIHBhcmFtcyA9IGdldFBhcmFtcyhyZXFfdXJsKTtcblxuICAgIC8v6I635Y+W5LiJ56eN5riF5pmw5bqmXG4gICAgdmFyIGxpbWl0cmF0ZSA9IG5ldyBBcnJheSgpO1xuICAgIGxpbWl0cmF0ZSA9IFsnNTcwJywgJzEwNTYnLCAnMTYxNSddO1xuICAgIHVybHMgPSBuZXcgQXJyYXkoKTtcbiAgICBwYXJhbXMubGltaXRyYXRlID0gbGltaXRyYXRlWzBdO1xuICAgIHRleHQgPSBcIuagh+a4hVwiO1xuICAgIGFqYXgoe1xuICAgICAgdXJsOiAnaHR0cDovL3BjdmNyLmNkbi5pbWdvLnR2L25jcnMvdm9kLmRvJyxcbiAgICAgIGpzb25wOiB0cnVlLFxuICAgICAgcGFyYW06IHBhcmFtcyxcbiAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09ICdvaycpIHVybHMucHVzaChbdGV4dCwgZGF0YS5pbmZvXSlcbiAgICAgICAgcGFyYW1zLmxpbWl0cmF0ZSA9IGxpbWl0cmF0ZVsxXTtcbiAgICAgICAgdGV4dCA9IFwi6auY5riFXCI7XG4gICAgICAgIGFqYXgoe1xuICAgICAgICAgIHVybDogJ2h0dHA6Ly9wY3Zjci5jZG4uaW1nby50di9uY3JzL3ZvZC5kbycsXG4gICAgICAgICAganNvbnA6IHRydWUsXG4gICAgICAgICAgcGFyYW06IHBhcmFtcyxcbiAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICBpZiAoZGF0YS5zdGF0dXMgPT0gJ29rJykgdXJscy5wdXNoKFt0ZXh0LCBkYXRhLmluZm9dKVxuICAgICAgICAgICAgcGFyYW1zLmxpbWl0cmF0ZSA9IGxpbWl0cmF0ZVsyXTtcbiAgICAgICAgICAgIHRleHQgPSBcIui2hea4hVwiO1xuICAgICAgICAgICAgYWpheCh7XG4gICAgICAgICAgICAgIHVybDogJ2h0dHA6Ly9wY3Zjci5jZG4uaW1nby50di9uY3JzL3ZvZC5kbycsXG4gICAgICAgICAgICAgIGpzb25wOiB0cnVlLFxuICAgICAgICAgICAgICBwYXJhbTogcGFyYW1zLFxuICAgICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuc3RhdHVzID09ICdvaycpIHVybHMucHVzaChbdGV4dCwgZGF0YS5pbmZvXSlcbiAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sodXJscyk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1lbHNle1xuICAgIGxvZygn6K+35L2/55SoU2FmYXJp6KeC55yL5pys6KeG6aKRJyk7XG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gICAgfSwgMjAwMCk7XG4gIH1cbn0iLCIvKiAgaXFpeWkgXG4gKiAgQOacseS4gFxuICovXG52YXIgY2FuUGxheU0zVTggPSByZXF1aXJlKCcuL2NhblBsYXlNM1U4JylcbnZhciBoYXNGbGFzaCA9IHJlcXVpcmUoJy4vaGFzRmxhc2gnKVxudmFyIHF1ZXJ5U3RyaW5nID0gcmVxdWlyZSgnLi9xdWVyeVN0cmluZycpXG52YXIgZ2V0Q29va2llID0gcmVxdWlyZSgnLi9nZXRDb29raWUnKVxudmFyIGFqYXggPSByZXF1aXJlKCcuL2FqYXgnKVxudmFyIGh0dHBQcm94eSA9IHJlcXVpcmUoJy4vaHR0cFByb3h5JylcbnZhciBsb2cgPSByZXF1aXJlKCcuL2xvZycpXG5cbmZ1bmN0aW9uIGZvcm1hdFZkICh2ZCkge1xuICBzd2l0Y2ggKHZkKSB7XG4gICAgY2FzZSAxOiAgcmV0dXJuIHtpbmRleDogMiwgdGV4dDogJ+agh+a4hScgIH1cbiAgICBjYXNlIDI6ICByZXR1cm4ge2luZGV4OiAzLCB0ZXh0OiAn6auY5riFJyAgfVxuICAgIGNhc2UgOTY6IHJldHVybiB7aW5kZXg6IDEsIHRleHQ6ICfmuKPnlLvotKgnIH1cbiAgICBkZWZhdWx0OiByZXR1cm4ge2luZGV4OiAwLCB0ZXh0OiAn5pyq55+lJyAgfVxuICB9XG59XG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAodXJsKSB7XG4gIHJldHVybiAvXmh0dHA6XFwvXFwvd3d3XFwuaXFpeWlcXC5jb20vLnRlc3QodXJsLmF0dHIoJ3NvdXJjZScpKSAmJiAhIXdpbmRvdy5RLlBhZ2VJbmZvXG59XG5cbmV4cG9ydHMuZ2V0VmlkZW9zID0gZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHtcblxuICBsb2coJ+WboOS4uueIseWlh+iJuueahOafkOS6m+WOn+WboOS4jeiuqeaSrSwg5omA5Lul5L2g54Ot5bCx54Ot5ZCn44CCJyk7XG4gIHJldHVybjtcblxuICB2YXIgdWlkID0gJydcbiAgdHJ5e1xuICAgIHVpZCA9IEpTT04ucGFyc2UoZ2V0Q29va2llKCdQMDAwMDInKSkudWlkXG4gIH1jYXRjaChlKSB7fVxuICB2YXIgY3VwaWQgPSAncWNfMTAwMDAxXzEwMDEwMicgLy/ov5nkuKrlhpnmrbvlkKdcbiAgdmFyIHR2SWQgPSB3aW5kb3cuUS5QYWdlSW5mby5wbGF5UGFnZUluZm8udHZJZFxuICB2YXIgYWxidW1JZCA9IHdpbmRvdy5RLlBhZ2VJbmZvLnBsYXlQYWdlSW5mby5hbGJ1bUlkXG4gIHZhciB2aWQgPSB3aW5kb3cuUS5QYWdlSW5mby5wbGF5UGFnZUluZm8udmlkIHx8XG4gICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZsYXNoYm94JykuZ2V0QXR0cmlidXRlKCdkYXRhLXBsYXllci12aWRlb2lkJylcblxuICBmdW5jdGlvbiBnZXRWaWRlb1VSTCAoKSB7XG4gICAgdmFyIHBhcmFtID0gd2VvcmpqaWdoKHR2SWQpXG4gICAgcGFyYW0udWlkID0gdWlkXG4gICAgcGFyYW0uY3VwaWQgPSBjdXBpZFxuICAgIHBhcmFtLnBsYXRGb3JtID0gJ2g1J1xuICAgIHBhcmFtLnR5cGUgPSBjYW5QbGF5TTNVOCA/ICdtM3U4JyA6ICdtcDQnLFxuICAgIHBhcmFtLnF5cGlkID0gdHZJZCArICdfMjEnXG4gICAgYWpheCh7XG4gICAgICB1cmw6ICdodHRwOi8vY2FjaGUubS5pcWl5aS5jb20vanAvdG10cy8nK3R2SWQrJy8nK3ZpZCsnLycsXG4gICAgICBqc29ucDogdHJ1ZSxcbiAgICAgIHBhcmFtOiBwYXJhbSxcbiAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAocnMpIHtcbiAgICAgICAgdmFyIHNvdXJjZSA9IFtdICAgICAgXG4gICAgICAgIGlmIChycy5kYXRhLnZpZGwgJiYgcnMuZGF0YS52aWRsWzBdICYmIHJzLmRhdGEudmlkbFswXS5tM3UpIHtcbiAgICAgICAgICBzb3VyY2UgPSBycy5kYXRhLnZpZGxcbiAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgdmFyIHZEYXRhID0gZm9ybWF0VmQoZGF0YS52ZClcbiAgICAgICAgICAgICAgdkRhdGEubTN1ID0gZGF0YS5tM3VcbiAgICAgICAgICAgICAgcmV0dXJuIHZEYXRhO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5zb3J0KGZ1bmN0aW9uIChkYXRhQSwgZGF0YUIpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGRhdGFCLmluZGV4IC0gZGF0YUEuaW5kZXhcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgIHJldHVybiBbZGF0YS50ZXh0LCBkYXRhLm0zdV1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHJzLmRhdGEubTN1Lmxlbmd0aCA+IDApIHNvdXJjZSA9IFtbJ+agh+a4hScsIHJzLmRhdGEubTN1XV1cbiAgICAgICAgfVxuICAgICAgICBjYWxsYmFjayhzb3VyY2UpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGlmICh3aW5kb3cud2VvcmpqaWdoKSB7XG4gICAgZ2V0VmlkZW9VUkwoKVxuICB9IGVsc2Uge1xuICAgIHZhciBodHRwUHJveHlPcHRzID0ge3RleHQ6IHRydWUsIHVhOiAnTW96aWxsYS81LjAgKGlQYWQ7IENQVSBpUGhvbmUgT1MgOF8xIGxpa2UgTWFjIE9TIFgpIEFwcGxlV2ViS2l0LzYwMC4xLjQgKEtIVE1MLCBsaWtlIEdlY2tvKSBWZXJzaW9uLzguMCBNb2JpbGUvMTJCNDEwIFNhZmFyaS82MDAuMS40J31cbiAgICBodHRwUHJveHkobG9jYXRpb24uaHJlZiwgJ2dldCcsIHt9LCBmdW5jdGlvbihycykge1xuICAgICAgdmFyIG0gPSBycy5tYXRjaCgvPHNjcmlwdFtePl0qPlxccyooZXZhbC4qOylcXHMqKD89PFxcL3NjcmlwdD4pPFxcL3NjcmlwdD4vKVxuICAgICAgd2luZG93Ll9fcWx0ID0gd2luZG93Ll9fcWx0IHx8IHtNQU1BMlBsYWNlSG9sZGVyOiB0cnVlfVxuICAgICAgd2luZG93LlFQID0gd2luZG93LlFQIHx8IHt9XG4gICAgICB3aW5kb3cuUVAuX3JlYWR5ID0gZnVuY3Rpb24gKGUpIHtpZih0aGlzLl9pc1JlYWR5KXtlJiZlKCl9ZWxzZXtlJiZ0aGlzLl93YWl0cy5wdXNoKGUpfX1cbiAgICAgIGV2YWwobVsxXSlcbiAgICAgIHdpbmRvdy53ZW9yamppZ2ggPSB3ZW9yamppZ2hcbiAgICAgIGdldFZpZGVvVVJMKClcbiAgICB9LCBodHRwUHJveHlPcHRzKVxuICB9XG59XG4iLCIvKiAg56eS5ouNXG4gKiAgQOacseS4gFxuICovXG52YXIgY2FuUGxheU0zVTggPSByZXF1aXJlKCcuL2NhblBsYXlNM1U4JylcbnZhciBxdWVyeVN0cmluZyA9IHJlcXVpcmUoJy4vcXVlcnlTdHJpbmcnKVxudmFyIGh0dHBQcm94eSA9IHJlcXVpcmUoJy4vaHR0cFByb3h5JylcbnZhciBsb2cgPSByZXF1aXJlKCcuL2xvZycpXG5cblxuZXhwb3J0cy5tYXRjaCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgcmV0dXJuIC9cXC5taWFvcGFpXFwuY29tXFwvc2hvdy8udGVzdCh1cmwuYXR0cignc291cmNlJykpXG59XG5cbmV4cG9ydHMuZ2V0VmlkZW9zID0gZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHtcbiAgdmFyIGh0dHBQcm94eU9wdHMgPSB7dGV4dDogdHJ1ZSwgdWE6ICdNb3ppbGxhLzUuMCAoaVBhZDsgQ1BVIGlQaG9uZSBPUyA4XzEgbGlrZSBNYWMgT1MgWCkgQXBwbGVXZWJLaXQvNjAwLjEuNCAoS0hUTUwsIGxpa2UgR2Vja28pIFZlcnNpb24vOC4wIE1vYmlsZS8xMkI0MTAgU2FmYXJpLzYwMC4xLjQnfSAgXG4gIGh0dHBQcm94eShsb2NhdGlvbi5ocmVmLCAnZ2V0Jywge30sIGZ1bmN0aW9uKHJzKSB7XG4gICAgdmFyIHVybCA9IHJzLm1hdGNoKC88dmlkZW8oPzouKj8pc3JjPVtcXFwiXFwnXSguKz8pW1xcXCJcXCddKD8hPCkoPzouKilcXD4oPzpbXFxuXFxyXFxzXSo/KSg/OjxcXC92aWRlbz4pKi8pXG4gICAgaWYgKHVybCAmJiB1cmxbMV0pIGNhbGxiYWNrKFtbJ+enkuaLjScsIHVybFsxXV1dKVxuICB9LCBodHRwUHJveHlPcHRzKVxufSIsIi8qICBwYW5kYXR2XG4gKlxuICogIEBwY3piXG4gKi9cbnZhciBsb2cgICAgICAgPSByZXF1aXJlKCcuL2xvZycpXG52YXIgY2FuUGxheU0zVTggPSByZXF1aXJlKCcuL2NhblBsYXlNM1U4JylcbnZhciBhamF4ID0gcmVxdWlyZSgnLi9hamF4JylcbnZhciBodHRwUHJveHkgPSByZXF1aXJlKCcuL2h0dHBQcm94eScpXG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAvXmh0dHBcXDpcXC9cXC93d3dcXC5wYW5kYVxcLnR2XFwvWzAtOV0rJC8udGVzdChsb2NhdGlvbi5ocmVmKVxufVxuXG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG4gIGlmKCFjYW5QbGF5TTNVOCl7XG4gICAgbG9nKCd1c2Ugc2FmYXJpIHBsZWFzZScpXG4gICAgY2FsbGJhY2soZmFsc2UpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHZhciByb29tX2lkID0gdXJsLmF0dHIoJ3BhdGgnKS5tYXRjaCgvXlxcLyhbMC05XSspJC8pWzFdXG4gIHZhciBtM3U4X2FwaSA9ICdodHRwOi8vcm9vbS5hcGkubS5wYW5kYS50di9pbmRleC5waHA/bWV0aG9kPXJvb20uc2hhcmVhcGkmcm9vbWlkPSdcbiAgaHR0cFByb3h5KFxuICAgICAgICBtM3U4X2FwaSArIHJvb21faWQsXG4gICAgICAgIFwiR0VUXCIsXG4gICAgICAgIHt9LFxuICAgICAgICBmdW5jdGlvbihyZXN1bHQpe1xuICAgICAgICAgIGlmKHJlc3VsdCA9PT0gLTEpe1xuICAgICAgICAgICAgY2FsbGJhY2soZmFsc2UpXG4gICAgICAgICAgfVxuICAgICAgICAgIGpzb25vYmogPSBldmFsKHJlc3VsdClcbiAgICAgICAgICBpZihqc29ub2JqLmVycm5vID09IDAgJiYganNvbm9iai5kYXRhLnZpZGVvaW5mby5hZGRyZXNzICE9IFwiXCIpe1xuICAgICAgICAgICAgdmFyIGFycnkgPSBuZXcgQXJyYXkoKVxuICAgICAgICAgICAgdmFyIGJhc2VhZGRyID0ganNvbm9iai5kYXRhLnZpZGVvaW5mby5hZGRyZXNzO1xuICAgICAgICAgICAgYXJyeS5wdXNoKFsn6LaF5riFJywgYmFzZWFkZHIucmVwbGFjZSgnX3NtYWxsXFwubTN1OCcsIFwiXFwubTN1OFwiKV0pXG4gICAgICAgICAgICBhcnJ5LnB1c2goWyfpq5jmuIUnLCBiYXNlYWRkci5yZXBsYWNlKCdfc21hbGxcXC5tM3U4JywgXCJfbWlkXFwubTN1OFwiKV0pXG4gICAgICAgICAgICBhcnJ5LnB1c2goWyfmoIfmuIUnLCBiYXNlYWRkcl0pXG4gICAgICAgICAgICBjYWxsYmFjayhhcnJ5KVxuICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGZhbHNlKVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbn1cbiIsIi8qICB0dWRvdSBcbiAqICBA5pyx5LiAXG4gKi9cbnZhciBjYW5QbGF5TTNVOCA9IHJlcXVpcmUoJy4vY2FuUGxheU0zVTgnKVxudmFyIGFqYXggICAgICAgID0gcmVxdWlyZSgnLi9hamF4JylcbnZhciBsb2cgICAgICAgICA9IHJlcXVpcmUoJy4vbG9nJylcbnZhciB5b3VrdSAgICAgICA9IHJlcXVpcmUoJy4vc2Vla2VyX3lvdWt1JylcblxuZXhwb3J0cy5tYXRjaCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgdmFyIF9pZCA9IHdpbmRvdy5paWQgfHwgKHdpbmRvdy5wYWdlQ29uZmlnICYmIHdpbmRvdy5wYWdlQ29uZmlnLmlpZCkgfHwgKHdpbmRvdy5pdGVtRGF0YSAmJiB3aW5kb3cuaXRlbURhdGEuaWlkKVxuICB2YXIgeW91a3VDb2RlID0gd2luZG93Lml0ZW1EYXRhICYmIHdpbmRvdy5pdGVtRGF0YS52Y29kZVxuICByZXR1cm4gL3R1ZG91XFwuY29tLy50ZXN0KHVybC5hdHRyKCdob3N0JykpICYmICh5b3VrdUNvZGUgfHwgX2lkKVxufVxuXG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7ICBcbiAgdmFyIHlvdWt1Q29kZSA9IHdpbmRvdy5pdGVtRGF0YSAmJiB3aW5kb3cuaXRlbURhdGEudmNvZGVcbiAgaWYgKHlvdWt1Q29kZSkge1xuICAgIHJldHVybiB5b3VrdS5wYXJzZVlvdWt1Q29kZSh5b3VrdUNvZGUsIGNhbGxiYWNrKVxuICB9XG4gIHZhciBfaWQgPSB3aW5kb3cuaWlkIHx8ICh3aW5kb3cucGFnZUNvbmZpZyAmJiB3aW5kb3cucGFnZUNvbmZpZy5paWQpIHx8ICh3aW5kb3cuaXRlbURhdGEgJiYgd2luZG93Lml0ZW1EYXRhLmlpZCk7XG4gIHZhciBtM3U4ID0gZnVuY3Rpb24oY2FsbGJhY2speyAgICBcbiAgICB2YXIgdXJscyA9IFtcbiAgICAgIFsn5Y6f55S7JywgJ2h0dHA6Ly92ci50dWRvdS5jb20vdjJwcm94eS92Mi5tM3U4P2l0PScgKyBfaWQgKyAnJnN0PTUnXSxcbiAgICAgIFsn6LaF5riFJywgJ2h0dHA6Ly92ci50dWRvdS5jb20vdjJwcm94eS92Mi5tM3U4P2l0PScgKyBfaWQgKyAnJnN0PTQnXSxcbiAgICAgIFsn6auY5riFJywgJ2h0dHA6Ly92ci50dWRvdS5jb20vdjJwcm94eS92Mi5tM3U4P2l0PScgKyBfaWQgKyAnJnN0PTMnXSxcbiAgICAgIFsn5qCH5riFJywgJ2h0dHA6Ly92ci50dWRvdS5jb20vdjJwcm94eS92Mi5tM3U4P2l0PScgKyBfaWQgKyAnJnN0PTInXVxuICAgIF1cbiAgICB2YXIgX3NcbiAgICBpZih3aW5kb3cuaXRlbURhdGEgJiYgd2luZG93Lml0ZW1EYXRhLnNlZ3Mpe1xuICAgICAgdXJscyA9IFtdXG4gICAgICBfcyAgID0gSlNPTi5wYXJzZSh3aW5kb3cuaXRlbURhdGEuc2VncylcbiAgICAgIGlmKF9zWzVdKSB1cmxzLnB1c2goWyfljp/nlLsnLCAnaHR0cDovL3ZyLnR1ZG91LmNvbS92MnByb3h5L3YyLm0zdTg/aXQ9JyArIF9pZCArICcmc3Q9NSddKVxuICAgICAgaWYoX3NbNF0pIHVybHMucHVzaChbJ+i2hea4hScsICdodHRwOi8vdnIudHVkb3UuY29tL3YycHJveHkvdjIubTN1OD9pdD0nICsgX2lkICsgJyZzdD00J10pXG4gICAgICBpZihfc1szXSkgdXJscy5wdXNoKFsn6auY5riFJywgJ2h0dHA6Ly92ci50dWRvdS5jb20vdjJwcm94eS92Mi5tM3U4P2l0PScgKyBfaWQgKyAnJnN0PTMnXSlcbiAgICAgIGlmKF9zWzJdKSB1cmxzLnB1c2goWyfmoIfmuIUnLCAnaHR0cDovL3ZyLnR1ZG91LmNvbS92MnByb3h5L3YyLm0zdTg/aXQ9JyArIF9pZCArICcmc3Q9MiddKVxuICAgIH0gICBcbiAgICBsb2coJ+ino+aekHR1ZG916KeG6aKR5Zyw5Z2A5oiQ5YqfICcgKyB1cmxzLm1hcChmdW5jdGlvbiAoaXRlbSkge3JldHVybiAnPGEgaHJlZj0nK2l0ZW1bMV0rJz4nK2l0ZW1bMF0rJzwvYT4nfSkuam9pbignICcpLCAyKVxuICAgIGNhbGxiYWNrKHVybHMpXG4gIH07XG4gIHZhciBtcDQgPSBmdW5jdGlvbihjYWxsYmFjayl7XG4gICAgYWpheCh7XG4gICAgICB1cmw6ICdodHRwOi8vdnIudHVkb3UuY29tL3YycHJveHkvdjIuanMnLFxuICAgICAgcGFyYW06IHtcbiAgICAgICAgaXQ6IF9pZCxcbiAgICAgICAgc3Q6ICc1MiUyQzUzJTJDNTQnXG4gICAgICB9LFxuICAgICAganNvbnA6ICdqc29ucCcsXG4gICAgICBjYWxsYmFjazogZnVuY3Rpb24ocGFyYW0pe1xuICAgICAgICBpZihwYXJhbSA9PT0gLTEgfHwgcGFyYW0uY29kZSA9PSAtMSkgcmV0dXJuIGxvZygn6Kej5p6QdHVkb3Xop4bpopHlnLDlnYDlpLHotKUnKVxuICAgICAgICBmb3IodmFyIHVybHM9W10saT0wLGxlbj1wYXJhbS51cmxzLmxlbmd0aDsgaTxsZW47IGkrKyl7IHVybHMucHVzaChbaSwgcGFyYW0udXJsc1tpXV0pOyB9XG4gICAgICAgIGxvZygn6Kej5p6QdHVkb3Xop4bpopHlnLDlnYDmiJDlip8gJyArIHVybHMubWFwKGZ1bmN0aW9uIChpdGVtKSB7cmV0dXJuICc8YSBocmVmPScraXRlbVsxXSsnPicraXRlbVswXSsnPC9hPid9KS5qb2luKCcgJyksIDIpXG4gICAgICAgIHJldHVybiBjYWxsYmFjayh1cmxzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbiAgY2FuUGxheU0zVTggPyBtM3U4KGNhbGxiYWNrKSA6IG1wNChjYWxsYmFjaylcbn0iLCJ2YXIgbG9nID0gcmVxdWlyZSgnLi9sb2cnKTtcbnZhciBhamF4ID0gcmVxdWlyZSgoJy4vYWpheCcpKTtcblxuXG4vLyDmgqjlpb3vvJpcbi8vIFx05oiR5piv5LiA5ZCN5YmN56uv5Yid5a2m6ICF77yM5rC05bmz5pyJ6ZmQ77yM6L+Y6K+36KeB6LCF44CCXG4vLyBcdOS7peS4i+aYr+WtmOWcqOeahOS4gOS6m+mXrumimO+8jOaIkeWni+e7iOayoeiDveino+WGs++8jOS4jeefpemBk+i/mOacieayoeacieWPr+eUqOS7t+WAvO+8jOWmguaenOWunuWcqOmavuWgqu+8jOWwseivt+W/veeVpei/meS4quiEmuacrOWQp+OAglxuXG4vLyBcdFx0MSDku47nvZHnq5nmi7/liLDnmoRoNei1hOa6kOWfuuacrOmDveaYr2ZsduagvOW8j++8jOWwkeaVsOS8muWRmOe6p+WIq+eahOaYr01QNOagvOW8j++8jOS4jei/h+WunumZhea1i+ivlWZsduagvOW8j+aSreaUvuaXtueahOi1hOa6kOWNoOeUqOeOh+S4jeaYr+W+iOWkmu+8m1xuLy8gXHRcdDIg57uP5bi45Ye6546w5LiA5Lya6IO95pKt5pS+5LiA5Lya5LiN6IO95pKt55qE6Zeu6aKY77yM5Y2z5L2/5piv5ZCM5LiA5Liq6KeG6aKR77yM54S26ICM5Zyo5Zyw5Z2A5qCP5Lit5omT5byA5oC75piv5Y+v5Lul5pKt5pS+44CC5Y+v6IO955Sx5LqOc291cmNlbWFw5Zyo5oiR55qE5py65a2Q5LiK5pyJ54K56Zeu6aKY77yM5peg5rOV5a6a5L2N5Yiw5YW35L2T5Ye66ZSZ55qE5Zyw5pa577yM5omA5Lul5oiR5Lmf5LiN55+l6YGT5Y+R55Sf5LqG5LuA5LmI44CCXG5cdFxuLy8gIOm6u+eDpuaCqOS6hlxuLy8gXHTogZTns7vmlrnlvI/vvJptaGNncnFAZ21haWwuY29tXG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAodXJsKSB7XG4gIGxvZyh1cmwuYXR0cignaG9zdCcpLmluZGV4T2YoJ3YueWlueXVldGFpLmNvbScpID49IDAgJiYgL15cXC92aWRlb1xcL1xcZCsvLnRlc3QodXJsLmF0dHIoJ2RpcmVjdG9yeScpKSk7XG4gIC8vIGxvZygvXlxcL3ZpZGVvXFwvaDVcXC9cXGQrLy50ZXN0KHVybC5hdHRyKCdkaXJlY3RvcnknKSkpO1xuICAvLyBsb2codXJsLmF0dHIoJ2RpcmVjdG9yeScpKTtcbiAgcmV0dXJuIHVybC5hdHRyKCdob3N0JykuaW5kZXhPZigndi55aW55dWV0YWkuY29tJykgPj0gMCAmJiAvXlxcL3ZpZGVvXFwvXFxkKy8udGVzdCh1cmwuYXR0cignZGlyZWN0b3J5JykpO1xufVxuXG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG5cdHZhciBoNSA9IFwiaHRtbDVcIjtcblx0dmFyIHZpZCA9IC9cXGQrJC8uZXhlYyh1cmwuYXR0cignZGlyZWN0b3J5JykpO1xuXHR2YXIgdHMgPSsgKG5ldyBEYXRlKTtcblx0dmFyIHVybCA9ICdodHRwOi8vZXh0Lnlpbnl1ZXRhaS5jb20vbWFpbi9nZXQtaC1tdi1pbmZvP2pzb249dHJ1ZSZ2aWRlb0lkPScgKyB2aWQgKyAnJl89JyArIHRzO1xuXHQgLy8gKyAnJnY9JyArIGg1XG5cblx0dmFyIGRhdGEgPSBbXTtcblxuXHRhamF4KHtcblx0XHR1cmw6IHVybCxcblx0XHRqc29ucDogdHJ1ZSxcblx0XHRjYWxsYmFjazogZnVuY3Rpb24ocmVzKSB7XG5cdFx0XHRjb25zb2xlLmxvZyhyZXMpO1xuXHRcdFx0dmFyIHZpZGVvID0gcmVzLnZpZGVvSW5mby5jb3JlVmlkZW9JbmZvLnZpZGVvVXJsTW9kZWxzO1xuXHRcdFx0dmFyIG1vZGUgPSBbJ+aZrua4hScsICfpq5jmuIUnLCAn6LaF5riFJywgJ+S8muWRmCddO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2aWRlby5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHR2YXIgaW5kZXggPSB2aWRlb1tpXS52aWRlb1VybC5zZWFyY2goLyhmbHZ8bXA0KS8pICsgMztcblx0XHRcdFx0ZGF0YS5wdXNoKFttb2RlW2ldLCB2aWRlb1tpXS52aWRlb1VybC5zbGljZSgwLCBpbmRleCldKTtcblx0XHRcdH1cblx0XHRcdGNvbnNvbGUubG9nKGRhdGEpO1xuXHRcdFx0Y2FsbGJhY2soZGF0YSk7XG5cdFx0fVxuXHR9KTtcbn1cblxuLy9cdOWwkeaVsOaDheWGteS4i+S8muWHuueOsOWmguS4i+mUmeivr++8jOebruWJjeS4jea4healmuaYr+aAjuS5iOWbnuS6i++8jOacieaXtuWAmeWHuueOsOi/meenjeaDheWGteWQju+8jOmHjeaWsOaJk+W8gOS4gOmBjeWwseWPiOWPr+S7peaSreaUvuS6hlxuLy8gR0VUIGh0dHA6Ly8xMjAuMTkyLjI0OS4yMjA6OTA5MC9kYXRhNC8xL2MvM2EvYy9hMzhkZjk5N2ZlY2M4MmQyNTE0ODJiNGJjZjZjM2FjMS9oYy55aW55dWV0YWkuY29tL0NERDgwMTU0MzZDNEVBRkVENDkyOTBGRTFBQTE2NDQ5LmZsdj90eXBlPWRhdGEgNDA0IChOb3QgRm91bmQpXG4vLyBpbmRleC5qczo0ODAgVW5jYXVnaHQgKGluIHByb21pc2UpIERPTUV4Y2VwdGlvbjogVGhlIGVsZW1lbnQgaGFzIG5vIHN1cHBvcnRlZCBzb3VyY2VzLlxuIiwiLyogIHlvdWt1IFxuICogIEDmnLHkuIBcbiAqL1xudmFyIGNhblBsYXlNM1U4ID0gcmVxdWlyZSgnLi9jYW5QbGF5TTNVOCcpXG52YXIgYWpheCAgICAgICAgPSByZXF1aXJlKCcuL2FqYXgnKVxudmFyIGxvZyAgICAgICAgID0gcmVxdWlyZSgnLi9sb2cnKVxuXG5cbnZhciBkaWMgPSBbMTksIDEsIDQsIDcsIDMwLCAxNCwgMjgsIDgsIDI0LCAxNywgNiwgMzUsIDM0LCAxNiwgOSwgMTAsIDEzLCAyMiwgMzIsIDI5LCAzMSwgMjEsIDE4LCAzLCAyLCAyMywgMjUsIDI3LCAxMSwgMjAsIDUsIDE1LCAxMiwgMCwgMzMsIDI2XVxudmFyIG1rID0ge2EzOiAnYjRldCcsIGE0OiAnYm9hNCd9XG52YXIgdXNlckNhY2hlID0geyBhMTogXCI0XCIsIGEyOiBcIjFcIiB9XG5cbmZ1bmN0aW9uIHVybFBhcmFtZXRlciAocXVlcnkpIHtcbiAgICB2YXIgc2VhcmNoID0gW11cbiAgICBmb3IgKHZhciBpdGVtIGluIHF1ZXJ5KSBzZWFyY2gucHVzaChpdGVtICsgXCI9XCIgKyBxdWVyeVtpdGVtXSlcbiAgICByZXR1cm4gc2VhcmNoLmpvaW4oXCImXCIpXG59XG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAodXJsKSB7XG4gIHJldHVybiAvdlxcLnlvdWt1XFwuY29tLy50ZXN0KHVybC5hdHRyKCdob3N0JykpICYmICEhd2luZG93LnZpZGVvSWRcbn1cbmV4cG9ydHMucGFyc2VZb3VrdUNvZGUgPSBmdW5jdGlvbiAodmlkZW9JZCwgY2FsbGJhY2spIHtcbiAgYWpheCh7XG4gICAgdXJsOiAnaHR0cDovL3BsYXkueW91a3UuY29tL3BsYXkvZ2V0Lmpzb24/dmlkPScgKyB2aWRlb0lkICsgJyZjdD0xMicsIGpzb25wOiB0cnVlLFxuICAgIGNhbGxiYWNrOiBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgIGlmKHBhcmFtID09IC0xKSBsb2coJ+ino+aekHlvdWt16KeG6aKR5Zyw5Z2A5aSx6LSlJywgMilcbiAgICAgIHZhciBkYXRhID0gcGFyYW0uZGF0YTsgICAgICAgICAgICBcbiAgICAgIFxuICAgICAgdmFyIHNpZF90b2tlbiA9IHJjNCh0cmFuc2xhdGUobWsuYTMgKyBcIm8wYlwiICsgdXNlckNhY2hlLmExLCBkaWMpLnRvU3RyaW5nKCksIGRlY29kZTY0KGRhdGEuc2VjdXJpdHkuZW5jcnlwdF9zdHJpbmcpKS5zcGxpdChcIl9cIik7XG4gICAgICB1c2VyQ2FjaGUuc2lkID0gc2lkX3Rva2VuWzBdO1xuICAgICAgdXNlckNhY2hlLnRva2VuID0gc2lkX3Rva2VuWzFdOyBcblxuICAgICAgaWYgKCBjYW5QbGF5TTNVOCApIHtcbiAgICAgICAgdmFyIHVybHF1ZXJ5ID0ge1xuICAgICAgICAgIHZpZDogd2luZG93LnZpZGVvSWQsXG4gICAgICAgICAgdHlwZTogJ1tbdHlwZV1dJyxcbiAgICAgICAgICB0czogcGFyc2VJbnQoKG5ldyBEYXRlKS5nZXRUaW1lKCkgLyAxZTMpLFxuICAgICAgICAgIGtleWZyYW1lOiAwLFxuICAgICAgICAgIGVwOiBlbmNvZGVVUklDb21wb25lbnQoZW5jb2RlNjQocmM0KHRyYW5zbGF0ZShtay5hNCArIFwicG96XCIgKyB1c2VyQ2FjaGUuYTIsIGRpYykudG9TdHJpbmcoKSwgdXNlckNhY2hlLnNpZCArIFwiX1wiICsgdmlkZW9JZCArIFwiX1wiICsgdXNlckNhY2hlLnRva2VuKSkpLFxuICAgICAgICAgIHNpZDogdXNlckNhY2hlLnNpZCxcbiAgICAgICAgICB0b2tlbjogdXNlckNhY2hlLnRva2VuLFxuICAgICAgICAgIGN0eXBlOiAxMixcbiAgICAgICAgICBldjogMSxcbiAgICAgICAgICBvaXA6IGRhdGEuc2VjdXJpdHkuaXAsXG4gICAgICAgICAgY2xpZW50X2lkOiBcInlvdWt1bW9iaWxlcGxheXBhZ2VcIlxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHZpZGVvU291cmNlID0gXCJodHRwOi8vcGwueW91a3UuY29tL3BsYXlsaXN0L20zdTg/XCIgKyB1cmxQYXJhbWV0ZXIodXJscXVlcnkpO1xuICAgICAgICBjYWxsYmFjayhbXG4gICAgICAgICAgWyfotoXmuIUnLCB2aWRlb1NvdXJjZS5yZXBsYWNlKCdbW3R5cGVdXScsICdoZDInKV0sXG4gICAgICAgICAgWyfpq5jmuIUnLCB2aWRlb1NvdXJjZS5yZXBsYWNlKCdbW3R5cGVdXScsICdtcDQnKV0sXG4gICAgICAgICAgWyfmoIfmuIUnLCB2aWRlb1NvdXJjZS5yZXBsYWNlKCdbW3R5cGVdXScsICdmbHYnKV1cbiAgICAgICAgXSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBwbGF5TGlzdERhdGEgPSBuZXcgUGxheUxpc3REYXRhKGRhdGEsIGRhdGEuc3RyZWFtLCAnbXA0JylcbiAgICAgICAgY29uc29sZS5sb2cocGxheUxpc3REYXRhLl92aWRlb1NlZ3NEaWMuc3RyZWFtcylcbiAgICAgICAgY2FsbGJhY2soW1sn5qCH5riFJywgcGxheUxpc3REYXRhLl92aWRlb1NlZ3NEaWMuc3RyZWFtc1snZ3VveXUnXVsnM2dwaGQnXVswXS5zcmNdXSlcbiAgICAgIH1cbiAgICB9XG4gIH0pXG59XG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG4gIGV4cG9ydHMucGFyc2VZb3VrdUNvZGUod2luZG93LnZpZGVvSWQsIGNhbGxiYWNrKVxufVxuXG4vL+S8mOmFt+iHquW3seWKoOWvhueul+azlVxuZnVuY3Rpb24gZGVjb2RlNjQoYSkge1xuICBpZiAoIWEpXG4gICAgcmV0dXJuIFwiXCI7XG4gIGEgPSBhLnRvU3RyaW5nKCk7XG4gIHZhciBiLCBjLCBkLCBlLCBmLCBnLCBoLCBpID0gbmV3IEFycmF5KC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCA2MiwgLTEsIC0xLCAtMSwgNjMsIDUyLCA1MywgNTQsIDU1LCA1NiwgNTcsIDU4LCA1OSwgNjAsIDYxLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSwgMTYsIDE3LCAxOCwgMTksIDIwLCAyMSwgMjIsIDIzLCAyNCwgMjUsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIDI2LCAyNywgMjgsIDI5LCAzMCwgMzEsIDMyLCAzMywgMzQsIDM1LCAzNiwgMzcsIDM4LCAzOSwgNDAsIDQxLCA0MiwgNDMsIDQ0LCA0NSwgNDYsIDQ3LCA0OCwgNDksIDUwLCA1MSwgLTEsIC0xLCAtMSwgLTEsIC0xKTtcbiAgZm9yIChnID0gYS5sZW5ndGgsIGYgPSAwLCBoID0gXCJcIjsgZyA+IGY7KSB7XG4gICAgZG9cbiAgICAgIGIgPSBpWzI1NSAmIGEuY2hhckNvZGVBdChmKyspXTtcbiAgICB3aGlsZSAoZyA+IGYgJiYgLTEgPT0gYik7XG4gICAgaWYgKC0xID09IGIpXG4gICAgICBicmVhaztcbiAgICBkb1xuICAgICAgYyA9IGlbMjU1ICYgYS5jaGFyQ29kZUF0KGYrKyldO1xuICAgIHdoaWxlIChnID4gZiAmJiAtMSA9PSBjKTtcbiAgICBpZiAoLTEgPT0gYylcbiAgICAgIGJyZWFrO1xuICAgIGggKz0gU3RyaW5nLmZyb21DaGFyQ29kZShiIDw8IDIgfCAoNDggJiBjKSA+PiA0KTtcbiAgICBkbyB7XG4gICAgICBpZiAoZCA9IDI1NSAmIGEuY2hhckNvZGVBdChmKyspLCA2MSA9PSBkKVxuICAgICAgICByZXR1cm4gaDtcbiAgICAgIGQgPSBpW2RdXG4gICAgfVxuICAgIHdoaWxlIChnID4gZiAmJiAtMSA9PSBkKTtcbiAgICBpZiAoLTEgPT0gZClcbiAgICAgIGJyZWFrO1xuICAgIGggKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoMTUgJiBjKSA8PCA0IHwgKDYwICYgZCkgPj4gMik7XG4gICAgZG8ge1xuICAgICAgaWYgKGUgPSAyNTUgJiBhLmNoYXJDb2RlQXQoZisrKSwgNjEgPT0gZSlcbiAgICAgICAgcmV0dXJuIGg7XG4gICAgICBlID0gaVtlXVxuICAgIH1cbiAgICB3aGlsZSAoZyA+IGYgJiYgLTEgPT0gZSk7XG4gICAgaWYgKC0xID09IGUpXG4gICAgICBicmVhaztcbiAgICBoICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKDMgJiBkKSA8PCA2IHwgZSlcbiAgfVxuICByZXR1cm4gaFxufVxuXG5mdW5jdGlvbiBlbmNvZGU2NChhKSB7XG4gIGlmICghYSlcbiAgICByZXR1cm4gXCJcIjtcbiAgYSA9IGEudG9TdHJpbmcoKTtcbiAgdmFyIGIsIGMsIGQsIGUsIGYsIGcsIGggPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIjtcbiAgZm9yIChkID0gYS5sZW5ndGgsIGMgPSAwLCBiID0gXCJcIjsgZCA+IGM7KSB7XG4gICAgaWYgKGUgPSAyNTUgJiBhLmNoYXJDb2RlQXQoYysrKSwgYyA9PSBkKSB7XG4gICAgICBiICs9IGguY2hhckF0KGUgPj4gMiksIGIgKz0gaC5jaGFyQXQoKDMgJiBlKSA8PCA0KSwgYiArPSBcIj09XCI7XG4gICAgICBicmVha1xuICAgIH1cbiAgICBpZiAoZiA9IGEuY2hhckNvZGVBdChjKyspLCBjID09IGQpIHtcbiAgICAgIGIgKz0gaC5jaGFyQXQoZSA+PiAyKSwgYiArPSBoLmNoYXJBdCgoMyAmIGUpIDw8IDQgfCAoMjQwICYgZikgPj4gNCksIGIgKz0gaC5jaGFyQXQoKDE1ICYgZikgPDwgMiksIGIgKz0gXCI9XCI7XG4gICAgICBicmVha1xuICAgIH1cbiAgICBnID0gYS5jaGFyQ29kZUF0KGMrKyksIGIgKz0gaC5jaGFyQXQoZSA+PiAyKSwgYiArPSBoLmNoYXJBdCgoMyAmIGUpIDw8IDQgfCAoMjQwICYgZikgPj4gNCksIGIgKz0gaC5jaGFyQXQoKDE1ICYgZikgPDwgMiB8ICgxOTIgJiBnKSA+PiA2KSwgYiArPSBoLmNoYXJBdCg2MyAmIGcpXG4gIH1cbiAgcmV0dXJuIGJcbn1cblxuZnVuY3Rpb24gcmM0KGEsIGIpIHtcbiAgZm9yICh2YXIgYywgZCA9IFtdLCBlID0gMCwgZiA9IFwiXCIsIGcgPSAwOyAyNTYgPiBnOyBnKyspXG4gICAgZFtnXSA9IGc7XG4gIGZvciAoZyA9IDA7IDI1NiA+IGc7IGcrKylcbiAgICBlID0gKGUgKyBkW2ddICsgYS5jaGFyQ29kZUF0KGcgJSBhLmxlbmd0aCkpICUgMjU2LCBjID0gZFtnXSwgZFtnXSA9IGRbZV0sIGRbZV0gPSBjO1xuICBnID0gMCwgZSA9IDA7XG4gIGZvciAodmFyIGggPSAwOyBoIDwgYi5sZW5ndGg7IGgrKylcbiAgICBnID0gKGcgKyAxKSAlIDI1NiwgZSA9IChlICsgZFtnXSkgJSAyNTYsIGMgPSBkW2ddLCBkW2ddID0gZFtlXSwgZFtlXSA9IGMsIGYgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShiLmNoYXJDb2RlQXQoaCkgXiBkWyhkW2ddICsgZFtlXSkgJSAyNTZdKTtcbiAgcmV0dXJuIGZcbn1cblxuZnVuY3Rpb24gdHJhbnNsYXRlKGEsIGIpIHtcbiAgZm9yICh2YXIgYyA9IFtdLCBkID0gMDsgZCA8IGEubGVuZ3RoOyBkKyspIHtcbiAgICB2YXIgZSA9IDA7XG4gICAgZSA9IGFbZF0gPj0gXCJhXCIgJiYgYVtkXSA8PSBcInpcIiA/IGFbZF0uY2hhckNvZGVBdCgwKSAtIFwiYVwiLmNoYXJDb2RlQXQoMCkgOiBhW2RdIC0gXCIwXCIgKyAyNjtcbiAgICBmb3IgKHZhciBmID0gMDsgMzYgPiBmOyBmKyspXG4gICAgICBpZiAoYltmXSA9PSBlKSB7XG4gICAgICAgIGUgPSBmO1xuICAgICAgICBicmVha1xuICAgICAgfVxuICAgIGUgPiAyNSA/IGNbZF0gPSBlIC0gMjYgOiBjW2RdID0gU3RyaW5nLmZyb21DaGFyQ29kZShlICsgOTcpXG4gIH1cbiAgcmV0dXJuIGMuam9pbihcIlwiKVxufVxuXG4vL21wNCDojrflj5bmkq3mlL7lnLDlnYBcbmZ1bmN0aW9uIFBsYXlMaXN0RGF0YSAoYSwgYiwgYykge1xuICB2YXIgZCA9IHRoaXM7XG4gIG5ldyBEYXRlO1xuICB0aGlzLl9zaWQgPSB1c2VyQ2FjaGUuc2lkLCB0aGlzLl9maWxlVHlwZSA9IGMsIHRoaXMuX3ZpZGVvU2Vnc0RpYyA9IHt9O1xuICB0aGlzLl9pcCA9IGEuc2VjdXJpdHkuaXA7XG4gIHZhciBlID0gKG5ldyBSYW5kb21Qcm94eSwgW10pLFxuICAgIGYgPSBbXTtcbiAgZi5zdHJlYW1zID0ge30sIGYubG9nb3MgPSB7fSwgZi50eXBlQXJyID0ge30sIGYudG90YWxUaW1lID0ge307XG4gIGZvciAodmFyIGcgPSAwOyBnIDwgYi5sZW5ndGg7IGcrKykge1xuICAgIGZvciAodmFyIGggPSBiW2ddLmF1ZGlvX2xhbmcsIGkgPSAhMSwgaiA9IDA7IGogPCBlLmxlbmd0aDsgaisrKVxuICAgICAgaWYgKGVbal0gPT0gaCkge1xuICAgICAgICBpID0gITA7XG4gICAgICAgIGJyZWFrXG4gICAgICB9XG4gICAgaSB8fCBlLnB1c2goaClcbiAgfVxuICBmb3IgKHZhciBnID0gMDsgZyA8IGUubGVuZ3RoOyBnKyspIHtcbiAgICBmb3IgKHZhciBrID0gZVtnXSwgbCA9IHt9LCBtID0ge30sIG4gPSBbXSwgaiA9IDA7IGogPCBiLmxlbmd0aDsgaisrKSB7XG4gICAgICB2YXIgbyA9IGJbal07XG4gICAgICBpZiAoayA9PSBvLmF1ZGlvX2xhbmcpIHtcbiAgICAgICAgaWYgKCFkLmlzVmFsaWRUeXBlKG8uc3RyZWFtX3R5cGUpKVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB2YXIgcCA9IGQuY29udmVydFR5cGUoby5zdHJlYW1fdHlwZSksXG4gICAgICAgICAgcSA9IDA7XG4gICAgICAgIFwibm9uZVwiICE9IG8ubG9nbyAmJiAocSA9IDEpLCBtW3BdID0gcTtcbiAgICAgICAgdmFyIHIgPSAhMTtcbiAgICAgICAgZm9yICh2YXIgcyBpbiBuKVxuICAgICAgICAgIHAgPT0gbltzXSAmJiAociA9ICEwKTtcbiAgICAgICAgciB8fCBuLnB1c2gocCk7XG4gICAgICAgIHZhciB0ID0gby5zZWdzO1xuICAgICAgICBpZiAobnVsbCA9PSB0KVxuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB2YXIgdSA9IFtdO1xuICAgICAgICByICYmICh1ID0gbFtwXSk7XG4gICAgICAgIGZvciAodmFyIHYgPSAwOyB2IDwgdC5sZW5ndGg7IHYrKykge1xuICAgICAgICAgIHZhciB3ID0gdFt2XTtcbiAgICAgICAgICBpZiAobnVsbCA9PSB3KVxuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgdmFyIHggPSB7fTtcbiAgICAgICAgICB4Lm5vID0gdiwgXG4gICAgICAgICAgeC5zaXplID0gdy5zaXplLCBcbiAgICAgICAgICB4LnNlY29uZHMgPSBOdW1iZXIody50b3RhbF9taWxsaXNlY29uZHNfdmlkZW8pIC8gMWUzLCBcbiAgICAgICAgICB4Lm1pbGxpc2Vjb25kc192aWRlbyA9IE51bWJlcihvLm1pbGxpc2Vjb25kc192aWRlbykgLyAxZTMsIFxuICAgICAgICAgIHgua2V5ID0gdy5rZXksIHguZmlsZUlkID0gdGhpcy5nZXRGaWxlSWQoby5zdHJlYW1fZmlsZWlkLCB2KSwgXG4gICAgICAgICAgeC5zcmMgPSB0aGlzLmdldFZpZGVvU3JjKGosIHYsIGEsIG8uc3RyZWFtX3R5cGUsIHguZmlsZUlkKSwgXG4gICAgICAgICAgeC50eXBlID0gcCwgXG4gICAgICAgICAgdS5wdXNoKHgpXG4gICAgICAgIH1cbiAgICAgICAgbFtwXSA9IHVcbiAgICAgIH1cbiAgICB9XG4gICAgdmFyIHkgPSB0aGlzLmxhbmdDb2RlVG9DTihrKS5rZXk7XG4gICAgZi5sb2dvc1t5XSA9IG0sIGYuc3RyZWFtc1t5XSA9IGwsIGYudHlwZUFyclt5XSA9IG4gICAgICAgIFxuICB9XG4gIHRoaXMuX3ZpZGVvU2Vnc0RpYyA9IGYsIHRoaXMuX3ZpZGVvU2Vnc0RpYy5sYW5nID0gdGhpcy5sYW5nQ29kZVRvQ04oZVswXSkua2V5XG59XG5cbmZ1bmN0aW9uIFJhbmRvbVByb3h5IChhKSB7XG4gIHRoaXMuX3JhbmRvbVNlZWQgPSBhLCB0aGlzLmNnX2h1bigpXG59O1xuUmFuZG9tUHJveHkucHJvdG90eXBlID0ge1xuICBjZ19odW46IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX2NnU3RyID0gXCJcIjtcbiAgICBmb3IgKHZhciBhID0gXCJhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ekFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaL1xcXFw6Ll8tMTIzNDU2Nzg5MFwiLCBiID0gYS5sZW5ndGgsIGMgPSAwOyBiID4gYzsgYysrKSB7XG4gICAgICB2YXIgZCA9IHBhcnNlSW50KHRoaXMucmFuKCkgKiBhLmxlbmd0aCk7XG4gICAgICB0aGlzLl9jZ1N0ciArPSBhLmNoYXJBdChkKSwgYSA9IGEuc3BsaXQoYS5jaGFyQXQoZCkpLmpvaW4oXCJcIilcbiAgICB9XG4gIH0sXG4gIGNnX2Z1bjogZnVuY3Rpb24oYSkge1xuICAgIGZvciAodmFyIGIgPSBhLnNwbGl0KFwiKlwiKSwgYyA9IFwiXCIsIGQgPSAwOyBkIDwgYi5sZW5ndGggLSAxOyBkKyspXG4gICAgICBjICs9IHRoaXMuX2NnU3RyLmNoYXJBdChiW2RdKTtcbiAgICByZXR1cm4gY1xuICB9LFxuICByYW46IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9yYW5kb21TZWVkID0gKDIxMSAqIHRoaXMuX3JhbmRvbVNlZWQgKyAzMDAzMSkgJSA2NTUzNiwgdGhpcy5fcmFuZG9tU2VlZCAvIDY1NTM2XG4gIH1cbiAgfSwgUGxheUxpc3REYXRhLnByb3RvdHlwZSA9IHtcbiAgZ2V0RmlsZUlkOiBmdW5jdGlvbihhLCBiKSB7XG4gICAgaWYgKG51bGwgPT0gYSB8fCBcIlwiID09IGEpXG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB2YXIgYyA9IFwiXCIsXG4gICAgICBkID0gYS5zbGljZSgwLCA4KSxcbiAgICAgIGUgPSBiLnRvU3RyaW5nKDE2KTtcbiAgICAxID09IGUubGVuZ3RoICYmIChlID0gXCIwXCIgKyBlKSwgZSA9IGUudG9VcHBlckNhc2UoKTtcbiAgICB2YXIgZiA9IGEuc2xpY2UoMTAsIGEubGVuZ3RoKTtcbiAgICByZXR1cm4gYyA9IGQgKyBlICsgZlxuICB9LFxuICBpc1ZhbGlkVHlwZTogZnVuY3Rpb24oYSkge1xuICAgIHJldHVybiBcIjNncGhkXCIgPT0gYSB8fCBcImZsdlwiID09IGEgfHwgXCJmbHZoZFwiID09IGEgfHwgXCJtcDRoZFwiID09IGEgfHwgXCJtcDRoZDJcIiA9PSBhIHx8IFwibXA0aGQzXCIgPT0gYSA/ICEwIDogITFcbiAgfSxcbiAgY29udmVydFR5cGU6IGZ1bmN0aW9uKGEpIHtcbiAgICB2YXIgYiA9IGE7XG4gICAgc3dpdGNoIChhKSB7XG4gICAgICBjYXNlIFwibTN1OFwiOlxuICAgICAgICBiID0gXCJtcDRcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiM2dwaGRcIjpcbiAgICAgICAgYiA9IFwiM2dwaGRcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZmx2XCI6XG4gICAgICAgIGIgPSBcImZsdlwiO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJmbHZoZFwiOlxuICAgICAgICBiID0gXCJmbHZcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwibXA0aGRcIjpcbiAgICAgICAgYiA9IFwibXA0XCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcIm1wNGhkMlwiOlxuICAgICAgICBiID0gXCJoZDJcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwibXA0aGQzXCI6XG4gICAgICAgIGIgPSBcImhkM1wiXG4gICAgfVxuICAgIHJldHVybiBiXG4gIH0sXG4gIGxhbmdDb2RlVG9DTjogZnVuY3Rpb24oYSkge1xuICAgIHZhciBiID0gXCJcIjtcbiAgICBzd2l0Y2ggKGEpIHtcbiAgICAgIGNhc2UgXCJkZWZhdWx0XCI6XG4gICAgICAgIGIgPSB7XG4gICAgICAgICAga2V5OiBcImd1b3l1XCIsXG4gICAgICAgICAgdmFsdWU6IFwi5Zu96K+tXCJcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiZ3VveXVcIjpcbiAgICAgICAgYiA9IHtcbiAgICAgICAgICBrZXk6IFwiZ3VveXVcIixcbiAgICAgICAgICB2YWx1ZTogXCLlm73or61cIlxuICAgICAgICB9O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ5dWVcIjpcbiAgICAgICAgYiA9IHtcbiAgICAgICAgICBrZXk6IFwieXVlXCIsXG4gICAgICAgICAgdmFsdWU6IFwi57Kk6K+tXCJcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiY2h1YW5cIjpcbiAgICAgICAgYiA9IHtcbiAgICAgICAgICBrZXk6IFwiY2h1YW5cIixcbiAgICAgICAgICB2YWx1ZTogXCLlt53or51cIlxuICAgICAgICB9O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJ0YWlcIjpcbiAgICAgICAgYiA9IHtcbiAgICAgICAgICBrZXk6IFwidGFpXCIsXG4gICAgICAgICAgdmFsdWU6IFwi5Y+w5rm+XCJcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwibWluXCI6XG4gICAgICAgIGIgPSB7XG4gICAgICAgICAga2V5OiBcIm1pblwiLFxuICAgICAgICAgIHZhbHVlOiBcIumXveWNl1wiXG4gICAgICAgIH07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImVuXCI6XG4gICAgICAgIGIgPSB7XG4gICAgICAgICAga2V5OiBcImVuXCIsXG4gICAgICAgICAgdmFsdWU6IFwi6Iux6K+tXCJcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiamFcIjpcbiAgICAgICAgYiA9IHtcbiAgICAgICAgICBrZXk6IFwiamFcIixcbiAgICAgICAgICB2YWx1ZTogXCLml6Xor61cIlxuICAgICAgICB9O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJrclwiOlxuICAgICAgICBiID0ge1xuICAgICAgICAgIGtleTogXCJrclwiLFxuICAgICAgICAgIHZhbHVlOiBcIumfqeivrVwiXG4gICAgICAgIH07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImluXCI6XG4gICAgICAgIGIgPSB7XG4gICAgICAgICAga2V5OiBcImluXCIsXG4gICAgICAgICAgdmFsdWU6IFwi5Y2w5bqmXCJcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwicnVcIjpcbiAgICAgICAgYiA9IHtcbiAgICAgICAgICBrZXk6IFwicnVcIixcbiAgICAgICAgICB2YWx1ZTogXCLkv4Tor61cIlxuICAgICAgICB9O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJmclwiOlxuICAgICAgICBiID0ge1xuICAgICAgICAgIGtleTogXCJmclwiLFxuICAgICAgICAgIHZhbHVlOiBcIuazleivrVwiXG4gICAgICAgIH07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcImRlXCI6XG4gICAgICAgIGIgPSB7XG4gICAgICAgICAga2V5OiBcImRlXCIsXG4gICAgICAgICAgdmFsdWU6IFwi5b636K+tXCJcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwiaXRcIjpcbiAgICAgICAgYiA9IHtcbiAgICAgICAgICBrZXk6IFwiaXRcIixcbiAgICAgICAgICB2YWx1ZTogXCLmhI/or61cIlxuICAgICAgICB9O1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgXCJlc1wiOlxuICAgICAgICBiID0ge1xuICAgICAgICAgIGtleTogXCJlc1wiLFxuICAgICAgICAgIHZhbHVlOiBcIuilv+ivrVwiXG4gICAgICAgIH07XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBcInBvXCI6XG4gICAgICAgIGIgPSB7XG4gICAgICAgICAga2V5OiBcInBvXCIsXG4gICAgICAgICAgdmFsdWU6IFwi6JGh6K+tXCJcbiAgICAgICAgfTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFwidGhcIjpcbiAgICAgICAgYiA9IHtcbiAgICAgICAgICBrZXk6IFwidGhcIixcbiAgICAgICAgICB2YWx1ZTogXCLms7Dor61cIlxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBiXG4gIH0sXG4gIGdldFZpZGVvU3JjOiBmdW5jdGlvbihhLCBiLCBjLCBkLCBlLCBmLCBnKSB7XG4gICAgdmFyIGggPSBjLnN0cmVhbVthXSxcbiAgICAgIGkgPSBjLnZpZGVvLmVuY29kZWlkO1xuICAgIGlmICghaSB8fCAhZClcbiAgICAgIHJldHVybiBcIlwiO1xuICAgIHZhciBqID0ge1xuICAgICAgICBmbHY6IDAsXG4gICAgICAgIGZsdmhkOiAwLFxuICAgICAgICBtcDQ6IDEsXG4gICAgICAgIGhkMjogMixcbiAgICAgICAgXCIzZ3BoZFwiOiAxLFxuICAgICAgICBcIjNncFwiOiAwXG4gICAgICB9LFxuICAgICAgayA9IGpbZF0sXG4gICAgICBsID0ge1xuICAgICAgICBmbHY6IFwiZmx2XCIsXG4gICAgICAgIG1wNDogXCJtcDRcIixcbiAgICAgICAgaGQyOiBcImZsdlwiLFxuICAgICAgICBtcDRoZDogXCJtcDRcIixcbiAgICAgICAgbXA0aGQyOiBcIm1wNFwiLFxuICAgICAgICBcIjNncGhkXCI6IFwibXA0XCIsXG4gICAgICAgIFwiM2dwXCI6IFwiZmx2XCIsXG4gICAgICAgIGZsdmhkOiBcImZsdlwiXG4gICAgICB9LFxuICAgICAgbSA9IGxbZF0sXG4gICAgICBuID0gYi50b1N0cmluZygxNik7XG4gICAgMSA9PSBuLmxlbmd0aCAmJiAobiA9IFwiMFwiICsgbik7XG4gICAgdmFyIG8gPSBoLnNlZ3NbYl0udG90YWxfbWlsbGlzZWNvbmRzX3ZpZGVvIC8gMWUzLFxuICAgICAgcCA9IGguc2Vnc1tiXS5rZXk7XG4gICAgKFwiXCIgPT0gcCB8fCAtMSA9PSBwKSAmJiAocCA9IGgua2V5MiArIGgua2V5MSk7XG4gICAgdmFyIHEgPSBcIlwiO1xuICAgIGMuc2hvdyAmJiAocSA9IGMuc2hvdy5wYXkgPyBcIiZ5cHJlbWl1bT0xXCIgOiBcIiZ5bW92aWU9MVwiKTtcbiAgICB2YXIgciA9IFwiL3BsYXllci9nZXRGbHZQYXRoL3NpZC9cIiArIHVzZXJDYWNoZS5zaWQgKyBcIl9cIiArIG4gKyBcIi9zdC9cIiArIG0gKyBcIi9maWxlaWQvXCIgKyBlICsgXCI/Sz1cIiArIHAgKyBcIiZoZD1cIiArIGsgKyBcIiZteXA9MCZ0cz1cIiArIG8gKyBcIiZ5cHA9MFwiICsgcSxcbiAgICAgIHMgPSBbMTksIDEsIDQsIDcsIDMwLCAxNCwgMjgsIDgsIDI0LCAxNywgNiwgMzUsIDM0LCAxNiwgOSwgMTAsIDEzLCAyMiwgMzIsIDI5LCAzMSwgMjEsIDE4LCAzLCAyLCAyMywgMjUsIDI3LCAxMSwgMjAsIDUsIDE1LCAxMiwgMCwgMzMsIDI2XSxcbiAgICAgIHQgPSBlbmNvZGVVUklDb21wb25lbnQoZW5jb2RlNjQocmM0KHRyYW5zbGF0ZShtay5hNCArIFwicG96XCIgKyB1c2VyQ2FjaGUuYTIsIGRpYykudG9TdHJpbmcoKSwgdXNlckNhY2hlLnNpZCArIFwiX1wiICsgZSArIFwiX1wiICsgdXNlckNhY2hlLnRva2VuKSkpO1xuICAgIHJldHVybiByICs9IFwiJmVwPVwiICsgdCwgciArPSBcIiZjdHlwZT0xMlwiLCByICs9IFwiJmV2PTFcIiwgciArPSBcIiZ0b2tlbj1cIiArIHVzZXJDYWNoZS50b2tlbiwgciArPSBcIiZvaXA9XCIgKyB0aGlzLl9pcCwgciArPSAoZiA/IFwiL3Bhc3N3b3JkL1wiICsgZiA6IFwiXCIpICsgKGcgPyBnIDogXCJcIiksIHIgPSBcImh0dHA6Ly9rLnlvdWt1LmNvbVwiICsgclxuICB9XG59IiwibW9kdWxlLmV4cG9ydHMgPSBbXG4gIHJlcXVpcmUoJy4vc2Vla2VyX2JpbGliaWxpJyksXG4gIHJlcXVpcmUoJy4vc2Vla2VyX3lvdWt1JyksXG4gIHJlcXVpcmUoJy4vc2Vla2VyX3R1ZG91JyksXG4gIHJlcXVpcmUoJy4vc2Vla2VyX2lxaXlpJyksXG4gIHJlcXVpcmUoJy4vc2Vla2VyX2h1bmFudHYnKSxcbiAgcmVxdWlyZSgnLi9zZWVrZXJfYmFpZHVwYW4nKSxcbiAgcmVxdWlyZSgnLi9zZWVrZXJfOTFwb3JuJyksXG4gIHJlcXVpcmUoJy4vc2Vla2VyX3BhbmRhdHYnKSxcbiAgcmVxdWlyZSgnLi9zZWVrZXJfeWlueXVldGFpJyksXG4gIHJlcXVpcmUoJy4vc2Vla2VyX2RvdXl1JyksXG4gIHJlcXVpcmUoJy4vc2Vla2VyX21pYW9wYWknKVxuICAvLyAscmVxdWlyZSgnLi9zZWVrZXJfZXhhbXBsZScpXG5dXG4iXX0=
