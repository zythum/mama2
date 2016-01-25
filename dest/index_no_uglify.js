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
		innerHTML: '<a style="color:#555555;" href="http://zythum.sinaapp.com/mama2/" target="_blank">MAMA2: \u5988\u5988\u518d\u4e5f\u4e0d\u7528\u62c5\u5fc3\u6211\u7684macbook\u53d1\u70ed\u8ba1\u5212</a>',
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
	for(var i=0,len=embeds.length; i<len; i++)	embeds[i] && parseFlash(embeds[i]);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvYWpheC5qcyIsInNyYy9jYW5QbGF5TTNVOC5qcyIsInNyYy9jcmVhdGVFbGVtZW50LmpzIiwic3JjL2ZsYXNoQmxvY2tlci5qcyIsInNyYy9nZXRDb29raWUuanMiLCJzcmMvaHR0cFByb3h5LmpzIiwic3JjL2pzb25wLmpzIiwic3JjL2xvZy5qcyIsInNyYy9tYW1hS2V5LmpzIiwic3JjL25vb3AuanMiLCJzcmMvcGxheWVyLmpzIiwic3JjL3B1cmwuanMiLCJzcmMvcXVlcnlTdHJpbmcuanMiLCJzcmMvc2Vla2VyXzkxcG9ybi5qcyIsInNyYy9zZWVrZXJfYmlsaWJpbGkuanMiLCJzcmMvc2Vla2VyX2ZsdnNwLmpzIiwic3JjL3NlZWtlcl9odW5hbnR2LmpzIiwic3JjL3NlZWtlcl9pcWl5aS5qcyIsInNyYy9zZWVrZXJfdHVkb3UuanMiLCJzcmMvc2Vla2VyX3lvdWt1LmpzIiwic3JjL3NlZWtlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdlpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBmbGFzaEJsb2NrZXIgID0gcmVxdWlyZSgnLi9mbGFzaEJsb2NrZXInKVxudmFyIGNyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKCcuL2NyZWF0ZUVsZW1lbnQnKVxudmFyIE1BTUFQbGF5ZXIgICAgPSByZXF1aXJlKCcuL3BsYXllcicpXG52YXIgbG9nICAgICAgICAgICA9IHJlcXVpcmUoJy4vbG9nJylcbnZhciBwdXJsICAgICAgICAgID0gcmVxdWlyZSgnLi9wdXJsJylcbnZhciBtYW1hS2V5ICAgICAgID0gcmVxdWlyZSgnLi9tYW1hS2V5JylcbnZhciBzZWVrZXJzICAgICAgID0gcmVxdWlyZSgnLi9zZWVrZXJzJylcbnZhciBmbHZzcCAgICAgICAgID0gcmVxdWlyZSgnLi9zZWVrZXJfZmx2c3AnKTtcbnZhciBtYXRjaGVkXG5cbmlmICh3aW5kb3dbbWFtYUtleV0gIT0gdHJ1ZSkge1xuXG5mdW5jdGlvbiBzZWVrZWQgKHNvdXJjZSwgY29tbWVudHMpIHtcblx0aWYgKCFzb3VyY2UpIHtcblx0XHRsb2coJ+ino+aekOWGheWuueWcsOWdgOWksei0pScsIDIpXG5cdFx0ZGVsZXRlIHdpbmRvd1ttYW1hS2V5XVxuXHRcdHJldHVyblxuXHR9XHRcblx0bG9nKCfop6PmnpDlhoXlrrnlnLDlnYDlrozmiJAnK3NvdXJjZS5tYXAoZnVuY3Rpb24gKGkpIHtyZXR1cm4gJzxhIGhyZWY9XCInK2lbMV0rJ1wiIHRhcmdldD1cIl9ibGFua1wiPicraVswXSsnPC9hPid9KS5qb2luKCcgJyksIDIpXG5cdHZhciBtYXNrID0gY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuXHRcdGFwcGVuZFRvOiBkb2N1bWVudC5ib2R5LFxuXHRcdHN0eWxlOiB7XG5cdFx0XHRwb3NpdGlvbjogJ2ZpeGVkJyxcblx0XHRcdGJhY2tncm91bmQ6ICdyZ2JhKDAsMCwwLDAuOCknLFxuXHRcdFx0dG9wOiAnMCcsXG5cdFx0XHRsZWZ0OiAnMCcsXG5cdFx0XHR3aWR0aDogJzEwMCUnLFxuXHRcdFx0aGVpZ2h0OiAnMTAwJScsXG5cdFx0XHR6SW5kZXg6ICc5OTk5OTknXG5cdFx0fVxuXHR9KVxuXHRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG5cdFx0YXBwZW5kVG86IG1hc2ssXG5cdFx0c3R5bGU6IHtcblx0XHRcdHdpZHRoOiAnMTAwMHB4Jyxcblx0XHRcdGhlaWdodDogJzUwMHB4Jyxcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuXHRcdFx0dG9wOiAnNTAlJyxcblx0XHRcdGxlZnQ6ICc1MCUnLFxuXHRcdFx0bWFyZ2luVG9wOiAnLTI1MHB4Jyxcblx0XHRcdG1hcmdpbkxlZnQ6ICctNTAwcHgnLFxuXHRcdFx0Ym9yZGVyUmFkaXVzOiAnMnB4Jyxcblx0XHRcdGJveFNoYWRvdzogJzAgMCAycHggIzAwMDAwMCwgMCAwIDIwMHB4ICMwMDAwMDAnLFxuXHRcdH1cblx0fSlcblx0Y3JlYXRlRWxlbWVudCgnZGl2Jywge1xuXHRcdGFwcGVuZFRvOiBtYXNrLFxuXHRcdGlubmVySFRNTDogJzxhIHN0eWxlPVwiY29sb3I6IzU1NTU1NTtcIiBocmVmPVwiaHR0cDovL3p5dGh1bS5zaW5hYXBwLmNvbS9tYW1hMi9cIiB0YXJnZXQ9XCJfYmxhbmtcIj5NQU1BMjog5aaI5aaI5YaN5Lmf5LiN55So5ouF5b+D5oiR55qEbWFjYm9va+WPkeeDreiuoeWIkjwvYT4nLFxuXHRcdHN0eWxlOiB7XG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcblx0XHRcdGJvdHRvbTogJzEwcHgnLFxuXHRcdFx0bGVmdDogJzAnLFxuXHRcdFx0cmlnaHQ6ICcwJyxcblx0XHRcdGhlaWdodDogJzIwcHgnLFxuXHRcdFx0bGluZUhlaWdodDogJzIwcHgnLFxuXHRcdFx0dGV4dEFsaWduOiAnY2VudGVyJyxcblx0XHRcdGZvbnRTaXplOicxMnB4Jyxcblx0XHRcdGZvbnRGYW1pbHk6ICdhcmlhbCwgc2Fucy1zZXJpZidcblx0XHR9XG5cdH0pXG5cdHZhciBjb250YWluZXIgPSBjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG5cdFx0YXBwZW5kVG86IG1hc2ssXG5cdFx0aW5uZXJIVE1MOiAnPGRpdiBpZD1cIk1BTUEyX3ZpZGVvX3BsYWNlSG9sZGVyXCI+PC9kaXY+Jyxcblx0XHRzdHlsZToge1xuXHRcdFx0d2lkdGg6ICcxMDAwcHgnLFxuXHRcdFx0aGVpZ2h0OiAnNTAwcHgnLFxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6ICcjMDAwMDAwJyxcblx0XHRcdHRvcDogJzUwJScsXG5cdFx0XHRsZWZ0OiAnNTAlJyxcblx0XHRcdG1hcmdpblRvcDogJy0yNTBweCcsXG5cdFx0XHRtYXJnaW5MZWZ0OiAnLTUwMHB4Jyxcblx0XHRcdGJvcmRlclJhZGl1czogJzJweCcsXG5cdFx0XHRvdmVyZmxvdzogJ2hpZGRlbidcblx0XHR9XG5cdH0pXG5cdGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcblx0XHRhcHBlbmRUbzogY29udGFpbmVyLFxuXHRcdGlubmVySFRNTDogJyZ0aW1lczsnLFxuXHRcdHN0eWxlOiB7XG5cdFx0XHR3aWR0aDogJzIwcHgnLFxuXHRcdFx0aGVpZ2h0OiAnMjBweCcsXG5cdFx0XHRsaW5lSGVpZ2h0OiAnMjBweCcsXG5cdFx0XHR0ZXh0QWxpZ246ICdjZW50ZXInLFxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXG5cdFx0XHRjb2xvcjogJyNmZmZmZmYnLFxuXHRcdFx0Zm9udFNpemU6ICcyMHB4Jyxcblx0XHRcdHRvcDogJzVweCcsXG5cdFx0XHRyaWdodDogJzVweCcsXG5cdFx0XHR0ZXh0U2hhZG93OiAnMCAwIDJweCAjMDAwMDAwJyxcblx0XHRcdGZvbnRXZWlnaHQ6ICdib2xkJyxcblx0XHRcdGZvbnRGYW1pbHk6ICdHYXJhbW9uZCwgXCJBcHBsZSBHYXJhbW9uZFwiJyxcblx0XHRcdGN1cnNvcjogJ3BvaW50ZXInXG5cdFx0fVxuXHR9KS5vbmNsaWNrID0gZnVuY3Rpb24gKCkge1xuXHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQobWFzaylcblx0XHRwbGF5ZXIudmlkZW8uc3JjID0gJ2Fib3V0OmJsYW5rJ1xuXHRcdGRlbGV0ZSB3aW5kb3dbbWFtYUtleV1cblx0fVxuXHR2YXIgcGxheWVyID0gbmV3IE1BTUFQbGF5ZXIoJ01BTUEyX3ZpZGVvX3BsYWNlSG9sZGVyJywgJzEwMDB4NTAwJywgc291cmNlLCBjb21tZW50cylcblx0cGxheWVyLmlmcmFtZS5jb250ZW50V2luZG93LmZvY3VzKClcblx0Zmxhc2hCbG9ja2VyKClcblx0cGxheWVyLmlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ2Jsb2NrJ1xuXHR3aW5kb3dbbWFtYUtleV0gPSB0cnVlXG59XG5cbnZhciB1cmwgPSBwdXJsKGxvY2F0aW9uLmhyZWYpXG5pZiAodXJsLmF0dHIoJ2hvc3QnKSA9PT0gJ3p5dGh1bS5zaW5hYXBwLmNvbScgJiYgXG5cdHVybC5hdHRyKCdkaXJlY3RvcnknKSA9PT0gJy9tYW1hMi9wczQvJyAmJiB1cmwucGFyYW0oJ3VybCcpICkge1xuXHR1cmwgPSBwdXJsKHVybC5wYXJhbSgndXJsJykpXG59XG5cbnNlZWtlcnMuZm9yRWFjaChmdW5jdGlvbiAoc2Vla2VyKSB7XG5cdGlmIChtYXRjaGVkID09PSB0cnVlKSByZXR1cm5cblx0aWYgKCEhc2Vla2VyLm1hdGNoKHVybCkgPT09IHRydWUpIHtcblx0XHRsb2coJ+W8gOWni+ino+aekOWGheWuueWcsOWdgCcpXG5cdFx0bWF0Y2hlZCA9IHRydWVcblx0XHRzZWVrZXIuZ2V0VmlkZW9zKHVybCwgc2Vla2VkKVx0XHRcblx0fVxufSlcblxuaWYgKG1hdGNoZWQgPT09IHVuZGVmaW5lZCkge1xuXHRsb2coJ+WwneivleS9v+eUqDxhIHRhcmdldD1cIl9ibGFua1wiIGhyZWY9XCJodHRwOi8vd2VpYm8uY29tL2p1c3Rhc2hpdFwiPuS4gOeOr+WQjOWtpjwvYT7mj5DkvpvnmoTop6PmnpDmnI3liqEnLCAyKVxuXHRmbHZzcC5nZXRWaWRlb3ModXJsLCBzZWVrZWQpXG59XG5cbn0iLCIvKiAg77yDZnVuY3Rpb24gYWpheCNcbiAqICA8IHtcbiAqICAgIHVybDogICAgICAgICAgU3RyaW5nICAg6K+35rGC5Zyw5Z2AXG4gKiAgICBwYXJhbTogICAgICAgIE9iamVjdCAgIOivt+axguWPguaVsC7lj6/nvLrnnIFcbiAqICAgIG1ldGhvZDogICAgICAgU3RyaW5nICAg6K+35rGC5pa55rOVR0VULFBPU1QsZXRjLiDlj6/nvLrnnIHvvIzpu5jorqTmmK9HRVQgXG4gKiAgICBjYWxsYmFjazogICAgIEZ1bmN0aW9uIOivt+axgueahGNhbGxiYWNrLCDlpoLmnpzlpLHotKXov5Tlm57vvI0x77yMIOaIkOWKn+i/lOWbnuWGheWuuVxuICogICAgY29udGVudFR5cGU6ICBTdHJpbmcgICDov5Tlm57lhoXlrrnnmoTmoLzlvI/jgILlpoLmnpzmmK9KT1NO5Lya5YGaSlNPTiBQYXJzZe+8jCDlj6/nvLrnnIEs6buY6K6k5pivanNvblxuICogICAgY29udGV4dDogICAgICBBbnkgICAgICBjYWxsYmFja+Wbnuiwg+WHveaVsOeahHRoaXPmjIflkJHjgILlj6/nvLrnnIFcbiAqICB9XG4gKiAg55So5LqO5Y+R6LW3YWpheOaIluiAhWpzb25w6K+35rGCXG4gKi9cblxudmFyIGpzb25wICAgICAgID0gcmVxdWlyZSgnLi9qc29ucCcpXG52YXIgbm9vcCAgICAgICAgPSByZXF1aXJlKCcuL25vb3AnKVxudmFyIHF1ZXJ5U3RyaW5nID0gcmVxdWlyZSgnLi9xdWVyeVN0cmluZycpXG5cbmZ1bmN0aW9uIGRlZmFsdXRPcHRpb24gKG9wdGlvbiwgZGVmYWx1dFZhbHVlKSB7XG5cdHJldHVybiBvcHRpb24gPT09IHVuZGVmaW5lZCA/IGRlZmFsdXRWYWx1ZSA6IG9wdGlvblxufVxuXG5mdW5jdGlvbiBxdWVyeVN0cmluZyAob2JqKSB7XG5cdHZhciBxdWVyeSA9IFtdXG5cdGZvciAob25lIGluIG9iaikge1xuXHRcdGlmIChvYmouaGFzT3duUHJvcGVydHkob25lKSkge1xuXHRcdFx0cXVlcnkucHVzaChbb25lLCBvYmpbb25lXV0uam9pbignPScpKVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gcXVlcnkuam9pbignJicpXG59XG5cbmZ1bmN0aW9uIGpvaW5VcmwgKHVybCwgcXVlcnlTdHJpbmcpIHtcblx0aWYgKHF1ZXJ5U3RyaW5nLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHVybFxuXHRyZXR1cm4gdXJsICsgKHVybC5pbmRleE9mKCc/JykgPT09IC0xID8gJz8nIDogJyYnKSArIHF1ZXJ5U3RyaW5nXG59XG5cbmZ1bmN0aW9uIGFqYXggKG9wdGlvbnMpIHtcblx0dmFyIHVybCAgICAgICAgID0gZGVmYWx1dE9wdGlvbihvcHRpb25zLnVybCwgJycpXG5cdHZhciBxdWVyeSAgICAgICA9IHF1ZXJ5U3RyaW5nKCBkZWZhbHV0T3B0aW9uKG9wdGlvbnMucGFyYW0sIHt9KSApXG5cdHZhciBtZXRob2QgICAgICA9IGRlZmFsdXRPcHRpb24ob3B0aW9ucy5tZXRob2QsICdHRVQnKVxuXHR2YXIgY2FsbGJhY2sgICAgPSBkZWZhbHV0T3B0aW9uKG9wdGlvbnMuY2FsbGJhY2ssIG5vb3ApXG5cdHZhciBjb250ZW50VHlwZSA9IGRlZmFsdXRPcHRpb24ob3B0aW9ucy5jb250ZW50VHlwZSwgJ2pzb24nKVxuXHR2YXIgY29udGV4dCAgICAgPSBkZWZhbHV0T3B0aW9uKG9wdGlvbnMuY29udGV4dCwgbnVsbClcblxuXHRpZiAob3B0aW9ucy5qc29ucCkge1xuXHRcdHJldHVybiBqc29ucChcblx0XHRcdGpvaW5VcmwodXJsLCBxdWVyeSksXG5cdFx0XHRjYWxsYmFjay5iaW5kKGNvbnRleHQpLFxuXHRcdFx0dHlwZW9mIG9wdGlvbnMuanNvbnAgPT09ICdzdHJpbmcnID8gb3B0aW9ucy5qc29ucCA6IHVuZGVmaW5lZFxuXHRcdClcblx0fVxuXG5cdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKVxuXHRpZiAobWV0aG9kLnRvTG93ZXJDYXNlKCkgPT09ICdnZXQnKSB7XG5cdFx0dXJsID0gam9pblVybCh1cmwsIHF1ZXJ5KVxuXHRcdHF1ZXJ5ID0gJydcblx0fVxuXHR4aHIub3BlbihtZXRob2QsIHVybCwgdHJ1ZSlcblx0eGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnKVxuXHR4aHIuc2VuZChxdWVyeSlcblx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uICgpIHtcblx0XHRpZiAoeGhyLnJlYWR5U3RhdGUgPT09IDQgKSB7XG5cdFx0XHRpZiAoeGhyLnN0YXR1cyA9PT0gMjAwKSB7XG5cdFx0XHRcdHZhciBkYXRhID0geGhyLnJlc3BvbnNlVGV4dFxuXHRcdFx0XHRpZiAoY29udGVudFR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ2pzb24nKSB7XG5cdFx0XHRcdFx0dHJ5IHtcblx0XHRcdFx0XHRcdGRhdGEgPSBKU09OLnBhcnNlKGRhdGEpXG5cdFx0XHRcdFx0fSBjYXRjaChlKSB7XG5cdFx0XHRcdFx0XHRkYXRhID0gLTFcblx0XHRcdFx0XHR9XHRcdFx0XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybiBjYWxsYmFjay5jYWxsKGNvbnRleHQsIGRhdGEpXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY2FsbGJhY2suY2FsbChjb250ZXh0LCAtMSlcblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cbm1vZHVsZS5leHBvcnRzID0gYWpheDtcbiIsIi8qICDvvINCb29sIGNhblBsYXlNM1U477yDXG4gKiAg6L+U5Zue5rWP6KeI5Zmo5piv5ZCm5pSv5oyBbTN1OOagvOW8j+eahOinhumikeaSreaUvuOAglxuICogIOebruWJjWNocm9tZSxmaXJlZm945Y+q5pSv5oyBbXA0XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gISFkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd2aWRlbycpLmNhblBsYXlUeXBlKCdhcHBsaWNhdGlvbi94LW1wZWdVUkwnKSIsIi8qXG4gKiDnlKjkuo7nroDljZXliJvlu7podG1s6IqC54K5XG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQgKHRhZ05hbWUsIGF0dHJpYnV0ZXMpIHtcblx0dmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpXG5cdGlmICggdHlwZW9mIGF0dHJpYnV0ZXMgPT09ICdmdW5jdGlvbicgKSB7XG5cdFx0YXR0cmlidXRlcy5jYWxsKGVsZW1lbnQpXG5cdH0gZWxzZSB7XG5cdFx0Zm9yICh2YXIgYXR0cmlidXRlIGluIGF0dHJpYnV0ZXMpIHtcblx0XHRcdGlmICggYXR0cmlidXRlcy5oYXNPd25Qcm9wZXJ0eShhdHRyaWJ1dGUpICkge1xuXHRcdFx0XHRzd2l0Y2ggKGF0dHJpYnV0ZSkge1xuXHRcdFx0XHRjYXNlICdhcHBlbmRUbyc6XG5cdFx0XHRcdFx0YXR0cmlidXRlc1thdHRyaWJ1dGVdLmFwcGVuZENoaWxkKGVsZW1lbnQpXG5cdFx0XHRcdFx0YnJlYWtcblx0XHRcdFx0Y2FzZSAnaW5uZXJIVE1MJzpcblx0XHRcdFx0Y2FzZSAnY2xhc3NOYW1lJzpcblx0XHRcdFx0Y2FzZSAnaWQnOlxuXHRcdFx0XHRcdGVsZW1lbnRbYXR0cmlidXRlXSA9IGF0dHJpYnV0ZXNbYXR0cmlidXRlXVxuXHRcdFx0XHRcdGJyZWFrXG5cdFx0XHRcdGNhc2UgJ3N0eWxlJzpcblx0XHRcdFx0XHR2YXIgc3R5bGVzID0gYXR0cmlidXRlc1thdHRyaWJ1dGVdXG5cdFx0XHRcdFx0Zm9yICh2YXIgbmFtZSBpbiBzdHlsZXMpXG5cdFx0XHRcdFx0XHRpZiAoIHN0eWxlcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSApXG5cdFx0XHRcdFx0XHRcdGVsZW1lbnQuc3R5bGVbbmFtZV0gPSBzdHlsZXNbbmFtZV1cblx0XHRcdFx0XHRicmVha1xuXHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKGF0dHJpYnV0ZSwgYXR0cmlidXRlc1thdHRyaWJ1dGVdICsgJycpXG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIGVsZW1lbnRcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBjcmVhdGVFbGVtZW50IiwiLyogIFxuICogIOeUqOS6juWxj+iUvemhtemdouS4iueahOaJgOaciWZsYXNoXG4gKi9cbnZhciBmbGFzaFRleHQgPSAnPGRpdiBzdHlsZT1cInRleHQtc2hhZG93OjAgMCAycHggI2VlZTtsZXR0ZXItc3BhY2luZzotMXB4O2JhY2tncm91bmQ6I2VlZTtmb250LXdlaWdodDpib2xkO3BhZGRpbmc6MDtmb250LWZhbWlseTphcmlhbCxzYW5zLXNlcmlmO2ZvbnQtc2l6ZTozMHB4O2NvbG9yOiNjY2M7d2lkdGg6MTUycHg7aGVpZ2h0OjUycHg7Ym9yZGVyOjRweCBzb2xpZCAjY2NjO2JvcmRlci1yYWRpdXM6MTJweDtwb3NpdGlvbjphYnNvbHV0ZTt0b3A6NTAlO2xlZnQ6NTAlO21hcmdpbjotMzBweCAwIDAgLTgwcHg7dGV4dC1hbGlnbjpjZW50ZXI7bGluZS1oZWlnaHQ6NTJweDtcIj5GbGFzaDwvZGl2Pic7XG5cbnZhciBjb3VudCA9IDA7XG52YXIgZmxhc2hCbG9ja3MgPSB7fTtcbi8v54K55Ye75pe26Ze06Kem5Y+RXG52YXIgY2xpY2syU2hvd0ZsYXNoID0gZnVuY3Rpb24oZSl7XG5cdHZhciBpbmRleCA9IHRoaXMuZ2V0QXR0cmlidXRlKCdkYXRhLWZsYXNoLWluZGV4Jyk7XG5cdHZhciBmbGFzaCA9IGZsYXNoQmxvY2tzW2luZGV4XTtcblx0Zmxhc2guc2V0QXR0cmlidXRlKCdkYXRhLWZsYXNoLXNob3cnLCdpc3Nob3cnKTtcblx0dGhpcy5wYXJlbnROb2RlLmluc2VydEJlZm9yZShmbGFzaCwgdGhpcyk7XG5cdHRoaXMucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzKTtcblx0dGhpcy5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIGNsaWNrMlNob3dGbGFzaCwgZmFsc2UpO1xufTtcblxudmFyIGNyZWF0ZUFQbGFjZUhvbGRlciA9IGZ1bmN0aW9uKGZsYXNoLCB3aWR0aCwgaGVpZ2h0KXtcblx0dmFyIGluZGV4ID0gY291bnQrKztcblx0dmFyIHN0eWxlID0gZG9jdW1lbnQuZGVmYXVsdFZpZXcuZ2V0Q29tcHV0ZWRTdHlsZShmbGFzaCwgbnVsbCk7XG5cdHZhciBwb3NpdGlvblR5cGUgPSBzdHlsZS5wb3NpdGlvbjtcblx0XHRwb3NpdGlvblR5cGUgPSBwb3NpdGlvblR5cGUgPT09ICdzdGF0aWMnID8gJ3JlbGF0aXZlJyA6IHBvc2l0aW9uVHlwZTtcblx0dmFyIG1hcmdpbiAgICAgICA9IHN0eWxlWydtYXJnaW4nXTtcblx0dmFyIGRpc3BsYXkgICAgICA9IHN0eWxlWydkaXNwbGF5J10gPT0gJ2lubGluZScgPyAnaW5saW5lLWJsb2NrJyA6IHN0eWxlWydkaXNwbGF5J107XG5cdHZhciBzdHlsZSA9IFtcblx0XHQnJyxcblx0XHQnd2lkdGg6JyAgICArIHdpZHRoICArJ3B4Jyxcblx0XHQnaGVpZ2h0OicgICArIGhlaWdodCArJ3B4Jyxcblx0XHQncG9zaXRpb246JyArIHBvc2l0aW9uVHlwZSxcblx0XHQnbWFyZ2luOicgICArIG1hcmdpbixcblx0XHQnZGlzcGxheTonICArIGRpc3BsYXksXG5cdFx0J21hcmdpbjowJyxcblx0XHQncGFkZGluZzowJyxcblx0XHQnYm9yZGVyOjAnLFxuXHRcdCdib3JkZXItcmFkaXVzOjFweCcsXG5cdFx0J2N1cnNvcjpwb2ludGVyJyxcblx0XHQnYmFja2dyb3VuZDotd2Via2l0LWxpbmVhci1ncmFkaWVudCh0b3AsIHJnYmEoMjQwLDI0MCwyNDAsMSkwJSxyZ2JhKDIyMCwyMjAsMjIwLDEpMTAwJSknLFx0XHRcdFxuXHRcdCcnXG5cdF1cblx0Zmxhc2hCbG9ja3NbaW5kZXhdID0gZmxhc2g7XG5cdHZhciBwbGFjZUhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRwbGFjZUhvbGRlci5zZXRBdHRyaWJ1dGUoJ3RpdGxlJywgJyYjeDcwQjk7JiN4NjIxMTsmI3g4RkQ4OyYjeDUzOUY7Rmxhc2gnKTtcblx0cGxhY2VIb2xkZXIuc2V0QXR0cmlidXRlKCdkYXRhLWZsYXNoLWluZGV4JywgJycgKyBpbmRleCk7XG5cdGZsYXNoLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHBsYWNlSG9sZGVyLCBmbGFzaCk7XG5cdGZsYXNoLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoZmxhc2gpO1xuXHRwbGFjZUhvbGRlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsaWNrMlNob3dGbGFzaCwgZmFsc2UpO1xuXHRwbGFjZUhvbGRlci5zdHlsZS5jc3NUZXh0ICs9IHN0eWxlLmpvaW4oJzsnKTtcblx0cGxhY2VIb2xkZXIuaW5uZXJIVE1MID0gZmxhc2hUZXh0O1xuXHRyZXR1cm4gcGxhY2VIb2xkZXI7XG59O1xuXG52YXIgcGFyc2VGbGFzaCA9IGZ1bmN0aW9uKHRhcmdldCl7XG5cdGlmKHRhcmdldCBpbnN0YW5jZW9mIEhUTUxPYmplY3RFbGVtZW50KSB7XG5cdFx0aWYodGFyZ2V0LmlubmVySFRNTC50cmltKCkgPT0gJycpIHJldHVybjtcblx0XHRpZih0YXJnZXQuZ2V0QXR0cmlidXRlKFwiY2xhc3NpZFwiKSAmJiAhL15qYXZhOi8udGVzdCh0YXJnZXQuZ2V0QXR0cmlidXRlKFwiY2xhc3NpZFwiKSkpIHJldHVybjtcdFx0XHRcblx0fSBlbHNlIGlmKCEodGFyZ2V0IGluc3RhbmNlb2YgSFRNTEVtYmVkRWxlbWVudCkpIHJldHVybjtcblxuXHR2YXIgd2lkdGggPSB0YXJnZXQub2Zmc2V0V2lkdGg7XG5cdHZhciBoZWlnaHQgPSB0YXJnZXQub2Zmc2V0SGVpZ2h0O1x0XHRcblxuXHRpZih3aWR0aCA+IDE2MCAmJiBoZWlnaHQgPiA2MCl7XG5cdFx0Y3JlYXRlQVBsYWNlSG9sZGVyKHRhcmdldCwgd2lkdGgsIGhlaWdodCk7XG5cdH1cbn07XG5cbnZhciBoYW5kbGVCZWZvcmVMb2FkRXZlbnQgPSBmdW5jdGlvbihlKXtcblx0dmFyIHRhcmdldCA9IGUudGFyZ2V0XG5cdGlmKHRhcmdldC5nZXRBdHRyaWJ1dGUoJ2RhdGEtZmxhc2gtc2hvdycpID09ICdpc3Nob3cnKSByZXR1cm47XG5cdHBhcnNlRmxhc2godGFyZ2V0KTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHRcblx0dmFyIGVtYmVkcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdlbWJlZCcpO1xuXHR2YXIgb2JqZWN0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdvYmplY3QnKTtcblx0Zm9yKHZhciBpPTAsbGVuPW9iamVjdHMubGVuZ3RoOyBpPGxlbjsgaSsrKSBvYmplY3RzW2ldICYmIHBhcnNlRmxhc2gob2JqZWN0c1tpXSk7XG5cdGZvcih2YXIgaT0wLGxlbj1lbWJlZHMubGVuZ3RoOyBpPGxlbjsgaSsrKVx0ZW1iZWRzW2ldICYmIHBhcnNlRmxhc2goZW1iZWRzW2ldKTtcbn1cbi8vIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJiZWZvcmVsb2FkXCIsIGhhbmRsZUJlZm9yZUxvYWRFdmVudCwgdHJ1ZSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldENvb2tpZShjX25hbWUpIHtcbiAgICBpZiAoZG9jdW1lbnQuY29va2llLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY19zdGFydCA9IGRvY3VtZW50LmNvb2tpZS5pbmRleE9mKGNfbmFtZSArIFwiPVwiKVxuICAgICAgICBpZiAoY19zdGFydCAhPSAtMSkge1xuICAgICAgICAgICAgY19zdGFydCA9IGNfc3RhcnQgKyBjX25hbWUubGVuZ3RoICsgMVxuICAgICAgICAgICAgY19lbmQgPSBkb2N1bWVudC5jb29raWUuaW5kZXhPZihcIjtcIiwgY19zdGFydClcbiAgICAgICAgICAgIGlmIChjX2VuZCA9PSAtMSkgY19lbmQgPSBkb2N1bWVudC5jb29raWUubGVuZ3RoXG4gICAgICAgICAgICByZXR1cm4gdW5lc2NhcGUoZG9jdW1lbnQuY29va2llLnN1YnN0cmluZyhjX3N0YXJ0LCBjX2VuZCkpXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFwiXCJcbn0iLCIvKiAg77yDZnVuY3Rpb24gaHR0cFByb3h5I1xuICogIDwgU3RyaW5nICAgICAgICDor7fmsYLlnLDlnYBcbiAqICA8IFN0cmluZyAgICAgICAg6K+35rGC5pa55rOVR0VULFBPU1QsZXRjLlxuICogIDwgT2JqZWN0ICAgICAgICDor7fmsYLlj4LmlbBcbiAqICA8IEZ1bmN0aW9uICAgICAg6K+35rGC55qEY2FsbGJhY2ssIOWmguaenOWksei0pei/lOWbnu+8jTHvvIwg5oiQ5Yqf6L+U5Zue5YaF5a65XG4gKiAgPCB7XG4gKiAgICAgIHhtbDogICAgICAgQm9vbCAgIOaYr+WQpumcgOimgeWBmnhtbDJqc29uIOWPr+e8uuecgSwg6buY6K6kZmFzbGVcbiAqICAgICAgZ3ppbmZsYXRlOiBCb29sICAg5piv5ZCm6ZyA6KaB5YGaZ3ppbmZsYXRlIOWPr+e8uuecgSwg6buY6K6kZmFzbGVcbiAqICAgICAgY29udGV4dDogICBBbnkgICAgY2FsbGJhY2vlm57osIPnmoR0aGlz5oyH5ZCRIOWPr+e8uuecgVxuICogICAgfVxuICogIH1cbiAqICDnlKjkuo7lj5Hotbfot6jln5/nmoRhamF46K+35rGC44CC5pei5o6l5Y+j6L+U5Zue6Leo5Z+f5Y+I5LiN5pSv5oyBanNvbnDljY/orq7nmoRcbiAqL1xuXG52YXIgY3JlYXRlRWxlbWVudCA9IHJlcXVpcmUoJy4vY3JlYXRlRWxlbWVudCcpXG52YXIgYWpheCAgICAgICAgICA9IHJlcXVpcmUoJy4vYWpheCcpXG52YXIgcXVlcnlTdHJpbmcgICA9IHJlcXVpcmUoJy4vcXVlcnlTdHJpbmcnKVxuXG52YXIgcHJveHlVcmwgPSAnaHR0cDovL3p5dGh1bS5zaW5hYXBwLmNvbS9tYW1hMi9wcm94eS5waHAnXG5cbmZ1bmN0aW9uIGh0dHBQcm94eSAodXJsLCB0eXBlLCBwYXJhbXMsIGNhbGxiYWNrLCBvcHRzKSB7XG5cdG9wdHMgPSBvcHRzIHx8IHt9XG5cdGFqYXgoe1xuXHRcdHVybDogcHJveHlVcmwsXG5cdFx0cGFyYW0gOiB7XG5cdFx0XHRwYXJhbXM6IGVuY29kZVVSSUNvbXBvbmVudChxdWVyeVN0cmluZyhwYXJhbXMpKSwvL+S4iuihjOWPguaVsFxuXHRcdFx0cmVmZXJyZXI6IG9wdHMucmVmZXJyZXIgfHwgbG9jYXRpb24uaHJlZixcblx0XHRcdHVybDogZW5jb2RlVVJJQ29tcG9uZW50KHVybCksXG5cdFx0XHRwb3N0OiB0eXBlID09PSAncG9zdCcgPyAxIDogMCxcdFx0XHRcblx0XHRcdHhtbDogb3B0cy54bWwgPyAxIDogMCxcblx0XHRcdHRleHQ6IG9wdHMudGV4dCA/IDEgOiAwLFxuXHRcdFx0Z3ppbmZsYXRlOiBvcHRzLmd6aW5mbGF0ZSA/IDEgOiAwLFxuXHRcdFx0dWE6IG9wdHMudWEgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudFxuXHRcdH0sXG5cdFx0anNvbnA6IHRydWUsXG5cdFx0Y2FsbGJhY2s6IGNhbGxiYWNrLFxuXHRcdGNvbnRleHQ6IG9wdHMuY29udGV4dFxuXHR9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGh0dHBQcm94eSIsIi8qICDvvINmdW5jdGlvbiBqc29ucCNcbiAqICBqc29ucOaWueazleOAguaOqOiNkOS9v+eUqGFqYXjmlrnms5XjgIJhamF45YyF5ZCr5LqGanNvbnBcbiAqL1xudmFyIGNyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKCcuL2NyZWF0ZUVsZW1lbnQnKVxudmFyIG5vb3AgICAgICAgICAgPSByZXF1aXJlKCcuL25vb3AnKVxuXG52YXIgY2FsbGJhY2tQcmVmaXggPSAnTUFNQTJfSFRUUF9KU09OUF9DQUxMQkFDSydcbnZhciBjYWxsYmFja0NvdW50ICA9IDBcbnZhciB0aW1lb3V0RGVsYXkgICA9IDEwMDAwXG5cbmZ1bmN0aW9uIGNhbGxiYWNrSGFuZGxlICgpIHtcblx0cmV0dXJuIGNhbGxiYWNrUHJlZml4ICsgY2FsbGJhY2tDb3VudCsrXG59XG5cbmZ1bmN0aW9uIGpzb25wICh1cmwsIGNhbGxiYWNrLCBjYWxsYmFja0tleSkge1xuXG5cdGNhbGxiYWNrS2V5ID0gY2FsbGJhY2tLZXkgfHwgJ2NhbGxiYWNrJ1xuXG5cdHZhciBfY2FsbGJhY2tIYW5kbGUgPSBjYWxsYmFja0hhbmRsZSgpXHRcblx0d2luZG93W19jYWxsYmFja0hhbmRsZV0gPSBmdW5jdGlvbiAocnMpIHtcblx0XHRjbGVhclRpbWVvdXQodGltZW91dFRpbWVyKVxuXHRcdHdpbmRvd1tfY2FsbGJhY2tIYW5kbGVdID0gbm9vcFxuXHRcdGNhbGxiYWNrKHJzKVxuXHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc2NyaXB0KVxuXHR9XG5cdHZhciB0aW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHR3aW5kb3dbX2NhbGxiYWNrSGFuZGxlXSgtMSlcblx0fSwgdGltZW91dERlbGF5KVxuXG5cdHZhciBzY3JpcHQgPSBjcmVhdGVFbGVtZW50KCdzY3JpcHQnLCB7XG5cdFx0YXBwZW5kVG86IGRvY3VtZW50LmJvZHksXG5cdFx0c3JjOiB1cmwgKyAodXJsLmluZGV4T2YoJz8nKSA+PSAwID8gJyYnIDogJz8nKSArIGNhbGxiYWNrS2V5ICsgJz0nICsgX2NhbGxiYWNrSGFuZGxlXG5cdH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0ganNvbnAiLCIvKiAg77yDZnVuY3Rpb24gbG9n77yDXG4gKiAgPCBTdHJpbmdcbiAqICBsb2csIOS8muWcqOmhtemdouWSjGNvbnNvbGXkuK3ovpPlh7psb2dcbiAqL1xuXG52YXIgY3JlYXRlRWxlbWVudCA9IHJlcXVpcmUoJy4vY3JlYXRlRWxlbWVudCcpXG52YXIgTUFNQUxvZ0RPTVxudmFyIGxvZ1RpbWVyXG52YXIgbG9nRGVsYXkgPSAxMDAwMFxuXG5mdW5jdGlvbiBsb2cgKG1zZywgZGVsYXkpIHtcblx0aWYgKCBNQU1BTG9nRE9NID09PSB1bmRlZmluZWQgKSB7XG5cdFx0TUFNQUxvZ0RPTSA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcblx0XHRcdHN0eWxlOiB7XG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogJyMyNDI3MkEnLFxuXHRcdFx0XHRjb2xvcjogJyNmZmZmZmYnLFxuXHRcdFx0XHRwb3NpdGlvbjogJ2ZpeGVkJyxcblx0XHRcdFx0ekluZGV4OiAnMTAwMDAwMCcsXG5cdFx0XHRcdHRvcDogJzAnLFxuXHRcdFx0XHRsZWZ0OiAnMCcsXG5cdFx0XHRcdHBhZGRpbmc6ICc1cHggMTBweCcsXG5cdFx0XHRcdGZvbnRTaXplOiAnMTRweCdcblx0XHRcdH1cblx0XHR9KVxuXHR9XG5cdGNsZWFyVGltZW91dChsb2dUaW1lcilcblx0XG5cdE1BTUFMb2dET00uaW5uZXJIVE1MID0gJzxzcGFuIHN0eWxlPVwiY29sb3I6I0RGNjU1OFwiPk1BTUEyICZndDs8L3NwYW4+ICcgKyBtc2dcblx0Y29uc29sZSAmJiBjb25zb2xlLmxvZyAmJiBjb25zb2xlLmxvZygnJWMgTUFNQTIgJWMgJXMnLCAnYmFja2dyb3VuZDojMjQyNzJBOyBjb2xvcjojZmZmZmZmJywgJycsIG1zZylcblxuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKE1BTUFMb2dET00pXG5cdGxvZ1RpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChNQU1BTG9nRE9NKVxuXHR9LCBkZWxheSoxMDAwIHx8IGxvZ0RlbGF5KVxufVxubW9kdWxlLmV4cG9ydHMgPSBsb2ciLCIvL+WmiOWmiOiuoeWIkuWUr+S4gOWAvFxubW9kdWxlLmV4cG9ydHMgPSAnTUFNQUtFWV/nlLDnkLTmmK/ov5nkuKrkuJbnlYzkuIrmnIDlj6/niLHnmoTlpbPlranlrZDlkbXlkbXlkbXlkbXvvIzmiJHopoHorqnlhajkuJbnlYzpg73lnKjnn6XpgZMnIiwiLy/nqbrmlrnms5Vcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge30iLCJ2YXIgTUFNQVBsYXllcjtcblxuLy8gTUFNQVBsYXllciBcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96eXRodW0vbWFtYXBsYXllclxuIWZ1bmN0aW9uIGUodCxpLG4pe2Z1bmN0aW9uIG8ocixhKXtpZighaVtyXSl7aWYoIXRbcl0pe3ZhciBsPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWEmJmwpcmV0dXJuIGwociwhMCk7aWYocylyZXR1cm4gcyhyLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK3IrXCInXCIpfXZhciBjPWlbcl09e2V4cG9ydHM6e319O3Rbcl1bMF0uY2FsbChjLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIGk9dFtyXVsxXVtlXTtyZXR1cm4gbyhpP2k6ZSl9LGMsYy5leHBvcnRzLGUsdCxpLG4pfXJldHVybiBpW3JdLmV4cG9ydHN9Zm9yKHZhciBzPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUscj0wO3I8bi5sZW5ndGg7cisrKW8obltyXSk7cmV0dXJuIG99KHsxOltmdW5jdGlvbihlLHQpe2Z1bmN0aW9uIGkoZSl7Zm9yKHZhciB0PVtdLGk9MTtpPGFyZ3VtZW50cy5sZW5ndGg7aSsrKXt2YXIgbz1hcmd1bWVudHNbaV0scz1vLmluaXQ7dC5wdXNoKHMpLGRlbGV0ZSBvLmluaXQsbihlLnByb3RvdHlwZSxvKX1lLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7dC5mb3JFYWNoKGZ1bmN0aW9uKGUpe2UuY2FsbCh0aGlzKX0uYmluZCh0aGlzKSl9fXZhciBuPWUoXCIuL2V4dGVuZFwiKTt0LmV4cG9ydHM9aX0se1wiLi9leHRlbmRcIjo5fV0sMjpbZnVuY3Rpb24oZSx0KXt2YXIgaT1lKFwiLi9wbGF5ZXIuY3NzXCIpLG49ZShcIi4vcGxheWVyLmh0bWxcIiksbz0oZShcIi4vZXh0ZW5kXCIpLGUoXCIuL2NyZWF0ZUVsZW1lbnRcIikpLHM9ZShcIi4vcGFyc2VET01CeUNsYXNzTmFtZXNcIik7dC5leHBvcnRzPXtpbml0OmZ1bmN0aW9uKCl7dmFyIGU9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLmlmcmFtZS5jb250ZW50RG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLHQ9dGhpcy5pZnJhbWUuY29udGVudERvY3VtZW50LmJvZHk7byhcInN0eWxlXCIsZnVuY3Rpb24oKXtlLmFwcGVuZENoaWxkKHRoaXMpO3RyeXt0aGlzLnN0eWxlU2hlZXQuY3NzVGV4dD1pfWNhdGNoKHQpe3RoaXMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaSkpfX0pLG8oXCJsaW5rXCIse2FwcGVuZFRvOmUsaHJlZjpcImh0dHA6Ly9saWJzLmNuY2RuLmNuL2ZvbnQtYXdlc29tZS80LjMuMC9jc3MvZm9udC1hd2Vzb21lLm1pbi5jc3NcIixyZWw6XCJzdHlsZXNoZWV0XCIsdHlwZTpcInRleHQvY3NzXCJ9KSx0LmlubmVySFRNTD1uLHRoaXMuRE9Ncz1zKHQsW1wicGxheWVyXCIsXCJ2aWRlb1wiLFwidmlkZW8tZnJhbWVcIixcImNvbW1lbnRzXCIsXCJjb21tZW50cy1idG5cIixcInBsYXlcIixcInByb2dyZXNzX2FuY2hvclwiLFwiYnVmZmVyZWRfYW5jaG9yXCIsXCJmdWxsc2NyZWVuXCIsXCJhbGxzY3JlZW5cIixcImhkXCIsXCJ2b2x1bWVfYW5jaG9yXCIsXCJjdXJyZW50XCIsXCJkdXJhdGlvblwiXSksdGhpcy52aWRlbz10aGlzLkRPTXMudmlkZW99LmJpbmQodGhpcyksdD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKSxyPXRoaXMuaWZyYW1lPW8oXCJpZnJhbWVcIix7YWxsb3dUcmFuc3BhcmVuY3k6ITAsZnJhbWVCb3JkZXI6XCJub1wiLHNjcm9sbGluZzpcIm5vXCIsc3JjOlwiYWJvdXQ6YmxhbmtcIixtb3phbGxvd2Z1bGxzY3JlZW46XCJtb3phbGxvd2Z1bGxzY3JlZW5cIix3ZWJraXRhbGxvd2Z1bGxzY3JlZW46XCJ3ZWJraXRhbGxvd2Z1bGxzY3JlZW5cIixhbGxvd2Z1bGxzY3JlZW46XCJhbGxvd2Z1bGxzY3JlZW5cIixzdHlsZTp7d2lkdGg6dGhpcy5zaXplWzBdK1wicHhcIixoZWlnaHQ6dGhpcy5zaXplWzFdK1wicHhcIixvdmVyZmxvdzpcImhpZGRlblwifX0pO3QmJnQucGFyZW50Tm9kZT8odC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChyLHQpLGUoKSk6KGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQociksZSgpLGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQocikpfX19LHtcIi4vY3JlYXRlRWxlbWVudFwiOjcsXCIuL2V4dGVuZFwiOjksXCIuL3BhcnNlRE9NQnlDbGFzc05hbWVzXCI6MTEsXCIuL3BsYXllci5jc3NcIjoxMixcIi4vcGxheWVyLmh0bWxcIjoxM31dLDM6W2Z1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gaShlKXtlLnN0cm9rZVN0eWxlPVwiYmxhY2tcIixlLmxpbmVXaWR0aD0zLGUuZm9udD0nYm9sZCAyMHB4IFwiUGluZ0hlaVwiLFwiTHVjaWRhIEdyYW5kZVwiLCBcIkx1Y2lkYSBTYW5zIFVuaWNvZGVcIiwgXCJTVEhlaXRpXCIsIFwiSGVsdmV0aWNhXCIsXCJBcmlhbFwiLFwiVmVyZGFuYVwiLFwic2Fucy1zZXJpZlwiJ312YXIgbj0oZShcIi4vY3JlYXRlRWxlbWVudFwiKSwuMSksbz0yNSxzPTRlMyxyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIikuZ2V0Q29udGV4dChcIjJkXCIpO2kocik7dmFyIGE9d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZXx8d2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZXx8d2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZXx8d2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lfHx3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZXx8ZnVuY3Rpb24oZSl7c2V0VGltZW91dChlLDFlMy82MCl9O3QuZXhwb3J0cz17aW5pdDpmdW5jdGlvbigpe3RoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcInBsYXlcIix0aGlzLnJlU3RhcnRDb21tZW50LmJpbmQodGhpcykpLHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcInBhdXNlXCIsdGhpcy5wYXVzZUNvbW1lbnQuYmluZCh0aGlzKSksdGhpcy5sYXN0Q29tbW5ldFVwZGF0ZVRpbWU9MCx0aGlzLmxhc3RDb21tbmV0SW5kZXg9MCx0aGlzLmNvbW1lbnRMb29wUHJlUXVldWU9W10sdGhpcy5jb21tZW50TG9vcFF1ZXVlPVtdLHRoaXMuY29tbWVudEJ1dHRvblByZVF1ZXVlPVtdLHRoaXMuY29tbWVudEJ1dHRvblF1ZXVlPVtdLHRoaXMuY29tbWVudFRvcFByZVF1ZXVlPVtdLHRoaXMuY29tbWVudFRvcFF1ZXVlPVtdLHRoaXMuZHJhd1F1ZXVlPVtdLHRoaXMucHJlUmVuZGVycz1bXSx0aGlzLnByZVJlbmRlck1hcD17fSx0aGlzLmVuYWJsZUNvbW1lbnQ9dm9pZCAwPT09dGhpcy5jb21tZW50cz8hMTohMCx0aGlzLnByZXZEcmF3Q2FudmFzPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiksdGhpcy5jYW52YXM9dGhpcy5ET01zLmNvbW1lbnRzLmdldENvbnRleHQoXCIyZFwiKSx0aGlzLmNvbW1lbnRzJiZ0aGlzLkRPTXMucGxheWVyLmNsYXNzTGlzdC5hZGQoXCJoYXMtY29tbWVudHNcIiksdGhpcy5ET01zW1wiY29tbWVudHMtYnRuXCJdLmNsYXNzTGlzdC5hZGQoXCJlbmFibGVcIiksdGhpcy5ET01zLmNvbW1lbnRzLmRpc3BsYXk9dGhpcy5lbmFibGVDb21tZW50P1wiYmxvY2tcIjpcIm5vbmVcIjt2YXIgZT0wLHQ9ZnVuY3Rpb24oKXsoZT1+ZSkmJnRoaXMub25Db21tZW50VGltZVVwZGF0ZSgpLGEodCl9LmJpbmQodGhpcyk7dCgpfSxuZWVkRHJhd1RleHQ6ZnVuY3Rpb24oZSx0LGkpe3RoaXMuZHJhd1F1ZXVlLnB1c2goW2UsdCxpXSl9LGRyYXdUZXh0OmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5wcmV2RHJhd0NhbnZhcyx0PXRoaXMucHJldkRyYXdDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO2Uud2lkdGg9dGhpcy5jYW52YXNXaWR0aCxlLmhlaWdodD10aGlzLmNhbnZhc0hlaWdodCx0LmNsZWFyUmVjdCgwLDAsdGhpcy5jYW52YXNXaWR0aCx0aGlzLmNhbnZhc0hlaWdodCk7dmFyIG49W107dGhpcy5wcmVSZW5kZXJzLmZvckVhY2goZnVuY3Rpb24oZSx0KXtlLnVzZWQ9ITEsdm9pZCAwPT09ZS5jaWQmJm4ucHVzaCh0KX0pO2Zvcih2YXIgcztzPXRoaXMuZHJhd1F1ZXVlLnNoaWZ0KCk7KSFmdW5jdGlvbihlLHMpe3ZhciByLGE9ZVswXS50ZXh0K2VbMF0uY29sb3IsbD1zLnByZVJlbmRlck1hcFthXTtpZih2b2lkIDA9PT1sKXt2YXIgbD1uLnNoaWZ0KCk7dm9pZCAwPT09bD8ocj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLGw9cy5wcmVSZW5kZXJzLnB1c2gociktMSk6cj1zLnByZVJlbmRlcnNbbF07dmFyIGM9ci53aWR0aD1lWzBdLndpZHRoLGg9ci5oZWlnaHQ9bysxMCxkPXIuZ2V0Q29udGV4dChcIjJkXCIpO2QuY2xlYXJSZWN0KDAsMCxjLGgpLGkoZCksZC5maWxsU3R5bGU9ZVswXS5jb2xvcixkLnN0cm9rZVRleHQoZVswXS50ZXh0LDAsbyksZC5maWxsVGV4dChlWzBdLnRleHQsMCxvKSxyLmNpZD1hLHMucHJlUmVuZGVyTWFwW2FdPWx9ZWxzZSByPXMucHJlUmVuZGVyc1tsXTtyLnVzZWQ9ITAsdC5kcmF3SW1hZ2UocixlWzFdLGVbMl0pfShzLHRoaXMpO3RoaXMucHJlUmVuZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2UudXNlZD09PSExJiYoZGVsZXRlIHRoaXMucHJlUmVuZGVyTWFwW2UuY2lkXSxlLmNpZD12b2lkIDApfS5iaW5kKHRoaXMpKSx0aGlzLmNhbnZhcy5jbGVhclJlY3QoMCwwLHRoaXMuY2FudmFzV2lkdGgsdGhpcy5jYW52YXNIZWlnaHQpLHRoaXMuY2FudmFzLmRyYXdJbWFnZShlLDAsMCl9LGNyZWF0ZUNvbW1lbnQ6ZnVuY3Rpb24oZSx0KXtpZih2b2lkIDA9PT1lKXJldHVybiExO3ZhciBpPXIubWVhc3VyZVRleHQoZS50ZXh0KTtyZXR1cm57c3RhcnRUaW1lOnQsdGV4dDplLnRleHQsY29sb3I6ZS5jb2xvcix3aWR0aDppLndpZHRoKzIwfX0sY29tbWVudFRvcDpmdW5jdGlvbihlLHQsaSl7dGhpcy5jb21tZW50VG9wUXVldWUuZm9yRWFjaChmdW5jdGlvbih0LG4pe3ZvaWQgMCE9dCYmKGk+dC5zdGFydFRpbWUrcz90aGlzLmNvbW1lbnRUb3BRdWV1ZVtuXT12b2lkIDA6dGhpcy5uZWVkRHJhd1RleHQodCwoZS10LndpZHRoKS8yLG8qbikpfS5iaW5kKHRoaXMpKTtmb3IodmFyIG47bj10aGlzLmNvbW1lbnRUb3BQcmVRdWV1ZS5zaGlmdCgpOyluPXRoaXMuY3JlYXRlQ29tbWVudChuLGkpLHRoaXMuY29tbWVudFRvcFF1ZXVlLmZvckVhY2goZnVuY3Rpb24odCxpKXtuJiZ2b2lkIDA9PT10JiYodD10aGlzLmNvbW1lbnRUb3BRdWV1ZVtpXT1uLHRoaXMubmVlZERyYXdUZXh0KHQsKGUtbi53aWR0aCkvMixvKmkpLG49dm9pZCAwKX0uYmluZCh0aGlzKSksbiYmKHRoaXMuY29tbWVudFRvcFF1ZXVlLnB1c2gobiksdGhpcy5uZWVkRHJhd1RleHQobiwoZS1uLndpZHRoKS8yLG8qdGhpcy5jb21tZW50VG9wUXVldWUubGVuZ3RoLTEpKX0sY29tbWVudEJvdHRvbTpmdW5jdGlvbihlLHQsaSl7dC09MTAsdGhpcy5jb21tZW50QnV0dG9uUXVldWUuZm9yRWFjaChmdW5jdGlvbihuLHIpe3ZvaWQgMCE9biYmKGk+bi5zdGFydFRpbWUrcz90aGlzLmNvbW1lbnRCdXR0b25RdWV1ZVtyXT12b2lkIDA6dGhpcy5uZWVkRHJhd1RleHQobiwoZS1uLndpZHRoKS8yLHQtbyoocisxKSkpfS5iaW5kKHRoaXMpKTtmb3IodmFyIG47bj10aGlzLmNvbW1lbnRCdXR0b25QcmVRdWV1ZS5zaGlmdCgpOyluPXRoaXMuY3JlYXRlQ29tbWVudChuLGkpLHRoaXMuY29tbWVudEJ1dHRvblF1ZXVlLmZvckVhY2goZnVuY3Rpb24oaSxzKXtuJiZ2b2lkIDA9PT1pJiYoaT10aGlzLmNvbW1lbnRCdXR0b25RdWV1ZVtzXT1uLHRoaXMubmVlZERyYXdUZXh0KGksKGUtbi53aWR0aCkvMix0LW8qKHMrMSkpLG49dm9pZCAwKX0uYmluZCh0aGlzKSksbiYmKHRoaXMuY29tbWVudEJ1dHRvblF1ZXVlLnB1c2gobiksdGhpcy5uZWVkRHJhd1RleHQobiwoZS1uLndpZHRoKS8yLHQtbyp0aGlzLmNvbW1lbnRCdXR0b25RdWV1ZS5sZW5ndGgpKX0sY29tbWVudExvb3A6ZnVuY3Rpb24oZSx0LGkpe2Zvcih2YXIgcz10L298MCxyPS0xOysrcjxzOyl7dmFyIGE9dGhpcy5jb21tZW50TG9vcFF1ZXVlW3JdO2lmKHZvaWQgMD09PWEmJihhPXRoaXMuY29tbWVudExvb3BRdWV1ZVtyXT1bXSksdGhpcy5jb21tZW50TG9vcFByZVF1ZXVlLmxlbmd0aD4wKXt2YXIgbD0wPT09YS5sZW5ndGg/dm9pZCAwOmFbYS5sZW5ndGgtMV07aWYodm9pZCAwPT09bHx8KGktbC5zdGFydFRpbWUpKm4+bC53aWR0aCl7dmFyIGM9dGhpcy5jcmVhdGVDb21tZW50KHRoaXMuY29tbWVudExvb3BQcmVRdWV1ZS5zaGlmdCgpLGkpO2MmJmEucHVzaChjKX19dGhpcy5jb21tZW50TG9vcFF1ZXVlW3JdPWEuZmlsdGVyKGZ1bmN0aW9uKHQpe3ZhciBzPShpLXQuc3RhcnRUaW1lKSpuO3JldHVybiAwPnN8fHM+dC53aWR0aCtlPyExOih0aGlzLm5lZWREcmF3VGV4dCh0LGUtcyxvKnIpLCEwKX0uYmluZCh0aGlzKSl9Zm9yKHZhciBoPXRoaXMuY29tbWVudExvb3BRdWV1ZS5sZW5ndGgtcztoLS0+MDspdGhpcy5jb21tZW50TG9vcFF1ZXVlLnBvcCgpfSxwYXVzZUNvbW1lbnQ6ZnVuY3Rpb24oKXt0aGlzLnBhdXNlQ29tbWVudEF0PURhdGUubm93KCl9LHJlU3RhcnRDb21tZW50OmZ1bmN0aW9uKCl7aWYodGhpcy5wYXVzZUNvbW1lbnRBdCl7dmFyIGU9RGF0ZS5ub3coKS10aGlzLnBhdXNlQ29tbWVudEF0O3RoaXMuY29tbWVudExvb3BRdWV1ZS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3QuZm9yRWFjaChmdW5jdGlvbih0KXt0JiYodC5zdGFydFRpbWUrPWUpfSl9KSx0aGlzLmNvbW1lbnRCdXR0b25RdWV1ZS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3QmJih0LnN0YXJ0VGltZSs9ZSl9KSx0aGlzLmNvbW1lbnRUb3BRdWV1ZS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3QmJih0LnN0YXJ0VGltZSs9ZSl9KX10aGlzLnBhdXNlQ29tbWVudEF0PXZvaWQgMH0sZHJhd0NvbW1lbnQ6ZnVuY3Rpb24oKXtpZighdGhpcy5wYXVzZUNvbW1lbnRBdCl7dmFyIGU9RGF0ZS5ub3coKSx0PXRoaXMuRE9Nc1tcInZpZGVvLWZyYW1lXCJdLm9mZnNldFdpZHRoLGk9dGhpcy5ET01zW1widmlkZW8tZnJhbWVcIl0ub2Zmc2V0SGVpZ2h0O3QhPXRoaXMuY2FudmFzV2lkdGgmJih0aGlzLkRPTXMuY29tbWVudHMud2lkdGg9dCx0aGlzLmNhbnZhc1dpZHRoPXQpLGkhPXRoaXMuY2FudmFzSGVpZ2h0JiYodGhpcy5ET01zLmNvbW1lbnRzLmhlaWdodD1pLHRoaXMuY2FudmFzSGVpZ2h0PWkpO3ZhciBuPXRoaXMudmlkZW8ub2Zmc2V0V2lkdGgsbz10aGlzLnZpZGVvLm9mZnNldEhlaWdodDt0aGlzLmNvbW1lbnRMb29wKG4sbyxlKSx0aGlzLmNvbW1lbnRUb3AobixvLGUpLHRoaXMuY29tbWVudEJvdHRvbShuLG8sZSksdGhpcy5kcmF3VGV4dCgpfX0sb25Db21tZW50VGltZVVwZGF0ZTpmdW5jdGlvbigpe2lmKHRoaXMuZW5hYmxlQ29tbWVudCE9PSExKXt2YXIgZT10aGlzLnZpZGVvLmN1cnJlbnRUaW1lO2lmKE1hdGguYWJzKGUtdGhpcy5sYXN0Q29tbW5ldFVwZGF0ZVRpbWUpPD0xJiZlPnRoaXMubGFzdENvbW1uZXRVcGRhdGVUaW1lKXt2YXIgdD0wO2Zvcih0aGlzLmxhc3RDb21tbmV0SW5kZXgmJnRoaXMuY29tbWVudHNbdGhpcy5sYXN0Q29tbW5ldEluZGV4XS50aW1lPD10aGlzLmxhc3RDb21tbmV0VXBkYXRlVGltZSYmKHQ9dGhpcy5sYXN0Q29tbW5ldEluZGV4KTsrK3Q8dGhpcy5jb21tZW50cy5sZW5ndGg7KWlmKCEodGhpcy5jb21tZW50c1t0XS50aW1lPD10aGlzLmxhc3RDb21tbmV0VXBkYXRlVGltZSkpe2lmKHRoaXMuY29tbWVudHNbdF0udGltZT5lKWJyZWFrO3N3aXRjaCh0aGlzLmNvbW1lbnRzW3RdLnBvcyl7Y2FzZVwiYm90dG9tXCI6dGhpcy5jb21tZW50QnV0dG9uUHJlUXVldWUucHVzaCh0aGlzLmNvbW1lbnRzW3RdKTticmVhaztjYXNlXCJ0b3BcIjp0aGlzLmNvbW1lbnRUb3BQcmVRdWV1ZS5wdXNoKHRoaXMuY29tbWVudHNbdF0pO2JyZWFrO2RlZmF1bHQ6dGhpcy5jb21tZW50TG9vcFByZVF1ZXVlLnB1c2godGhpcy5jb21tZW50c1t0XSl9dGhpcy5sYXN0Q29tbW5ldEluZGV4PXR9fXRyeXt0aGlzLmRyYXdDb21tZW50KCl9Y2F0Y2goaSl7fXRoaXMubGFzdENvbW1uZXRVcGRhdGVUaW1lPWV9fX19LHtcIi4vY3JlYXRlRWxlbWVudFwiOjd9XSw0OltmdW5jdGlvbihlLHQpe2Z1bmN0aW9uIGkoZSl7cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGUpfWZ1bmN0aW9uIG4oZSx0LGksbil7ZnVuY3Rpb24gbyh0KXt2YXIgaT0odC5jbGllbnRYLWUucGFyZW50Tm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0KS9lLnBhcmVudE5vZGUub2Zmc2V0V2lkdGg7cmV0dXJuIE1hdGgubWluKE1hdGgubWF4KGksMCksMSl9ZnVuY3Rpb24gcyh0KXsxPT10LndoaWNoJiYobD0hMCxlLmRyYWdpbmc9ITAscih0KSl9ZnVuY3Rpb24gcihlKXtpZigxPT1lLndoaWNoJiZsPT09ITApe3ZhciB0PW8oZSk7aSh0KX19ZnVuY3Rpb24gYSh0KXtpZigxPT10LndoaWNoJiZsPT09ITApe3ZhciBzPW8odCk7aShzKSxuKHMpLGw9ITEsZGVsZXRlIGUuZHJhZ2luZ319dmFyIGw9ITE7aT1pfHxmdW5jdGlvbigpe30sbj1ufHxmdW5jdGlvbigpe30sZS5wYXJlbnROb2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIixzKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIixyKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsYSl9dmFyIG89KGUoXCIuL2NyZWF0ZUVsZW1lbnRcIiksZShcIi4vZGVsZWdhdGVDbGlja0J5Q2xhc3NOYW1lXCIpKSxzPWUoXCIuL3RpbWVGb3JtYXRcIik7dC5leHBvcnRzPXtpbml0OmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5pZnJhbWUuY29udGVudERvY3VtZW50LHQ9byhlKTt0Lm9uKFwicGxheVwiLHRoaXMub25QbGF5Q2xpY2ssdGhpcyksdC5vbihcInZpZGVvLWZyYW1lXCIsdGhpcy5vblZpZGVvQ2xpY2ssdGhpcyksdC5vbihcInNvdXJjZVwiLHRoaXMub25Tb3VyY2VDbGljayx0aGlzKSx0Lm9uKFwiYWxsc2NyZWVuXCIsdGhpcy5vbkFsbFNjcmVlbkNsaWNrLHRoaXMpLHQub24oXCJmdWxsc2NyZWVuXCIsdGhpcy5vbmZ1bGxTY3JlZW5DbGljayx0aGlzKSx0Lm9uKFwibm9ybWFsc2NyZWVuXCIsdGhpcy5vbk5vcm1hbFNjcmVlbkNsaWNrLHRoaXMpLHQub24oXCJjb21tZW50cy1idG5cIix0aGlzLm9uY29tbWVudHNCdG5DbGljayx0aGlzKSx0Lm9uKFwiYWlycGxheVwiLHRoaXMub25BaXJwbGF5QnRuQ2xpY2ssdGhpcyksZS5kb2N1bWVudEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImtleWRvd25cIix0aGlzLm9uS2V5RG93bi5iaW5kKHRoaXMpLCExKSx0aGlzLkRPTXMucGxheWVyLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIix0aGlzLm9uTW91c2VBY3RpdmUuYmluZCh0aGlzKSksbih0aGlzLkRPTXMucHJvZ3Jlc3NfYW5jaG9yLGUsdGhpcy5vblByb2dyZXNzQW5jaG9yV2lsbFNldC5iaW5kKHRoaXMpLHRoaXMub25Qcm9ncmVzc0FuY2hvclNldC5iaW5kKHRoaXMpKSxuKHRoaXMuRE9Ncy52b2x1bWVfYW5jaG9yLGUsdGhpcy5vblZvbHVtZUFuY2hvcldpbGxTZXQuYmluZCh0aGlzKSl9LG9uS2V5RG93bjpmdW5jdGlvbihlKXtzd2l0Y2goZS5wcmV2ZW50RGVmYXVsdCgpLGUua2V5Q29kZSl7Y2FzZSAzMjp0aGlzLm9uUGxheUNsaWNrKCk7YnJlYWs7Y2FzZSAzOTp0aGlzLnZpZGVvLmN1cnJlbnRUaW1lPU1hdGgubWluKHRoaXMudmlkZW8uZHVyYXRpb24sdGhpcy52aWRlby5jdXJyZW50VGltZSsxMCk7YnJlYWs7Y2FzZSAzNzp0aGlzLnZpZGVvLmN1cnJlbnRUaW1lPU1hdGgubWF4KDAsdGhpcy52aWRlby5jdXJyZW50VGltZS0xMCk7YnJlYWs7Y2FzZSAzODp0aGlzLnZpZGVvLnZvbHVtZT1NYXRoLm1pbigxLHRoaXMudmlkZW8udm9sdW1lKy4xKSx0aGlzLkRPTXMudm9sdW1lX2FuY2hvci5zdHlsZS53aWR0aD0xMDAqdGhpcy52aWRlby52b2x1bWUrXCIlXCI7YnJlYWs7Y2FzZSA0MDp0aGlzLnZpZGVvLnZvbHVtZT1NYXRoLm1heCgwLHRoaXMudmlkZW8udm9sdW1lLS4xKSx0aGlzLkRPTXMudm9sdW1lX2FuY2hvci5zdHlsZS53aWR0aD0xMDAqdGhpcy52aWRlby52b2x1bWUrXCIlXCI7YnJlYWs7Y2FzZSA2NTp0aGlzLkRPTXMucGxheWVyLmNsYXNzTGlzdC5jb250YWlucyhcImFsbHNjcmVlblwiKT90aGlzLm9uTm9ybWFsU2NyZWVuQ2xpY2soKTp0aGlzLm9uQWxsU2NyZWVuQ2xpY2soKTticmVhaztjYXNlIDcwOnRoaXMuRE9Ncy5wbGF5ZXIuY2xhc3NMaXN0LmNvbnRhaW5zKFwiZnVsbHNjcmVlblwiKXx8dGhpcy5vbmZ1bGxTY3JlZW5DbGljaygpfX0sb25WaWRlb0NsaWNrOmZ1bmN0aW9uKCl7dm9pZCAwPT10aGlzLnZpZGVvQ2xpY2tEYmxUaW1lcj90aGlzLnZpZGVvQ2xpY2tEYmxUaW1lcj1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhpcy52aWRlb0NsaWNrRGJsVGltZXI9dm9pZCAwLHRoaXMub25QbGF5Q2xpY2soKX0uYmluZCh0aGlzKSwzMDApOihjbGVhclRpbWVvdXQodGhpcy52aWRlb0NsaWNrRGJsVGltZXIpLHRoaXMudmlkZW9DbGlja0RibFRpbWVyPXZvaWQgMCxkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudHx8ZG9jdW1lbnQubW96RnVsbFNjcmVlbkVsZW1lbnR8fGRvY3VtZW50LndlYmtpdEZ1bGxzY3JlZW5FbGVtZW50P3RoaXMub25Ob3JtYWxTY3JlZW5DbGljaygpOnRoaXMub25mdWxsU2NyZWVuQ2xpY2soKSl9LG9uTW91c2VBY3RpdmU6ZnVuY3Rpb24oKXt0aGlzLkRPTXMucGxheWVyLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIiksY2xlYXJUaW1lb3V0KHRoaXMuTW91c2VBY3RpdmVUaW1lciksdGhpcy5Nb3VzZUFjdGl2ZVRpbWVyPXNldFRpbWVvdXQoZnVuY3Rpb24oKXt0aGlzLkRPTXMucGxheWVyLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIil9LmJpbmQodGhpcyksMWUzKX0sb25QbGF5Q2xpY2s6ZnVuY3Rpb24oKXt0aGlzLkRPTXMucGxheS5jbGFzc0xpc3QuY29udGFpbnMoXCJwYXVzZWRcIik/KHRoaXMudmlkZW8ucGxheSgpLHRoaXMuRE9Ncy5wbGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJwYXVzZWRcIikpOih0aGlzLnZpZGVvLnBhdXNlKCksdGhpcy5ET01zLnBsYXkuY2xhc3NMaXN0LmFkZChcInBhdXNlZFwiKSl9LG9uU291cmNlQ2xpY2s6ZnVuY3Rpb24oZSl7ZS5jbGFzc0xpc3QuY29udGFpbnMoXCJjdXJyXCIpfHwodGhpcy52aWRlby5wcmVsb2FkU3RhcnRUaW1lPXRoaXMudmlkZW8uY3VycmVudFRpbWUsdGhpcy52aWRlby5zcmM9dGhpcy5zb3VyY2VMaXN0WzB8ZS5nZXRBdHRyaWJ1dGUoXCJzb3VyY2VJbmRleFwiKV1bMV0saShlLnBhcmVudE5vZGUuY2hpbGROb2RlcykuZm9yRWFjaChmdW5jdGlvbih0KXtlPT09dD90LmNsYXNzTGlzdC5hZGQoXCJjdXJyXCIpOnQuY2xhc3NMaXN0LnJlbW92ZShcImN1cnJcIil9LmJpbmQodGhpcykpKX0sb25Qcm9ncmVzc0FuY2hvcldpbGxTZXQ6ZnVuY3Rpb24oZSl7dmFyIHQ9dGhpcy52aWRlby5kdXJhdGlvbixpPXQqZTt0aGlzLkRPTXMuY3VycmVudC5pbm5lckhUTUw9cyhpKSx0aGlzLkRPTXMuZHVyYXRpb24uaW5uZXJIVE1MPXModCksdGhpcy5ET01zLnByb2dyZXNzX2FuY2hvci5zdHlsZS53aWR0aD0xMDAqZStcIiVcIn0sb25Qcm9ncmVzc0FuY2hvclNldDpmdW5jdGlvbihlKXt0aGlzLnZpZGVvLmN1cnJlbnRUaW1lPXRoaXMudmlkZW8uZHVyYXRpb24qZX0sb25Wb2x1bWVBbmNob3JXaWxsU2V0OmZ1bmN0aW9uKGUpe3RoaXMudmlkZW8udm9sdW1lPWUsdGhpcy5ET01zLnZvbHVtZV9hbmNob3Iuc3R5bGUud2lkdGg9MTAwKmUrXCIlXCJ9LG9uQWxsU2NyZWVuQ2xpY2s6ZnVuY3Rpb24oKXt2YXIgZT1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgsdD1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0O3RoaXMuaWZyYW1lLnN0eWxlLmNzc1RleHQ9XCI7cG9zaXRpb246Zml4ZWQ7dG9wOjA7bGVmdDowO3dpZHRoOlwiK2UrXCJweDtoZWlnaHQ6XCIrdCtcInB4O3otaW5kZXg6OTk5OTk5O1wiLHRoaXMuYWxsU2NyZWVuV2luUmVzaXplRnVuY3Rpb249dGhpcy5hbGxTY3JlZW5XaW5SZXNpemVGdW5jdGlvbnx8ZnVuY3Rpb24oKXt0aGlzLmlmcmFtZS5zdHlsZS53aWR0aD1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgrXCJweFwiLHRoaXMuaWZyYW1lLnN0eWxlLmhlaWdodD1kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50SGVpZ2h0K1wicHhcIn0uYmluZCh0aGlzKSx3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLHRoaXMuYWxsU2NyZWVuV2luUmVzaXplRnVuY3Rpb24pLHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsdGhpcy5hbGxTY3JlZW5XaW5SZXNpemVGdW5jdGlvbiksdGhpcy5ET01zLnBsYXllci5jbGFzc0xpc3QuYWRkKFwiYWxsc2NyZWVuXCIpfSxvbmZ1bGxTY3JlZW5DbGljazpmdW5jdGlvbigpe1tcIndlYmtpdFJlcXVlc3RGdWxsU2NyZWVuXCIsXCJtb3pSZXF1ZXN0RnVsbFNjcmVlblwiLFwicmVxdWVzdEZ1bGxTY3JlZW5cIl0uZm9yRWFjaChmdW5jdGlvbihlKXt0aGlzLkRPTXMucGxheWVyW2VdJiZ0aGlzLkRPTXMucGxheWVyW2VdKCl9LmJpbmQodGhpcykpLHRoaXMub25Nb3VzZUFjdGl2ZSgpfSxvbk5vcm1hbFNjcmVlbkNsaWNrOmZ1bmN0aW9uKCl7d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIix0aGlzLmFsbFNjcmVlbldpblJlc2l6ZUZ1bmN0aW9uKSx0aGlzLmlmcmFtZS5zdHlsZS5jc3NUZXh0PVwiO3dpZHRoOlwiK3RoaXMuc2l6ZVswXStcInB4O2hlaWdodDpcIit0aGlzLnNpemVbMV0rXCJweDtcIixbXCJ3ZWJraXRDYW5jZWxGdWxsU2NyZWVuXCIsXCJtb3pDYW5jZWxGdWxsU2NyZWVuXCIsXCJjYW5jZWxGdWxsU2NyZWVuXCJdLmZvckVhY2goZnVuY3Rpb24oZSl7ZG9jdW1lbnRbZV0mJmRvY3VtZW50W2VdKCl9KSx0aGlzLkRPTXMucGxheWVyLmNsYXNzTGlzdC5yZW1vdmUoXCJhbGxzY3JlZW5cIil9LG9uY29tbWVudHNCdG5DbGljazpmdW5jdGlvbigpe3RoaXMuZW5hYmxlQ29tbWVudD0hdGhpcy5ET01zW1wiY29tbWVudHMtYnRuXCJdLmNsYXNzTGlzdC5jb250YWlucyhcImVuYWJsZVwiKSx0aGlzLmVuYWJsZUNvbW1lbnQ/KHNldFRpbWVvdXQoZnVuY3Rpb24oKXt0aGlzLkRPTXMuY29tbWVudHMuc3R5bGUuZGlzcGxheT1cImJsb2NrXCJ9LmJpbmQodGhpcyksODApLHRoaXMuRE9Nc1tcImNvbW1lbnRzLWJ0blwiXS5jbGFzc0xpc3QuYWRkKFwiZW5hYmxlXCIpKToodGhpcy5ET01zLmNvbW1lbnRzLnN0eWxlLmRpc3BsYXk9XCJub25lXCIsdGhpcy5ET01zW1wiY29tbWVudHMtYnRuXCJdLmNsYXNzTGlzdC5yZW1vdmUoXCJlbmFibGVcIikpfSxvbkFpcnBsYXlCdG5DbGljazpmdW5jdGlvbigpe3RoaXMudmlkZW8ud2Via2l0U2hvd1BsYXliYWNrVGFyZ2V0UGlja2VyKCl9fX0se1wiLi9jcmVhdGVFbGVtZW50XCI6NyxcIi4vZGVsZWdhdGVDbGlja0J5Q2xhc3NOYW1lXCI6OCxcIi4vdGltZUZvcm1hdFwiOjE0fV0sNTpbZnVuY3Rpb24oZSx0KXt7dmFyIGk9KGUoXCIuL2V4dGVuZFwiKSxlKFwiLi9jcmVhdGVFbGVtZW50XCIpKTtlKFwiLi9wYXJzZURPTUJ5Q2xhc3NOYW1lc1wiKX10LmV4cG9ydHM9e2luaXQ6ZnVuY3Rpb24oKXt2YXIgZT0wO3RoaXMuc291cmNlTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHQsbil7aShcImxpXCIse2FwcGVuZFRvOnRoaXMuRE9Ncy5oZCxzb3VyY2VJbmRleDpuLGNsYXNzTmFtZTpcInNvdXJjZSBcIisobj09PWU/XCJjdXJyXCI6XCJcIiksaW5uZXJIVE1MOnRbMF19KX0uYmluZCh0aGlzKSksdGhpcy5ET01zLnZpZGVvLnNyYz10aGlzLnNvdXJjZUxpc3RbZV1bMV19fX0se1wiLi9jcmVhdGVFbGVtZW50XCI6NyxcIi4vZXh0ZW5kXCI6OSxcIi4vcGFyc2VET01CeUNsYXNzTmFtZXNcIjoxMX1dLDY6W2Z1bmN0aW9uKGUsdCl7dmFyIGk9ZShcIi4vdGltZUZvcm1hdFwiKTt0LmV4cG9ydHM9e2luaXQ6ZnVuY3Rpb24oKXt0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJ0aW1ldXBkYXRlXCIsdGhpcy5vblZpZGVvVGltZVVwZGF0ZS5iaW5kKHRoaXMpKSx0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJwbGF5XCIsdGhpcy5vblZpZGVvUGxheS5iaW5kKHRoaXMpKSx0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJwYXVzZVwiLHRoaXMub25WaWRlb1RpbWVQYXVzZS5iaW5kKHRoaXMpKSx0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkZWRtZXRhZGF0YVwiLHRoaXMub25WaWRlb0xvYWRlZE1ldGFEYXRhLmJpbmQodGhpcykpLHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcIndlYmtpdHBsYXliYWNrdGFyZ2V0YXZhaWxhYmlsaXR5Y2hhbmdlZFwiLHRoaXMub25QbGF5YmFja1RhcmdldEF2YWlsYWJpbGl0eUNoYW5nZWQuYmluZCh0aGlzKSksc2V0SW50ZXJ2YWwodGhpcy52aWRlb0J1ZmZlcmVkLmJpbmQodGhpcyksMWUzKSx0aGlzLkRPTXMudm9sdW1lX2FuY2hvci5zdHlsZS53aWR0aD0xMDAqdGhpcy52aWRlby52b2x1bWUrXCIlXCJ9LG9uVmlkZW9UaW1lVXBkYXRlOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy52aWRlby5jdXJyZW50VGltZSx0PXRoaXMudmlkZW8uZHVyYXRpb247dGhpcy5ET01zLmN1cnJlbnQuaW5uZXJIVE1MPWkoZSksdGhpcy5ET01zLmR1cmF0aW9uLmlubmVySFRNTD1pKHQpLHRoaXMuRE9Ncy5wcm9ncmVzc19hbmNob3IuZHJhZ2luZ3x8KHRoaXMuRE9Ncy5wcm9ncmVzc19hbmNob3Iuc3R5bGUud2lkdGg9MTAwKk1hdGgubWluKE1hdGgubWF4KGUvdCwwKSwxKStcIiVcIil9LHZpZGVvQnVmZmVyZWQ6ZnVuY3Rpb24oKXt2YXIgZT10aGlzLnZpZGVvLmJ1ZmZlcmVkLHQ9dGhpcy52aWRlby5jdXJyZW50VGltZSxpPTA9PWUubGVuZ3RoPzA6ZS5lbmQoZS5sZW5ndGgtMSk7dGhpcy5ET01zLmJ1ZmZlcmVkX2FuY2hvci5zdHlsZS53aWR0aD0xMDAqTWF0aC5taW4oTWF0aC5tYXgoaS90aGlzLnZpZGVvLmR1cmF0aW9uLDApLDEpK1wiJVwiLDA9PWl8fHQ+PWk/dGhpcy5ET01zLnBsYXllci5jbGFzc0xpc3QuYWRkKFwibG9hZGluZ1wiKTp0aGlzLkRPTXMucGxheWVyLmNsYXNzTGlzdC5yZW1vdmUoXCJsb2FkaW5nXCIpfSxvblZpZGVvUGxheTpmdW5jdGlvbigpe3RoaXMuRE9Ncy5wbGF5LmNsYXNzTGlzdC5yZW1vdmUoXCJwYXVzZWRcIil9LG9uVmlkZW9UaW1lUGF1c2U6ZnVuY3Rpb24oKXt0aGlzLkRPTXMucGxheS5jbGFzc0xpc3QuYWRkKFwicGF1c2VkXCIpfSxvblZpZGVvTG9hZGVkTWV0YURhdGE6ZnVuY3Rpb24oKXt0aGlzLnZpZGVvLnByZWxvYWRTdGFydFRpbWUmJih0aGlzLnZpZGVvLmN1cnJlbnRUaW1lPXRoaXMudmlkZW8ucHJlbG9hZFN0YXJ0VGltZSxkZWxldGUgdGhpcy52aWRlby5wcmVsb2FkU3RhcnRUaW1lKX0sb25QbGF5YmFja1RhcmdldEF2YWlsYWJpbGl0eUNoYW5nZWQ6ZnVuY3Rpb24oZSl7dmFyIHQ9XCJzdXBwb3J0LWFpcnBsYXlcIjtcImF2YWlsYWJsZVwiPT09ZS5hdmFpbGFiaWxpdHk/dGhpcy5ET01zLnBsYXllci5jbGFzc0xpc3QuYWRkKHQpOnRoaXMuRE9Ncy5wbGF5ZXIuY2xhc3NMaXN0LnJlbW92ZSh0KX19fSx7XCIuL3RpbWVGb3JtYXRcIjoxNH1dLDc6W2Z1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gaShlLHQpe3ZhciBpPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoZSk7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YgdCl0LmNhbGwoaSk7ZWxzZSBmb3IodmFyIG4gaW4gdClpZih0Lmhhc093blByb3BlcnR5KG4pKXN3aXRjaChuKXtjYXNlXCJhcHBlbmRUb1wiOnRbbl0uYXBwZW5kQ2hpbGQoaSk7YnJlYWs7Y2FzZVwidGV4dFwiOnZhciBvPWRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRbbl0pO2kuaW5uZXJIVE1MPVwiXCIsaS5hcHBlbmRDaGlsZChvKTticmVhaztjYXNlXCJpbm5lckhUTUxcIjpjYXNlXCJjbGFzc05hbWVcIjpjYXNlXCJpZFwiOmlbbl09dFtuXTticmVhaztjYXNlXCJzdHlsZVwiOnZhciBzPXRbbl07Zm9yKHZhciByIGluIHMpcy5oYXNPd25Qcm9wZXJ0eShyKSYmKGkuc3R5bGVbcl09c1tyXSk7YnJlYWs7ZGVmYXVsdDppLnNldEF0dHJpYnV0ZShuLHRbbl0rXCJcIil9cmV0dXJuIGl9dC5leHBvcnRzPWl9LHt9XSw4OltmdW5jdGlvbihlLHQpe2Z1bmN0aW9uIGkoZSl7cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGUpfWZ1bmN0aW9uIG4oZSl7dGhpcy5fZXZlbnRNYXA9e30sdGhpcy5fcm9vdEVsZW1lbnQ9ZSx0aGlzLl9pc1Jvb3RFbGVtZW50QmluZGVkQ2xpY2s9ITEsdGhpcy5fYmluZENsaWNrRnVuY3Rpb249ZnVuY3Rpb24oZSl7IWZ1bmN0aW9uIHQoZSxuKXtuJiZuLm5vZGVOYW1lJiYobi5jbGFzc0xpc3QmJmkobi5jbGFzc0xpc3QpLmZvckVhY2goZnVuY3Rpb24odCl7ZS50cmlnZ2VyKHQsbil9KSx0KGUsbi5wYXJlbnROb2RlKSl9KHRoaXMsZS50YXJnZXQpfS5iaW5kKHRoaXMpfXZhciBvPWUoXCIuL2V4dGVuZFwiKTtvKG4ucHJvdG90eXBlLHtvbjpmdW5jdGlvbihlLHQsaSl7dm9pZCAwPT09dGhpcy5fZXZlbnRNYXBbZV0mJih0aGlzLl9ldmVudE1hcFtlXT1bXSksdGhpcy5fZXZlbnRNYXBbZV0ucHVzaChbdCxpXSksdGhpcy5faXNSb290RWxlbWVudEJpbmRlZENsaWNrfHwoX2lzUm9vdEVsZW1lbnRCaW5kZWRDbGljaz0hMCx0aGlzLl9yb290RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIix0aGlzLl9iaW5kQ2xpY2tGdW5jdGlvbiwhMSkpfSxvZmY6ZnVuY3Rpb24oZSx0KXtpZih2b2lkIDAhPXRoaXMuX2V2ZW50TWFwW2VdKWZvcih2YXIgaT10aGlzLl9ldmVudE1hcFtlXS5sZW5ndGg7aS0tOylpZih0aGlzLl9ldmVudE1hcFtlXVtpXVswXT09PXQpe3RoaXMuX2V2ZW50TWFwW2VdLnNwbGljZShpLDEpO2JyZWFrfWZvcih2YXIgbiBpbiB0aGlzLl9ldmVudE1hcClicmVhazt2b2lkIDA9PT1uJiZ0aGlzLl9pc1Jvb3RFbGVtZW50QmluZGVkQ2xpY2smJihfaXNSb290RWxlbWVudEJpbmRlZENsaWNrPSExLHRoaXMuX3Jvb3RFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLHRoaXMuX2JpbmRDbGlja0Z1bmN0aW9uLCExKSl9LHRyaWdnZXI6ZnVuY3Rpb24oZSx0KXt0PXZvaWQgMD09PXQ/dGhpcy5fcm9vdEVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWVzKGUpOlt0XSx0LmZvckVhY2goZnVuY3Rpb24odCl7KHRoaXMuX2V2ZW50TWFwW2VdfHxbXSkuZm9yRWFjaChmdW5jdGlvbihlKXtlWzBdLmNhbGwoZVsxXSx0KX0pfS5iaW5kKHRoaXMpKX19KSx0LmV4cG9ydHM9ZnVuY3Rpb24oZSl7cmV0dXJuIG5ldyBuKGUpfX0se1wiLi9leHRlbmRcIjo5fV0sOTpbZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBpKGUpe2Zvcih2YXIgdCxpPWFyZ3VtZW50cy5sZW5ndGgsbj0xO2k+bjspe3Q9YXJndW1lbnRzW24rK107Zm9yKHZhciBvIGluIHQpdC5oYXNPd25Qcm9wZXJ0eShvKSYmKGVbb109dFtvXSl9cmV0dXJuIGV9dC5leHBvcnRzPWl9LHt9XSwxMDpbZnVuY3Rpb24oZSl7ZnVuY3Rpb24gdChlLHQsaSxuKXt0aGlzLmlkPWUsdGhpcy5zaXplPXQuc3BsaXQoXCJ4XCIpLHRoaXMuc291cmNlTGlzdD1pfHxbXSx0aGlzLmNvbW1lbnRzPW4sdGhpcy5pbml0KCl9ZShcIi4vY29tcG9uZW50XCIpKHQsZShcIi4vY29tcG9uZW50X2J1aWxkXCIpLGUoXCIuL2NvbXBvbmVudF9ldmVudFwiKSxlKFwiLi9jb21wb25lbnRfdmlkZW9cIiksZShcIi4vY29tcG9uZW50X3NvdXJjZVwiKSxlKFwiLi9jb21wb25lbnRfY29tbWVudHNcIikpLE1BTUFQbGF5ZXI9dH0se1wiLi9jb21wb25lbnRcIjoxLFwiLi9jb21wb25lbnRfYnVpbGRcIjoyLFwiLi9jb21wb25lbnRfY29tbWVudHNcIjozLFwiLi9jb21wb25lbnRfZXZlbnRcIjo0LFwiLi9jb21wb25lbnRfc291cmNlXCI6NSxcIi4vY29tcG9uZW50X3ZpZGVvXCI6Nn1dLDExOltmdW5jdGlvbihlLHQpe2Z1bmN0aW9uIGkoZSx0KXt2YXIgaT17fTtyZXR1cm4gdC5mb3JFYWNoKGZ1bmN0aW9uKHQpe2lbdF09ZS5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKHQpWzBdfSksaX10LmV4cG9ydHM9aX0se31dLDEyOltmdW5jdGlvbihlLHQpe3QuZXhwb3J0cz0nKiB7IG1hcmdpbjowOyBwYWRkaW5nOjA7IH1ib2R5IHsgZm9udC1mYW1pbHk6IFwiUGluZ0hlaVwiLFwiTHVjaWRhIEdyYW5kZVwiLCBcIkx1Y2lkYSBTYW5zIFVuaWNvZGVcIiwgXCJTVEhlaXRpXCIsIFwiSGVsdmV0aWNhXCIsXCJBcmlhbFwiLFwiVmVyZGFuYVwiLFwic2Fucy1zZXJpZlwiOyBmb250LXNpemU6MTZweDt9aHRtbCwgYm9keSwgLnBsYXllciB7IGhlaWdodDogMTAwJTsgfS5wbGF5ZXI6LXdlYmtpdC1mdWxsLXNjcmVlbiB7IHdpZHRoOiAxMDAlOyBjdXJzb3I6dXJsKGRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQUVBQUFBQkNBWUFBQUFmRmNTSkFBQUFEVWxFUVZRSW1XTmdZR0JnQUFBQUJRQUJoNkZPMUFBQUFBQkpSVTVFcmtKZ2dnPT0pOyB9LnBsYXllcjotbW96LWZ1bGwtc2NyZWVuIHsgd2lkdGg6IDEwMCU7IGN1cnNvcjp1cmwoZGF0YTppbWFnZS9naWY7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBRUFBQUFCQ0FZQUFBQWZGY1NKQUFBQURVbEVRVlFJbVdOZ1lHQmdBQUFBQlFBQmg2Rk8xQUFBQUFCSlJVNUVya0pnZ2c9PSk7IH0ucGxheWVyOmZ1bGwtc2NyZWVuIHsgd2lkdGg6IDEwMCU7IGN1cnNvcjp1cmwoZGF0YTppbWFnZS9naWY7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBRUFBQUFCQ0FZQUFBQWZGY1NKQUFBQURVbEVRVlFJbVdOZ1lHQmdBQUFBQlFBQmg2Rk8xQUFBQUFCSlJVNUVya0pnZ2c9PSk7IH0ucGxheWVyIHsgYm9yZGVyLXJhZGl1czogM3B4OyBvdmVyZmxvdzogaGlkZGVuOyBwb3NpdGlvbjogcmVsYXRpdmU7IGN1cnNvcjogZGVmYXVsdDsgIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7ICAtbW96LXVzZXItc2VsZWN0OiBub25lOyB1c2VyLXNlbGVjdDogbm9uZTt9LnZpZGVvLWZyYW1lIHsgYm94LXNpemluZzogYm9yZGVyLWJveDsgcGFkZGluZy1ib3R0b206IDUwcHg7IGhlaWdodDogMTAwJTsgb3ZlcmZsb3c6IGhpZGRlbjsgcG9zaXRpb246IHJlbGF0aXZlO30udmlkZW8tZnJhbWUgLmNvbW1lbnRzeyBwb3NpdGlvbjogYWJzb2x1dGU7IHRvcDowO2xlZnQ6MDsgd2lkdGg6MTAwJTsgaGVpZ2h0OjEwMCU7ICAtd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGVaKDApOyAgLW1vei10cmFuc2Zvcm06dHJhbnNsYXRlWigwKTsgdHJhbnNmb3JtOnRyYW5zbGF0ZVooMCk7ICBwb2ludGVyLWV2ZW50czogbm9uZTt9LnBsYXllcjotd2Via2l0LWZ1bGwtc2NyZWVuIC52aWRlby1mcmFtZSB7IHBhZGRpbmctYm90dG9tOiAwcHg7IH0ucGxheWVyOi1tb3otZnVsbC1zY3JlZW4gLnZpZGVvLWZyYW1lIHsgcGFkZGluZy1ib3R0b206IDBweDsgfS5wbGF5ZXI6ZnVsbC1zY3JlZW4gLnZpZGVvLWZyYW1leyBwYWRkaW5nLWJvdHRvbTogMHB4OyB9LnZpZGVvIHsgd2lkdGg6IDEwMCU7ICBoZWlnaHQ6IDEwMCU7IGJhY2tncm91bmQ6ICMwMDAwMDA7fS5jb250cm9sbGVyIHsgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgYm90dG9tOiAwcHg7ICBsZWZ0OjA7IHJpZ2h0OjA7ICBiYWNrZ3JvdW5kOiAjMjQyNzJBOyAgaGVpZ2h0OiA1MHB4O30uY29udHJvbGxlciAubG9hZGluZy1pY29uIHsgZGlzcGxheTogbm9uZTsgIHBvc2l0aW9uOiBhYnNvbHV0ZTsgd2lkdGg6IDIwcHg7ICBoZWlnaHQ6IDIwcHg7IGxpbmUtaGVpZ2h0OiAyMHB4OyAgdGV4dC1hbGlnbjogY2VudGVyOyBmb250LXNpemU6IDIwcHg7ICBjb2xvcjogI2ZmZmZmZjsgdG9wOiAtMzBweDsgcmlnaHQ6IDEwcHg7fS5wbGF5ZXIubG9hZGluZyAuY29udHJvbGxlciAubG9hZGluZy1pY29uIHsgIGRpc3BsYXk6IGJsb2NrO30ucGxheWVyOi13ZWJraXQtZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgeyAtd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGVZKDUwcHgpOyAtd2Via2l0LXRyYW5zaXRpb246IC13ZWJraXQtdHJhbnNmb3JtIDAuM3MgZWFzZTt9LnBsYXllcjotbW96LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIHsgLW1vei10cmFuc2Zvcm06dHJhbnNsYXRlWSg1MHB4KTsgIC1tb3otdHJhbnNpdGlvbjogLW1vei10cmFuc2Zvcm0gMC4zcyBlYXNlO30ucGxheWVyOmZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIHsgIHRyYW5zZm9ybTp0cmFuc2xhdGVZKDUwcHgpOyB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4zcyBlYXNlO30ucGxheWVyLmFjdGl2ZTotd2Via2l0LWZ1bGwtc2NyZWVuIHsgY3Vyc29yOiBkZWZhdWx0O30ucGxheWVyLmFjdGl2ZTotbW96LWZ1bGwtc2NyZWVuIHsgIGN1cnNvcjogZGVmYXVsdDt9LnBsYXllci5hY3RpdmU6ZnVsbC1zY3JlZW4geyBjdXJzb3I6IGRlZmF1bHQ7fS5wbGF5ZXIuYWN0aXZlOi13ZWJraXQtZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIsLnBsYXllcjotd2Via2l0LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyOmhvdmVyIHsgLXdlYmtpdC10cmFuc2Zvcm06dHJhbnNsYXRlWSgwKTsgIGN1cnNvcjogZGVmYXVsdDt9LnBsYXllci5hY3RpdmU6LW1vei1mdWxsLXNjcmVlbiAuY29udHJvbGxlciwucGxheWVyOi1tb3otZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXI6aG92ZXIgeyAtbW96LXRyYW5zZm9ybTp0cmFuc2xhdGVZKDApOyBjdXJzb3I6IGRlZmF1bHQ7fS5wbGF5ZXIuYWN0aXZlOmZ1bGwtc2NyZWVuIC5jb250cm9sbGVyLnBsYXllcjpmdWxsLXNjcmVlbiAuY29udHJvbGxlcjpob3ZlciB7ICB0cmFuc2Zvcm06dHJhbnNsYXRlWSgwKTsgIGN1cnNvcjogZGVmYXVsdDt9LnBsYXllci5hY3RpdmU6LXdlYmtpdC1mdWxsLXNjcmVlbiAuY29udHJvbGxlciAucHJvZ3Jlc3MgLnByb2dyZXNzX2FuY2hvcjphZnRlciwucGxheWVyOi13ZWJraXQtZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXI6aG92ZXIgLnByb2dyZXNzIC5wcm9ncmVzc19hbmNob3I6YWZ0ZXIgeyBoZWlnaHQ6MTJweDt9LnBsYXllci5hY3RpdmU6LW1vei1mdWxsLXNjcmVlbiAuY29udHJvbGxlciAucHJvZ3Jlc3MgLnByb2dyZXNzX2FuY2hvcjphZnRlciwucGxheWVyOi1tb3otZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXI6aG92ZXIgLnByb2dyZXNzIC5wcm9ncmVzc19hbmNob3I6YWZ0ZXIgeyBoZWlnaHQ6MTJweDt9LnBsYXllci5hY3RpdmU6ZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgLnByb2dyZXNzIC5wcm9ncmVzc19hbmNob3I6YWZ0ZXIsLnBsYXllcjpmdWxsLXNjcmVlbiAuY29udHJvbGxlcjpob3ZlciAucHJvZ3Jlc3MgLnByb2dyZXNzX2FuY2hvcjphZnRlciB7IGhlaWdodDoxMnB4O30ucGxheWVyOi13ZWJraXQtZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgLnByb2dyZXNzIC5wcm9ncmVzc19hbmNob3I6YWZ0ZXIgeyBoZWlnaHQ6NHB4O30ucGxheWVyOi1tb3otZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgLnByb2dyZXNzIC5wcm9ncmVzc19hbmNob3I6YWZ0ZXIgeyBoZWlnaHQ6NHB4O30ucGxheWVyOmZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIC5wcm9ncmVzcyAucHJvZ3Jlc3NfYW5jaG9yOmFmdGVyIHsgIGhlaWdodDo0cHg7fS5jb250cm9sbGVyIC5wcm9ncmVzcyB7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOjBweDsgIGxlZnQ6MDsgcmlnaHQ6MDsgIGJvcmRlci1yaWdodDogNHB4IHNvbGlkICMxODFBMUQ7ICBib3JkZXItbGVmdDogOHB4IHNvbGlkICNERjY1NTg7IGhlaWdodDogNHB4OyAgYmFja2dyb3VuZDogIzE4MUExRDsgIHotaW5kZXg6MTsgIC13ZWJraXQtdHJhbnNmb3JtOiB0cmFuc2xhdGVaKDApOyAtbW96LXRyYW5zZm9ybTogdHJhbnNsYXRlWigwKTsgIHRyYW5zZm9ybTogdHJhbnNsYXRlWigwKTt9LmNvbnRyb2xsZXIgLnByb2dyZXNzOmFmdGVyIHsgY29udGVudDpcIlwiOyBkaXNwbGF5OiBibG9jazsgcG9zaXRpb246IGFic29sdXRlOyB0b3A6MHB4OyAgbGVmdDowOyByaWdodDowOyAgYm90dG9tOi0xMHB4OyBoZWlnaHQ6IDEwcHg7fS5jb250cm9sbGVyIC5wcm9ncmVzcyAuYW5jaG9yIHsgaGVpZ2h0OiA0cHg7ICBiYWNrZ3JvdW5kOiAjREY2NTU4OyAgcG9zaXRpb246IGFic29sdXRlOyB0b3A6MDtsZWZ0OjA7fS5jb250cm9sbGVyIC5wcm9ncmVzcyAuYW5jaG9yOmFmdGVyIHsgY29udGVudDpcIlwiOyBkaXNwbGF5OiBibG9jazsgd2lkdGg6IDEycHg7ICBiYWNrZ3JvdW5kOiAjREY2NTU4OyAgcG9zaXRpb246IGFic29sdXRlOyByaWdodDotNHB4OyB0b3A6IDUwJTsgaGVpZ2h0OiAxMnB4OyBib3gtc2hhZG93OiAwIDAgMnB4IHJnYmEoMCwwLDAsIDAuNCk7IGJvcmRlci1yYWRpdXM6IDEycHg7ICAtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTsgIC1tb3otdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpOyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7fS5jb250cm9sbGVyIC5wcm9ncmVzcyAuYW5jaG9yLmJ1ZmZlcmVkX2FuY2hvciB7ICBwb3NpdGlvbjogcmVsYXRpdmU7IGJhY2tncm91bmQ6IHJnYmEoMjU1LDI1NSwyNTUsMC4xKTt9LmNvbnRyb2xsZXIgLnByb2dyZXNzIC5hbmNob3IuYnVmZmVyZWRfYW5jaG9yOmFmdGVyIHsgIGJveC1zaGFkb3c6IG5vbmU7IGhlaWdodDogNHB4OyAgd2lkdGg6IDRweDsgYm9yZGVyLXJhZGl1czogMDsgYmFja2dyb3VuZDogcmdiYSgyNTUsMjU1LDI1NSwwLjEpO30uY29udHJvbGxlciAucmlnaHQgeyBoZWlnaHQ6IDUwcHg7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgdG9wOjA7ICBsZWZ0OjEwcHg7ICByaWdodDoxMHB4OyBwb2ludGVyLWV2ZW50czogbm9uZTt9LmNvbnRyb2xsZXIgLnBsYXksLmNvbnRyb2xsZXIgLnZvbHVtZSwuY29udHJvbGxlciAudGltZSwuY29udHJvbGxlciAuaGQsLmNvbnRyb2xsZXIgLmFpcnBsYXksLmNvbnRyb2xsZXIgLmFsbHNjcmVlbiwuY29udHJvbGxlciAubm9ybWFsc2NyZWVuLC5jb250cm9sbGVyIC5jb21tZW50cy1idG4sLmNvbnRyb2xsZXIgLmZ1bGxzY3JlZW4geyBwYWRkaW5nLXRvcDo0cHg7ICBoZWlnaHQ6IDQ2cHg7IGxpbmUtaGVpZ2h0OiA1MHB4OyAgdGV4dC1hbGlnbjogY2VudGVyOyBjb2xvcjogI2VlZWVlZTsgZmxvYXQ6bGVmdDsgdGV4dC1zaGFkb3c6MCAwIDJweCByZ2JhKDAsMCwwLDAuNSk7ICBwb2ludGVyLWV2ZW50czogYXV0bzt9LmNvbnRyb2xsZXIgLmhkLC5jb250cm9sbGVyIC5haXJwbGF5LC5jb250cm9sbGVyIC5hbGxzY3JlZW4sLmNvbnRyb2xsZXIgLm5vcm1hbHNjcmVlbiwuY29udHJvbGxlciAuY29tbWVudHMtYnRuLC5jb250cm9sbGVyIC5mdWxsc2NyZWVuIHsgZmxvYXQ6cmlnaHQ7fS5jb250cm9sbGVyIC5wbGF5IHsgIHdpZHRoOiAzNnB4OyAgcGFkZGluZy1sZWZ0OiAxMHB4OyBjdXJzb3I6IHBvaW50ZXI7fS5jb250cm9sbGVyIC5wbGF5OmFmdGVyIHsgIGZvbnQtZmFtaWx5OiBcIkZvbnRBd2Vzb21lXCI7IGNvbnRlbnQ6IFwiXFxcXGYwNGNcIjt9LmNvbnRyb2xsZXIgLnBsYXkucGF1c2VkOmFmdGVyIHsgY29udGVudDogXCJcXFxcZjA0YlwiO30uY29udHJvbGxlciAudm9sdW1lIHsgIG1pbi13aWR0aDogMzBweDsgIHBvc2l0aW9uOiByZWxhdGl2ZTsgb3ZlcmZsb3c6IGhpZGRlbjsgLXdlYmtpdC10cmFuc2l0aW9uOiBtaW4td2lkdGggMC4zcyBlYXNlIDAuNXM7IC1tb3otdHJhbnNpdGlvbjogbWluLXdpZHRoIDAuM3MgZWFzZSAwLjVzOyAgdHJhbnNpdGlvbjogbWluLXdpZHRoIDAuM3MgZWFzZSAwLjVzO30uY29udHJvbGxlciAudm9sdW1lOmhvdmVyIHsgbWluLXdpZHRoOiAxMjhweDt9LmNvbnRyb2xsZXIgLnZvbHVtZTpiZWZvcmUgeyAgZm9udC1mYW1pbHk6IFwiRm9udEF3ZXNvbWVcIjsgY29udGVudDogXCJcXFxcZjAyOFwiOyAgd2lkdGg6IDM2cHg7ICBkaXNwbGF5OiBibG9jazt9LmNvbnRyb2xsZXIgLnZvbHVtZSAucHJvZ3Jlc3MgeyB3aWR0aDogNzBweDsgIHRvcDogMjdweDsgIGxlZnQ6IDQwcHg7fS5jb250cm9sbGVyIC50aW1lIHsgZm9udC1zaXplOiAxMnB4OyAgZm9udC13ZWlnaHQ6IGJvbGQ7ICBwYWRkaW5nLWxlZnQ6IDEwcHg7fS5jb250cm9sbGVyIC50aW1lIC5jdXJyZW50IHsgIGNvbG9yOiAjREY2NTU4O30uY29udHJvbGxlciAuZnVsbHNjcmVlbiwuY29udHJvbGxlciAuYWlycGxheSwuY29udHJvbGxlciAuYWxsc2NyZWVuLC5jb250cm9sbGVyIC5jb21tZW50cy1idG4sLmNvbnRyb2xsZXIgLm5vcm1hbHNjcmVlbiB7IHdpZHRoOiAzNnB4OyAgY3Vyc29yOiBwb2ludGVyO30uY29udHJvbGxlciAuY29tbWVudHMtYnRuIHsgIG1hcmdpbi1yaWdodDogLTE1cHg7ICBkaXNwbGF5OiBub25lO30ucGxheWVyLmhhcy1jb21tZW50cyAuY29udHJvbGxlciAuY29tbWVudHMtYnRuIHsgZGlzcGxheTogYmxvY2s7fS5jb250cm9sbGVyIC5jb21tZW50cy1idG46YmVmb3JlIHsgIGZvbnQtZmFtaWx5OiBcIkZvbnRBd2Vzb21lXCI7IGNvbnRlbnQ6IFwiXFxcXGYwNzVcIjt9LmNvbnRyb2xsZXIgLmNvbW1lbnRzLWJ0bi5lbmFibGU6YmVmb3JlIHsgIGNvbG9yOiAjREY2NTU4O30uY29udHJvbGxlciAuYWlycGxheSwuY29udHJvbGxlciAubm9ybWFsc2NyZWVuIHsgIGRpc3BsYXk6IG5vbmU7fS5wbGF5ZXI6LXdlYmtpdC1mdWxsLXNjcmVlbiAuY29udHJvbGxlciAuZnVsbHNjcmVlbiwucGxheWVyOi13ZWJraXQtZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgLmFsbHNjcmVlbiB7IGRpc3BsYXk6IG5vbmU7fS5wbGF5ZXI6LXdlYmtpdC1mdWxsLXNjcmVlbiAuY29udHJvbGxlciAubm9ybWFsc2NyZWVuLC5wbGF5ZXIuYWxsc2NyZWVuIC5jb250cm9sbGVyIC5ub3JtYWxzY3JlZW4sLnBsYXllci5zdXBwb3J0LWFpcnBsYXkgLmNvbnRyb2xsZXIgLmFpcnBsYXkgeyBkaXNwbGF5OiBibG9jazt9LnBsYXllci5hbGxzY3JlZW4gLmNvbnRyb2xsZXIgLmFsbHNjcmVlbiB7ICBkaXNwbGF5OiBub25lO30uY29udHJvbGxlciAuZnVsbHNjcmVlbjpiZWZvcmUgeyBmb250LWZhbWlseTogXCJGb250QXdlc29tZVwiOyBjb250ZW50OiBcIlxcXFxmMGIyXCI7fS5jb250cm9sbGVyIC5hbGxzY3JlZW46YmVmb3JlIHsgIGZvbnQtZmFtaWx5OiBcIkZvbnRBd2Vzb21lXCI7IGNvbnRlbnQ6IFwiXFxcXGYwNjVcIjt9LmNvbnRyb2xsZXIgLm5vcm1hbHNjcmVlbjpiZWZvcmUgeyBmb250LWZhbWlseTogXCJGb250QXdlc29tZVwiOyBjb250ZW50OiBcIlxcXFxmMDY2XCI7fS5jb250cm9sbGVyIC5haXJwbGF5IHsgYmFja2dyb3VuZDogdXJsKGRhdGE6aW1hZ2Uvc3ZnK3htbDtiYXNlNjQsUEQ5NGJXd2dkbVZ5YzJsdmJqMGlNUzR3SWlCbGJtTnZaR2x1WnowaWRYUm1MVGdpUHo0OElVUlBRMVJaVUVVZ2MzWm5JRkJWUWt4SlF5QWlMUzh2VnpOREx5OUVWRVFnVTFaSElERXVNUzh2UlU0aUlDSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OUhjbUZ3YUdsamN5OVRWa2N2TVM0eEwwUlVSQzl6ZG1jeE1TNWtkR1FpUGp4emRtY2dkbVZ5YzJsdmJqMGlNUzR4SWlCcFpEMGliV0Z0WVMxaGFYSndiR0Y1TFdsamIyNGlJSGh0Ykc1elBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMlp5SWdlRzFzYm5NNmVHeHBibXM5SW1oMGRIQTZMeTkzZDNjdWR6TXViM0puTHpFNU9Ua3ZlR3hwYm1zaUlIZzlJakJ3ZUNJZ2VUMGlNSEI0SWlCM2FXUjBhRDBpTWpKd2VDSWdhR1ZwWjJoMFBTSXhObkI0SWlCMmFXVjNRbTk0UFNJd0lEQWdNaklnTVRZaUlIaHRiRHB6Y0dGalpUMGljSEpsYzJWeWRtVWlQanh3YjJ4NWJHbHVaU0J3YjJsdWRITTlJalVzTVRJZ01Td3hNaUF4TERFZ01qRXNNU0F5TVN3eE1pQXhOeXd4TWlJZ2MzUjViR1U5SW1acGJHdzZkSEpoYm5Od1lYSmxiblE3YzNSeWIydGxPbmRvYVhSbE8zTjBjbTlyWlMxM2FXUjBhRG94SWk4K1BIQnZiSGxzYVc1bElIQnZhVzUwY3owaU5Dd3hOaUF4TVN3eE1DQXhPQ3d4TmlJZ2MzUjViR1U5SW1acGJHdzZkMmhwZEdVN2MzUnliMnRsT25SeVlXNXpjR0Z5Wlc1ME8zTjBjbTlyWlMxM2FXUjBhRG93SWk4K1BDOXpkbWMrRFFvPSkgbm8tcmVwZWF0IGNlbnRlciAyMHB4OyAgYmFja2dyb3VuZC1zaXplOiAyMnB4IGF1dG87fS5jb250cm9sbGVyIC5oZCB7IHdoaXRlLXNwYWNlOm5vd3JhcDsgb3ZlcmZsb3c6IGhpZGRlbjsgbWFyZ2luLXJpZ2h0OiAxMHB4OyB0ZXh0LWFsaWduOiByaWdodDt9LmNvbnRyb2xsZXIgLmhkOmhvdmVyIGxpIHsgbWF4LXdpZHRoOiAzMDBweDt9LmNvbnRyb2xsZXIgLmhkIGxpIHsgIGRpc3BsYXk6IGlubGluZS1ibG9jazsgIG1heC13aWR0aDogMHB4OyAtd2Via2l0LXRyYW5zaXRpb246IG1heC13aWR0aCAwLjhzIGVhc2UgMC4zczsgLW1vei10cmFuc2l0aW9uOiBtYXgtd2lkdGggMC44cyBlYXNlIDAuM3M7ICB0cmFuc2l0aW9uOiBtYXgtd2lkdGggMC44cyBlYXNlIDAuM3M7IG92ZXJmbG93OiBoaWRkZW47IGZvbnQtc2l6ZTogMTRweDsgIGZvbnQtd2VpZ2h0OiBib2xkOyAgcG9zaXRpb246IHJlbGF0aXZlOyBjdXJzb3I6IHBvaW50ZXI7fS5jb250cm9sbGVyIC5oZCBsaTpiZWZvcmUgeyAgY29udGVudDogXCJcIjsgIGRpc3BsYXk6IGlubGluZS1ibG9jazsgIHdpZHRoOjIwcHg7fS5jb250cm9sbGVyIC5oZCBsaTpiZWZvcmUgeyBjb250ZW50OiBcIlwiOyAgZGlzcGxheTogaW5saW5lLWJsb2NrOyAgd2lkdGg6MjBweDt9LmNvbnRyb2xsZXIgLmhkIGxpLmN1cnIgeyBtYXgtd2lkdGg6IDMwMHB4OyBjdXJzb3I6IGRlZmF1bHQ7ICBjb2xvcjogI0RGNjU1ODt9LmNvbnRyb2xsZXIgLmhkIGxpLmN1cnI6YWZ0ZXIgeyBjb250ZW50OiBcIlwiOyAgZGlzcGxheTogYmxvY2s7IHBvc2l0aW9uOiBhYnNvbHV0ZTsgd2lkdGg6NHB4OyAgaGVpZ2h0OjRweDsgYm9yZGVyLXJhZGl1czogNTAlOyBiYWNrZ3JvdW5kOiAjZmZmZmZmOyAgbGVmdDogMTJweDsgdG9wOiAyM3B4OyAgb3BhY2l0eTogMDsgLXdlYmtpdC10cmFuc2l0aW9uOiBvcGFjaXR5IDAuNXMgZWFzZSAwLjNzOyAtbW96LXRyYW5zaXRpb246IG9wYWNpdHkgMC41cyBlYXNlIDAuM3M7ICB0cmFuc2l0aW9uOiBvcGFjaXR5IDAuNXMgZWFzZSAwLjNzO30nfSx7fV0sMTM6W2Z1bmN0aW9uKGUsdCl7dC5leHBvcnRzPSc8ZGl2IGNsYXNzPVwicGxheWVyXCI+ICA8ZGl2IGNsYXNzPVwidmlkZW8tZnJhbWVcIj48dmlkZW8gY2xhc3M9XCJ2aWRlb1wiIGF1dG9wbGF5PVwiYXV0b3BsYXlcIj48L3ZpZGVvPjxjYW52YXMgY2xhc3M9XCJjb21tZW50c1wiPjwvY2FudmFzPjwvZGl2PiAgPGRpdiBjbGFzcz1cImNvbnRyb2xsZXJcIj4gICAgPGRpdiBjbGFzcz1cImxvYWRpbmctaWNvbiBmYSBmYS1zcGluIGZhLWNpcmNsZS1vLW5vdGNoXCI+PC9kaXY+ICAgPGRpdiBjbGFzcz1cInByb2dyZXNzXCI+ICAgICAgPGRpdiBjbGFzcz1cImFuY2hvciBidWZmZXJlZF9hbmNob3JcIiBzdHlsZT1cIndpZHRoOjAlXCI+PC9kaXY+ICAgICA8ZGl2IGNsYXNzPVwiYW5jaG9yIHByb2dyZXNzX2FuY2hvclwiIHN0eWxlPVwid2lkdGg6MCVcIj48L2Rpdj4gICA8L2Rpdj4gICAgPGRpdiBjbGFzcz1cInJpZ2h0XCI+ICAgICA8ZGl2IGNsYXNzPVwiZnVsbHNjcmVlblwiPjwvZGl2PiAgICAgIDxkaXYgY2xhc3M9XCJhbGxzY3JlZW5cIj48L2Rpdj4gICAgIDxkaXYgY2xhc3M9XCJub3JtYWxzY3JlZW5cIj48L2Rpdj4gICAgICA8ZGl2IGNsYXNzPVwiYWlycGxheVwiPjwvZGl2PiAgICAgPHVsIGNsYXNzPVwiaGRcIj48L3VsPiAgICAgIDxkaXYgY2xhc3M9XCJjb21tZW50cy1idG5cIj48L2Rpdj4gICAgIDwvZGl2PiAgICA8ZGl2IGNsYXNzPVwibGVmdFwiPiAgICAgPGRpdiBjbGFzcz1cInBsYXkgcGF1c2VkXCI+PC9kaXY+ICAgICA8ZGl2IGNsYXNzPVwidm9sdW1lXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3NcIj4gICAgICAgICAgPGRpdiBjbGFzcz1cImFuY2hvciB2b2x1bWVfYW5jaG9yXCIgc3R5bGU9XCJ3aWR0aDowJVwiPjwvZGl2PiAgICAgICA8L2Rpdj4gICAgICA8L2Rpdj4gICAgICA8ZGl2IGNsYXNzPVwidGltZVwiPiAgICAgICAgPHNwYW4gY2xhc3M9XCJjdXJyZW50XCI+MDA6MDA6MDA8L3NwYW4+IC8gPHNwYW4gY2xhc3M9XCJkdXJhdGlvblwiPjAwOjAwOjAwPC9zcGFuPiAgICAgIDwvZGl2PiAgICAgPC9kaXY+IDwvZGl2PjwvZGl2Pid9LHt9XSwxNDpbZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBpKGUsdCl7cmV0dXJuKEFycmF5KHQpLmpvaW4oMCkrZSkuc2xpY2UoLXQpfWZ1bmN0aW9uIG4oZSl7dmFyIHQsbj1bXTtyZXR1cm5bMzYwMCw2MCwxXS5mb3JFYWNoKGZ1bmN0aW9uKG8pe24ucHVzaChpKHQ9ZS9vfDAsMikpLGUtPXQqb30pLG4uam9pbihcIjpcIil9dC5leHBvcnRzPW59LHt9XX0se30sWzEwXSk7XG5cbi8vZXhwb3J0c1xubW9kdWxlLmV4cG9ydHMgPSBNQU1BUGxheWVyOyIsIi8qXG4gKiBQdXJsIChBIEphdmFTY3JpcHQgVVJMIHBhcnNlcikgdjIuMy4xXG4gKiBEZXZlbG9wZWQgYW5kIG1haW50YW5pbmVkIGJ5IE1hcmsgUGVya2lucywgbWFya0BhbGxtYXJrZWR1cC5jb21cbiAqIFNvdXJjZSByZXBvc2l0b3J5OiBodHRwczovL2dpdGh1Yi5jb20vYWxsbWFya2VkdXAvalF1ZXJ5LVVSTC1QYXJzZXJcbiAqIExpY2Vuc2VkIHVuZGVyIGFuIE1JVC1zdHlsZSBsaWNlbnNlLiBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2FsbG1hcmtlZHVwL2pRdWVyeS1VUkwtUGFyc2VyL2Jsb2IvbWFzdGVyL0xJQ0VOU0UgZm9yIGRldGFpbHMuXG4gKi9cblxudmFyIHRhZzJhdHRyID0ge1xuICAgICAgICBhICAgICAgIDogJ2hyZWYnLFxuICAgICAgICBpbWcgICAgIDogJ3NyYycsXG4gICAgICAgIGZvcm0gICAgOiAnYWN0aW9uJyxcbiAgICAgICAgYmFzZSAgICA6ICdocmVmJyxcbiAgICAgICAgc2NyaXB0ICA6ICdzcmMnLFxuICAgICAgICBpZnJhbWUgIDogJ3NyYycsXG4gICAgICAgIGxpbmsgICAgOiAnaHJlZicsXG4gICAgICAgIGVtYmVkICAgOiAnc3JjJyxcbiAgICAgICAgb2JqZWN0ICA6ICdkYXRhJ1xuICAgIH0sXG5cbiAgICBrZXkgPSBbJ3NvdXJjZScsICdwcm90b2NvbCcsICdhdXRob3JpdHknLCAndXNlckluZm8nLCAndXNlcicsICdwYXNzd29yZCcsICdob3N0JywgJ3BvcnQnLCAncmVsYXRpdmUnLCAncGF0aCcsICdkaXJlY3RvcnknLCAnZmlsZScsICdxdWVyeScsICdmcmFnbWVudCddLCAvLyBrZXlzIGF2YWlsYWJsZSB0byBxdWVyeVxuXG4gICAgYWxpYXNlcyA9IHsgJ2FuY2hvcicgOiAnZnJhZ21lbnQnIH0sIC8vIGFsaWFzZXMgZm9yIGJhY2t3YXJkcyBjb21wYXRhYmlsaXR5XG5cbiAgICBwYXJzZXIgPSB7XG4gICAgICAgIHN0cmljdCA6IC9eKD86KFteOlxcLz8jXSspOik/KD86XFwvXFwvKCg/OigoW146QF0qKTo/KFteOkBdKikpP0ApPyhbXjpcXC8/I10qKSg/OjooXFxkKikpPykpPygoKCg/OltePyNcXC9dKlxcLykqKShbXj8jXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLywgIC8vbGVzcyBpbnR1aXRpdmUsIG1vcmUgYWNjdXJhdGUgdG8gdGhlIHNwZWNzXG4gICAgICAgIGxvb3NlIDogIC9eKD86KD8hW146QF0rOlteOkBcXC9dKkApKFteOlxcLz8jLl0rKTopPyg/OlxcL1xcLyk/KCg/OigoW146QF0qKTo/KFteOkBdKikpP0ApPyhbXjpcXC8/I10qKSg/OjooXFxkKikpPykoKChcXC8oPzpbXj8jXSg/IVtePyNcXC9dKlxcLltePyNcXC8uXSsoPzpbPyNdfCQpKSkqXFwvPyk/KFtePyNcXC9dKikpKD86XFw/KFteI10qKSk/KD86IyguKikpPykvIC8vIG1vcmUgaW50dWl0aXZlLCBmYWlscyBvbiByZWxhdGl2ZSBwYXRocyBhbmQgZGV2aWF0ZXMgZnJvbSBzcGVjc1xuICAgIH0sXG5cbiAgICBpc2ludCA9IC9eWzAtOV0rJC87XG5cbmZ1bmN0aW9uIHBhcnNlVXJpKCB1cmwsIHN0cmljdE1vZGUgKSB7XG4gICAgdmFyIHN0ciA9IGRlY29kZVVSSSggdXJsICksXG4gICAgcmVzICAgPSBwYXJzZXJbIHN0cmljdE1vZGUgfHwgZmFsc2UgPyAnc3RyaWN0JyA6ICdsb29zZScgXS5leGVjKCBzdHIgKSxcbiAgICB1cmkgPSB7IGF0dHIgOiB7fSwgcGFyYW0gOiB7fSwgc2VnIDoge30gfSxcbiAgICBpICAgPSAxNDtcblxuICAgIHdoaWxlICggaS0tICkge1xuICAgICAgICB1cmkuYXR0clsga2V5W2ldIF0gPSByZXNbaV0gfHwgJyc7XG4gICAgfVxuXG4gICAgLy8gYnVpbGQgcXVlcnkgYW5kIGZyYWdtZW50IHBhcmFtZXRlcnNcbiAgICB1cmkucGFyYW1bJ3F1ZXJ5J10gPSBwYXJzZVN0cmluZyh1cmkuYXR0clsncXVlcnknXSk7XG4gICAgdXJpLnBhcmFtWydmcmFnbWVudCddID0gcGFyc2VTdHJpbmcodXJpLmF0dHJbJ2ZyYWdtZW50J10pO1xuXG4gICAgLy8gc3BsaXQgcGF0aCBhbmQgZnJhZ2VtZW50IGludG8gc2VnbWVudHNcbiAgICB1cmkuc2VnWydwYXRoJ10gPSB1cmkuYXR0ci5wYXRoLnJlcGxhY2UoL15cXC8rfFxcLyskL2csJycpLnNwbGl0KCcvJyk7XG4gICAgdXJpLnNlZ1snZnJhZ21lbnQnXSA9IHVyaS5hdHRyLmZyYWdtZW50LnJlcGxhY2UoL15cXC8rfFxcLyskL2csJycpLnNwbGl0KCcvJyk7XG5cbiAgICAvLyBjb21waWxlIGEgJ2Jhc2UnIGRvbWFpbiBhdHRyaWJ1dGVcbiAgICB1cmkuYXR0clsnYmFzZSddID0gdXJpLmF0dHIuaG9zdCA/ICh1cmkuYXR0ci5wcm90b2NvbCA/ICB1cmkuYXR0ci5wcm90b2NvbCsnOi8vJyt1cmkuYXR0ci5ob3N0IDogdXJpLmF0dHIuaG9zdCkgKyAodXJpLmF0dHIucG9ydCA/ICc6Jyt1cmkuYXR0ci5wb3J0IDogJycpIDogJyc7XG5cbiAgICByZXR1cm4gdXJpO1xufVxuXG5mdW5jdGlvbiBnZXRBdHRyTmFtZSggZWxtICkge1xuICAgIHZhciB0biA9IGVsbS50YWdOYW1lO1xuICAgIGlmICggdHlwZW9mIHRuICE9PSAndW5kZWZpbmVkJyApIHJldHVybiB0YWcyYXR0clt0bi50b0xvd2VyQ2FzZSgpXTtcbiAgICByZXR1cm4gdG47XG59XG5cbmZ1bmN0aW9uIHByb21vdGUocGFyZW50LCBrZXkpIHtcbiAgICBpZiAocGFyZW50W2tleV0ubGVuZ3RoID09PSAwKSByZXR1cm4gcGFyZW50W2tleV0gPSB7fTtcbiAgICB2YXIgdCA9IHt9O1xuICAgIGZvciAodmFyIGkgaW4gcGFyZW50W2tleV0pIHRbaV0gPSBwYXJlbnRba2V5XVtpXTtcbiAgICBwYXJlbnRba2V5XSA9IHQ7XG4gICAgcmV0dXJuIHQ7XG59XG5cbmZ1bmN0aW9uIHBhcnNlKHBhcnRzLCBwYXJlbnQsIGtleSwgdmFsKSB7XG4gICAgdmFyIHBhcnQgPSBwYXJ0cy5zaGlmdCgpO1xuICAgIGlmICghcGFydCkge1xuICAgICAgICBpZiAoaXNBcnJheShwYXJlbnRba2V5XSkpIHtcbiAgICAgICAgICAgIHBhcmVudFtrZXldLnB1c2godmFsKTtcbiAgICAgICAgfSBlbHNlIGlmICgnb2JqZWN0JyA9PSB0eXBlb2YgcGFyZW50W2tleV0pIHtcbiAgICAgICAgICAgIHBhcmVudFtrZXldID0gdmFsO1xuICAgICAgICB9IGVsc2UgaWYgKCd1bmRlZmluZWQnID09IHR5cGVvZiBwYXJlbnRba2V5XSkge1xuICAgICAgICAgICAgcGFyZW50W2tleV0gPSB2YWw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnRba2V5XSA9IFtwYXJlbnRba2V5XSwgdmFsXTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBvYmogPSBwYXJlbnRba2V5XSA9IHBhcmVudFtrZXldIHx8IFtdO1xuICAgICAgICBpZiAoJ10nID09IHBhcnQpIHtcbiAgICAgICAgICAgIGlmIChpc0FycmF5KG9iaikpIHtcbiAgICAgICAgICAgICAgICBpZiAoJycgIT09IHZhbCkgb2JqLnB1c2godmFsKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJ29iamVjdCcgPT0gdHlwZW9mIG9iaikge1xuICAgICAgICAgICAgICAgIG9ialtrZXlzKG9iaikubGVuZ3RoXSA9IHZhbDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgb2JqID0gcGFyZW50W2tleV0gPSBbcGFyZW50W2tleV0sIHZhbF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAofnBhcnQuaW5kZXhPZignXScpKSB7XG4gICAgICAgICAgICBwYXJ0ID0gcGFydC5zdWJzdHIoMCwgcGFydC5sZW5ndGggLSAxKTtcbiAgICAgICAgICAgIGlmICghaXNpbnQudGVzdChwYXJ0KSAmJiBpc0FycmF5KG9iaikpIG9iaiA9IHByb21vdGUocGFyZW50LCBrZXkpO1xuICAgICAgICAgICAgcGFyc2UocGFydHMsIG9iaiwgcGFydCwgdmFsKTtcbiAgICAgICAgICAgIC8vIGtleVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKCFpc2ludC50ZXN0KHBhcnQpICYmIGlzQXJyYXkob2JqKSkgb2JqID0gcHJvbW90ZShwYXJlbnQsIGtleSk7XG4gICAgICAgICAgICBwYXJzZShwYXJ0cywgb2JqLCBwYXJ0LCB2YWwpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiBtZXJnZShwYXJlbnQsIGtleSwgdmFsKSB7XG4gICAgaWYgKH5rZXkuaW5kZXhPZignXScpKSB7XG4gICAgICAgIHZhciBwYXJ0cyA9IGtleS5zcGxpdCgnWycpO1xuICAgICAgICBwYXJzZShwYXJ0cywgcGFyZW50LCAnYmFzZScsIHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFpc2ludC50ZXN0KGtleSkgJiYgaXNBcnJheShwYXJlbnQuYmFzZSkpIHtcbiAgICAgICAgICAgIHZhciB0ID0ge307XG4gICAgICAgICAgICBmb3IgKHZhciBrIGluIHBhcmVudC5iYXNlKSB0W2tdID0gcGFyZW50LmJhc2Vba107XG4gICAgICAgICAgICBwYXJlbnQuYmFzZSA9IHQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGtleSAhPT0gJycpIHtcbiAgICAgICAgICAgIHNldChwYXJlbnQuYmFzZSwga2V5LCB2YWwpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYXJlbnQ7XG59XG5cbmZ1bmN0aW9uIHBhcnNlU3RyaW5nKHN0cikge1xuICAgIHJldHVybiByZWR1Y2UoU3RyaW5nKHN0cikuc3BsaXQoLyZ8Oy8pLCBmdW5jdGlvbihyZXQsIHBhaXIpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHBhaXIgPSBkZWNvZGVVUklDb21wb25lbnQocGFpci5yZXBsYWNlKC9cXCsvZywgJyAnKSk7XG4gICAgICAgIH0gY2F0Y2goZSkge1xuICAgICAgICAgICAgLy8gaWdub3JlXG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVxbCA9IHBhaXIuaW5kZXhPZignPScpLFxuICAgICAgICAgICAgYnJhY2UgPSBsYXN0QnJhY2VJbktleShwYWlyKSxcbiAgICAgICAgICAgIGtleSA9IHBhaXIuc3Vic3RyKDAsIGJyYWNlIHx8IGVxbCksXG4gICAgICAgICAgICB2YWwgPSBwYWlyLnN1YnN0cihicmFjZSB8fCBlcWwsIHBhaXIubGVuZ3RoKTtcblxuICAgICAgICB2YWwgPSB2YWwuc3Vic3RyKHZhbC5pbmRleE9mKCc9JykgKyAxLCB2YWwubGVuZ3RoKTtcblxuICAgICAgICBpZiAoa2V5ID09PSAnJykge1xuICAgICAgICAgICAga2V5ID0gcGFpcjtcbiAgICAgICAgICAgIHZhbCA9ICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG1lcmdlKHJldCwga2V5LCB2YWwpO1xuICAgIH0sIHsgYmFzZToge30gfSkuYmFzZTtcbn1cblxuZnVuY3Rpb24gc2V0KG9iaiwga2V5LCB2YWwpIHtcbiAgICB2YXIgdiA9IG9ialtrZXldO1xuICAgIGlmICh0eXBlb2YgdiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgb2JqW2tleV0gPSB2YWw7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5KHYpKSB7XG4gICAgICAgIHYucHVzaCh2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIG9ialtrZXldID0gW3YsIHZhbF07XG4gICAgfVxufVxuXG5mdW5jdGlvbiBsYXN0QnJhY2VJbktleShzdHIpIHtcbiAgICB2YXIgbGVuID0gc3RyLmxlbmd0aCxcbiAgICAgICAgYnJhY2UsXG4gICAgICAgIGM7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSkge1xuICAgICAgICBjID0gc3RyW2ldO1xuICAgICAgICBpZiAoJ10nID09IGMpIGJyYWNlID0gZmFsc2U7XG4gICAgICAgIGlmICgnWycgPT0gYykgYnJhY2UgPSB0cnVlO1xuICAgICAgICBpZiAoJz0nID09IGMgJiYgIWJyYWNlKSByZXR1cm4gaTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlZHVjZShvYmosIGFjY3VtdWxhdG9yKXtcbiAgICB2YXIgaSA9IDAsXG4gICAgICAgIGwgPSBvYmoubGVuZ3RoID4+IDAsXG4gICAgICAgIGN1cnIgPSBhcmd1bWVudHNbMl07XG4gICAgd2hpbGUgKGkgPCBsKSB7XG4gICAgICAgIGlmIChpIGluIG9iaikgY3VyciA9IGFjY3VtdWxhdG9yLmNhbGwodW5kZWZpbmVkLCBjdXJyLCBvYmpbaV0sIGksIG9iaik7XG4gICAgICAgICsraTtcbiAgICB9XG4gICAgcmV0dXJuIGN1cnI7XG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkodkFyZykge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodkFyZykgPT09IFwiW29iamVjdCBBcnJheV1cIjtcbn1cblxuZnVuY3Rpb24ga2V5cyhvYmopIHtcbiAgICB2YXIga2V5X2FycmF5ID0gW107XG4gICAgZm9yICggdmFyIHByb3AgaW4gb2JqICkge1xuICAgICAgICBpZiAoIG9iai5oYXNPd25Qcm9wZXJ0eShwcm9wKSApIGtleV9hcnJheS5wdXNoKHByb3ApO1xuICAgIH1cbiAgICByZXR1cm4ga2V5X2FycmF5O1xufVxuXG5mdW5jdGlvbiBwdXJsKCB1cmwsIHN0cmljdE1vZGUgKSB7XG4gICAgaWYgKCBhcmd1bWVudHMubGVuZ3RoID09PSAxICYmIHVybCA9PT0gdHJ1ZSApIHtcbiAgICAgICAgc3RyaWN0TW9kZSA9IHRydWU7XG4gICAgICAgIHVybCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgc3RyaWN0TW9kZSA9IHN0cmljdE1vZGUgfHwgZmFsc2U7XG4gICAgdXJsID0gdXJsIHx8IHdpbmRvdy5sb2NhdGlvbi50b1N0cmluZygpO1xuXG4gICAgcmV0dXJuIHtcblxuICAgICAgICBkYXRhIDogcGFyc2VVcmkodXJsLCBzdHJpY3RNb2RlKSxcblxuICAgICAgICAvLyBnZXQgdmFyaW91cyBhdHRyaWJ1dGVzIGZyb20gdGhlIFVSSVxuICAgICAgICBhdHRyIDogZnVuY3Rpb24oIGF0dHIgKSB7XG4gICAgICAgICAgICBhdHRyID0gYWxpYXNlc1thdHRyXSB8fCBhdHRyO1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBhdHRyICE9PSAndW5kZWZpbmVkJyA/IHRoaXMuZGF0YS5hdHRyW2F0dHJdIDogdGhpcy5kYXRhLmF0dHI7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gcmV0dXJuIHF1ZXJ5IHN0cmluZyBwYXJhbWV0ZXJzXG4gICAgICAgIHBhcmFtIDogZnVuY3Rpb24oIHBhcmFtICkge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBwYXJhbSAhPT0gJ3VuZGVmaW5lZCcgPyB0aGlzLmRhdGEucGFyYW0ucXVlcnlbcGFyYW1dIDogdGhpcy5kYXRhLnBhcmFtLnF1ZXJ5O1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHJldHVybiBmcmFnbWVudCBwYXJhbWV0ZXJzXG4gICAgICAgIGZwYXJhbSA6IGZ1bmN0aW9uKCBwYXJhbSApIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgcGFyYW0gIT09ICd1bmRlZmluZWQnID8gdGhpcy5kYXRhLnBhcmFtLmZyYWdtZW50W3BhcmFtXSA6IHRoaXMuZGF0YS5wYXJhbS5mcmFnbWVudDtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyByZXR1cm4gcGF0aCBzZWdtZW50c1xuICAgICAgICBzZWdtZW50IDogZnVuY3Rpb24oIHNlZyApIHtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIHNlZyA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5zZWcucGF0aDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgc2VnID0gc2VnIDwgMCA/IHRoaXMuZGF0YS5zZWcucGF0aC5sZW5ndGggKyBzZWcgOiBzZWcgLSAxOyAvLyBuZWdhdGl2ZSBzZWdtZW50cyBjb3VudCBmcm9tIHRoZSBlbmRcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnNlZy5wYXRoW3NlZ107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gcmV0dXJuIGZyYWdtZW50IHNlZ21lbnRzXG4gICAgICAgIGZzZWdtZW50IDogZnVuY3Rpb24oIHNlZyApIHtcbiAgICAgICAgICAgIGlmICggdHlwZW9mIHNlZyA9PT0gJ3VuZGVmaW5lZCcgKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5zZWcuZnJhZ21lbnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlZyA9IHNlZyA8IDAgPyB0aGlzLmRhdGEuc2VnLmZyYWdtZW50Lmxlbmd0aCArIHNlZyA6IHNlZyAtIDE7IC8vIG5lZ2F0aXZlIHNlZ21lbnRzIGNvdW50IGZyb20gdGhlIGVuZFxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEuc2VnLmZyYWdtZW50W3NlZ107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH07XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBwdXJsO1xuIiwiLyogIO+8g2Z1bmN0aW9uIHF1ZXJ5U3RyaW5nI1xuICogIDwgT2JqZWN0ICAg5L6L5aaCIHthOjEsYjoyLGM6M31cbiAqICA+IFN0cmluZyAgIOS+i+WmgiBhPTEmYj0yJmM9M1xuICogIOeUqOS6juaLvOijhXVybOWcsOWdgOeahHF1ZXJ5XG4gKi9cbmZ1bmN0aW9uIHF1ZXJ5U3RyaW5nIChvYmopIHtcblx0dmFyIHF1ZXJ5ID0gW11cblx0Zm9yIChvbmUgaW4gb2JqKSB7XG5cdFx0aWYgKG9iai5oYXNPd25Qcm9wZXJ0eShvbmUpKSB7XG5cdFx0XHRxdWVyeS5wdXNoKFtvbmUsIG9ialtvbmVdXS5qb2luKCc9JykpXG5cdFx0fVxuXHR9XG5cdHJldHVybiBxdWVyeS5qb2luKCcmJylcbn1cbm1vZHVsZS5leHBvcnRzID0gcXVlcnlTdHJpbmciLCIvKiAgOTFwb3JuIFxuICogIEBTbm9vemUgMjAxNS03LTI2XG4gKi9cbnZhciBjYW5QbGF5TTNVOCA9IHJlcXVpcmUoJy4vY2FuUGxheU0zVTgnKVxudmFyIGFqYXggICAgICAgID0gcmVxdWlyZSgnLi9hamF4JylcbnZhciBsb2cgICAgICAgICA9IHJlcXVpcmUoJy4vbG9nJylcblxuZXhwb3J0cy5tYXRjaCA9IGZ1bmN0aW9uICh1cmwpIHtcblx0aWYgKHdpbmRvdy5zbyAmJiB3aW5kb3cuc28udmFyaWFibGVzKSB7XG5cdFx0dmFyIGZpbGVJZCA9IHdpbmRvdy5zby52YXJpYWJsZXMuZmlsZVxuXHRcdHZhciBzZWNDb2RlID0gd2luZG93LnNvLnZhcmlhYmxlcy5zZWNjb2RlXG5cdFx0dmFyIG1heF92aWQgPSB3aW5kb3cuc28udmFyaWFibGVzLm1heF92aWRcblx0XHRyZXR1cm4gISFmaWxlSWQgJiAhIXNlY0NvZGUgJiAhIW1heF92aWQgJiBcblx0XHRcdC92aWV3X3ZpZGVvXFwucGhwXFw/dmlld2tleS8udGVzdCggdXJsLmF0dHIoJ3NvdXJjZScpIClcblx0fVxuXHRyZXR1cm4gZmFsc2U7XG59XG5cbmV4cG9ydHMuZ2V0VmlkZW9zID0gZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHtcdFxuXHQvL3ZhciBtZWRpYVNwYWNlSFRNTCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWVkaWFzcGFjZVwiKS5pbm5lckhUTUxcblx0Ly92YXIgZmlsZUlkID0gL2ZpbGUnLCcoLio/KScvaS5leGVjKG1lZGlhU3BhY2VIVE1MKVsxXVxuXHQvL3ZhciBzZWNDb2RlID0gL3NlY2NvZGUnLCcoLio/KScvaS5leGVjKG1lZGlhU3BhY2VIVE1MKVsxXVxuXHQvL3ZhciBtYXhfdmlkID0gL21heF9iaWQnLCcoLio/KScvaS5leGVjKG1lZGlhU3BhY2VIVE1MKVsxXVxuXHR2YXIgZmlsZUlkID0gd2luZG93LnNvLnZhcmlhYmxlcy5maWxlXG5cdHZhciBzZWNDb2RlID0gd2luZG93LnNvLnZhcmlhYmxlcy5zZWNjb2RlXG5cdHZhciBtYXhfdmlkID0gd2luZG93LnNvLnZhcmlhYmxlcy5tYXhfdmlkXG5cdFxuXG5cdHZhciBtcDQgPSBmdW5jdGlvbihjYWxsYmFjayl7XG5cdFx0YWpheCh7XG5cdFx0XHR1cmw6ICdodHRwOi8vd3d3LjkxcG9ybi5jb20vZ2V0ZmlsZS5waHAnLFxuXHRcdFx0anNvbnA6IGZhbHNlLFxuXHRcdFx0cGFyYW06IHtcblx0XHRcdFx0VklEOiBmaWxlSWQsXG5cdFx0XHRcdG1wNDogJzAnLFxuXHRcdFx0XHRzZWNjb2RlOiBzZWNDb2RlLFxuXHRcdFx0XHRtYXhfdmlkOiBtYXhfdmlkXG5cdFx0XHR9LFxuXHRcdFx0Y29udGVudFR5cGU6ICdub3RKU09OJyxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihwYXJhbSl7XG5cdFx0XHRcdGlmKHBhcmFtID09IC0xIHx8IHBhcmFtLmNvZGUgPT0gLTEpIHJldHVybiBsb2coJ+ino+aekDkxcG9ybuinhumikeWcsOWdgOWksei0pScpXG5cdFx0XHRcdG1wNFVybCA9IHBhcmFtLnNwbGl0KCc9JylbMV0uc3BsaXQoJyYnKVswXVxuXHRcdFx0XHR2YXIgdXJscyA9IFtdXG5cdFx0XHRcdHVybHMucHVzaChbJ+S9jua4heeJiCcsIG1wNFVybF0pXG5cdFx0XHRcdGxvZygn6Kej5p6QOTFwb3Ju6KeG6aKR5Zyw5Z2A5oiQ5YqfICcgKyB1cmxzLm1hcChmdW5jdGlvbiAoaXRlbSkge3JldHVybiAnPGEgaHJlZj0nK2l0ZW1bMV0rJz4nK2l0ZW1bMF0rJzwvYT4nfSkuam9pbignICcpLCAyKVxuXHRcdFx0XHQvLyBjb25zb2xlLmluZm8odXJscylcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKHVybHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9O1xuXHRtcDQoY2FsbGJhY2spXG59XG5cblxuXG4iLCIvKiAgYmlsaWJsaSBcbiAqICBA5pyx5LiAXG4gKi9cbnZhciBwdXJsICAgICAgPSByZXF1aXJlKCcuL3B1cmwnKVxudmFyIGxvZyAgICAgICA9IHJlcXVpcmUoJy4vbG9nJylcbnZhciBodHRwUHJveHkgPSByZXF1aXJlKCcuL2h0dHBQcm94eScpXG52YXIgZ2V0Q29va2llID0gcmVxdWlyZSgnLi9nZXRDb29raWUnKVxuXG5mdW5jdGlvbiBwYWQobnVtLCBuKSB7IFxuXHRyZXR1cm4gKEFycmF5KG4pLmpvaW4oMCkgKyBudW0pLnNsaWNlKC1uKVxufVxuXG5leHBvcnRzLm1hdGNoID0gZnVuY3Rpb24gKHVybCkge1xuXHRyZXR1cm4gdXJsLmF0dHIoJ2hvc3QnKS5pbmRleE9mKCdiaWxpYmlsaScpID49IDAgJiYgL15cXC92aWRlb1xcL2F2XFxkK1xcLyQvLnRlc3QodXJsLmF0dHIoJ2RpcmVjdG9yeScpKVxufVxuXG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG5cdGxvZygn5byA5aeL6Kej5p6QYmlsaWJsaeinhumikeWcsOWdgCcpXG5cdHZhciBhaWQgPSB1cmwuYXR0cignZGlyZWN0b3J5JykubWF0Y2goL15cXC92aWRlb1xcL2F2KFxcZCspXFwvJC8pWzFdXG5cdHZhciBwYWdlID0gKGZ1bmN0aW9uICgpIHtcblx0XHRwYWdlTWF0Y2ggPSB1cmwuYXR0cignZmlsZScpLm1hdGNoKC9eaW5kZXhcXF8oXFxkKylcXC5odG1sJC8pXG5cdFx0cmV0dXJuIHBhZ2VNYXRjaCA/IHBhZ2VNYXRjaFsxXSA6IDFcblx0fSgpKVxuXHRcblx0aHR0cFByb3h5KFxuXHRcdCdodHRwOi8vd3d3LmJpbGliaWxpLmNvbS9tL2h0bWw1JywgXG5cdFx0J2dldCcsIFxuXHRcdHthaWQ6IGFpZCwgcGFnZTogcGFnZSwgc2lkOiBnZXRDb29raWUoJ3NpZCcpfSxcblx0ZnVuY3Rpb24gKHJzKSB7XG5cdFx0aWYgKHJzICYmIHJzLnNyYykge1xuXHRcdFx0bG9nKCfojrflj5bliLA8YSBocmVmPVwiJytycy5zcmMrJ1wiPuinhumikeWcsOWdgDwvYT4sIOW5tuW8gOWni+ino+aekGJpbGlibGnlvLnluZUnKVxuXHRcdFx0dmFyIHNvdXJjZSA9IFsgWydiaWxpYmlsaScsIHJzLnNyY10gXVx0XHRcdFxuXHRcdFx0aHR0cFByb3h5KHJzLmNpZCwgJ2dldCcsIHt9LCBmdW5jdGlvbiAocnMpIHtcblxuXHRcdFx0XHRpZiAocnMgJiYgcnMuaSkge1x0XHRcdFx0XHRcblx0XHRcdFx0XHR2YXIgY29tbWVudHMgPSBbXS5jb25jYXQocnMuaS5kIHx8IFtdKVxuXHRcdFx0XHRcdGNvbW1lbnRzID0gY29tbWVudHMubWFwKGZ1bmN0aW9uIChjb21tZW50KSB7XG5cdFx0XHRcdFx0XHR2YXIgcCA9IGNvbW1lbnRbJ0BwJ10uc3BsaXQoJywnKVxuXHRcdFx0XHRcdFx0c3dpdGNoIChwWzFdIHwgMCkge1xuXHRcdFx0XHRcdFx0XHRjYXNlIDQ6ICBwWzFdID0gJ2JvdHRvbSc7IGJyZWFrXG5cdFx0XHRcdFx0XHRcdGNhc2UgNTogIHBbMV0gPSAgJ3RvcCc7IGJyZWFrXG5cdFx0XHRcdFx0XHRcdGRlZmF1bHQ6IHBbMV0gPSAnbG9vcCdcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdHJldHVybiB7XG5cdFx0XHRcdFx0XHRcdHRpbWU6IHBhcnNlRmxvYXQocFswXSksXG5cdFx0XHRcdFx0XHRcdHBvczogIHBbMV0sXG5cdFx0XHRcdFx0XHRcdGNvbG9yOiAnIycgKyBwYWQoKHBbM10gfCAwKS50b1N0cmluZygxNiksIDYpLFxuXHRcdFx0XHRcdFx0XHR0ZXh0OiBjb21tZW50WycjdGV4dCddXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSkuc29ydChmdW5jdGlvbiAoYSwgYikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIGEudGltZSAtIGIudGltZVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0bG9nKCfkuIDliIfpobrliKnlvIDlp4vmkq3mlL4nLCAyKVxuXHRcdFx0XHRcdGNhbGxiYWNrKHNvdXJjZSwgY29tbWVudHMpXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0bG9nKCfop6PmnpBiaWxpYmxp5by55bmV5aSx6LSlLCDkvYbli4nlvLrlj6/ku6Xmkq3mlL4nLCAyKVxuXHRcdFx0XHRcdGNhbGxiYWNrKHNvdXJjZSlcblx0XHRcdFx0fVxuXG5cdFx0XHR9LCB7Z3ppbmZsYXRlOjEsIHhtbDoxfSlcblx0XHR9IGVsc2Uge1xuXHRcdFx0bG9nKCfop6PmnpBiaWxpYmxp6KeG6aKR5Zyw5Z2A5aSx6LSlJywgMilcblx0XHRcdGNhbGxiYWNrKGZhbHNlKVxuXHRcdH1cblx0fSlcbn1cbiIsIi8qICB0dWRvdSBcbiAqICBA5pyx5LiAXG4gKi9cbnZhciBjYW5QbGF5TTNVOCA9IHJlcXVpcmUoJy4vY2FuUGxheU0zVTgnKVxudmFyIGFqYXggICAgICAgID0gcmVxdWlyZSgnLi9hamF4JylcbnZhciBsb2cgICAgICAgICA9IHJlcXVpcmUoJy4vbG9nJylcblxuZXhwb3J0cy5tYXRjaCA9IGZ1bmN0aW9uICh1cmwpIHtcblx0cmV0dXJuIHRydWU7XG59XG5cbmV4cG9ydHMuZ2V0VmlkZW9zID0gZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHtcblx0YWpheCh7XG5cdFx0dXJsOiAnaHR0cDovL2FjZnVuZml4LnNpbmFhcHAuY29tL21hbWEucGhwJyxcblx0XHRqc29ucDogdHJ1ZSxcblx0XHRwYXJhbToge1xuXHRcdFx0dXJsOiB1cmwuYXR0cignc291cmNlJylcblx0XHR9LFxuXHRcdGNhbGxiYWNrOiBmdW5jdGlvbihwYXJhbSkge1xuXHRcdFx0aWYgKHBhcmFtLmNvZGUgIT0gMjAwKSB7XG5cdFx0XHRcdGNhbGxiYWNrKGZhbHNlKTtcblx0XHRcdH1cblx0XHRcdHZhciBzb3VyY2UgPSBjYW5QbGF5TTNVOCAmJiBwYXJhbS5tM3U4ID8gcGFyYW0ubTN1OCA6IHBhcmFtLm1wNDtcblx0XHRcdHZhciBycyA9IFtdO1xuXHRcdFx0aWYgKHNvdXJjZSkge1xuXHRcdFx0XHRmb3IodHlwZSBpbiBzb3VyY2UpIHtcblx0XHRcdFx0XHRycy5wdXNoKFt0eXBlLCBzb3VyY2VbdHlwZV1dKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjYWxsYmFjayhycyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9KVxufSIsIi8qICBodW5hbnR2IFxuICogIEDmg4Xov7fmtbfpvp9waXp6YVxuICovXG52YXIgY2FuUGxheU0zVTggPSByZXF1aXJlKCcuL2NhblBsYXlNM1U4JylcbnZhciBhamF4ICAgICAgICA9IHJlcXVpcmUoJy4vYWpheCcpXG52YXIgbG9nICAgICAgICAgPSByZXF1aXJlKCcuL2xvZycpXG5leHBvcnRzLm1hdGNoID0gZnVuY3Rpb24gKHVybCkge1xuXHRyZXR1cm4gL3d3d1xcLmh1bmFudHZcXC5jb20vLnRlc3QodXJsLmF0dHIoJ2hvc3QnKSlcbn1cbmV4cG9ydHMuZ2V0VmlkZW9zID0gZnVuY3Rpb24gKHVybCwgY2FsbGJhY2spIHtcblx0Ly/oipLmnpzlj7DmsqHmnIltcDQgbyjila/ilqHilbApb1xuXHRpZiAoY2FuUGxheU0zVTgpIHtcblx0XHR2YXIgZ2V0UGFyYW1zID0gZnVuY3Rpb24ocmVxX3VybCl7XG5cdFx0XHR2YXIgcGFyYW1zX3VybCA9IHJlcV91cmwuc3BsaXQoXCI/XCIpWzFdO1xuXHRcdFx0dmFyIHBhcmFtc190bXAgPSBuZXcgQXJyYXkoKTtcblx0XHRcdHBhcmFtc190bXAgPSBwYXJhbXNfdXJsLnNwbGl0KFwiJlwiKTtcblx0XHRcdHZhciBwYXJhbXMgPSB7fTtcblx0XHRcdGZvcihrZXkgaW4gcGFyYW1zX3RtcCl7XG5cdFx0XHRcdHBhcmFtID0gcGFyYW1zX3RtcFtrZXldO1xuXHRcdFx0XHRpdGVtID0gbmV3IEFycmF5KCk7XG5cdFx0XHRcdGl0ZW0gPSBwYXJhbXNfdG1wW2tleV0uc3BsaXQoXCI9XCIpO1xuXHRcdFx0XHRpZiAoaXRlbVswXSAhPSAnJykge1xuXHRcdCAgICBcdFx0cGFyYW1zW2l0ZW1bMF1dID0gaXRlbVsxXTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHBhcmFtcztcblx0XHR9XG5cblx0XHR2YXIgbTN1OF9yZXFfcGFybXMgPSAnJmZtdD02JnBubz03Jm0zdTg9MSc7XG5cdFx0dmFyIHN0cl9vcmlnID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeU5hbWUoJ0ZsYXNoVmFycycpWzBdLmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcblx0XHR2YXIgc3RyX3RtcCA9IHN0cl9vcmlnLnNwbGl0KFwiJmZpbGU9XCIpWzFdO1xuXHRcdHZhciByZXFfdXJsID0gc3RyX3RtcC5zcGxpdChcIiUyNmZtdFwiKVswXTtcblx0XHRyZXFfdXJsID0gcmVxX3VybCArIG0zdThfcmVxX3Bhcm1zO1xuXHRcdHJlcV91cmwgPSBkZWNvZGVVUklDb21wb25lbnQocmVxX3VybCk7XG5cdFx0cGFyYW1zID0gZ2V0UGFyYW1zKHJlcV91cmwpO1xuXG5cdFx0Ly/ojrflj5bkuInnp43muIXmmbDluqZcblx0XHR2YXIgbGltaXRyYXRlID0gbmV3IEFycmF5KCk7XG5cdFx0bGltaXRyYXRlID0gWyc1NzAnLCAnMTA1NicsICcxNjE1J107XG5cdFx0dXJscyA9IG5ldyBBcnJheSgpO1xuXHRcdHBhcmFtcy5saW1pdHJhdGUgPSBsaW1pdHJhdGVbMF07XG5cdFx0dGV4dCA9IFwi5qCH5riFXCI7XG5cdFx0YWpheCh7XG5cdFx0XHRcdHVybDogJ2h0dHA6Ly9wY3Zjci5jZG4uaW1nby50di9uY3JzL3ZvZC5kbycsXG5cdFx0XHRcdGpzb25wOiB0cnVlLFxuXHRcdFx0XHRwYXJhbTogcGFyYW1zLFxuXHRcdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0aWYgKGRhdGEuc3RhdHVzID09ICdvaycpIHVybHMucHVzaChbdGV4dCwgZGF0YS5pbmZvXSlcblx0XHRcdFx0XHRwYXJhbXMubGltaXRyYXRlID0gbGltaXRyYXRlWzFdO1xuXHRcdFx0XHRcdHRleHQgPSBcIumrmOa4hVwiO1xuXHRcdFx0XHRcdGFqYXgoe1xuXHRcdFx0XHRcdFx0XHR1cmw6ICdodHRwOi8vcGN2Y3IuY2RuLmltZ28udHYvbmNycy92b2QuZG8nLFxuXHRcdFx0XHRcdFx0XHRqc29ucDogdHJ1ZSxcblx0XHRcdFx0XHRcdFx0cGFyYW06IHBhcmFtcyxcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdFx0XHRcdGlmIChkYXRhLnN0YXR1cyA9PSAnb2snKSB1cmxzLnB1c2goW3RleHQsIGRhdGEuaW5mb10pXG5cdFx0XHRcdFx0XHRcdFx0cGFyYW1zLmxpbWl0cmF0ZSA9IGxpbWl0cmF0ZVsyXTtcblx0XHRcdFx0XHRcdFx0XHR0ZXh0ID0gXCLotoXmuIVcIjtcblx0XHRcdFx0XHRcdFx0XHRhamF4KHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0dXJsOiAnaHR0cDovL3BjdmNyLmNkbi5pbWdvLnR2L25jcnMvdm9kLmRvJyxcblx0XHRcdFx0XHRcdFx0XHRcdFx0anNvbnA6IHRydWUsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdHBhcmFtOiBwYXJhbXMsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAoZGF0YS5zdGF0dXMgPT0gJ29rJykgdXJscy5wdXNoKFt0ZXh0LCBkYXRhLmluZm9dKVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdHJldHVybiBjYWxsYmFjayh1cmxzKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0fWVsc2V7XG5cdFx0bG9nKCfor7fkvb/nlKhTYWZhcmnop4LnnIvmnKzop4bpopEnKTtcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gY2FsbGJhY2soKTtcblx0XHR9LCAyMDAwKTtcblx0fVxufSIsIi8qICBpcWl5aSBcbiAqICBA5pyx5LiAXG4gKi9cbnZhciBjYW5QbGF5TTNVOCA9IHJlcXVpcmUoJy4vY2FuUGxheU0zVTgnKVxudmFyIHF1ZXJ5U3RyaW5nID0gcmVxdWlyZSgnLi9xdWVyeVN0cmluZycpXG52YXIgZ2V0Q29va2llID0gcmVxdWlyZSgnLi9nZXRDb29raWUnKVxudmFyIGFqYXggPSByZXF1aXJlKCcuL2FqYXgnKVxudmFyIGh0dHBQcm94eSA9IHJlcXVpcmUoJy4vaHR0cFByb3h5JylcbnZhciBsb2cgPSByZXF1aXJlKCcuL2xvZycpXG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgcmV0dXJuIC9eaHR0cDpcXC9cXC93d3dcXC5pcWl5aVxcLmNvbS8udGVzdCh1cmwuYXR0cignc291cmNlJykpICYmICEhd2luZG93LlEuUGFnZUluZm9cbn1cblxuZXhwb3J0cy5nZXRWaWRlb3MgPSBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaykge1xuICAgIHZhciB1aWQgPSAnJztcbiAgICB0cnl7XG4gICAgdWlkID0gSlNPTi5wYXJzZShnZXRDb29raWUoJ1AwMDAwMicpKS51aWRcbiAgICB9Y2F0Y2goZSkge31cbiAgICB2YXIgY3VwaWQgPSAncWNfMTAwMDAxXzEwMDEwMicgLy/ov5nkuKrlhpnmrbvlkKdcbiAgICB2YXIgdHZJZCA9IHdpbmRvdy5RLlBhZ2VJbmZvLnBsYXlQYWdlSW5mby50dklkXG4gICAgdmFyIGFsYnVtSWQgPSB3aW5kb3cuUS5QYWdlSW5mby5wbGF5UGFnZUluZm8uYWxidW1JZFxuICAgIHZhciB2aWQgPSB3aW5kb3cuUS5QYWdlSW5mby5wbGF5UGFnZUluZm8udmlkIHx8XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmbGFzaGJveCcpLmdldEF0dHJpYnV0ZSgnZGF0YS1wbGF5ZXItdmlkZW9pZCcpXG5cbiAgICB2YXIgaHR0cFByb3h5T3B0cyA9IHt0ZXh0OiB0cnVlLCB1YTogJ01vemlsbGEvNS4wIChpUGFkOyBDUFUgaVBob25lIE9TIDhfMSBsaWtlIE1hYyBPUyBYKSBBcHBsZVdlYktpdC82MDAuMS40IChLSFRNTCwgbGlrZSBHZWNrbykgVmVyc2lvbi84LjAgTW9iaWxlLzEyQjQxMCBTYWZhcmkvNjAwLjEuNCd9XG5cbiAgICBodHRwUHJveHkobG9jYXRpb24uaHJlZiwgJ2dldCcsIHt9LCBmdW5jdGlvbihycykge1xuICAgICAgICB2YXIgbSA9IHJzLm1hdGNoKC88c2NyaXB0W14+XSo+XFxzKihldmFsLio7KVxccyooPz08XFwvc2NyaXB0Pik8XFwvc2NyaXB0Pi8pXG4gICAgICAgIHdpbmRvdy5fX3FsdCA9IHdpbmRvdy5fX3FsdCB8fCB7TUFNQTJQbGFjZUhvbGRlcjogdHJ1ZX1cbiAgICAgICAgd2luZG93LlFQID0gd2luZG93LlFQIHx8IHt9XG4gICAgICAgIHdpbmRvdy5RUC5fcmVhZHkgPSBmdW5jdGlvbiAoZSkge2lmKHRoaXMuX2lzUmVhZHkpe2UmJmUoKX1lbHNle2UmJnRoaXMuX3dhaXRzLnB1c2goZSl9fVxuICAgICAgICBldmFsKG1bMV0pXG4gICAgICAgIHZhciBwYXJhbSA9IHdlb3JqamlnaCh0dklkKVxuICAgICAgICBwYXJhbS51aWQgPSB1aWRcbiAgICAgICAgcGFyYW0uY3VwaWQgPSBjdXBpZFxuICAgICAgICBwYXJhbS5wbGF0Rm9ybSA9ICdoNSdcbiAgICAgICAgcGFyYW0udHlwZSA9IGNhblBsYXlNM1U4ID8gJ20zdTgnIDogJ21wNCcsXG4gICAgICAgIHBhcmFtLnF5cGlkID0gdHZJZCArICdfMjEnXG4gICAgICAgIGFqYXgoe1xuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2NhY2hlLm0uaXFpeWkuY29tL2pwL3RtdHMvJyt0dklkKycvJyt2aWQrJy8nLFxuICAgICAgICAgICAganNvbnA6IHRydWUsXG4gICAgICAgICAgICBwYXJhbTogcGFyYW0sXG4gICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gKHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZSA9IFtdXG4gICAgICAgICAgICAgICAgaWYgKHJzLmRhdGEubTN1dHgubGVuZ3RoID4gMCkgc291cmNlLnB1c2goWyfpq5jmuIUnLCBycy5kYXRhLm0zdXR4XSlcbiAgICAgICAgICAgICAgICBpZiAocnMuZGF0YS5tM3UubGVuZ3RoID4gMCkgc291cmNlLnB1c2goWyfmoIfmuIUnLCBycy5kYXRhLm0zdV0pXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soc291cmNlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sIGh0dHBQcm94eU9wdHMpXG59XG4iLCIvKiAgdHVkb3UgXG4gKiAgQOacseS4gFxuICovXG52YXIgY2FuUGxheU0zVTggPSByZXF1aXJlKCcuL2NhblBsYXlNM1U4JylcbnZhciBhamF4ICAgICAgICA9IHJlcXVpcmUoJy4vYWpheCcpXG52YXIgbG9nICAgICAgICAgPSByZXF1aXJlKCcuL2xvZycpXG52YXIgeW91a3UgICAgICAgPSByZXF1aXJlKCcuL3NlZWtlcl95b3VrdScpXG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAodXJsKSB7XG5cdHZhciBfaWQgPSB3aW5kb3cuaWlkIHx8ICh3aW5kb3cucGFnZUNvbmZpZyAmJiB3aW5kb3cucGFnZUNvbmZpZy5paWQpIHx8ICh3aW5kb3cuaXRlbURhdGEgJiYgd2luZG93Lml0ZW1EYXRhLmlpZClcblx0dmFyIHlvdWt1Q29kZSA9IHdpbmRvdy5pdGVtRGF0YSAmJiB3aW5kb3cuaXRlbURhdGEudmNvZGVcblx0cmV0dXJuIC90dWRvdVxcLmNvbS8udGVzdCh1cmwuYXR0cignaG9zdCcpKSAmJiAoeW91a3VDb2RlIHx8IF9pZClcbn1cblxuZXhwb3J0cy5nZXRWaWRlb3MgPSBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaykge1x0XG5cdHZhciB5b3VrdUNvZGUgPSB3aW5kb3cuaXRlbURhdGEgJiYgd2luZG93Lml0ZW1EYXRhLnZjb2RlXG5cdGlmICh5b3VrdUNvZGUpIHtcblx0XHRyZXR1cm4geW91a3UucGFyc2VZb3VrdUNvZGUoeW91a3VDb2RlLCBjYWxsYmFjaylcblx0fVxuXHR2YXIgX2lkID0gd2luZG93LmlpZCB8fCAod2luZG93LnBhZ2VDb25maWcgJiYgd2luZG93LnBhZ2VDb25maWcuaWlkKSB8fCAod2luZG93Lml0ZW1EYXRhICYmIHdpbmRvdy5pdGVtRGF0YS5paWQpO1xuXHR2YXIgbTN1OCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcdFx0XG5cdFx0dmFyIHVybHMgPSBbXG5cdFx0XHRbJ+WOn+eUuycsICdodHRwOi8vdnIudHVkb3UuY29tL3YycHJveHkvdjIubTN1OD9pdD0nICsgX2lkICsgJyZzdD01J10sXG5cdFx0XHRbJ+i2hea4hScsICdodHRwOi8vdnIudHVkb3UuY29tL3YycHJveHkvdjIubTN1OD9pdD0nICsgX2lkICsgJyZzdD00J10sXG5cdFx0XHRbJ+mrmOa4hScsICdodHRwOi8vdnIudHVkb3UuY29tL3YycHJveHkvdjIubTN1OD9pdD0nICsgX2lkICsgJyZzdD0zJ10sXG5cdFx0XHRbJ+agh+a4hScsICdodHRwOi8vdnIudHVkb3UuY29tL3YycHJveHkvdjIubTN1OD9pdD0nICsgX2lkICsgJyZzdD0yJ11cblx0XHRdXG5cdFx0dmFyIF9zXG5cdFx0aWYod2luZG93Lml0ZW1EYXRhICYmIHdpbmRvdy5pdGVtRGF0YS5zZWdzKXtcblx0XHRcdHVybHMgPSBbXVxuXHRcdFx0X3MgICA9IEpTT04ucGFyc2Uod2luZG93Lml0ZW1EYXRhLnNlZ3MpXG5cdFx0XHRpZihfc1s1XSkgdXJscy5wdXNoKFsn5Y6f55S7JywgJ2h0dHA6Ly92ci50dWRvdS5jb20vdjJwcm94eS92Mi5tM3U4P2l0PScgKyBfaWQgKyAnJnN0PTUnXSlcblx0XHRcdGlmKF9zWzRdKSB1cmxzLnB1c2goWyfotoXmuIUnLCAnaHR0cDovL3ZyLnR1ZG91LmNvbS92MnByb3h5L3YyLm0zdTg/aXQ9JyArIF9pZCArICcmc3Q9NCddKVxuXHRcdFx0aWYoX3NbM10pIHVybHMucHVzaChbJ+mrmOa4hScsICdodHRwOi8vdnIudHVkb3UuY29tL3YycHJveHkvdjIubTN1OD9pdD0nICsgX2lkICsgJyZzdD0zJ10pXG5cdFx0XHRpZihfc1syXSkgdXJscy5wdXNoKFsn5qCH5riFJywgJ2h0dHA6Ly92ci50dWRvdS5jb20vdjJwcm94eS92Mi5tM3U4P2l0PScgKyBfaWQgKyAnJnN0PTInXSlcblx0XHR9XHRcdFxuXHRcdGxvZygn6Kej5p6QdHVkb3Xop4bpopHlnLDlnYDmiJDlip8gJyArIHVybHMubWFwKGZ1bmN0aW9uIChpdGVtKSB7cmV0dXJuICc8YSBocmVmPScraXRlbVsxXSsnPicraXRlbVswXSsnPC9hPid9KS5qb2luKCcgJyksIDIpXG5cdFx0Y2FsbGJhY2sodXJscylcblx0fTtcblx0dmFyIG1wNCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcblx0XHRhamF4KHtcblx0XHRcdHVybDogJ2h0dHA6Ly92ci50dWRvdS5jb20vdjJwcm94eS92Mi5qcycsXG5cdFx0XHRwYXJhbToge1xuXHRcdFx0XHRpdDogX2lkLFxuXHRcdFx0XHRzdDogJzUyJTJDNTMlMkM1NCdcblx0XHRcdH0sXG5cdFx0XHRqc29ucDogJ2pzb25wJyxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihwYXJhbSl7XG5cdFx0XHRcdGlmKHBhcmFtID09PSAtMSB8fCBwYXJhbS5jb2RlID09IC0xKSByZXR1cm4gbG9nKCfop6PmnpB0dWRvdeinhumikeWcsOWdgOWksei0pScpXG5cdFx0XHRcdGZvcih2YXIgdXJscz1bXSxpPTAsbGVuPXBhcmFtLnVybHMubGVuZ3RoOyBpPGxlbjsgaSsrKXsgdXJscy5wdXNoKFtpLCBwYXJhbS51cmxzW2ldXSk7IH1cblx0XHRcdFx0bG9nKCfop6PmnpB0dWRvdeinhumikeWcsOWdgOaIkOWKnyAnICsgdXJscy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtyZXR1cm4gJzxhIGhyZWY9JytpdGVtWzFdKyc+JytpdGVtWzBdKyc8L2E+J30pLmpvaW4oJyAnKSwgMilcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKHVybHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9O1xuXHRjYW5QbGF5TTNVOCA/IG0zdTgoY2FsbGJhY2spIDogbXA0KGNhbGxiYWNrKVxufSIsIi8qICB5b3VrdSBcbiAqICBA5pyx5LiAXG4gKi9cbnZhciBjYW5QbGF5TTNVOCA9IHJlcXVpcmUoJy4vY2FuUGxheU0zVTgnKVxudmFyIGFqYXggICAgICAgID0gcmVxdWlyZSgnLi9hamF4JylcbnZhciBsb2cgICAgICAgICA9IHJlcXVpcmUoJy4vbG9nJylcbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAodXJsKSB7XG5cdHJldHVybiAvdlxcLnlvdWt1XFwuY29tLy50ZXN0KHVybC5hdHRyKCdob3N0JykpICYmICEhd2luZG93LnZpZGVvSWRcbn1cbnZhciBwYXJzZVlvdWt1Q29kZSA9IGV4cG9ydHMucGFyc2VZb3VrdUNvZGUgPSBmdW5jdGlvbiAoX2lkLCBjYWxsYmFjaykge1xuXHRsb2coJ+W8gOWni+ino+aekHlvdWt16KeG6aKR5Zyw5Z2AJylcdFxuXHR2YXIgbWtfYTMgPSAnYjRldCc7XG5cdHZhciBta19hNCA9ICdib2E0Jztcblx0dmFyIHVzZXJDYWNoZV9hMSA9ICc0Jztcblx0dmFyIHVzZXJDYWNoZV9hMiA9ICcxJztcblx0dmFyIHJzO1xuXHR2YXIgc2lkO1xuXHR2YXIgdG9rZW47XG5cdGZ1bmN0aW9uIGRlY29kZTY0KGEpIHtcblx0XHRpZiAoIWEpXG5cdFx0XHRyZXR1cm4gXCJcIjtcblx0XHRhID0gYS50b1N0cmluZygpO1xuXHRcdHZhciBiLCBjLCBkLCBlLCBmLCBnLCBoLCBpID0gbmV3IEFycmF5KC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCA2MiwgLTEsIC0xLCAtMSwgNjMsIDUyLCA1MywgNTQsIDU1LCA1NiwgNTcsIDU4LCA1OSwgNjAsIDYxLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSwgMTYsIDE3LCAxOCwgMTksIDIwLCAyMSwgMjIsIDIzLCAyNCwgMjUsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIDI2LCAyNywgMjgsIDI5LCAzMCwgMzEsIDMyLCAzMywgMzQsIDM1LCAzNiwgMzcsIDM4LCAzOSwgNDAsIDQxLCA0MiwgNDMsIDQ0LCA0NSwgNDYsIDQ3LCA0OCwgNDksIDUwLCA1MSwgLTEsIC0xLCAtMSwgLTEsIC0xKTtcblx0XHRmb3IgKGcgPSBhLmxlbmd0aCwgZiA9IDAsIGggPSBcIlwiOyBnID4gZjspIHtcblx0XHRcdGRvXG5cdFx0XHRcdGIgPSBpWzI1NSAmIGEuY2hhckNvZGVBdChmKyspXTtcblx0XHRcdHdoaWxlIChnID4gZiAmJiAtMSA9PSBiKTtcblx0XHRcdGlmICgtMSA9PSBiKVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGRvXG5cdFx0XHRcdGMgPSBpWzI1NSAmIGEuY2hhckNvZGVBdChmKyspXTtcblx0XHRcdHdoaWxlIChnID4gZiAmJiAtMSA9PSBjKTtcblx0XHRcdGlmICgtMSA9PSBjKVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGggKz0gU3RyaW5nLmZyb21DaGFyQ29kZShiIDw8IDIgfCAoNDggJiBjKSA+PiA0KTtcblx0XHRcdGRvIHtcblx0XHRcdFx0aWYgKGQgPSAyNTUgJiBhLmNoYXJDb2RlQXQoZisrKSwgNjEgPT0gZClcblx0XHRcdFx0XHRyZXR1cm4gaDtcblx0XHRcdFx0ZCA9IGlbZF1cblx0XHRcdH1cblx0XHRcdHdoaWxlIChnID4gZiAmJiAtMSA9PSBkKTtcblx0XHRcdGlmICgtMSA9PSBkKVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGggKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoMTUgJiBjKSA8PCA0IHwgKDYwICYgZCkgPj4gMik7XG5cdFx0XHRkbyB7XG5cdFx0XHRcdGlmIChlID0gMjU1ICYgYS5jaGFyQ29kZUF0KGYrKyksIDYxID09IGUpXG5cdFx0XHRcdFx0cmV0dXJuIGg7XG5cdFx0XHRcdGUgPSBpW2VdXG5cdFx0XHR9XG5cdFx0XHR3aGlsZSAoZyA+IGYgJiYgLTEgPT0gZSk7XG5cdFx0XHRpZiAoLTEgPT0gZSlcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRoICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKDMgJiBkKSA8PCA2IHwgZSlcblx0XHR9XG5cdFx0cmV0dXJuIGhcblx0fVxuXG5cdGZ1bmN0aW9uIEQoYSkge1xuXHRcdGlmICghYSkgcmV0dXJuIFwiXCI7XG5cdFx0dmFyIGEgPSBhLnRvU3RyaW5nKCksXG5cdFx0XHRjLCBiLCBmLCBlLCBnLCBoO1xuXHRcdGYgPSBhLmxlbmd0aDtcblx0XHRiID0gMDtcblx0XHRmb3IgKGMgPSBcIlwiOyBiIDwgZjspIHtcblx0XHRcdGUgPSBhLmNoYXJDb2RlQXQoYisrKSAmIDI1NTtcblx0XHRcdGlmIChiID09IGYpIHtcblx0XHRcdFx0YyArPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIi5jaGFyQXQoZSA+PiAyKTtcblx0XHRcdFx0YyArPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIi5jaGFyQXQoKGUgJiAzKSA8PCA0KTtcblx0XHRcdFx0YyArPSBcIj09XCI7XG5cdFx0XHRcdGJyZWFrXG5cdFx0XHR9XG5cdFx0XHRnID0gYS5jaGFyQ29kZUF0KGIrKyk7XG5cdFx0XHRpZiAoYiA9PSBmKSB7XG5cdFx0XHRcdGMgKz0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCIuY2hhckF0KGUgPj4gMik7XG5cdFx0XHRcdGMgKz0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCIuY2hhckF0KChlICYgMykgPDwgNCB8IChnICYgMjQwKSA+PiA0KTtcblx0XHRcdFx0YyArPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIi5jaGFyQXQoKGcgJlxuXHRcdFx0XHRcdDE1KSA8PCAyKTtcblx0XHRcdFx0YyArPSBcIj1cIjtcblx0XHRcdFx0YnJlYWtcblx0XHRcdH1cblx0XHRcdGggPSBhLmNoYXJDb2RlQXQoYisrKTtcblx0XHRcdGMgKz0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCIuY2hhckF0KGUgPj4gMik7XG5cdFx0XHRjICs9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrL1wiLmNoYXJBdCgoZSAmIDMpIDw8IDQgfCAoZyAmIDI0MCkgPj4gNCk7XG5cdFx0XHRjICs9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrL1wiLmNoYXJBdCgoZyAmIDE1KSA8PCAyIHwgKGggJiAxOTIpID4+IDYpO1xuXHRcdFx0YyArPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIi5jaGFyQXQoaCAmIDYzKVxuXHRcdH1cblx0XHRyZXR1cm4gY1xuXHR9XG5cblx0ZnVuY3Rpb24gRShhLCBjKSB7XG5cdFx0Zm9yICh2YXIgYiA9IFtdLCBmID0gMCwgaSwgZSA9IFwiXCIsIGggPSAwOyAyNTYgPiBoOyBoKyspIGJbaF0gPSBoO1xuXHRcdGZvciAoaCA9IDA7IDI1NiA+IGg7IGgrKykgZiA9IChmICsgYltoXSArIGEuY2hhckNvZGVBdChoICUgYS5sZW5ndGgpKSAlIDI1NiwgaSA9IGJbaF0sIGJbaF0gPSBiW2ZdLCBiW2ZdID0gaTtcblx0XHRmb3IgKHZhciBxID0gZiA9IGggPSAwOyBxIDwgYy5sZW5ndGg7IHErKykgaCA9IChoICsgMSkgJSAyNTYsIGYgPSAoZiArIGJbaF0pICUgMjU2LCBpID0gYltoXSwgYltoXSA9IGJbZl0sIGJbZl0gPSBpLCBlICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYy5jaGFyQ29kZUF0KHEpIF4gYlsoYltoXSArIGJbZl0pICUgMjU2XSk7XG5cdFx0cmV0dXJuIGVcblx0fVxuXG5cdGZ1bmN0aW9uIEYoYSwgYykge1xuXHRcdGZvciAodmFyIGIgPSBbXSwgZiA9IDA7IGYgPCBhLmxlbmd0aDsgZisrKSB7XG5cdFx0XHRmb3IgKHZhciBpID0gMCwgaSA9IFwiYVwiIDw9IGFbZl0gJiYgXCJ6XCIgPj0gYVtmXSA/IGFbZl0uY2hhckNvZGVBdCgwKSAtIDk3IDogYVtmXSAtIDAgKyAyNiwgZSA9IDA7IDM2ID4gZTsgZSsrKVxuXHRcdFx0XHRpZiAoY1tlXSA9PSBpKSB7XG5cdFx0XHRcdFx0aSA9IGU7XG5cdFx0XHRcdFx0YnJlYWtcblx0XHRcdFx0fVxuXHRcdFx0YltmXSA9IDI1IDwgaSA/IGkgLSAyNiA6IFN0cmluZy5mcm9tQ2hhckNvZGUoaSArIDk3KVxuXHRcdH1cblx0XHRyZXR1cm4gYi5qb2luKFwiXCIpXG5cdH1cblx0XG5cdHZhciBQbGF5TGlzdERhdGEgPSBmdW5jdGlvbihhLCBiLCBjKSB7XG5cdFx0XHR2YXIgZCA9IHRoaXM7XG5cdFx0XHRuZXcgRGF0ZTtcblx0XHRcdHRoaXMuX3NpZCA9IHNpZCwgdGhpcy5fZmlsZVR5cGUgPSBjLCB0aGlzLl92aWRlb1NlZ3NEaWMgPSB7fTtcblx0XHRcdHRoaXMuX2lwID0gYS5zZWN1cml0eS5pcDtcblx0XHRcdHZhciBlID0gKG5ldyBSYW5kb21Qcm94eSwgW10pLFxuXHRcdFx0XHRmID0gW107XG5cdFx0XHRmLnN0cmVhbXMgPSB7fSwgZi5sb2dvcyA9IHt9LCBmLnR5cGVBcnIgPSB7fSwgZi50b3RhbFRpbWUgPSB7fTtcblx0XHRcdGZvciAodmFyIGcgPSAwOyBnIDwgYi5sZW5ndGg7IGcrKykge1xuXHRcdFx0XHRmb3IgKHZhciBoID0gYltnXS5hdWRpb19sYW5nLCBpID0gITEsIGogPSAwOyBqIDwgZS5sZW5ndGg7IGorKylcblx0XHRcdFx0XHRpZiAoZVtqXSA9PSBoKSB7XG5cdFx0XHRcdFx0XHRpID0gITA7XG5cdFx0XHRcdFx0XHRicmVha1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0aSB8fCBlLnB1c2goaClcblx0XHRcdH1cblx0XHRcdGZvciAodmFyIGcgPSAwOyBnIDwgZS5sZW5ndGg7IGcrKykge1xuXHRcdFx0XHRmb3IgKHZhciBrID0gZVtnXSwgbCA9IHt9LCBtID0ge30sIG4gPSBbXSwgaiA9IDA7IGogPCBiLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdFx0dmFyIG8gPSBiW2pdO1xuXHRcdFx0XHRcdGlmIChrID09IG8uYXVkaW9fbGFuZykge1xuXHRcdFx0XHRcdFx0aWYgKCFkLmlzVmFsaWRUeXBlKG8uc3RyZWFtX3R5cGUpKVxuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdHZhciBwID0gZC5jb252ZXJ0VHlwZShvLnN0cmVhbV90eXBlKSxcblx0XHRcdFx0XHRcdFx0cSA9IDA7XG5cdFx0XHRcdFx0XHRcIm5vbmVcIiAhPSBvLmxvZ28gJiYgKHEgPSAxKSwgbVtwXSA9IHE7XG5cdFx0XHRcdFx0XHR2YXIgciA9ICExO1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgcyBpbiBuKVxuXHRcdFx0XHRcdFx0XHRwID09IG5bc10gJiYgKHIgPSAhMCk7XG5cdFx0XHRcdFx0XHRyIHx8IG4ucHVzaChwKTtcblx0XHRcdFx0XHRcdHZhciB0ID0gby5zZWdzO1xuXHRcdFx0XHRcdFx0aWYgKG51bGwgPT0gdClcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR2YXIgdSA9IFtdO1xuXHRcdFx0XHRcdFx0ciAmJiAodSA9IGxbcF0pO1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgdiA9IDA7IHYgPCB0Lmxlbmd0aDsgdisrKSB7XG5cdFx0XHRcdFx0XHRcdHZhciB3ID0gdFt2XTtcblx0XHRcdFx0XHRcdFx0aWYgKG51bGwgPT0gdylcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0dmFyIHggPSB7fTtcblx0XHRcdFx0XHRcdFx0eC5ubyA9IHYsIFxuXHRcdFx0XHRcdFx0XHR4LnNpemUgPSB3LnNpemUsIFxuXHRcdFx0XHRcdFx0XHR4LnNlY29uZHMgPSBOdW1iZXIody50b3RhbF9taWxsaXNlY29uZHNfdmlkZW8pIC8gMWUzLCBcblx0XHRcdFx0XHRcdFx0eC5taWxsaXNlY29uZHNfdmlkZW8gPSBOdW1iZXIoby5taWxsaXNlY29uZHNfdmlkZW8pIC8gMWUzLCBcblx0XHRcdFx0XHRcdFx0eC5rZXkgPSB3LmtleSwgeC5maWxlSWQgPSB0aGlzLmdldEZpbGVJZChvLnN0cmVhbV9maWxlaWQsIHYpLCBcblx0XHRcdFx0XHRcdFx0eC5zcmMgPSB0aGlzLmdldFZpZGVvU3JjKGosIHYsIGEsIG8uc3RyZWFtX3R5cGUsIHguZmlsZUlkKSwgXG5cdFx0XHRcdFx0XHRcdHgudHlwZSA9IHAsIFxuXHRcdFx0XHRcdFx0XHR1LnB1c2goeClcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGxbcF0gPSB1XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciB5ID0gdGhpcy5sYW5nQ29kZVRvQ04oaykua2V5O1xuXHRcdFx0XHRmLmxvZ29zW3ldID0gbSwgZi5zdHJlYW1zW3ldID0gbCwgZi50eXBlQXJyW3ldID0gblx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl92aWRlb1NlZ3NEaWMgPSBmLCB0aGlzLl92aWRlb1NlZ3NEaWMubGFuZyA9IHRoaXMubGFuZ0NvZGVUb0NOKGVbMF0pLmtleVxuXHRcdH0sXG5cdFx0UmFuZG9tUHJveHkgPSBmdW5jdGlvbihhKSB7XG5cdFx0XHR0aGlzLl9yYW5kb21TZWVkID0gYSwgdGhpcy5jZ19odW4oKVxuXHRcdH07XG5cdFJhbmRvbVByb3h5LnByb3RvdHlwZSA9IHtcblx0XHRjZ19odW46IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5fY2dTdHIgPSBcIlwiO1xuXHRcdFx0Zm9yICh2YXIgYSA9IFwiYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWi9cXFxcOi5fLTEyMzQ1Njc4OTBcIiwgYiA9IGEubGVuZ3RoLCBjID0gMDsgYiA+IGM7IGMrKykge1xuXHRcdFx0XHR2YXIgZCA9IHBhcnNlSW50KHRoaXMucmFuKCkgKiBhLmxlbmd0aCk7XG5cdFx0XHRcdHRoaXMuX2NnU3RyICs9IGEuY2hhckF0KGQpLCBhID0gYS5zcGxpdChhLmNoYXJBdChkKSkuam9pbihcIlwiKVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Y2dfZnVuOiBmdW5jdGlvbihhKSB7XG5cdFx0XHRmb3IgKHZhciBiID0gYS5zcGxpdChcIipcIiksIGMgPSBcIlwiLCBkID0gMDsgZCA8IGIubGVuZ3RoIC0gMTsgZCsrKVxuXHRcdFx0XHRjICs9IHRoaXMuX2NnU3RyLmNoYXJBdChiW2RdKTtcblx0XHRcdHJldHVybiBjXG5cdFx0fSxcblx0XHRyYW46IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3JhbmRvbVNlZWQgPSAoMjExICogdGhpcy5fcmFuZG9tU2VlZCArIDMwMDMxKSAlIDY1NTM2LCB0aGlzLl9yYW5kb21TZWVkIC8gNjU1MzZcblx0XHR9XG5cdH0sIFBsYXlMaXN0RGF0YS5wcm90b3R5cGUgPSB7XG5cdFx0Z2V0RmlsZUlkOiBmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHRpZiAobnVsbCA9PSBhIHx8IFwiXCIgPT0gYSlcblx0XHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0XHR2YXIgYyA9IFwiXCIsXG5cdFx0XHRcdGQgPSBhLnNsaWNlKDAsIDgpLFxuXHRcdFx0XHRlID0gYi50b1N0cmluZygxNik7XG5cdFx0XHQxID09IGUubGVuZ3RoICYmIChlID0gXCIwXCIgKyBlKSwgZSA9IGUudG9VcHBlckNhc2UoKTtcblx0XHRcdHZhciBmID0gYS5zbGljZSgxMCwgYS5sZW5ndGgpO1xuXHRcdFx0cmV0dXJuIGMgPSBkICsgZSArIGZcblx0XHR9LFxuXHRcdGlzVmFsaWRUeXBlOiBmdW5jdGlvbihhKSB7XG5cdFx0XHRyZXR1cm4gXCIzZ3BoZFwiID09IGEgfHwgXCJmbHZcIiA9PSBhIHx8IFwiZmx2aGRcIiA9PSBhIHx8IFwibXA0aGRcIiA9PSBhIHx8IFwibXA0aGQyXCIgPT0gYSB8fCBcIm1wNGhkM1wiID09IGEgPyAhMCA6ICExXG5cdFx0fSxcblx0XHRjb252ZXJ0VHlwZTogZnVuY3Rpb24oYSkge1xuXHRcdFx0dmFyIGIgPSBhO1xuXHRcdFx0c3dpdGNoIChhKSB7XG5cdFx0XHRcdGNhc2UgXCJtM3U4XCI6XG5cdFx0XHRcdFx0YiA9IFwibXA0XCI7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCIzZ3BoZFwiOlxuXHRcdFx0XHRcdGIgPSBcIjNncGhkXCI7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJmbHZcIjpcblx0XHRcdFx0XHRiID0gXCJmbHZcIjtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImZsdmhkXCI6XG5cdFx0XHRcdFx0YiA9IFwiZmx2XCI7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJtcDRoZFwiOlxuXHRcdFx0XHRcdGIgPSBcIm1wNFwiO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwibXA0aGQyXCI6XG5cdFx0XHRcdFx0YiA9IFwiaGQyXCI7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJtcDRoZDNcIjpcblx0XHRcdFx0XHRiID0gXCJoZDNcIlxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGJcblx0XHR9LFxuXHRcdGxhbmdDb2RlVG9DTjogZnVuY3Rpb24oYSkge1xuXHRcdFx0dmFyIGIgPSBcIlwiO1xuXHRcdFx0c3dpdGNoIChhKSB7XG5cdFx0XHRcdGNhc2UgXCJkZWZhdWx0XCI6XG5cdFx0XHRcdFx0YiA9IHtcblx0XHRcdFx0XHRcdGtleTogXCJndW95dVwiLFxuXHRcdFx0XHRcdFx0dmFsdWU6IFwi5Zu96K+tXCJcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiZ3VveXVcIjpcblx0XHRcdFx0XHRiID0ge1xuXHRcdFx0XHRcdFx0a2V5OiBcImd1b3l1XCIsXG5cdFx0XHRcdFx0XHR2YWx1ZTogXCLlm73or61cIlxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJ5dWVcIjpcblx0XHRcdFx0XHRiID0ge1xuXHRcdFx0XHRcdFx0a2V5OiBcInl1ZVwiLFxuXHRcdFx0XHRcdFx0dmFsdWU6IFwi57Kk6K+tXCJcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiY2h1YW5cIjpcblx0XHRcdFx0XHRiID0ge1xuXHRcdFx0XHRcdFx0a2V5OiBcImNodWFuXCIsXG5cdFx0XHRcdFx0XHR2YWx1ZTogXCLlt53or51cIlxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJ0YWlcIjpcblx0XHRcdFx0XHRiID0ge1xuXHRcdFx0XHRcdFx0a2V5OiBcInRhaVwiLFxuXHRcdFx0XHRcdFx0dmFsdWU6IFwi5Y+w5rm+XCJcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwibWluXCI6XG5cdFx0XHRcdFx0YiA9IHtcblx0XHRcdFx0XHRcdGtleTogXCJtaW5cIixcblx0XHRcdFx0XHRcdHZhbHVlOiBcIumXveWNl1wiXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImVuXCI6XG5cdFx0XHRcdFx0YiA9IHtcblx0XHRcdFx0XHRcdGtleTogXCJlblwiLFxuXHRcdFx0XHRcdFx0dmFsdWU6IFwi6Iux6K+tXCJcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiamFcIjpcblx0XHRcdFx0XHRiID0ge1xuXHRcdFx0XHRcdFx0a2V5OiBcImphXCIsXG5cdFx0XHRcdFx0XHR2YWx1ZTogXCLml6Xor61cIlxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJrclwiOlxuXHRcdFx0XHRcdGIgPSB7XG5cdFx0XHRcdFx0XHRrZXk6IFwia3JcIixcblx0XHRcdFx0XHRcdHZhbHVlOiBcIumfqeivrVwiXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImluXCI6XG5cdFx0XHRcdFx0YiA9IHtcblx0XHRcdFx0XHRcdGtleTogXCJpblwiLFxuXHRcdFx0XHRcdFx0dmFsdWU6IFwi5Y2w5bqmXCJcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwicnVcIjpcblx0XHRcdFx0XHRiID0ge1xuXHRcdFx0XHRcdFx0a2V5OiBcInJ1XCIsXG5cdFx0XHRcdFx0XHR2YWx1ZTogXCLkv4Tor61cIlxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJmclwiOlxuXHRcdFx0XHRcdGIgPSB7XG5cdFx0XHRcdFx0XHRrZXk6IFwiZnJcIixcblx0XHRcdFx0XHRcdHZhbHVlOiBcIuazleivrVwiXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImRlXCI6XG5cdFx0XHRcdFx0YiA9IHtcblx0XHRcdFx0XHRcdGtleTogXCJkZVwiLFxuXHRcdFx0XHRcdFx0dmFsdWU6IFwi5b636K+tXCJcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiaXRcIjpcblx0XHRcdFx0XHRiID0ge1xuXHRcdFx0XHRcdFx0a2V5OiBcIml0XCIsXG5cdFx0XHRcdFx0XHR2YWx1ZTogXCLmhI/or61cIlxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJlc1wiOlxuXHRcdFx0XHRcdGIgPSB7XG5cdFx0XHRcdFx0XHRrZXk6IFwiZXNcIixcblx0XHRcdFx0XHRcdHZhbHVlOiBcIuilv+ivrVwiXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcInBvXCI6XG5cdFx0XHRcdFx0YiA9IHtcblx0XHRcdFx0XHRcdGtleTogXCJwb1wiLFxuXHRcdFx0XHRcdFx0dmFsdWU6IFwi6JGh6K+tXCJcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwidGhcIjpcblx0XHRcdFx0XHRiID0ge1xuXHRcdFx0XHRcdFx0a2V5OiBcInRoXCIsXG5cdFx0XHRcdFx0XHR2YWx1ZTogXCLms7Dor61cIlxuXHRcdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBiXG5cdFx0fSxcblx0XHRnZXRWaWRlb1NyYzogZnVuY3Rpb24oYSwgYiwgYywgZCwgZSwgZiwgZykge1xuXHRcdFx0dmFyIGggPSBjLnN0cmVhbVthXSxcblx0XHRcdFx0aSA9IGMudmlkZW8uZW5jb2RlaWQ7XG5cdFx0XHRpZiAoIWkgfHwgIWQpXG5cdFx0XHRcdHJldHVybiBcIlwiO1xuXHRcdFx0dmFyIGogPSB7XG5cdFx0XHRcdFx0Zmx2OiAwLFxuXHRcdFx0XHRcdGZsdmhkOiAwLFxuXHRcdFx0XHRcdG1wNDogMSxcblx0XHRcdFx0XHRoZDI6IDIsXG5cdFx0XHRcdFx0XCIzZ3BoZFwiOiAxLFxuXHRcdFx0XHRcdFwiM2dwXCI6IDBcblx0XHRcdFx0fSxcblx0XHRcdFx0ayA9IGpbZF0sXG5cdFx0XHRcdGwgPSB7XG5cdFx0XHRcdFx0Zmx2OiBcImZsdlwiLFxuXHRcdFx0XHRcdG1wNDogXCJtcDRcIixcblx0XHRcdFx0XHRoZDI6IFwiZmx2XCIsXG5cdFx0XHRcdFx0bXA0aGQ6IFwibXA0XCIsXG5cdFx0XHRcdFx0bXA0aGQyOiBcIm1wNFwiLFxuXHRcdFx0XHRcdFwiM2dwaGRcIjogXCJtcDRcIixcblx0XHRcdFx0XHRcIjNncFwiOiBcImZsdlwiLFxuXHRcdFx0XHRcdGZsdmhkOiBcImZsdlwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG0gPSBsW2RdLFxuXHRcdFx0XHRuID0gYi50b1N0cmluZygxNik7XG5cdFx0XHQxID09IG4ubGVuZ3RoICYmIChuID0gXCIwXCIgKyBuKTtcblx0XHRcdHZhciBvID0gaC5zZWdzW2JdLnRvdGFsX21pbGxpc2Vjb25kc192aWRlbyAvIDFlMyxcblx0XHRcdFx0cCA9IGguc2Vnc1tiXS5rZXk7XG5cdFx0XHQoXCJcIiA9PSBwIHx8IC0xID09IHApICYmIChwID0gaC5rZXkyICsgaC5rZXkxKTtcblx0XHRcdHZhciBxID0gXCJcIjtcblx0XHRcdGMuc2hvdyAmJiAocSA9IGMuc2hvdy5wYXkgPyBcIiZ5cHJlbWl1bT0xXCIgOiBcIiZ5bW92aWU9MVwiKTtcblx0XHRcdHZhciByID0gXCIvcGxheWVyL2dldEZsdlBhdGgvc2lkL1wiICsgc2lkICsgXCJfXCIgKyBuICsgXCIvc3QvXCIgKyBtICsgXCIvZmlsZWlkL1wiICsgZSArIFwiP0s9XCIgKyBwICsgXCImaGQ9XCIgKyBrICsgXCImbXlwPTAmdHM9XCIgKyBvICsgXCImeXBwPTBcIiArIHEsXG5cdFx0XHRcdHMgPSBbMTksIDEsIDQsIDcsIDMwLCAxNCwgMjgsIDgsIDI0LCAxNywgNiwgMzUsIDM0LCAxNiwgOSwgMTAsIDEzLCAyMiwgMzIsIDI5LCAzMSwgMjEsIDE4LCAzLCAyLCAyMywgMjUsIDI3LCAxMSwgMjAsIDUsIDE1LCAxMiwgMCwgMzMsIDI2XSxcblx0XHRcdFx0dCA9IGVuY29kZVVSSUNvbXBvbmVudChlbmNvZGU2NChFKEYobWtfYTQgKyBcInBvelwiICsgdXNlckNhY2hlX2EyLCBzKS50b1N0cmluZygpLCBzaWQgKyBcIl9cIiArIGUgKyBcIl9cIiArIHRva2VuKSkpO1xuXHRcdFx0cmV0dXJuIHIgKz0gXCImZXA9XCIgKyB0LCByICs9IFwiJmN0eXBlPTEyXCIsIHIgKz0gXCImZXY9MVwiLCByICs9IFwiJnRva2VuPVwiICsgdG9rZW4sIHIgKz0gXCImb2lwPVwiICsgdGhpcy5faXAsIHIgKz0gKGYgPyBcIi9wYXNzd29yZC9cIiArIGYgOiBcIlwiKSArIChnID8gZyA6IFwiXCIpLCByID0gXCJodHRwOi8vay55b3VrdS5jb21cIiArIHJcblx0XHR9XG5cdH07XG5cblx0YWpheCh7XG5cdFx0dXJsOiAnaHR0cDovL3BsYXkueW91a3UuY29tL3BsYXkvZ2V0Lmpzb24/dmlkPScgKyBfaWQgKyAnJmN0PTEyJyxcblx0XHRqc29ucDogdHJ1ZSxcblx0XHRjYWxsYmFjazogZnVuY3Rpb24gKHBhcmFtKSB7XG5cdFx0XHRpZihwYXJhbSA9PSAtMSkge1xuXHRcdFx0XHRsb2coJ+ino+aekHlvdWt16KeG6aKR5Zyw5Z2A5aSx6LSlJywgMilcblx0XHRcdH1cblx0XHRcdHJzID0gcGFyYW07XG5cdFx0XHR2YXIgYSA9IHBhcmFtLmRhdGEsXG5cdFx0XHRcdGMgPSBFKEYobWtfYTMgKyBcIm8wYlwiICsgdXNlckNhY2hlX2ExLCBbMTksIDEsIDQsIDcsIDMwLCAxNCwgMjgsIDgsIDI0LFxuXHRcdFx0XHRcdDE3LCA2LCAzNSwgMzQsIDE2LCA5LCAxMCwgMTMsIDIyLCAzMiwgMjksIDMxLCAyMSwgMTgsIDMsIDIsIDIzLCAyNSwgMjcsIDExLCAyMCwgNSwgMTUsIDEyLCAwLCAzMywgMjZcblx0XHRcdFx0XSkudG9TdHJpbmcoKSwgZGVjb2RlNjQoYS5zZWN1cml0eS5lbmNyeXB0X3N0cmluZykpO1xuXHRcdFx0YyAgICAgPSBjLnNwbGl0KFwiX1wiKTtcblx0XHRcdHNpZCAgID0gY1swXTtcblx0XHRcdHRva2VuID0gY1sxXTtcblx0XHRcdGlmICggY2FuUGxheU0zVTggJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdQbGF5U3RhdGlvbicpID09PSAtMSApIHtcblx0XHRcdFx0dmFyIGVwICA9IGVuY29kZVVSSUNvbXBvbmVudChEKEUoRihta19hNCArIFwicG96XCIgKyB1c2VyQ2FjaGVfYTIsIFsxOSwgMSwgNCwgNywgMzAsIDE0LCAyOCwgOCwgMjQsIDE3LCA2LCAzNSwgMzQsIDE2LCA5LCAxMCwgMTMsIDIyLCAzMiwgMjksIDMxLCAyMSwgMTgsIDMsIDIsIDIzLCAyNSwgMjcsIDExLCAyMCwgNSwgMTUsIDEyLCAwLCAzMywgMjZdKS50b1N0cmluZygpLCBzaWQgKyBcIl9cIiArIF9pZCArIFwiX1wiICsgdG9rZW4pKSk7XG5cdFx0XHRcdHZhciBvaXAgPSBhLnNlY3VyaXR5LmlwO1xuXHRcdFx0XHR2YXIgc291cmNlID0gW1xuXHRcdFx0XHRcdFsn6LaF5riFJywgJ2h0dHA6Ly9wbC55b3VrdS5jb20vcGxheWxpc3QvbTN1OD92aWQ9JytfaWQrJyZ0eXBlPWhkMiZjdHlwZT0xMiZrZXlmcmFtZT0xJmVwPScrZXArJyZzaWQ9JytzaWQrJyZ0b2tlbj0nK3Rva2VuKycmZXY9MSZvaXA9JytvaXBdLFxuXHRcdFx0XHRcdFsn6auY5riFJywgJ2h0dHA6Ly9wbC55b3VrdS5jb20vcGxheWxpc3QvbTN1OD92aWQ9JytfaWQrJyZ0eXBlPW1wNCZjdHlwZT0xMiZrZXlmcmFtZT0xJmVwPScrZXArJyZzaWQ9JytzaWQrJyZ0b2tlbj0nK3Rva2VuKycmZXY9MSZvaXA9JytvaXBdLFxuXHRcdFx0XHRcdFsn5qCH5riFJywgJ2h0dHA6Ly9wbC55b3VrdS5jb20vcGxheWxpc3QvbTN1OD92aWQ9JytfaWQrJyZ0eXBlPWZsdiZjdHlwZT0xMiZrZXlmcmFtZT0xJmVwPScrZXArJyZzaWQ9JytzaWQrJyZ0b2tlbj0nK3Rva2VuKycmZXY9MSZvaXA9JytvaXBdXG5cdFx0XHRcdF07XG5cdFx0XHRcdGxvZygn6Kej5p6QeW91a3Xop4bpopHlnLDlnYDmiJDlip8gJyArIHNvdXJjZS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtyZXR1cm4gJzxhIGhyZWY9JytpdGVtWzFdKyc+JytpdGVtWzBdKyc8L2E+J30pLmpvaW4oJyAnKSwgMilcblx0XHRcdFx0Y2FsbGJhY2soc291cmNlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciB0ID0gbmV3IFBsYXlMaXN0RGF0YShhLCBhLnN0cmVhbSwgJ21wNCcpXG5cdFx0XHRcdHZhciBzb3VyY2UgPSBbXG5cdFx0XHRcdFx0WyfmoIfmuIUnLCB0Ll92aWRlb1NlZ3NEaWMuc3RyZWFtc1snZ3VveXUnXVsnM2dwaGQnXVswXS5zcmNdXG5cdFx0XHRcdF07XG5cdFx0XHRcdGxvZygn6Kej5p6QeW91a3Xop4bpopHlnLDlnYDmiJDlip8gJyArIHNvdXJjZS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtyZXR1cm4gJzxhIGhyZWY9JytpdGVtWzFdKyc+JytpdGVtWzBdKyc8L2E+J30pLmpvaW4oJyAnKSwgMilcblx0XHRcdFx0Y2FsbGJhY2soc291cmNlKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pXG59XG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG5cdHBhcnNlWW91a3VDb2RlKHdpbmRvdy52aWRlb0lkLCBjYWxsYmFjaylcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IFtcblx0cmVxdWlyZSgnLi9zZWVrZXJfYmlsaWJpbGknKSxcblx0cmVxdWlyZSgnLi9zZWVrZXJfeW91a3UnKSxcblx0cmVxdWlyZSgnLi9zZWVrZXJfdHVkb3UnKSxcblx0cmVxdWlyZSgnLi9zZWVrZXJfaXFpeWknKSxcblx0cmVxdWlyZSgnLi9zZWVrZXJfaHVuYW50dicpLFxuXHRyZXF1aXJlKCcuL3NlZWtlcl85MXBvcm4nKVxuXHQvLyAscmVxdWlyZSgnLi9zZWVrZXJfZXhhbXBsZScpXG5dXG4iXX0=
