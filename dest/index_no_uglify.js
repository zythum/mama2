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
},{"./createElement":4,"./flashBlocker":5,"./log":8,"./mamaKey":9,"./player":11,"./purl":12,"./seeker_flvsp":17,"./seekers":22}],2:[function(require,module,exports){
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
	var headers = defalutOption(options.headers, {})

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
	for (var header in headers) {
		xhr.setRequestHeader(header, headers[header])
	}
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

},{"./jsonp":7,"./noop":10,"./queryString":13}],3:[function(require,module,exports){
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
			
			url: encodeURIComponent(url),
			post: type === 'post' ? 1 : 0,			
			xml: opts.xml ? 1 : 0,
			text: opts.text ? 1 : 0,
			gzinflate: opts.gzinflate ? 1 : 0,
			ua: opts.ua || ''
		},
		jsonp: true,
		callback: callback,
		context: opts.context
	})
}

module.exports = httpProxy
},{"./ajax":2,"./createElement":4,"./queryString":13}],7:[function(require,module,exports){
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
},{"./createElement":4,"./noop":10}],8:[function(require,module,exports){
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
},{"./createElement":4}],9:[function(require,module,exports){
//\u5988\u5988\u8ba1\u5212\u552f\u4e00\u503c
module.exports = 'MAMAKEY_\u7530\u7434\u662f\u8fd9\u4e2a\u4e16\u754c\u4e0a\u6700\u53ef\u7231\u7684\u5973\u5b69\u5b50\u5475\u5475\u5475\u5475\uff0c\u6211\u8981\u8ba9\u5168\u4e16\u754c\u90fd\u5728\u77e5\u9053'
},{}],10:[function(require,module,exports){
//\u7a7a\u65b9\u6cd5
module.exports = function () {}
},{}],11:[function(require,module,exports){
var MAMAPlayer;

// MAMAPlayer 
// https://github.com/zythum/mamaplayer
!function e(t,n,i){function o(r,a){if(!n[r]){if(!t[r]){var l="function"==typeof require&&require;if(!a&&l)return l(r,!0);if(s)return s(r,!0);throw new Error("Cannot find module '"+r+"'")}var c=n[r]={exports:{}};t[r][0].call(c.exports,function(e){var n=t[r][1][e];return o(n?n:e)},c,c.exports,e,t,n,i)}return n[r].exports}for(var s="function"==typeof require&&require,r=0;r<i.length;r++)o(i[r]);return o}({1:[function(e,t){function n(e){for(var t=[],n=1;n<arguments.length;n++){var o=arguments[n],s=o.init;t.push(s),delete o.init,i(e.prototype,o)}e.prototype.init=function(){t.forEach(function(e){e.call(this)}.bind(this))}}var i=e("./extend");t.exports=n},{"./extend":9}],2:[function(e,t){var n=e("./player.css"),i=e("./player.html"),o=(e("./extend"),e("./createElement")),s=e("./parseDOMByClassNames");t.exports={init:function(){var e=function(){var e=this.iframe.contentDocument.getElementsByTagName("head")[0],t=this.iframe.contentDocument.body;o("style",function(){e.appendChild(this);try{this.styleSheet.cssText=n}catch(t){this.appendChild(document.createTextNode(n))}}),o("link",{appendTo:e,href:"http://libs.cncdn.cn/font-awesome/4.3.0/css/font-awesome.min.css",rel:"stylesheet",type:"text/css"}),t.innerHTML=i,this.DOMs=s(t,["player","video","video-frame","comments","comments-btn","play","progress_anchor","buffered_anchor","fullscreen","allscreen","hd","volume_anchor","current","duration"]),this.video=this.DOMs.video}.bind(this),t=document.getElementById(this.id),r=this.iframe=o("iframe",{allowTransparency:!0,frameBorder:"no",scrolling:"no",src:"about:blank",mozallowfullscreen:"mozallowfullscreen",webkitallowfullscreen:"webkitallowfullscreen",style:{width:this.size[0]+"px",height:this.size[1]+"px",overflow:"hidden"}});t&&t.parentNode?(t.parentNode.replaceChild(r,t),e()):(document.body.appendChild(r),e(),document.body.removeChild(r))}}},{"./createElement":7,"./extend":9,"./parseDOMByClassNames":11,"./player.css":12,"./player.html":13}],3:[function(e,t){function n(e){e.strokeStyle="black",e.lineWidth=3,e.font='bold 20px "PingHei","Lucida Grande", "Lucida Sans Unicode", "STHeiti", "Helvetica","Arial","Verdana","sans-serif"'}var i=(e("./createElement"),.1),o=25,s=4e3,r=document.createElement("canvas").getContext("2d");n(r);var a=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame||window.oRequestAnimationFrame||function(e){setTimeout(e,1e3/60)};t.exports={init:function(){this.video.addEventListener("play",this.reStartComment.bind(this)),this.video.addEventListener("pause",this.pauseComment.bind(this)),this.lastCommnetUpdateTime=0,this.lastCommnetIndex=0,this.commentLoopPreQueue=[],this.commentLoopQueue=[],this.commentButtonPreQueue=[],this.commentButtonQueue=[],this.commentTopPreQueue=[],this.commentTopQueue=[],this.drawQueue=[],this.preRenders=[],this.preRenderMap={},this.enableComment=void 0===this.comments?!1:!0,this.prevDrawCanvas=document.createElement("canvas"),this.canvas=this.DOMs.comments.getContext("2d"),this.comments&&this.DOMs.player.classList.add("has-comments"),this.DOMs["comments-btn"].classList.add("enable"),this.DOMs.comments.display=this.enableComment?"block":"none";var e=0,t=function(){(e=~e)&&this.onCommentTimeUpdate(),a(t)}.bind(this);t()},needDrawText:function(e,t,n){this.drawQueue.push([e,t,n])},drawText:function(){var e=this.prevDrawCanvas,t=this.prevDrawCanvas.getContext("2d");e.width=this.canvasWidth,e.height=this.canvasHeight,t.clearRect(0,0,this.canvasWidth,this.canvasHeight);var i=[];this.preRenders.forEach(function(e,t){e.used=!1,void 0===e.cid&&i.push(t)});for(var s;s=this.drawQueue.shift();)!function(e,s){var r,a=e[0].text+e[0].color,l=s.preRenderMap[a];if(void 0===l){var l=i.shift();void 0===l?(r=document.createElement("canvas"),l=s.preRenders.push(r)-1):r=s.preRenders[l];var c=r.width=e[0].width,h=r.height=o+10,d=r.getContext("2d");d.clearRect(0,0,c,h),n(d),d.fillStyle=e[0].color,d.strokeText(e[0].text,0,o),d.fillText(e[0].text,0,o),r.cid=a,s.preRenderMap[a]=l}else r=s.preRenders[l];r.used=!0,t.drawImage(r,e[1],e[2])}(s,this);this.preRenders.forEach(function(e){e.used===!1&&(delete this.preRenderMap[e.cid],e.cid=void 0)}.bind(this)),this.canvas.clearRect(0,0,this.canvasWidth,this.canvasHeight),this.canvas.drawImage(e,0,0)},createComment:function(e,t){if(void 0===e)return!1;var n=r.measureText(e.text);return{startTime:t,text:e.text,color:e.color,width:n.width+20}},commentTop:function(e,t,n){this.commentTopQueue.forEach(function(t,i){void 0!=t&&(n>t.startTime+s?this.commentTopQueue[i]=void 0:this.needDrawText(t,(e-t.width)/2,o*i))}.bind(this));for(var i;i=this.commentTopPreQueue.shift();)i=this.createComment(i,n),this.commentTopQueue.forEach(function(t,n){i&&void 0===t&&(t=this.commentTopQueue[n]=i,this.needDrawText(t,(e-i.width)/2,o*n),i=void 0)}.bind(this)),i&&(this.commentTopQueue.push(i),this.needDrawText(i,(e-i.width)/2,o*this.commentTopQueue.length-1))},commentBottom:function(e,t,n){t-=10,this.commentButtonQueue.forEach(function(i,r){void 0!=i&&(n>i.startTime+s?this.commentButtonQueue[r]=void 0:this.needDrawText(i,(e-i.width)/2,t-o*(r+1)))}.bind(this));for(var i;i=this.commentButtonPreQueue.shift();)i=this.createComment(i,n),this.commentButtonQueue.forEach(function(n,s){i&&void 0===n&&(n=this.commentButtonQueue[s]=i,this.needDrawText(n,(e-i.width)/2,t-o*(s+1)),i=void 0)}.bind(this)),i&&(this.commentButtonQueue.push(i),this.needDrawText(i,(e-i.width)/2,t-o*this.commentButtonQueue.length))},commentLoop:function(e,t,n){for(var s=t/o|0,r=-1;++r<s;){var a=this.commentLoopQueue[r];if(void 0===a&&(a=this.commentLoopQueue[r]=[]),this.commentLoopPreQueue.length>0){var l=0===a.length?void 0:a[a.length-1];if(void 0===l||(n-l.startTime)*i>l.width){var c=this.createComment(this.commentLoopPreQueue.shift(),n);c&&a.push(c)}}this.commentLoopQueue[r]=a.filter(function(t){var s=(n-t.startTime)*i;return 0>s||s>t.width+e?!1:(this.needDrawText(t,e-s,o*r),!0)}.bind(this))}for(var h=this.commentLoopQueue.length-s;h-->0;)this.commentLoopQueue.pop()},pauseComment:function(){this.pauseCommentAt=Date.now()},reStartComment:function(){if(this.pauseCommentAt){var e=Date.now()-this.pauseCommentAt;this.commentLoopQueue.forEach(function(t){t.forEach(function(t){t&&(t.startTime+=e)})}),this.commentButtonQueue.forEach(function(t){t&&(t.startTime+=e)}),this.commentTopQueue.forEach(function(t){t&&(t.startTime+=e)})}this.pauseCommentAt=void 0},drawComment:function(){if(!this.pauseCommentAt){var e=Date.now(),t=this.DOMs["video-frame"].offsetWidth,n=this.DOMs["video-frame"].offsetHeight;t!=this.canvasWidth&&(this.DOMs.comments.width=t,this.canvasWidth=t),n!=this.canvasHeight&&(this.DOMs.comments.height=n,this.canvasHeight=n);var i=this.video.offsetWidth,o=this.video.offsetHeight;this.commentLoop(i,o,e),this.commentTop(i,o,e),this.commentBottom(i,o,e),this.drawText()}},onCommentTimeUpdate:function(){if(this.enableComment!==!1){var e=this.video.currentTime;if(Math.abs(e-this.lastCommnetUpdateTime)<=1&&e>this.lastCommnetUpdateTime){var t=0;for(this.lastCommnetIndex&&this.comments[this.lastCommnetIndex].time<=this.lastCommnetUpdateTime&&(t=this.lastCommnetIndex);++t<this.comments.length;)if(!(this.comments[t].time<=this.lastCommnetUpdateTime)){if(this.comments[t].time>e)break;switch(this.comments[t].pos){case"bottom":this.commentButtonPreQueue.push(this.comments[t]);break;case"top":this.commentTopPreQueue.push(this.comments[t]);break;default:this.commentLoopPreQueue.push(this.comments[t])}this.lastCommnetIndex=t}}try{this.drawComment()}catch(n){}this.lastCommnetUpdateTime=e}}}},{"./createElement":7}],4:[function(e,t){function n(e){return Array.prototype.slice.call(e)}function i(e,t,n,i){function o(t){var n=(t.clientX-e.parentNode.getBoundingClientRect().left)/e.parentNode.offsetWidth;return Math.min(Math.max(n,0),1)}function s(t){1==t.which&&(l=!0,e.draging=!0,r(t))}function r(e){if(1==e.which&&l===!0){var t=o(e);n(t)}}function a(t){if(1==t.which&&l===!0){var s=o(t);n(s),i(s),l=!1,delete e.draging}}var l=!1;n=n||function(){},i=i||function(){},e.parentNode.addEventListener("mousedown",s),t.addEventListener("mousemove",r),t.addEventListener("mouseup",a)}var o=(e("./createElement"),e("./delegateClickByClassName")),s=e("./timeFormat");t.exports={init:function(){var e=this.iframe.contentDocument,t=o(e);t.on("play",this.onPlayClick,this),t.on("video-frame",this.onVideoClick,this),t.on("source",this.onSourceClick,this),t.on("allscreen",this.onAllScreenClick,this),t.on("fullscreen",this.onfullScreenClick,this),t.on("normalscreen",this.onNormalScreenClick,this),t.on("comments-btn",this.oncommentsBtnClick,this),e.documentElement.addEventListener("keydown",this.onKeyDown.bind(this),!1),this.DOMs.player.addEventListener("mousemove",this.onMouseActive.bind(this)),i(this.DOMs.progress_anchor,e,this.onProgressAnchorWillSet.bind(this),this.onProgressAnchorSet.bind(this)),i(this.DOMs.volume_anchor,e,this.onVolumeAnchorWillSet.bind(this))},onKeyDown:function(e){switch(e.preventDefault(),e.keyCode){case 32:this.onPlayClick();break;case 39:this.video.currentTime=Math.min(this.video.duration,this.video.currentTime+10);break;case 37:this.video.currentTime=Math.max(0,this.video.currentTime-10);break;case 38:this.video.volume=Math.min(1,this.video.volume+.1),this.DOMs.volume_anchor.style.width=100*this.video.volume+"%";break;case 40:this.video.volume=Math.max(0,this.video.volume-.1),this.DOMs.volume_anchor.style.width=100*this.video.volume+"%";break;case 65:this.DOMs.player.classList.contains("allscreen")?this.onNormalScreenClick():this.onAllScreenClick();break;case 70:this.DOMs.player.classList.contains("fullscreen")||this.onfullScreenClick()}},onVideoClick:function(){void 0==this.videoClickDblTimer?this.videoClickDblTimer=setTimeout(function(){this.videoClickDblTimer=void 0,this.onPlayClick()}.bind(this),300):(clearTimeout(this.videoClickDblTimer),this.videoClickDblTimer=void 0,document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement?this.onNormalScreenClick():this.onfullScreenClick())},onMouseActive:function(){this.DOMs.player.classList.add("active"),clearTimeout(this.MouseActiveTimer),this.MouseActiveTimer=setTimeout(function(){this.DOMs.player.classList.remove("active")}.bind(this),1e3)},onPlayClick:function(){this.DOMs.play.classList.contains("paused")?(this.video.play(),this.DOMs.play.classList.remove("paused")):(this.video.pause(),this.DOMs.play.classList.add("paused"))},onSourceClick:function(e){e.classList.contains("curr")||(this.video.preloadStartTime=this.video.currentTime,this.video.src=this.sourceList[0|e.getAttribute("sourceIndex")][1],n(e.parentNode.childNodes).forEach(function(t){e===t?t.classList.add("curr"):t.classList.remove("curr")}.bind(this)))},onProgressAnchorWillSet:function(e){var t=this.video.duration,n=t*e;this.DOMs.current.innerHTML=s(n),this.DOMs.duration.innerHTML=s(t),this.DOMs.progress_anchor.style.width=100*e+"%"},onProgressAnchorSet:function(e){this.video.currentTime=this.video.duration*e},onVolumeAnchorWillSet:function(e){this.video.volume=e,this.DOMs.volume_anchor.style.width=100*e+"%"},onAllScreenClick:function(){var e=document.documentElement.clientWidth,t=document.documentElement.clientHeight;this.iframe.style.cssText=";position:fixed;top:0;left:0;width:"+e+"px;height:"+t+"px;z-index:999999;",this.allScreenWinResizeFunction=this.allScreenWinResizeFunction||function(){this.iframe.style.width=document.documentElement.clientWidth+"px",this.iframe.style.height=document.documentElement.clientHeight+"px"}.bind(this),window.removeEventListener("resize",this.allScreenWinResizeFunction),window.addEventListener("resize",this.allScreenWinResizeFunction),this.DOMs.player.classList.add("allscreen")},onfullScreenClick:function(){["webkitRequestFullScreen","mozRequestFullScreen","requestFullScreen"].forEach(function(e){this.DOMs.player[e]&&this.DOMs.player[e]()}.bind(this)),this.onMouseActive()},onNormalScreenClick:function(){window.removeEventListener("resize",this.allScreenWinResizeFunction),this.iframe.style.cssText=";width:"+this.size[0]+"px;height:"+this.size[1]+"px;",["webkitCancelFullScreen","mozCancelFullScreen","cancelFullScreen"].forEach(function(e){document[e]&&document[e]()}),this.DOMs.player.classList.remove("allscreen")},oncommentsBtnClick:function(){this.enableComment=!this.DOMs["comments-btn"].classList.contains("enable"),this.enableComment?(setTimeout(function(){this.DOMs.comments.style.display="block"}.bind(this),80),this.DOMs["comments-btn"].classList.add("enable")):(this.DOMs.comments.style.display="none",this.DOMs["comments-btn"].classList.remove("enable"))}}},{"./createElement":7,"./delegateClickByClassName":8,"./timeFormat":14}],5:[function(e,t){{var n=(e("./extend"),e("./createElement"));e("./parseDOMByClassNames")}t.exports={init:function(){var e=0;this.sourceList.forEach(function(t,i){n("li",{appendTo:this.DOMs.hd,sourceIndex:i,className:"source "+(i===e?"curr":""),innerHTML:t[0]})}.bind(this)),this.DOMs.video.src=this.sourceList[e][1]}}},{"./createElement":7,"./extend":9,"./parseDOMByClassNames":11}],6:[function(e,t){var n=e("./timeFormat");t.exports={init:function(){this.video.addEventListener("timeupdate",this.onVideoTimeUpdate.bind(this)),this.video.addEventListener("play",this.onVideoPlay.bind(this)),this.video.addEventListener("pause",this.onVideoTimePause.bind(this)),this.video.addEventListener("loadedmetadata",this.onVideoLoadedMetaData.bind(this)),setInterval(this.videoBuffered.bind(this),1e3),this.DOMs.volume_anchor.style.width=100*this.video.volume+"%"},onVideoTimeUpdate:function(){var e=this.video.currentTime,t=this.video.duration;this.DOMs.current.innerHTML=n(e),this.DOMs.duration.innerHTML=n(t),this.DOMs.progress_anchor.draging||(this.DOMs.progress_anchor.style.width=100*Math.min(Math.max(e/t,0),1)+"%")},videoBuffered:function(){var e=this.video.buffered,t=this.video.currentTime,n=0==e.length?0:e.end(e.length-1);this.DOMs.buffered_anchor.style.width=100*Math.min(Math.max(n/this.video.duration,0),1)+"%",0==n||t>=n?this.DOMs.player.classList.add("loading"):this.DOMs.player.classList.remove("loading")},onVideoPlay:function(){this.DOMs.play.classList.remove("paused")},onVideoTimePause:function(){this.DOMs.play.classList.add("paused")},onVideoLoadedMetaData:function(){this.video.preloadStartTime&&(this.video.currentTime=this.video.preloadStartTime,delete this.video.preloadStartTime)}}},{"./timeFormat":14}],7:[function(e,t){function n(e,t){var n=document.createElement(e);if("function"==typeof t)t.call(n);else for(var i in t)if(t.hasOwnProperty(i))switch(i){case"appendTo":t[i].appendChild(n);break;case"text":var o=document.createTextNode(t[i]);n.innerHTML="",n.appendChild(o);break;case"innerHTML":case"className":case"id":n[i]=t[i];break;case"style":var s=t[i];for(var r in s)s.hasOwnProperty(r)&&(n.style[r]=s[r]);break;default:n.setAttribute(i,t[i]+"")}return n}t.exports=n},{}],8:[function(e,t){function n(e){return Array.prototype.slice.call(e)}function i(e){this._eventMap={},this._rootElement=e,this._isRootElementBindedClick=!1,this._bindClickFunction=function(e){!function t(e,i){i&&i.nodeName&&(i.classList&&n(i.classList).forEach(function(t){e.trigger(t,i)}),t(e,i.parentNode))}(this,e.target)}.bind(this)}var o=e("./extend");o(i.prototype,{on:function(e,t,n){void 0===this._eventMap[e]&&(this._eventMap[e]=[]),this._eventMap[e].push([t,n]),this._isRootElementBindedClick||(_isRootElementBindedClick=!0,this._rootElement.addEventListener("click",this._bindClickFunction,!1))},off:function(e,t){if(void 0!=this._eventMap[e])for(var n=this._eventMap[e].length;n--;)if(this._eventMap[e][n][0]===t){this._eventMap[e].splice(n,1);break}for(var i in this._eventMap)break;void 0===i&&this._isRootElementBindedClick&&(_isRootElementBindedClick=!1,this._rootElement.removeEventListener("click",this._bindClickFunction,!1))},trigger:function(e,t){t=void 0===t?this._rootElement.getElementsByTagNames(e):[t],t.forEach(function(t){(this._eventMap[e]||[]).forEach(function(e){e[0].call(e[1],t)})}.bind(this))}}),t.exports=function(e){return new i(e)}},{"./extend":9}],9:[function(e,t){function n(e){for(var t,n=arguments.length,i=1;n>i;){t=arguments[i++];for(var o in t)t.hasOwnProperty(o)&&(e[o]=t[o])}return e}t.exports=n},{}],10:[function(e){function t(e,t,n,i){this.id=e,this.size=t.split("x"),this.sourceList=n||[],this.comments=i,this.init()}e("./component")(t,e("./component_build"),e("./component_event"),e("./component_video"),e("./component_source"),e("./component_comments")),MAMAPlayer=t},{"./component":1,"./component_build":2,"./component_comments":3,"./component_event":4,"./component_source":5,"./component_video":6}],11:[function(e,t){function n(e,t){var n={};return t.forEach(function(t){n[t]=e.getElementsByClassName(t)[0]}),n}t.exports=n},{}],12:[function(e,t){t.exports='* { margin:0; padding:0; }body { font-family: "PingHei","Lucida Grande", "Lucida Sans Unicode", "STHeiti", "Helvetica","Arial","Verdana","sans-serif"; font-size:16px;}html, body, .player { height: 100%; }.player:-webkit-full-screen { width: 100%; cursor:url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==); }.player:-moz-full-screen { width: 100%; cursor:url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==); }.player:full-screen { width: 100%; cursor:url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==); }.player {		border-radius: 3px;	overflow: hidden;	position: relative;	cursor: default;	-webkit-user-select: none;	-moz-user-select: none;	user-select: none;}.video-frame {	box-sizing: border-box;	padding-bottom: 50px;	height: 100%;	overflow: hidden;	position: relative;}.video-frame .comments{	position: absolute;	top:0;left:0;	width:100%;	height:100%;	-webkit-transform:translateZ(0);	-moz-transform:translateZ(0);	transform:translateZ(0);	pointer-events: none;}.player:-webkit-full-screen .video-frame { padding-bottom: 0px; }.player:-moz-full-screen .video-frame { padding-bottom: 0px; }.player:full-screen .video-frame{ padding-bottom: 0px; }.video {	width: 100%;	height: 100%;	background: #000000;}.controller {	position: absolute;	bottom: 0px;	left:0;	right:0;	background: #24272A;	height: 50px;}.controller .loading-icon {	display: none;	position: absolute;	width: 20px;	height: 20px;	line-height: 20px;	text-align: center;	font-size: 20px;	color: #ffffff;	top: -30px;	right: 10px;}.player.loading .controller .loading-icon {	display: block;}.player:-webkit-full-screen .controller {	-webkit-transform:translateY(50px);	-webkit-transition: -webkit-transform 0.3s ease;}.player:-moz-full-screen .controller {	-moz-transform:translateY(50px);	-moz-transition: -moz-transform 0.3s ease;}.player:full-screen .controller {	transform:translateY(50px);	transition: transform 0.3s ease;}.player.active:-webkit-full-screen {	cursor: default;}.player.active:-moz-full-screen {	cursor: default;}.player.active:full-screen {	cursor: default;}.player.active:-webkit-full-screen .controller,.player:-webkit-full-screen .controller:hover {	-webkit-transform:translateY(0);	cursor: default;}.player.active:-moz-full-screen .controller,.player:-moz-full-screen .controller:hover {	-moz-transform:translateY(0);	cursor: default;}.player.active:full-screen .controller.player:full-screen .controller:hover {	transform:translateY(0);	cursor: default;}.player.active:-webkit-full-screen .controller .progress .progress_anchor:after,.player:-webkit-full-screen .controller:hover .progress .progress_anchor:after {	height:12px;}.player.active:-moz-full-screen .controller .progress .progress_anchor:after,.player:-moz-full-screen .controller:hover .progress .progress_anchor:after {	height:12px;}.player.active:full-screen .controller .progress .progress_anchor:after,.player:full-screen .controller:hover .progress .progress_anchor:after {	height:12px;}.player:-webkit-full-screen .controller .progress .progress_anchor:after {	height:4px;}.player:-moz-full-screen .controller .progress .progress_anchor:after {	height:4px;}.player:full-screen .controller .progress .progress_anchor:after {	height:4px;}.controller .progress {	position: absolute;	top:0px;	left:0;	right:0;	border-right: 4px solid #181A1D;	border-left: 8px solid #DF6558;	height: 4px;	background: #181A1D;	z-index:1;	-webkit-transform: translateZ(0);	-moz-transform: translateZ(0);	transform: translateZ(0);}.controller .progress:after {	content:"";	display: block;	position: absolute;	top:0px;	left:0;	right:0;	bottom:-10px;	height: 10px;}.controller .progress .anchor {	height: 4px;	background: #DF6558;	position: absolute;	top:0;left:0;}.controller .progress .anchor:after {	content:"";	display: block;	width: 12px;	background: #DF6558;	position: absolute;	right:-4px;	top: 50%;	height: 12px;	box-shadow: 0 0 2px rgba(0,0,0, 0.4);	border-radius: 12px;	-webkit-transform: translateY(-50%);	-moz-transform: translateY(-50%);	transform: translateY(-50%);}.controller .progress .anchor.buffered_anchor {		position: relative;	background: rgba(255,255,255,0.1);}.controller .progress .anchor.buffered_anchor:after {	box-shadow: none;	height: 4px;	width: 4px;	border-radius: 0;	background: rgba(255,255,255,0.1);}.controller .right {	height: 50px;	position: absolute;	top:0;	left:10px;	right:10px;	pointer-events: none;}.controller .play,.controller .volume,.controller .time,.controller .hd,.controller .allscreen,.controller .normalscreen,.controller .comments-btn,.controller .fullscreen {	padding-top:4px;	height: 46px;	line-height: 50px;	text-align: center;	color: #eeeeee;	float:left;	text-shadow:0 0 2px rgba(0,0,0,0.5);	pointer-events: auto;}.controller .hd,.controller .allscreen,.controller .normalscreen,.controller .comments-btn,.controller .fullscreen {	float:right;}.controller .play {	width: 36px;	padding-left: 10px;	cursor: pointer;}.controller .play:after {	font-family: "FontAwesome";	content: "\\f04c";}.controller .play.paused:after {	content: "\\f04b";}.controller .volume {	min-width: 30px;	position: relative;	overflow: hidden;	-webkit-transition: min-width 0.3s ease 0.5s;	-moz-transition: min-width 0.3s ease 0.5s;	transition: min-width 0.3s ease 0.5s;}.controller .volume:hover {	min-width: 128px;}.controller .volume:before {	font-family: "FontAwesome";	content: "\\f028";	width: 36px;	display: block;}.controller .volume .progress {	width: 70px;	top: 27px;	left: 40px;}.controller .time {	font-size: 12px;	font-weight: bold;	padding-left: 10px;}.controller .time .current {	color: #DF6558;}.controller .fullscreen,.controller .allscreen,.controller .comments-btn,.controller .normalscreen {	width: 36px;	cursor: pointer;}.controller .comments-btn {	margin-right: -15px;	display: none;}.player.has-comments .controller .comments-btn {	display: block;}.controller .comments-btn:before {	font-family: "FontAwesome";	content: "\\f075";}.controller .comments-btn.enable:before {	color: #DF6558;}.controller .normalscreen {	display: none;}.player:-webkit-full-screen .controller .fullscreen,.player:-webkit-full-screen .controller .allscreen {	display: none;}.player:-webkit-full-screen .controller .normalscreen,.player.allscreen .controller .normalscreen {	display: block;}.player.allscreen .controller .allscreen {	display: none;}.controller .fullscreen:before {	font-family: "FontAwesome";	content: "\\f0b2";}.controller .allscreen:before {	font-family: "FontAwesome";	content: "\\f065";}.controller .normalscreen:before {	font-family: "FontAwesome";	content: "\\f066";}.controller .hd {	white-space:nowrap;	overflow: hidden;	margin-right: 10px;	text-align: right;}.controller .hd:hover li {	max-width: 300px;}.controller .hd li {	display: inline-block;	max-width: 0px;	-webkit-transition: max-width 0.8s ease 0.3s;	-moz-transition: max-width 0.8s ease 0.3s;	transition: max-width 0.8s ease 0.3s;	overflow: hidden;	font-size: 14px;	font-weight: bold;	position: relative;	cursor: pointer;}.controller .hd li:before {	content: "";	display: inline-block;	width:20px;}.controller .hd li:before {	content: "";	display: inline-block;	width:20px;}.controller .hd li.curr {	max-width: 300px;	cursor: default;	color: #DF6558;}.controller .hd li.curr:after {	content: "";	display: block;	position: absolute;	width:4px;	height:4px;	border-radius: 50%;	background: #ffffff;	left: 12px;	top: 23px;	opacity: 0;	-webkit-transition: opacity 0.5s ease 0.3s;	-moz-transition: opacity 0.5s ease 0.3s;	transition: opacity 0.5s ease 0.3s;}'},{}],13:[function(e,t){t.exports='<div class="player">	<div class="video-frame"><video class="video" autoplay="autoplay"></video><canvas class="comments"></canvas></div>	<div class="controller">		<div class="loading-icon fa fa-spin fa-circle-o-notch"></div>		<div class="progress">			<div class="anchor buffered_anchor" style="width:0%"></div>			<div class="anchor progress_anchor" style="width:0%"></div>		</div>		<div class="right">		 			 	<div class="fullscreen"></div>		 	<div class="allscreen"></div>		 	<div class="normalscreen"></div>		 	<ul class="hd"></ul>		 	<div class="comments-btn"></div>		 </div>		 <div class="left">		 	<div class="play paused"></div>		 	<div class="volume">			 	<div class="progress">			 		<div class="anchor volume_anchor" style="width:0%"></div>		 		</div>		 	</div>		 	<div class="time">		 		<span class="current">00:00:00</span> / <span class="duration">00:00:00</span>		 	</div>		 </div>	</div></div>'},{}],14:[function(e,t){function n(e,t){return(Array(t).join(0)+e).slice(-t)}function i(e){var t,i=[];return[3600,60,1].forEach(function(o){i.push(n(t=e/o|0,2)),e-=t*o}),i.join(":")}t.exports=i},{}]},{},[10]);

//exports
module.exports = MAMAPlayer;
},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
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




},{"./ajax":2,"./canPlayM3U8":3,"./log":8}],15:[function(require,module,exports){
/*  acfun
 *  @zhangge
 */
var purl      = require('./purl');
var log       = require('./log');
var ajax        = require('./ajax');
var isMobile;

exports.match = function (url) {
    if ( url.attr('host').indexOf('acfun.tv') >= 0) {
        if (/^.*\/v\/ac\d+$/.test(url.attr('path'))) {
            isMobile = false;
            return true;
        }
        if (url.param('ac')) {
            isMobile = true;
            return true;
        }
    }
    return false;
};

function getAv(url) {
    if (isMobile) {
        return url.param('ac');
    }
    return url.attr('path').match(/^.*\/v\/ac(\d+).*$/)[1];
}

exports.getVideos = function (url, callback) {
    log('\u5f00\u59cb\u89e3\u6790acfun\u5730\u5740by zhangge');
    var av = getAv(url);
    var sourceUrl = "http://api.aixifan.com/videos/" + av;
    ajax( {
        url: sourceUrl,
        headers: {
            'deviceType': "1"
        },
        callback: function(data) {
            if (data.code == 200) {
                var sourcdId = data.data.videos[0].sourceId;
                var realUrl = "http://api.aixifan.com/plays/" + sourcdId + "/realSource";
                ajax({
                    url: realUrl,
                    headers: {
                        'deviceType': '1'
                    },
                    callback: function(data) {
                        if (data.code == 200) {
                            var urls = [];
                            data.data.files.reverse().forEach(function(item) {
                                urls.push([item.description, item.url[0]])
                            });
                            return callback(urls)
                        }
                    }
                });
            }
        }
    });
};
},{"./ajax":2,"./log":8,"./purl":12}],16:[function(require,module,exports){
/*  bilibli 
 *  @\u6731\u4e00
 */
var purl      = require('./purl')
var log       = require('./log')
var httpProxy = require('./httpProxy')

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
		{aid: aid, page: page},
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

},{"./httpProxy":6,"./log":8,"./purl":12}],17:[function(require,module,exports){
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
},{"./ajax":2,"./canPlayM3U8":3,"./log":8}],18:[function(require,module,exports){
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
},{"./ajax":2,"./canPlayM3U8":3,"./log":8}],19:[function(require,module,exports){
/*  iqiyi 
 *  @\u6731\u4e00
 */
var canPlayM3U8 = require('./canPlayM3U8')
var queryString = require('./queryString')
var ajax = require('./ajax')
var httpProxy = require('./httpProxy')
var log = require('./log')

function getCookie(c_name) {
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

},{"./ajax":2,"./canPlayM3U8":3,"./httpProxy":6,"./log":8,"./queryString":13}],20:[function(require,module,exports){
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
},{"./ajax":2,"./canPlayM3U8":3,"./log":8,"./seeker_youku":21}],21:[function(require,module,exports){
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
},{"./ajax":2,"./canPlayM3U8":3,"./log":8}],22:[function(require,module,exports){
module.exports = [
	require('./seeker_bilibili'),
	require('./seeker_youku'),
	require('./seeker_tudou'),
	require('./seeker_iqiyi'),
	require('./seeker_hunantv'),
	require('./seeker_acfun'),
	require('./seeker_91porn')
	// ,require('./seeker_example')
]

},{"./seeker_91porn":14,"./seeker_acfun":15,"./seeker_bilibili":16,"./seeker_hunantv":18,"./seeker_iqiyi":19,"./seeker_tudou":20,"./seeker_youku":21}]},{},[1]);
/# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvaW5kZXguanMiLCJzcmMvYWpheC5qcyIsInNyYy9jYW5QbGF5TTNVOC5qcyIsInNyYy9jcmVhdGVFbGVtZW50LmpzIiwic3JjL2ZsYXNoQmxvY2tlci5qcyIsInNyYy9odHRwUHJveHkuanMiLCJzcmMvanNvbnAuanMiLCJzcmMvbG9nLmpzIiwic3JjL21hbWFLZXkuanMiLCJzcmMvbm9vcC5qcyIsInNyYy9wbGF5ZXIuanMiLCJzcmMvcHVybC5qcyIsInNyYy9xdWVyeVN0cmluZy5qcyIsInNyYy9zZWVrZXJfOTFwb3JuLmpzIiwic3JjL3NlZWtlcl9hY2Z1bi5qcyIsInNyYy9zZWVrZXJfYmlsaWJpbGkuanMiLCJzcmMvc2Vla2VyX2ZsdnNwLmpzIiwic3JjL3NlZWtlcl9odW5hbnR2LmpzIiwic3JjL3NlZWtlcl9pcWl5aS5qcyIsInNyYy9zZWVrZXJfdHVkb3UuanMiLCJzcmMvc2Vla2VyX3lvdWt1LmpzIiwic3JjL3NlZWtlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkNBO0FBQ0E7O0FDREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDalBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgZmxhc2hCbG9ja2VyICA9IHJlcXVpcmUoJy4vZmxhc2hCbG9ja2VyJylcbnZhciBjcmVhdGVFbGVtZW50ID0gcmVxdWlyZSgnLi9jcmVhdGVFbGVtZW50JylcbnZhciBNQU1BUGxheWVyICAgID0gcmVxdWlyZSgnLi9wbGF5ZXInKVxudmFyIGxvZyAgICAgICAgICAgPSByZXF1aXJlKCcuL2xvZycpXG52YXIgcHVybCAgICAgICAgICA9IHJlcXVpcmUoJy4vcHVybCcpXG52YXIgbWFtYUtleSAgICAgICA9IHJlcXVpcmUoJy4vbWFtYUtleScpXG52YXIgc2Vla2VycyAgICAgICA9IHJlcXVpcmUoJy4vc2Vla2VycycpXG52YXIgZmx2c3AgICAgICAgICA9IHJlcXVpcmUoJy4vc2Vla2VyX2ZsdnNwJyk7XG52YXIgbWF0Y2hlZFxuXG5pZiAod2luZG93W21hbWFLZXldICE9IHRydWUpIHtcblxuZnVuY3Rpb24gc2Vla2VkIChzb3VyY2UsIGNvbW1lbnRzKSB7XG5cdGlmICghc291cmNlKSB7XG5cdFx0bG9nKCfop6PmnpDlhoXlrrnlnLDlnYDlpLHotKUnLCAyKVxuXHRcdGRlbGV0ZSB3aW5kb3dbbWFtYUtleV1cblx0XHRyZXR1cm5cblx0fVx0XG5cdGxvZygn6Kej5p6Q5YaF5a655Zyw5Z2A5a6M5oiQJytzb3VyY2UubWFwKGZ1bmN0aW9uIChpKSB7cmV0dXJuICc8YSBocmVmPVwiJytpWzFdKydcIiB0YXJnZXQ9XCJfYmxhbmtcIj4nK2lbMF0rJzwvYT4nfSkuam9pbignICcpLCAyKVxuXHR2YXIgbWFzayA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcblx0XHRhcHBlbmRUbzogZG9jdW1lbnQuYm9keSxcblx0XHRzdHlsZToge1xuXHRcdFx0cG9zaXRpb246ICdmaXhlZCcsXG5cdFx0XHRiYWNrZ3JvdW5kOiAncmdiYSgwLDAsMCwwLjgpJyxcblx0XHRcdHRvcDogJzAnLFxuXHRcdFx0bGVmdDogJzAnLFxuXHRcdFx0d2lkdGg6ICcxMDAlJyxcblx0XHRcdGhlaWdodDogJzEwMCUnLFxuXHRcdFx0ekluZGV4OiAnOTk5OTk5J1xuXHRcdH1cblx0fSlcblx0Y3JlYXRlRWxlbWVudCgnZGl2Jywge1xuXHRcdGFwcGVuZFRvOiBtYXNrLFxuXHRcdHN0eWxlOiB7XG5cdFx0XHR3aWR0aDogJzEwMDBweCcsXG5cdFx0XHRoZWlnaHQ6ICc1MDBweCcsXG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJyxcblx0XHRcdHRvcDogJzUwJScsXG5cdFx0XHRsZWZ0OiAnNTAlJyxcblx0XHRcdG1hcmdpblRvcDogJy0yNTBweCcsXG5cdFx0XHRtYXJnaW5MZWZ0OiAnLTUwMHB4Jyxcblx0XHRcdGJvcmRlclJhZGl1czogJzJweCcsXG5cdFx0XHRib3hTaGFkb3c6ICcwIDAgMnB4ICMwMDAwMDAsIDAgMCAyMDBweCAjMDAwMDAwJyxcblx0XHR9XG5cdH0pXG5cdGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcblx0XHRhcHBlbmRUbzogbWFzayxcblx0XHRpbm5lckhUTUw6ICc8YSBzdHlsZT1cImNvbG9yOiM1NTU1NTU7XCIgaHJlZj1cImh0dHA6Ly96eXRodW0uc2luYWFwcC5jb20vbWFtYTIvXCIgdGFyZ2V0PVwiX2JsYW5rXCI+TUFNQTI6IOWmiOWmiOWGjeS5n+S4jeeUqOaLheW/g+aIkeeahG1hY2Jvb2vlj5Hng63orqHliJI8L2E+Jyxcblx0XHRzdHlsZToge1xuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZScsXG5cdFx0XHRib3R0b206ICcxMHB4Jyxcblx0XHRcdGxlZnQ6ICcwJyxcblx0XHRcdHJpZ2h0OiAnMCcsXG5cdFx0XHRoZWlnaHQ6ICcyMHB4Jyxcblx0XHRcdGxpbmVIZWlnaHQ6ICcyMHB4Jyxcblx0XHRcdHRleHRBbGlnbjogJ2NlbnRlcicsXG5cdFx0XHRmb250U2l6ZTonMTJweCcsXG5cdFx0XHRmb250RmFtaWx5OiAnYXJpYWwsIHNhbnMtc2VyaWYnXG5cdFx0fVxuXHR9KVxuXHR2YXIgY29udGFpbmVyID0gY3JlYXRlRWxlbWVudCgnZGl2Jywge1xuXHRcdGFwcGVuZFRvOiBtYXNrLFxuXHRcdGlubmVySFRNTDogJzxkaXYgaWQ9XCJNQU1BMl92aWRlb19wbGFjZUhvbGRlclwiPjwvZGl2PicsXG5cdFx0c3R5bGU6IHtcblx0XHRcdHdpZHRoOiAnMTAwMHB4Jyxcblx0XHRcdGhlaWdodDogJzUwMHB4Jyxcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAnIzAwMDAwMCcsXG5cdFx0XHR0b3A6ICc1MCUnLFxuXHRcdFx0bGVmdDogJzUwJScsXG5cdFx0XHRtYXJnaW5Ub3A6ICctMjUwcHgnLFxuXHRcdFx0bWFyZ2luTGVmdDogJy01MDBweCcsXG5cdFx0XHRib3JkZXJSYWRpdXM6ICcycHgnLFxuXHRcdFx0b3ZlcmZsb3c6ICdoaWRkZW4nXG5cdFx0fVxuXHR9KVxuXHRjcmVhdGVFbGVtZW50KCdkaXYnLCB7XG5cdFx0YXBwZW5kVG86IGNvbnRhaW5lcixcblx0XHRpbm5lckhUTUw6ICcmdGltZXM7Jyxcblx0XHRzdHlsZToge1xuXHRcdFx0d2lkdGg6ICcyMHB4Jyxcblx0XHRcdGhlaWdodDogJzIwcHgnLFxuXHRcdFx0bGluZUhlaWdodDogJzIwcHgnLFxuXHRcdFx0dGV4dEFsaWduOiAnY2VudGVyJyxcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuXHRcdFx0Y29sb3I6ICcjZmZmZmZmJyxcblx0XHRcdGZvbnRTaXplOiAnMjBweCcsXG5cdFx0XHR0b3A6ICc1cHgnLFxuXHRcdFx0cmlnaHQ6ICc1cHgnLFxuXHRcdFx0dGV4dFNoYWRvdzogJzAgMCAycHggIzAwMDAwMCcsXG5cdFx0XHRmb250V2VpZ2h0OiAnYm9sZCcsXG5cdFx0XHRmb250RmFtaWx5OiAnR2FyYW1vbmQsIFwiQXBwbGUgR2FyYW1vbmRcIicsXG5cdFx0XHRjdXJzb3I6ICdwb2ludGVyJ1xuXHRcdH1cblx0fSkub25jbGljayA9IGZ1bmN0aW9uICgpIHtcblx0XHRkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKG1hc2spXG5cdFx0cGxheWVyLnZpZGVvLnNyYyA9ICdhYm91dDpibGFuaydcblx0XHRkZWxldGUgd2luZG93W21hbWFLZXldXG5cdH1cblx0dmFyIHBsYXllciA9IG5ldyBNQU1BUGxheWVyKCdNQU1BMl92aWRlb19wbGFjZUhvbGRlcicsICcxMDAweDUwMCcsIHNvdXJjZSwgY29tbWVudHMpXG5cdHBsYXllci5pZnJhbWUuY29udGVudFdpbmRvdy5mb2N1cygpXG5cdGZsYXNoQmxvY2tlcigpXG5cdHBsYXllci5pZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdibG9jaydcblx0d2luZG93W21hbWFLZXldID0gdHJ1ZVxufVxuXG52YXIgdXJsID0gcHVybChsb2NhdGlvbi5ocmVmKVxuaWYgKHVybC5hdHRyKCdob3N0JykgPT09ICd6eXRodW0uc2luYWFwcC5jb20nICYmIFxuXHR1cmwuYXR0cignZGlyZWN0b3J5JykgPT09ICcvbWFtYTIvcHM0LycgJiYgdXJsLnBhcmFtKCd1cmwnKSApIHtcblx0dXJsID0gcHVybCh1cmwucGFyYW0oJ3VybCcpKVxufVxuXG5zZWVrZXJzLmZvckVhY2goZnVuY3Rpb24gKHNlZWtlcikge1xuXHRpZiAobWF0Y2hlZCA9PT0gdHJ1ZSkgcmV0dXJuXG5cdGlmICghIXNlZWtlci5tYXRjaCh1cmwpID09PSB0cnVlKSB7XG5cdFx0bG9nKCflvIDlp4vop6PmnpDlhoXlrrnlnLDlnYAnKVxuXHRcdG1hdGNoZWQgPSB0cnVlXG5cdFx0c2Vla2VyLmdldFZpZGVvcyh1cmwsIHNlZWtlZClcdFx0XG5cdH1cbn0pXG5cbmlmIChtYXRjaGVkID09PSB1bmRlZmluZWQpIHtcblx0bG9nKCflsJ3or5Xkvb/nlKg8YSB0YXJnZXQ9XCJfYmxhbmtcIiBocmVmPVwiaHR0cDovL3dlaWJvLmNvbS9qdXN0YXNoaXRcIj7kuIDnjq/lkIzlraY8L2E+5o+Q5L6b55qE6Kej5p6Q5pyN5YqhJywgMilcblx0Zmx2c3AuZ2V0VmlkZW9zKHVybCwgc2Vla2VkKVxufVxuXG59IiwiLyogIO+8g2Z1bmN0aW9uIGFqYXgjXG4gKiAgPCB7XG4gKiAgICB1cmw6ICAgICAgICAgIFN0cmluZyAgIOivt+axguWcsOWdgFxuICogICAgcGFyYW06ICAgICAgICBPYmplY3QgICDor7fmsYLlj4LmlbAu5Y+v57y655yBXG4gKiAgICBtZXRob2Q6ICAgICAgIFN0cmluZyAgIOivt+axguaWueazlUdFVCxQT1NULGV0Yy4g5Y+v57y655yB77yM6buY6K6k5pivR0VUIFxuICogICAgY2FsbGJhY2s6ICAgICBGdW5jdGlvbiDor7fmsYLnmoRjYWxsYmFjaywg5aaC5p6c5aSx6LSl6L+U5Zue77yNMe+8jCDmiJDlip/ov5Tlm57lhoXlrrlcbiAqICAgIGNvbnRlbnRUeXBlOiAgU3RyaW5nICAg6L+U5Zue5YaF5a6555qE5qC85byP44CC5aaC5p6c5pivSk9TTuS8muWBmkpTT04gUGFyc2XvvIwg5Y+v57y655yBLOm7mOiupOaYr2pzb25cbiAqICAgIGNvbnRleHQ6ICAgICAgQW55ICAgICAgY2FsbGJhY2vlm57osIPlh73mlbDnmoR0aGlz5oyH5ZCR44CC5Y+v57y655yBXG4gKiAgfVxuICogIOeUqOS6juWPkei1t2FqYXjmiJbogIVqc29ucOivt+axglxuICovXG5cbnZhciBqc29ucCAgICAgICA9IHJlcXVpcmUoJy4vanNvbnAnKVxudmFyIG5vb3AgICAgICAgID0gcmVxdWlyZSgnLi9ub29wJylcbnZhciBxdWVyeVN0cmluZyA9IHJlcXVpcmUoJy4vcXVlcnlTdHJpbmcnKVxuXG5mdW5jdGlvbiBkZWZhbHV0T3B0aW9uIChvcHRpb24sIGRlZmFsdXRWYWx1ZSkge1xuXHRyZXR1cm4gb3B0aW9uID09PSB1bmRlZmluZWQgPyBkZWZhbHV0VmFsdWUgOiBvcHRpb25cbn1cblxuZnVuY3Rpb24gcXVlcnlTdHJpbmcgKG9iaikge1xuXHR2YXIgcXVlcnkgPSBbXVxuXHRmb3IgKG9uZSBpbiBvYmopIHtcblx0XHRpZiAob2JqLmhhc093blByb3BlcnR5KG9uZSkpIHtcblx0XHRcdHF1ZXJ5LnB1c2goW29uZSwgb2JqW29uZV1dLmpvaW4oJz0nKSlcblx0XHR9XG5cdH1cblx0cmV0dXJuIHF1ZXJ5LmpvaW4oJyYnKVxufVxuXG5mdW5jdGlvbiBqb2luVXJsICh1cmwsIHF1ZXJ5U3RyaW5nKSB7XG5cdGlmIChxdWVyeVN0cmluZy5sZW5ndGggPT09IDApIHJldHVybiB1cmxcblx0cmV0dXJuIHVybCArICh1cmwuaW5kZXhPZignPycpID09PSAtMSA/ICc/JyA6ICcmJykgKyBxdWVyeVN0cmluZ1xufVxuXG5mdW5jdGlvbiBhamF4IChvcHRpb25zKSB7XG5cdHZhciB1cmwgICAgICAgICA9IGRlZmFsdXRPcHRpb24ob3B0aW9ucy51cmwsICcnKVxuXHR2YXIgcXVlcnkgICAgICAgPSBxdWVyeVN0cmluZyggZGVmYWx1dE9wdGlvbihvcHRpb25zLnBhcmFtLCB7fSkgKVxuXHR2YXIgbWV0aG9kICAgICAgPSBkZWZhbHV0T3B0aW9uKG9wdGlvbnMubWV0aG9kLCAnR0VUJylcblx0dmFyIGNhbGxiYWNrICAgID0gZGVmYWx1dE9wdGlvbihvcHRpb25zLmNhbGxiYWNrLCBub29wKVxuXHR2YXIgY29udGVudFR5cGUgPSBkZWZhbHV0T3B0aW9uKG9wdGlvbnMuY29udGVudFR5cGUsICdqc29uJylcblx0dmFyIGNvbnRleHQgICAgID0gZGVmYWx1dE9wdGlvbihvcHRpb25zLmNvbnRleHQsIG51bGwpXG5cdHZhciBoZWFkZXJzID0gZGVmYWx1dE9wdGlvbihvcHRpb25zLmhlYWRlcnMsIHt9KVxuXG5cdGlmIChvcHRpb25zLmpzb25wKSB7XG5cdFx0cmV0dXJuIGpzb25wKFxuXHRcdFx0am9pblVybCh1cmwsIHF1ZXJ5KSxcblx0XHRcdGNhbGxiYWNrLmJpbmQoY29udGV4dCksXG5cdFx0XHR0eXBlb2Ygb3B0aW9ucy5qc29ucCA9PT0gJ3N0cmluZycgPyBvcHRpb25zLmpzb25wIDogdW5kZWZpbmVkXG5cdFx0KVxuXHR9XG5cblx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cdGlmIChtZXRob2QudG9Mb3dlckNhc2UoKSA9PT0gJ2dldCcpIHtcblx0XHR1cmwgPSBqb2luVXJsKHVybCwgcXVlcnkpXG5cdFx0cXVlcnkgPSAnJ1xuXHR9XG5cdHhoci5vcGVuKG1ldGhvZCwgdXJsLCB0cnVlKVxuXHR4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCcpXG5cdGZvciAodmFyIGhlYWRlciBpbiBoZWFkZXJzKSB7XG5cdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLCBoZWFkZXJzW2hlYWRlcl0pXG5cdH1cblx0eGhyLnNlbmQocXVlcnkpXG5cdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG5cdFx0aWYgKHhoci5yZWFkeVN0YXRlID09PSA0ICkge1xuXHRcdFx0aWYgKHhoci5zdGF0dXMgPT09IDIwMCkge1xuXHRcdFx0XHR2YXIgZGF0YSA9IHhoci5yZXNwb25zZVRleHRcblx0XHRcdFx0aWYgKGNvbnRlbnRUeXBlLnRvTG93ZXJDYXNlKCkgPT09ICdqc29uJykge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRkYXRhID0gSlNPTi5wYXJzZShkYXRhKVxuXHRcdFx0XHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0XHRcdFx0ZGF0YSA9IC0xXG5cdFx0XHRcdFx0fVx0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm4gY2FsbGJhY2suY2FsbChjb250ZXh0LCBkYXRhKVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrLmNhbGwoY29udGV4dCwgLTEpXG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59XG5tb2R1bGUuZXhwb3J0cyA9IGFqYXg7XG4iLCIvKiAg77yDQm9vbCBjYW5QbGF5TTNVOO+8g1xuICogIOi/lOWbnua1j+iniOWZqOaYr+WQpuaUr+aMgW0zdTjmoLzlvI/nmoTop4bpopHmkq3mlL7jgIJcbiAqICDnm67liY1jaHJvbWUsZmlyZWZveOWPquaUr+aMgW1wNFxuICovXG5tb2R1bGUuZXhwb3J0cyA9ICEhZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndmlkZW8nKS5jYW5QbGF5VHlwZSgnYXBwbGljYXRpb24veC1tcGVnVVJMJykiLCIvKlxuICog55So5LqO566A5Y2V5Yib5bu6aHRtbOiKgueCuVxuICovXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50ICh0YWdOYW1lLCBhdHRyaWJ1dGVzKSB7XG5cdHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKVxuXHRpZiAoIHR5cGVvZiBhdHRyaWJ1dGVzID09PSAnZnVuY3Rpb24nICkge1xuXHRcdGF0dHJpYnV0ZXMuY2FsbChlbGVtZW50KVxuXHR9IGVsc2Uge1xuXHRcdGZvciAodmFyIGF0dHJpYnV0ZSBpbiBhdHRyaWJ1dGVzKSB7XG5cdFx0XHRpZiAoIGF0dHJpYnV0ZXMuaGFzT3duUHJvcGVydHkoYXR0cmlidXRlKSApIHtcblx0XHRcdFx0c3dpdGNoIChhdHRyaWJ1dGUpIHtcblx0XHRcdFx0Y2FzZSAnYXBwZW5kVG8nOlxuXHRcdFx0XHRcdGF0dHJpYnV0ZXNbYXR0cmlidXRlXS5hcHBlbmRDaGlsZChlbGVtZW50KVxuXHRcdFx0XHRcdGJyZWFrXG5cdFx0XHRcdGNhc2UgJ2lubmVySFRNTCc6XG5cdFx0XHRcdGNhc2UgJ2NsYXNzTmFtZSc6XG5cdFx0XHRcdGNhc2UgJ2lkJzpcblx0XHRcdFx0XHRlbGVtZW50W2F0dHJpYnV0ZV0gPSBhdHRyaWJ1dGVzW2F0dHJpYnV0ZV1cblx0XHRcdFx0XHRicmVha1xuXHRcdFx0XHRjYXNlICdzdHlsZSc6XG5cdFx0XHRcdFx0dmFyIHN0eWxlcyA9IGF0dHJpYnV0ZXNbYXR0cmlidXRlXVxuXHRcdFx0XHRcdGZvciAodmFyIG5hbWUgaW4gc3R5bGVzKVxuXHRcdFx0XHRcdFx0aWYgKCBzdHlsZXMuaGFzT3duUHJvcGVydHkobmFtZSkgKVxuXHRcdFx0XHRcdFx0XHRlbGVtZW50LnN0eWxlW25hbWVdID0gc3R5bGVzW25hbWVdXG5cdFx0XHRcdFx0YnJlYWtcblx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShhdHRyaWJ1dGUsIGF0dHJpYnV0ZXNbYXR0cmlidXRlXSArICcnKVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBlbGVtZW50XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY3JlYXRlRWxlbWVudCIsIi8qICBcbiAqICDnlKjkuo7lsY/olL3pobXpnaLkuIrnmoTmiYDmnIlmbGFzaFxuICovXG52YXIgZmxhc2hUZXh0ID0gJzxkaXYgc3R5bGU9XCJ0ZXh0LXNoYWRvdzowIDAgMnB4ICNlZWU7bGV0dGVyLXNwYWNpbmc6LTFweDtiYWNrZ3JvdW5kOiNlZWU7Zm9udC13ZWlnaHQ6Ym9sZDtwYWRkaW5nOjA7Zm9udC1mYW1pbHk6YXJpYWwsc2Fucy1zZXJpZjtmb250LXNpemU6MzBweDtjb2xvcjojY2NjO3dpZHRoOjE1MnB4O2hlaWdodDo1MnB4O2JvcmRlcjo0cHggc29saWQgI2NjYztib3JkZXItcmFkaXVzOjEycHg7cG9zaXRpb246YWJzb2x1dGU7dG9wOjUwJTtsZWZ0OjUwJTttYXJnaW46LTMwcHggMCAwIC04MHB4O3RleHQtYWxpZ246Y2VudGVyO2xpbmUtaGVpZ2h0OjUycHg7XCI+Rmxhc2g8L2Rpdj4nO1xuXG52YXIgY291bnQgPSAwO1xudmFyIGZsYXNoQmxvY2tzID0ge307XG4vL+eCueWHu+aXtumXtOinpuWPkVxudmFyIGNsaWNrMlNob3dGbGFzaCA9IGZ1bmN0aW9uKGUpe1xuXHR2YXIgaW5kZXggPSB0aGlzLmdldEF0dHJpYnV0ZSgnZGF0YS1mbGFzaC1pbmRleCcpO1xuXHR2YXIgZmxhc2ggPSBmbGFzaEJsb2Nrc1tpbmRleF07XG5cdGZsYXNoLnNldEF0dHJpYnV0ZSgnZGF0YS1mbGFzaC1zaG93JywnaXNzaG93Jyk7XG5cdHRoaXMucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZmxhc2gsIHRoaXMpO1xuXHR0aGlzLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcyk7XG5cdHRoaXMucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGljazJTaG93Rmxhc2gsIGZhbHNlKTtcbn07XG5cbnZhciBjcmVhdGVBUGxhY2VIb2xkZXIgPSBmdW5jdGlvbihmbGFzaCwgd2lkdGgsIGhlaWdodCl7XG5cdHZhciBpbmRleCA9IGNvdW50Kys7XG5cdHZhciBzdHlsZSA9IGRvY3VtZW50LmRlZmF1bHRWaWV3LmdldENvbXB1dGVkU3R5bGUoZmxhc2gsIG51bGwpO1xuXHR2YXIgcG9zaXRpb25UeXBlID0gc3R5bGUucG9zaXRpb247XG5cdFx0cG9zaXRpb25UeXBlID0gcG9zaXRpb25UeXBlID09PSAnc3RhdGljJyA/ICdyZWxhdGl2ZScgOiBwb3NpdGlvblR5cGU7XG5cdHZhciBtYXJnaW4gICAgICAgPSBzdHlsZVsnbWFyZ2luJ107XG5cdHZhciBkaXNwbGF5ICAgICAgPSBzdHlsZVsnZGlzcGxheSddID09ICdpbmxpbmUnID8gJ2lubGluZS1ibG9jaycgOiBzdHlsZVsnZGlzcGxheSddO1xuXHR2YXIgc3R5bGUgPSBbXG5cdFx0JycsXG5cdFx0J3dpZHRoOicgICAgKyB3aWR0aCAgKydweCcsXG5cdFx0J2hlaWdodDonICAgKyBoZWlnaHQgKydweCcsXG5cdFx0J3Bvc2l0aW9uOicgKyBwb3NpdGlvblR5cGUsXG5cdFx0J21hcmdpbjonICAgKyBtYXJnaW4sXG5cdFx0J2Rpc3BsYXk6JyAgKyBkaXNwbGF5LFxuXHRcdCdtYXJnaW46MCcsXG5cdFx0J3BhZGRpbmc6MCcsXG5cdFx0J2JvcmRlcjowJyxcblx0XHQnYm9yZGVyLXJhZGl1czoxcHgnLFxuXHRcdCdjdXJzb3I6cG9pbnRlcicsXG5cdFx0J2JhY2tncm91bmQ6LXdlYmtpdC1saW5lYXItZ3JhZGllbnQodG9wLCByZ2JhKDI0MCwyNDAsMjQwLDEpMCUscmdiYSgyMjAsMjIwLDIyMCwxKTEwMCUpJyxcdFx0XHRcblx0XHQnJ1xuXHRdXG5cdGZsYXNoQmxvY2tzW2luZGV4XSA9IGZsYXNoO1xuXHR2YXIgcGxhY2VIb2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0cGxhY2VIb2xkZXIuc2V0QXR0cmlidXRlKCd0aXRsZScsICcmI3g3MEI5OyYjeDYyMTE7JiN4OEZEODsmI3g1MzlGO0ZsYXNoJyk7XG5cdHBsYWNlSG9sZGVyLnNldEF0dHJpYnV0ZSgnZGF0YS1mbGFzaC1pbmRleCcsICcnICsgaW5kZXgpO1xuXHRmbGFzaC5wYXJlbnROb2RlLmluc2VydEJlZm9yZShwbGFjZUhvbGRlciwgZmxhc2gpO1xuXHRmbGFzaC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGZsYXNoKTtcblx0cGxhY2VIb2xkZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbGljazJTaG93Rmxhc2gsIGZhbHNlKTtcblx0cGxhY2VIb2xkZXIuc3R5bGUuY3NzVGV4dCArPSBzdHlsZS5qb2luKCc7Jyk7XG5cdHBsYWNlSG9sZGVyLmlubmVySFRNTCA9IGZsYXNoVGV4dDtcblx0cmV0dXJuIHBsYWNlSG9sZGVyO1xufTtcblxudmFyIHBhcnNlRmxhc2ggPSBmdW5jdGlvbih0YXJnZXQpe1xuXHRpZih0YXJnZXQgaW5zdGFuY2VvZiBIVE1MT2JqZWN0RWxlbWVudCkge1xuXHRcdGlmKHRhcmdldC5pbm5lckhUTUwudHJpbSgpID09ICcnKSByZXR1cm47XG5cdFx0aWYodGFyZ2V0LmdldEF0dHJpYnV0ZShcImNsYXNzaWRcIikgJiYgIS9eamF2YTovLnRlc3QodGFyZ2V0LmdldEF0dHJpYnV0ZShcImNsYXNzaWRcIikpKSByZXR1cm47XHRcdFx0XG5cdH0gZWxzZSBpZighKHRhcmdldCBpbnN0YW5jZW9mIEhUTUxFbWJlZEVsZW1lbnQpKSByZXR1cm47XG5cblx0dmFyIHdpZHRoID0gdGFyZ2V0Lm9mZnNldFdpZHRoO1xuXHR2YXIgaGVpZ2h0ID0gdGFyZ2V0Lm9mZnNldEhlaWdodDtcdFx0XG5cblx0aWYod2lkdGggPiAxNjAgJiYgaGVpZ2h0ID4gNjApe1xuXHRcdGNyZWF0ZUFQbGFjZUhvbGRlcih0YXJnZXQsIHdpZHRoLCBoZWlnaHQpO1xuXHR9XG59O1xuXG52YXIgaGFuZGxlQmVmb3JlTG9hZEV2ZW50ID0gZnVuY3Rpb24oZSl7XG5cdHZhciB0YXJnZXQgPSBlLnRhcmdldFxuXHRpZih0YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWZsYXNoLXNob3cnKSA9PSAnaXNzaG93JykgcmV0dXJuO1xuXHRwYXJzZUZsYXNoKHRhcmdldCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1x0XG5cdHZhciBlbWJlZHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnZW1iZWQnKTtcblx0dmFyIG9iamVjdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnb2JqZWN0Jyk7XG5cdGZvcih2YXIgaT0wLGxlbj1vYmplY3RzLmxlbmd0aDsgaTxsZW47IGkrKykgb2JqZWN0c1tpXSAmJiBwYXJzZUZsYXNoKG9iamVjdHNbaV0pO1xuXHRmb3IodmFyIGk9MCxsZW49ZW1iZWRzLmxlbmd0aDsgaTxsZW47IGkrKylcdGVtYmVkc1tpXSAmJiBwYXJzZUZsYXNoKGVtYmVkc1tpXSk7XG59XG4vLyBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiYmVmb3JlbG9hZFwiLCBoYW5kbGVCZWZvcmVMb2FkRXZlbnQsIHRydWUpO1xuIiwiLyogIO+8g2Z1bmN0aW9uIGh0dHBQcm94eSNcbiAqICA8IFN0cmluZyAgICAgICAg6K+35rGC5Zyw5Z2AXG4gKiAgPCBTdHJpbmcgICAgICAgIOivt+axguaWueazlUdFVCxQT1NULGV0Yy5cbiAqICA8IE9iamVjdCAgICAgICAg6K+35rGC5Y+C5pWwXG4gKiAgPCBGdW5jdGlvbiAgICAgIOivt+axgueahGNhbGxiYWNrLCDlpoLmnpzlpLHotKXov5Tlm57vvI0x77yMIOaIkOWKn+i/lOWbnuWGheWuuVxuICogIDwge1xuICogICAgICB4bWw6ICAgICAgIEJvb2wgICDmmK/lkKbpnIDopoHlgZp4bWwyanNvbiDlj6/nvLrnnIEsIOm7mOiupGZhc2xlXG4gKiAgICAgIGd6aW5mbGF0ZTogQm9vbCAgIOaYr+WQpumcgOimgeWBmmd6aW5mbGF0ZSDlj6/nvLrnnIEsIOm7mOiupGZhc2xlXG4gKiAgICAgIGNvbnRleHQ6ICAgQW55ICAgIGNhbGxiYWNr5Zue6LCD55qEdGhpc+aMh+WQkSDlj6/nvLrnnIFcbiAqICAgIH1cbiAqICB9XG4gKiAg55So5LqO5Y+R6LW36Leo5Z+f55qEYWpheOivt+axguOAguaXouaOpeWPo+i/lOWbnui3qOWfn+WPiOS4jeaUr+aMgWpzb25w5Y2P6K6u55qEXG4gKi9cblxudmFyIGNyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKCcuL2NyZWF0ZUVsZW1lbnQnKVxudmFyIGFqYXggICAgICAgICAgPSByZXF1aXJlKCcuL2FqYXgnKVxudmFyIHF1ZXJ5U3RyaW5nICAgPSByZXF1aXJlKCcuL3F1ZXJ5U3RyaW5nJylcblxudmFyIHByb3h5VXJsID0gJ2h0dHA6Ly96eXRodW0uc2luYWFwcC5jb20vbWFtYTIvcHJveHkucGhwJ1xuXG5mdW5jdGlvbiBodHRwUHJveHkgKHVybCwgdHlwZSwgcGFyYW1zLCBjYWxsYmFjaywgb3B0cykge1xuXHRvcHRzID0gb3B0cyB8fCB7fVxuXHRhamF4KHtcblx0XHR1cmw6IHByb3h5VXJsLFxuXHRcdHBhcmFtIDoge1xuXHRcdFx0cGFyYW1zOiBlbmNvZGVVUklDb21wb25lbnQocXVlcnlTdHJpbmcocGFyYW1zKSksLy/kuIrooYzlj4LmlbBcblx0XHRcdFxuXHRcdFx0dXJsOiBlbmNvZGVVUklDb21wb25lbnQodXJsKSxcblx0XHRcdHBvc3Q6IHR5cGUgPT09ICdwb3N0JyA/IDEgOiAwLFx0XHRcdFxuXHRcdFx0eG1sOiBvcHRzLnhtbCA/IDEgOiAwLFxuXHRcdFx0dGV4dDogb3B0cy50ZXh0ID8gMSA6IDAsXG5cdFx0XHRnemluZmxhdGU6IG9wdHMuZ3ppbmZsYXRlID8gMSA6IDAsXG5cdFx0XHR1YTogb3B0cy51YSB8fCAnJ1xuXHRcdH0sXG5cdFx0anNvbnA6IHRydWUsXG5cdFx0Y2FsbGJhY2s6IGNhbGxiYWNrLFxuXHRcdGNvbnRleHQ6IG9wdHMuY29udGV4dFxuXHR9KVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGh0dHBQcm94eSIsIi8qICDvvINmdW5jdGlvbiBqc29ucCNcbiAqICBqc29ucOaWueazleOAguaOqOiNkOS9v+eUqGFqYXjmlrnms5XjgIJhamF45YyF5ZCr5LqGanNvbnBcbiAqL1xudmFyIGNyZWF0ZUVsZW1lbnQgPSByZXF1aXJlKCcuL2NyZWF0ZUVsZW1lbnQnKVxudmFyIG5vb3AgICAgICAgICAgPSByZXF1aXJlKCcuL25vb3AnKVxuXG52YXIgY2FsbGJhY2tQcmVmaXggPSAnTUFNQTJfSFRUUF9KU09OUF9DQUxMQkFDSydcbnZhciBjYWxsYmFja0NvdW50ICA9IDBcbnZhciB0aW1lb3V0RGVsYXkgICA9IDEwMDAwXG5cbmZ1bmN0aW9uIGNhbGxiYWNrSGFuZGxlICgpIHtcblx0cmV0dXJuIGNhbGxiYWNrUHJlZml4ICsgY2FsbGJhY2tDb3VudCsrXG59XG5cbmZ1bmN0aW9uIGpzb25wICh1cmwsIGNhbGxiYWNrLCBjYWxsYmFja0tleSkge1xuXG5cdGNhbGxiYWNrS2V5ID0gY2FsbGJhY2tLZXkgfHwgJ2NhbGxiYWNrJ1xuXG5cdHZhciBfY2FsbGJhY2tIYW5kbGUgPSBjYWxsYmFja0hhbmRsZSgpXHRcblx0d2luZG93W19jYWxsYmFja0hhbmRsZV0gPSBmdW5jdGlvbiAocnMpIHtcblx0XHRjbGVhclRpbWVvdXQodGltZW91dFRpbWVyKVxuXHRcdHdpbmRvd1tfY2FsbGJhY2tIYW5kbGVdID0gbm9vcFxuXHRcdGNhbGxiYWNrKHJzKVxuXHRcdGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoc2NyaXB0KVxuXHR9XG5cdHZhciB0aW1lb3V0VGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblx0XHR3aW5kb3dbX2NhbGxiYWNrSGFuZGxlXSgtMSlcblx0fSwgdGltZW91dERlbGF5KVxuXG5cdHZhciBzY3JpcHQgPSBjcmVhdGVFbGVtZW50KCdzY3JpcHQnLCB7XG5cdFx0YXBwZW5kVG86IGRvY3VtZW50LmJvZHksXG5cdFx0c3JjOiB1cmwgKyAodXJsLmluZGV4T2YoJz8nKSA+PSAwID8gJyYnIDogJz8nKSArIGNhbGxiYWNrS2V5ICsgJz0nICsgX2NhbGxiYWNrSGFuZGxlXG5cdH0pXG59XG5cbm1vZHVsZS5leHBvcnRzID0ganNvbnAiLCIvKiAg77yDZnVuY3Rpb24gbG9n77yDXG4gKiAgPCBTdHJpbmdcbiAqICBsb2csIOS8muWcqOmhtemdouWSjGNvbnNvbGXkuK3ovpPlh7psb2dcbiAqL1xuXG52YXIgY3JlYXRlRWxlbWVudCA9IHJlcXVpcmUoJy4vY3JlYXRlRWxlbWVudCcpXG52YXIgTUFNQUxvZ0RPTVxudmFyIGxvZ1RpbWVyXG52YXIgbG9nRGVsYXkgPSAxMDAwMFxuXG5mdW5jdGlvbiBsb2cgKG1zZywgZGVsYXkpIHtcblx0aWYgKCBNQU1BTG9nRE9NID09PSB1bmRlZmluZWQgKSB7XG5cdFx0TUFNQUxvZ0RPTSA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicsIHtcblx0XHRcdHN0eWxlOiB7XG5cdFx0XHRcdGJhY2tncm91bmRDb2xvcjogJyMyNDI3MkEnLFxuXHRcdFx0XHRjb2xvcjogJyNmZmZmZmYnLFxuXHRcdFx0XHRwb3NpdGlvbjogJ2ZpeGVkJyxcblx0XHRcdFx0ekluZGV4OiAnMTAwMDAwMCcsXG5cdFx0XHRcdHRvcDogJzAnLFxuXHRcdFx0XHRsZWZ0OiAnMCcsXG5cdFx0XHRcdHBhZGRpbmc6ICc1cHggMTBweCcsXG5cdFx0XHRcdGZvbnRTaXplOiAnMTRweCdcblx0XHRcdH1cblx0XHR9KVxuXHR9XG5cdGNsZWFyVGltZW91dChsb2dUaW1lcilcblx0XG5cdE1BTUFMb2dET00uaW5uZXJIVE1MID0gJzxzcGFuIHN0eWxlPVwiY29sb3I6I0RGNjU1OFwiPk1BTUEyICZndDs8L3NwYW4+ICcgKyBtc2dcblx0Y29uc29sZSAmJiBjb25zb2xlLmxvZyAmJiBjb25zb2xlLmxvZygnJWMgTUFNQTIgJWMgJXMnLCAnYmFja2dyb3VuZDojMjQyNzJBOyBjb2xvcjojZmZmZmZmJywgJycsIG1zZylcblxuXHRkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKE1BTUFMb2dET00pXG5cdGxvZ1RpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0ZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChNQU1BTG9nRE9NKVxuXHR9LCBkZWxheSoxMDAwIHx8IGxvZ0RlbGF5KVxufVxubW9kdWxlLmV4cG9ydHMgPSBsb2ciLCIvL+WmiOWmiOiuoeWIkuWUr+S4gOWAvFxubW9kdWxlLmV4cG9ydHMgPSAnTUFNQUtFWV/nlLDnkLTmmK/ov5nkuKrkuJbnlYzkuIrmnIDlj6/niLHnmoTlpbPlranlrZDlkbXlkbXlkbXlkbXvvIzmiJHopoHorqnlhajkuJbnlYzpg73lnKjnn6XpgZMnIiwiLy/nqbrmlrnms5Vcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge30iLCJ2YXIgTUFNQVBsYXllcjtcblxuLy8gTUFNQVBsYXllciBcbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96eXRodW0vbWFtYXBsYXllclxuIWZ1bmN0aW9uIGUodCxuLGkpe2Z1bmN0aW9uIG8ocixhKXtpZighbltyXSl7aWYoIXRbcl0pe3ZhciBsPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWEmJmwpcmV0dXJuIGwociwhMCk7aWYocylyZXR1cm4gcyhyLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK3IrXCInXCIpfXZhciBjPW5bcl09e2V4cG9ydHM6e319O3Rbcl1bMF0uY2FsbChjLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtyXVsxXVtlXTtyZXR1cm4gbyhuP246ZSl9LGMsYy5leHBvcnRzLGUsdCxuLGkpfXJldHVybiBuW3JdLmV4cG9ydHN9Zm9yKHZhciBzPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUscj0wO3I8aS5sZW5ndGg7cisrKW8oaVtyXSk7cmV0dXJuIG99KHsxOltmdW5jdGlvbihlLHQpe2Z1bmN0aW9uIG4oZSl7Zm9yKHZhciB0PVtdLG49MTtuPGFyZ3VtZW50cy5sZW5ndGg7bisrKXt2YXIgbz1hcmd1bWVudHNbbl0scz1vLmluaXQ7dC5wdXNoKHMpLGRlbGV0ZSBvLmluaXQsaShlLnByb3RvdHlwZSxvKX1lLnByb3RvdHlwZS5pbml0PWZ1bmN0aW9uKCl7dC5mb3JFYWNoKGZ1bmN0aW9uKGUpe2UuY2FsbCh0aGlzKX0uYmluZCh0aGlzKSl9fXZhciBpPWUoXCIuL2V4dGVuZFwiKTt0LmV4cG9ydHM9bn0se1wiLi9leHRlbmRcIjo5fV0sMjpbZnVuY3Rpb24oZSx0KXt2YXIgbj1lKFwiLi9wbGF5ZXIuY3NzXCIpLGk9ZShcIi4vcGxheWVyLmh0bWxcIiksbz0oZShcIi4vZXh0ZW5kXCIpLGUoXCIuL2NyZWF0ZUVsZW1lbnRcIikpLHM9ZShcIi4vcGFyc2VET01CeUNsYXNzTmFtZXNcIik7dC5leHBvcnRzPXtpbml0OmZ1bmN0aW9uKCl7dmFyIGU9ZnVuY3Rpb24oKXt2YXIgZT10aGlzLmlmcmFtZS5jb250ZW50RG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdLHQ9dGhpcy5pZnJhbWUuY29udGVudERvY3VtZW50LmJvZHk7byhcInN0eWxlXCIsZnVuY3Rpb24oKXtlLmFwcGVuZENoaWxkKHRoaXMpO3RyeXt0aGlzLnN0eWxlU2hlZXQuY3NzVGV4dD1ufWNhdGNoKHQpe3RoaXMuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUobikpfX0pLG8oXCJsaW5rXCIse2FwcGVuZFRvOmUsaHJlZjpcImh0dHA6Ly9saWJzLmNuY2RuLmNuL2ZvbnQtYXdlc29tZS80LjMuMC9jc3MvZm9udC1hd2Vzb21lLm1pbi5jc3NcIixyZWw6XCJzdHlsZXNoZWV0XCIsdHlwZTpcInRleHQvY3NzXCJ9KSx0LmlubmVySFRNTD1pLHRoaXMuRE9Ncz1zKHQsW1wicGxheWVyXCIsXCJ2aWRlb1wiLFwidmlkZW8tZnJhbWVcIixcImNvbW1lbnRzXCIsXCJjb21tZW50cy1idG5cIixcInBsYXlcIixcInByb2dyZXNzX2FuY2hvclwiLFwiYnVmZmVyZWRfYW5jaG9yXCIsXCJmdWxsc2NyZWVuXCIsXCJhbGxzY3JlZW5cIixcImhkXCIsXCJ2b2x1bWVfYW5jaG9yXCIsXCJjdXJyZW50XCIsXCJkdXJhdGlvblwiXSksdGhpcy52aWRlbz10aGlzLkRPTXMudmlkZW99LmJpbmQodGhpcyksdD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKSxyPXRoaXMuaWZyYW1lPW8oXCJpZnJhbWVcIix7YWxsb3dUcmFuc3BhcmVuY3k6ITAsZnJhbWVCb3JkZXI6XCJub1wiLHNjcm9sbGluZzpcIm5vXCIsc3JjOlwiYWJvdXQ6YmxhbmtcIixtb3phbGxvd2Z1bGxzY3JlZW46XCJtb3phbGxvd2Z1bGxzY3JlZW5cIix3ZWJraXRhbGxvd2Z1bGxzY3JlZW46XCJ3ZWJraXRhbGxvd2Z1bGxzY3JlZW5cIixzdHlsZTp7d2lkdGg6dGhpcy5zaXplWzBdK1wicHhcIixoZWlnaHQ6dGhpcy5zaXplWzFdK1wicHhcIixvdmVyZmxvdzpcImhpZGRlblwifX0pO3QmJnQucGFyZW50Tm9kZT8odC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZChyLHQpLGUoKSk6KGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQociksZSgpLGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQocikpfX19LHtcIi4vY3JlYXRlRWxlbWVudFwiOjcsXCIuL2V4dGVuZFwiOjksXCIuL3BhcnNlRE9NQnlDbGFzc05hbWVzXCI6MTEsXCIuL3BsYXllci5jc3NcIjoxMixcIi4vcGxheWVyLmh0bWxcIjoxM31dLDM6W2Z1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gbihlKXtlLnN0cm9rZVN0eWxlPVwiYmxhY2tcIixlLmxpbmVXaWR0aD0zLGUuZm9udD0nYm9sZCAyMHB4IFwiUGluZ0hlaVwiLFwiTHVjaWRhIEdyYW5kZVwiLCBcIkx1Y2lkYSBTYW5zIFVuaWNvZGVcIiwgXCJTVEhlaXRpXCIsIFwiSGVsdmV0aWNhXCIsXCJBcmlhbFwiLFwiVmVyZGFuYVwiLFwic2Fucy1zZXJpZlwiJ312YXIgaT0oZShcIi4vY3JlYXRlRWxlbWVudFwiKSwuMSksbz0yNSxzPTRlMyxyPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIikuZ2V0Q29udGV4dChcIjJkXCIpO24ocik7dmFyIGE9d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZXx8d2luZG93Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZXx8d2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZXx8d2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lfHx3aW5kb3cub1JlcXVlc3RBbmltYXRpb25GcmFtZXx8ZnVuY3Rpb24oZSl7c2V0VGltZW91dChlLDFlMy82MCl9O3QuZXhwb3J0cz17aW5pdDpmdW5jdGlvbigpe3RoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcInBsYXlcIix0aGlzLnJlU3RhcnRDb21tZW50LmJpbmQodGhpcykpLHRoaXMudmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcInBhdXNlXCIsdGhpcy5wYXVzZUNvbW1lbnQuYmluZCh0aGlzKSksdGhpcy5sYXN0Q29tbW5ldFVwZGF0ZVRpbWU9MCx0aGlzLmxhc3RDb21tbmV0SW5kZXg9MCx0aGlzLmNvbW1lbnRMb29wUHJlUXVldWU9W10sdGhpcy5jb21tZW50TG9vcFF1ZXVlPVtdLHRoaXMuY29tbWVudEJ1dHRvblByZVF1ZXVlPVtdLHRoaXMuY29tbWVudEJ1dHRvblF1ZXVlPVtdLHRoaXMuY29tbWVudFRvcFByZVF1ZXVlPVtdLHRoaXMuY29tbWVudFRvcFF1ZXVlPVtdLHRoaXMuZHJhd1F1ZXVlPVtdLHRoaXMucHJlUmVuZGVycz1bXSx0aGlzLnByZVJlbmRlck1hcD17fSx0aGlzLmVuYWJsZUNvbW1lbnQ9dm9pZCAwPT09dGhpcy5jb21tZW50cz8hMTohMCx0aGlzLnByZXZEcmF3Q2FudmFzPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIiksdGhpcy5jYW52YXM9dGhpcy5ET01zLmNvbW1lbnRzLmdldENvbnRleHQoXCIyZFwiKSx0aGlzLmNvbW1lbnRzJiZ0aGlzLkRPTXMucGxheWVyLmNsYXNzTGlzdC5hZGQoXCJoYXMtY29tbWVudHNcIiksdGhpcy5ET01zW1wiY29tbWVudHMtYnRuXCJdLmNsYXNzTGlzdC5hZGQoXCJlbmFibGVcIiksdGhpcy5ET01zLmNvbW1lbnRzLmRpc3BsYXk9dGhpcy5lbmFibGVDb21tZW50P1wiYmxvY2tcIjpcIm5vbmVcIjt2YXIgZT0wLHQ9ZnVuY3Rpb24oKXsoZT1+ZSkmJnRoaXMub25Db21tZW50VGltZVVwZGF0ZSgpLGEodCl9LmJpbmQodGhpcyk7dCgpfSxuZWVkRHJhd1RleHQ6ZnVuY3Rpb24oZSx0LG4pe3RoaXMuZHJhd1F1ZXVlLnB1c2goW2UsdCxuXSl9LGRyYXdUZXh0OmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5wcmV2RHJhd0NhbnZhcyx0PXRoaXMucHJldkRyYXdDYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO2Uud2lkdGg9dGhpcy5jYW52YXNXaWR0aCxlLmhlaWdodD10aGlzLmNhbnZhc0hlaWdodCx0LmNsZWFyUmVjdCgwLDAsdGhpcy5jYW52YXNXaWR0aCx0aGlzLmNhbnZhc0hlaWdodCk7dmFyIGk9W107dGhpcy5wcmVSZW5kZXJzLmZvckVhY2goZnVuY3Rpb24oZSx0KXtlLnVzZWQ9ITEsdm9pZCAwPT09ZS5jaWQmJmkucHVzaCh0KX0pO2Zvcih2YXIgcztzPXRoaXMuZHJhd1F1ZXVlLnNoaWZ0KCk7KSFmdW5jdGlvbihlLHMpe3ZhciByLGE9ZVswXS50ZXh0K2VbMF0uY29sb3IsbD1zLnByZVJlbmRlck1hcFthXTtpZih2b2lkIDA9PT1sKXt2YXIgbD1pLnNoaWZ0KCk7dm9pZCAwPT09bD8ocj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLGw9cy5wcmVSZW5kZXJzLnB1c2gociktMSk6cj1zLnByZVJlbmRlcnNbbF07dmFyIGM9ci53aWR0aD1lWzBdLndpZHRoLGg9ci5oZWlnaHQ9bysxMCxkPXIuZ2V0Q29udGV4dChcIjJkXCIpO2QuY2xlYXJSZWN0KDAsMCxjLGgpLG4oZCksZC5maWxsU3R5bGU9ZVswXS5jb2xvcixkLnN0cm9rZVRleHQoZVswXS50ZXh0LDAsbyksZC5maWxsVGV4dChlWzBdLnRleHQsMCxvKSxyLmNpZD1hLHMucHJlUmVuZGVyTWFwW2FdPWx9ZWxzZSByPXMucHJlUmVuZGVyc1tsXTtyLnVzZWQ9ITAsdC5kcmF3SW1hZ2UocixlWzFdLGVbMl0pfShzLHRoaXMpO3RoaXMucHJlUmVuZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGUpe2UudXNlZD09PSExJiYoZGVsZXRlIHRoaXMucHJlUmVuZGVyTWFwW2UuY2lkXSxlLmNpZD12b2lkIDApfS5iaW5kKHRoaXMpKSx0aGlzLmNhbnZhcy5jbGVhclJlY3QoMCwwLHRoaXMuY2FudmFzV2lkdGgsdGhpcy5jYW52YXNIZWlnaHQpLHRoaXMuY2FudmFzLmRyYXdJbWFnZShlLDAsMCl9LGNyZWF0ZUNvbW1lbnQ6ZnVuY3Rpb24oZSx0KXtpZih2b2lkIDA9PT1lKXJldHVybiExO3ZhciBuPXIubWVhc3VyZVRleHQoZS50ZXh0KTtyZXR1cm57c3RhcnRUaW1lOnQsdGV4dDplLnRleHQsY29sb3I6ZS5jb2xvcix3aWR0aDpuLndpZHRoKzIwfX0sY29tbWVudFRvcDpmdW5jdGlvbihlLHQsbil7dGhpcy5jb21tZW50VG9wUXVldWUuZm9yRWFjaChmdW5jdGlvbih0LGkpe3ZvaWQgMCE9dCYmKG4+dC5zdGFydFRpbWUrcz90aGlzLmNvbW1lbnRUb3BRdWV1ZVtpXT12b2lkIDA6dGhpcy5uZWVkRHJhd1RleHQodCwoZS10LndpZHRoKS8yLG8qaSkpfS5iaW5kKHRoaXMpKTtmb3IodmFyIGk7aT10aGlzLmNvbW1lbnRUb3BQcmVRdWV1ZS5zaGlmdCgpOylpPXRoaXMuY3JlYXRlQ29tbWVudChpLG4pLHRoaXMuY29tbWVudFRvcFF1ZXVlLmZvckVhY2goZnVuY3Rpb24odCxuKXtpJiZ2b2lkIDA9PT10JiYodD10aGlzLmNvbW1lbnRUb3BRdWV1ZVtuXT1pLHRoaXMubmVlZERyYXdUZXh0KHQsKGUtaS53aWR0aCkvMixvKm4pLGk9dm9pZCAwKX0uYmluZCh0aGlzKSksaSYmKHRoaXMuY29tbWVudFRvcFF1ZXVlLnB1c2goaSksdGhpcy5uZWVkRHJhd1RleHQoaSwoZS1pLndpZHRoKS8yLG8qdGhpcy5jb21tZW50VG9wUXVldWUubGVuZ3RoLTEpKX0sY29tbWVudEJvdHRvbTpmdW5jdGlvbihlLHQsbil7dC09MTAsdGhpcy5jb21tZW50QnV0dG9uUXVldWUuZm9yRWFjaChmdW5jdGlvbihpLHIpe3ZvaWQgMCE9aSYmKG4+aS5zdGFydFRpbWUrcz90aGlzLmNvbW1lbnRCdXR0b25RdWV1ZVtyXT12b2lkIDA6dGhpcy5uZWVkRHJhd1RleHQoaSwoZS1pLndpZHRoKS8yLHQtbyoocisxKSkpfS5iaW5kKHRoaXMpKTtmb3IodmFyIGk7aT10aGlzLmNvbW1lbnRCdXR0b25QcmVRdWV1ZS5zaGlmdCgpOylpPXRoaXMuY3JlYXRlQ29tbWVudChpLG4pLHRoaXMuY29tbWVudEJ1dHRvblF1ZXVlLmZvckVhY2goZnVuY3Rpb24obixzKXtpJiZ2b2lkIDA9PT1uJiYobj10aGlzLmNvbW1lbnRCdXR0b25RdWV1ZVtzXT1pLHRoaXMubmVlZERyYXdUZXh0KG4sKGUtaS53aWR0aCkvMix0LW8qKHMrMSkpLGk9dm9pZCAwKX0uYmluZCh0aGlzKSksaSYmKHRoaXMuY29tbWVudEJ1dHRvblF1ZXVlLnB1c2goaSksdGhpcy5uZWVkRHJhd1RleHQoaSwoZS1pLndpZHRoKS8yLHQtbyp0aGlzLmNvbW1lbnRCdXR0b25RdWV1ZS5sZW5ndGgpKX0sY29tbWVudExvb3A6ZnVuY3Rpb24oZSx0LG4pe2Zvcih2YXIgcz10L298MCxyPS0xOysrcjxzOyl7dmFyIGE9dGhpcy5jb21tZW50TG9vcFF1ZXVlW3JdO2lmKHZvaWQgMD09PWEmJihhPXRoaXMuY29tbWVudExvb3BRdWV1ZVtyXT1bXSksdGhpcy5jb21tZW50TG9vcFByZVF1ZXVlLmxlbmd0aD4wKXt2YXIgbD0wPT09YS5sZW5ndGg/dm9pZCAwOmFbYS5sZW5ndGgtMV07aWYodm9pZCAwPT09bHx8KG4tbC5zdGFydFRpbWUpKmk+bC53aWR0aCl7dmFyIGM9dGhpcy5jcmVhdGVDb21tZW50KHRoaXMuY29tbWVudExvb3BQcmVRdWV1ZS5zaGlmdCgpLG4pO2MmJmEucHVzaChjKX19dGhpcy5jb21tZW50TG9vcFF1ZXVlW3JdPWEuZmlsdGVyKGZ1bmN0aW9uKHQpe3ZhciBzPShuLXQuc3RhcnRUaW1lKSppO3JldHVybiAwPnN8fHM+dC53aWR0aCtlPyExOih0aGlzLm5lZWREcmF3VGV4dCh0LGUtcyxvKnIpLCEwKX0uYmluZCh0aGlzKSl9Zm9yKHZhciBoPXRoaXMuY29tbWVudExvb3BRdWV1ZS5sZW5ndGgtcztoLS0+MDspdGhpcy5jb21tZW50TG9vcFF1ZXVlLnBvcCgpfSxwYXVzZUNvbW1lbnQ6ZnVuY3Rpb24oKXt0aGlzLnBhdXNlQ29tbWVudEF0PURhdGUubm93KCl9LHJlU3RhcnRDb21tZW50OmZ1bmN0aW9uKCl7aWYodGhpcy5wYXVzZUNvbW1lbnRBdCl7dmFyIGU9RGF0ZS5ub3coKS10aGlzLnBhdXNlQ29tbWVudEF0O3RoaXMuY29tbWVudExvb3BRdWV1ZS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3QuZm9yRWFjaChmdW5jdGlvbih0KXt0JiYodC5zdGFydFRpbWUrPWUpfSl9KSx0aGlzLmNvbW1lbnRCdXR0b25RdWV1ZS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3QmJih0LnN0YXJ0VGltZSs9ZSl9KSx0aGlzLmNvbW1lbnRUb3BRdWV1ZS5mb3JFYWNoKGZ1bmN0aW9uKHQpe3QmJih0LnN0YXJ0VGltZSs9ZSl9KX10aGlzLnBhdXNlQ29tbWVudEF0PXZvaWQgMH0sZHJhd0NvbW1lbnQ6ZnVuY3Rpb24oKXtpZighdGhpcy5wYXVzZUNvbW1lbnRBdCl7dmFyIGU9RGF0ZS5ub3coKSx0PXRoaXMuRE9Nc1tcInZpZGVvLWZyYW1lXCJdLm9mZnNldFdpZHRoLG49dGhpcy5ET01zW1widmlkZW8tZnJhbWVcIl0ub2Zmc2V0SGVpZ2h0O3QhPXRoaXMuY2FudmFzV2lkdGgmJih0aGlzLkRPTXMuY29tbWVudHMud2lkdGg9dCx0aGlzLmNhbnZhc1dpZHRoPXQpLG4hPXRoaXMuY2FudmFzSGVpZ2h0JiYodGhpcy5ET01zLmNvbW1lbnRzLmhlaWdodD1uLHRoaXMuY2FudmFzSGVpZ2h0PW4pO3ZhciBpPXRoaXMudmlkZW8ub2Zmc2V0V2lkdGgsbz10aGlzLnZpZGVvLm9mZnNldEhlaWdodDt0aGlzLmNvbW1lbnRMb29wKGksbyxlKSx0aGlzLmNvbW1lbnRUb3AoaSxvLGUpLHRoaXMuY29tbWVudEJvdHRvbShpLG8sZSksdGhpcy5kcmF3VGV4dCgpfX0sb25Db21tZW50VGltZVVwZGF0ZTpmdW5jdGlvbigpe2lmKHRoaXMuZW5hYmxlQ29tbWVudCE9PSExKXt2YXIgZT10aGlzLnZpZGVvLmN1cnJlbnRUaW1lO2lmKE1hdGguYWJzKGUtdGhpcy5sYXN0Q29tbW5ldFVwZGF0ZVRpbWUpPD0xJiZlPnRoaXMubGFzdENvbW1uZXRVcGRhdGVUaW1lKXt2YXIgdD0wO2Zvcih0aGlzLmxhc3RDb21tbmV0SW5kZXgmJnRoaXMuY29tbWVudHNbdGhpcy5sYXN0Q29tbW5ldEluZGV4XS50aW1lPD10aGlzLmxhc3RDb21tbmV0VXBkYXRlVGltZSYmKHQ9dGhpcy5sYXN0Q29tbW5ldEluZGV4KTsrK3Q8dGhpcy5jb21tZW50cy5sZW5ndGg7KWlmKCEodGhpcy5jb21tZW50c1t0XS50aW1lPD10aGlzLmxhc3RDb21tbmV0VXBkYXRlVGltZSkpe2lmKHRoaXMuY29tbWVudHNbdF0udGltZT5lKWJyZWFrO3N3aXRjaCh0aGlzLmNvbW1lbnRzW3RdLnBvcyl7Y2FzZVwiYm90dG9tXCI6dGhpcy5jb21tZW50QnV0dG9uUHJlUXVldWUucHVzaCh0aGlzLmNvbW1lbnRzW3RdKTticmVhaztjYXNlXCJ0b3BcIjp0aGlzLmNvbW1lbnRUb3BQcmVRdWV1ZS5wdXNoKHRoaXMuY29tbWVudHNbdF0pO2JyZWFrO2RlZmF1bHQ6dGhpcy5jb21tZW50TG9vcFByZVF1ZXVlLnB1c2godGhpcy5jb21tZW50c1t0XSl9dGhpcy5sYXN0Q29tbW5ldEluZGV4PXR9fXRyeXt0aGlzLmRyYXdDb21tZW50KCl9Y2F0Y2gobil7fXRoaXMubGFzdENvbW1uZXRVcGRhdGVUaW1lPWV9fX19LHtcIi4vY3JlYXRlRWxlbWVudFwiOjd9XSw0OltmdW5jdGlvbihlLHQpe2Z1bmN0aW9uIG4oZSl7cmV0dXJuIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGUpfWZ1bmN0aW9uIGkoZSx0LG4saSl7ZnVuY3Rpb24gbyh0KXt2YXIgbj0odC5jbGllbnRYLWUucGFyZW50Tm9kZS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0KS9lLnBhcmVudE5vZGUub2Zmc2V0V2lkdGg7cmV0dXJuIE1hdGgubWluKE1hdGgubWF4KG4sMCksMSl9ZnVuY3Rpb24gcyh0KXsxPT10LndoaWNoJiYobD0hMCxlLmRyYWdpbmc9ITAscih0KSl9ZnVuY3Rpb24gcihlKXtpZigxPT1lLndoaWNoJiZsPT09ITApe3ZhciB0PW8oZSk7bih0KX19ZnVuY3Rpb24gYSh0KXtpZigxPT10LndoaWNoJiZsPT09ITApe3ZhciBzPW8odCk7bihzKSxpKHMpLGw9ITEsZGVsZXRlIGUuZHJhZ2luZ319dmFyIGw9ITE7bj1ufHxmdW5jdGlvbigpe30saT1pfHxmdW5jdGlvbigpe30sZS5wYXJlbnROb2RlLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIixzKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZW1vdmVcIixyKSx0LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsYSl9dmFyIG89KGUoXCIuL2NyZWF0ZUVsZW1lbnRcIiksZShcIi4vZGVsZWdhdGVDbGlja0J5Q2xhc3NOYW1lXCIpKSxzPWUoXCIuL3RpbWVGb3JtYXRcIik7dC5leHBvcnRzPXtpbml0OmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy5pZnJhbWUuY29udGVudERvY3VtZW50LHQ9byhlKTt0Lm9uKFwicGxheVwiLHRoaXMub25QbGF5Q2xpY2ssdGhpcyksdC5vbihcInZpZGVvLWZyYW1lXCIsdGhpcy5vblZpZGVvQ2xpY2ssdGhpcyksdC5vbihcInNvdXJjZVwiLHRoaXMub25Tb3VyY2VDbGljayx0aGlzKSx0Lm9uKFwiYWxsc2NyZWVuXCIsdGhpcy5vbkFsbFNjcmVlbkNsaWNrLHRoaXMpLHQub24oXCJmdWxsc2NyZWVuXCIsdGhpcy5vbmZ1bGxTY3JlZW5DbGljayx0aGlzKSx0Lm9uKFwibm9ybWFsc2NyZWVuXCIsdGhpcy5vbk5vcm1hbFNjcmVlbkNsaWNrLHRoaXMpLHQub24oXCJjb21tZW50cy1idG5cIix0aGlzLm9uY29tbWVudHNCdG5DbGljayx0aGlzKSxlLmRvY3VtZW50RWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwia2V5ZG93blwiLHRoaXMub25LZXlEb3duLmJpbmQodGhpcyksITEpLHRoaXMuRE9Ncy5wbGF5ZXIuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLHRoaXMub25Nb3VzZUFjdGl2ZS5iaW5kKHRoaXMpKSxpKHRoaXMuRE9Ncy5wcm9ncmVzc19hbmNob3IsZSx0aGlzLm9uUHJvZ3Jlc3NBbmNob3JXaWxsU2V0LmJpbmQodGhpcyksdGhpcy5vblByb2dyZXNzQW5jaG9yU2V0LmJpbmQodGhpcykpLGkodGhpcy5ET01zLnZvbHVtZV9hbmNob3IsZSx0aGlzLm9uVm9sdW1lQW5jaG9yV2lsbFNldC5iaW5kKHRoaXMpKX0sb25LZXlEb3duOmZ1bmN0aW9uKGUpe3N3aXRjaChlLnByZXZlbnREZWZhdWx0KCksZS5rZXlDb2RlKXtjYXNlIDMyOnRoaXMub25QbGF5Q2xpY2soKTticmVhaztjYXNlIDM5OnRoaXMudmlkZW8uY3VycmVudFRpbWU9TWF0aC5taW4odGhpcy52aWRlby5kdXJhdGlvbix0aGlzLnZpZGVvLmN1cnJlbnRUaW1lKzEwKTticmVhaztjYXNlIDM3OnRoaXMudmlkZW8uY3VycmVudFRpbWU9TWF0aC5tYXgoMCx0aGlzLnZpZGVvLmN1cnJlbnRUaW1lLTEwKTticmVhaztjYXNlIDM4OnRoaXMudmlkZW8udm9sdW1lPU1hdGgubWluKDEsdGhpcy52aWRlby52b2x1bWUrLjEpLHRoaXMuRE9Ncy52b2x1bWVfYW5jaG9yLnN0eWxlLndpZHRoPTEwMCp0aGlzLnZpZGVvLnZvbHVtZStcIiVcIjticmVhaztjYXNlIDQwOnRoaXMudmlkZW8udm9sdW1lPU1hdGgubWF4KDAsdGhpcy52aWRlby52b2x1bWUtLjEpLHRoaXMuRE9Ncy52b2x1bWVfYW5jaG9yLnN0eWxlLndpZHRoPTEwMCp0aGlzLnZpZGVvLnZvbHVtZStcIiVcIjticmVhaztjYXNlIDY1OnRoaXMuRE9Ncy5wbGF5ZXIuY2xhc3NMaXN0LmNvbnRhaW5zKFwiYWxsc2NyZWVuXCIpP3RoaXMub25Ob3JtYWxTY3JlZW5DbGljaygpOnRoaXMub25BbGxTY3JlZW5DbGljaygpO2JyZWFrO2Nhc2UgNzA6dGhpcy5ET01zLnBsYXllci5jbGFzc0xpc3QuY29udGFpbnMoXCJmdWxsc2NyZWVuXCIpfHx0aGlzLm9uZnVsbFNjcmVlbkNsaWNrKCl9fSxvblZpZGVvQ2xpY2s6ZnVuY3Rpb24oKXt2b2lkIDA9PXRoaXMudmlkZW9DbGlja0RibFRpbWVyP3RoaXMudmlkZW9DbGlja0RibFRpbWVyPXNldFRpbWVvdXQoZnVuY3Rpb24oKXt0aGlzLnZpZGVvQ2xpY2tEYmxUaW1lcj12b2lkIDAsdGhpcy5vblBsYXlDbGljaygpfS5iaW5kKHRoaXMpLDMwMCk6KGNsZWFyVGltZW91dCh0aGlzLnZpZGVvQ2xpY2tEYmxUaW1lciksdGhpcy52aWRlb0NsaWNrRGJsVGltZXI9dm9pZCAwLGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50fHxkb2N1bWVudC5tb3pGdWxsU2NyZWVuRWxlbWVudHx8ZG9jdW1lbnQud2Via2l0RnVsbHNjcmVlbkVsZW1lbnQ/dGhpcy5vbk5vcm1hbFNjcmVlbkNsaWNrKCk6dGhpcy5vbmZ1bGxTY3JlZW5DbGljaygpKX0sb25Nb3VzZUFjdGl2ZTpmdW5jdGlvbigpe3RoaXMuRE9Ncy5wbGF5ZXIuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKSxjbGVhclRpbWVvdXQodGhpcy5Nb3VzZUFjdGl2ZVRpbWVyKSx0aGlzLk1vdXNlQWN0aXZlVGltZXI9c2V0VGltZW91dChmdW5jdGlvbigpe3RoaXMuRE9Ncy5wbGF5ZXIuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKX0uYmluZCh0aGlzKSwxZTMpfSxvblBsYXlDbGljazpmdW5jdGlvbigpe3RoaXMuRE9Ncy5wbGF5LmNsYXNzTGlzdC5jb250YWlucyhcInBhdXNlZFwiKT8odGhpcy52aWRlby5wbGF5KCksdGhpcy5ET01zLnBsYXkuY2xhc3NMaXN0LnJlbW92ZShcInBhdXNlZFwiKSk6KHRoaXMudmlkZW8ucGF1c2UoKSx0aGlzLkRPTXMucGxheS5jbGFzc0xpc3QuYWRkKFwicGF1c2VkXCIpKX0sb25Tb3VyY2VDbGljazpmdW5jdGlvbihlKXtlLmNsYXNzTGlzdC5jb250YWlucyhcImN1cnJcIil8fCh0aGlzLnZpZGVvLnByZWxvYWRTdGFydFRpbWU9dGhpcy52aWRlby5jdXJyZW50VGltZSx0aGlzLnZpZGVvLnNyYz10aGlzLnNvdXJjZUxpc3RbMHxlLmdldEF0dHJpYnV0ZShcInNvdXJjZUluZGV4XCIpXVsxXSxuKGUucGFyZW50Tm9kZS5jaGlsZE5vZGVzKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe2U9PT10P3QuY2xhc3NMaXN0LmFkZChcImN1cnJcIik6dC5jbGFzc0xpc3QucmVtb3ZlKFwiY3VyclwiKX0uYmluZCh0aGlzKSkpfSxvblByb2dyZXNzQW5jaG9yV2lsbFNldDpmdW5jdGlvbihlKXt2YXIgdD10aGlzLnZpZGVvLmR1cmF0aW9uLG49dCplO3RoaXMuRE9Ncy5jdXJyZW50LmlubmVySFRNTD1zKG4pLHRoaXMuRE9Ncy5kdXJhdGlvbi5pbm5lckhUTUw9cyh0KSx0aGlzLkRPTXMucHJvZ3Jlc3NfYW5jaG9yLnN0eWxlLndpZHRoPTEwMCplK1wiJVwifSxvblByb2dyZXNzQW5jaG9yU2V0OmZ1bmN0aW9uKGUpe3RoaXMudmlkZW8uY3VycmVudFRpbWU9dGhpcy52aWRlby5kdXJhdGlvbiplfSxvblZvbHVtZUFuY2hvcldpbGxTZXQ6ZnVuY3Rpb24oZSl7dGhpcy52aWRlby52b2x1bWU9ZSx0aGlzLkRPTXMudm9sdW1lX2FuY2hvci5zdHlsZS53aWR0aD0xMDAqZStcIiVcIn0sb25BbGxTY3JlZW5DbGljazpmdW5jdGlvbigpe3ZhciBlPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCx0PWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQ7dGhpcy5pZnJhbWUuc3R5bGUuY3NzVGV4dD1cIjtwb3NpdGlvbjpmaXhlZDt0b3A6MDtsZWZ0OjA7d2lkdGg6XCIrZStcInB4O2hlaWdodDpcIit0K1wicHg7ei1pbmRleDo5OTk5OTk7XCIsdGhpcy5hbGxTY3JlZW5XaW5SZXNpemVGdW5jdGlvbj10aGlzLmFsbFNjcmVlbldpblJlc2l6ZUZ1bmN0aW9ufHxmdW5jdGlvbigpe3RoaXMuaWZyYW1lLnN0eWxlLndpZHRoPWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCtcInB4XCIsdGhpcy5pZnJhbWUuc3R5bGUuaGVpZ2h0PWRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQrXCJweFwifS5iaW5kKHRoaXMpLHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwicmVzaXplXCIsdGhpcy5hbGxTY3JlZW5XaW5SZXNpemVGdW5jdGlvbiksd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIix0aGlzLmFsbFNjcmVlbldpblJlc2l6ZUZ1bmN0aW9uKSx0aGlzLkRPTXMucGxheWVyLmNsYXNzTGlzdC5hZGQoXCJhbGxzY3JlZW5cIil9LG9uZnVsbFNjcmVlbkNsaWNrOmZ1bmN0aW9uKCl7W1wid2Via2l0UmVxdWVzdEZ1bGxTY3JlZW5cIixcIm1velJlcXVlc3RGdWxsU2NyZWVuXCIsXCJyZXF1ZXN0RnVsbFNjcmVlblwiXS5mb3JFYWNoKGZ1bmN0aW9uKGUpe3RoaXMuRE9Ncy5wbGF5ZXJbZV0mJnRoaXMuRE9Ncy5wbGF5ZXJbZV0oKX0uYmluZCh0aGlzKSksdGhpcy5vbk1vdXNlQWN0aXZlKCl9LG9uTm9ybWFsU2NyZWVuQ2xpY2s6ZnVuY3Rpb24oKXt3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInJlc2l6ZVwiLHRoaXMuYWxsU2NyZWVuV2luUmVzaXplRnVuY3Rpb24pLHRoaXMuaWZyYW1lLnN0eWxlLmNzc1RleHQ9XCI7d2lkdGg6XCIrdGhpcy5zaXplWzBdK1wicHg7aGVpZ2h0OlwiK3RoaXMuc2l6ZVsxXStcInB4O1wiLFtcIndlYmtpdENhbmNlbEZ1bGxTY3JlZW5cIixcIm1vekNhbmNlbEZ1bGxTY3JlZW5cIixcImNhbmNlbEZ1bGxTY3JlZW5cIl0uZm9yRWFjaChmdW5jdGlvbihlKXtkb2N1bWVudFtlXSYmZG9jdW1lbnRbZV0oKX0pLHRoaXMuRE9Ncy5wbGF5ZXIuY2xhc3NMaXN0LnJlbW92ZShcImFsbHNjcmVlblwiKX0sb25jb21tZW50c0J0bkNsaWNrOmZ1bmN0aW9uKCl7dGhpcy5lbmFibGVDb21tZW50PSF0aGlzLkRPTXNbXCJjb21tZW50cy1idG5cIl0uY2xhc3NMaXN0LmNvbnRhaW5zKFwiZW5hYmxlXCIpLHRoaXMuZW5hYmxlQ29tbWVudD8oc2V0VGltZW91dChmdW5jdGlvbigpe3RoaXMuRE9Ncy5jb21tZW50cy5zdHlsZS5kaXNwbGF5PVwiYmxvY2tcIn0uYmluZCh0aGlzKSw4MCksdGhpcy5ET01zW1wiY29tbWVudHMtYnRuXCJdLmNsYXNzTGlzdC5hZGQoXCJlbmFibGVcIikpOih0aGlzLkRPTXMuY29tbWVudHMuc3R5bGUuZGlzcGxheT1cIm5vbmVcIix0aGlzLkRPTXNbXCJjb21tZW50cy1idG5cIl0uY2xhc3NMaXN0LnJlbW92ZShcImVuYWJsZVwiKSl9fX0se1wiLi9jcmVhdGVFbGVtZW50XCI6NyxcIi4vZGVsZWdhdGVDbGlja0J5Q2xhc3NOYW1lXCI6OCxcIi4vdGltZUZvcm1hdFwiOjE0fV0sNTpbZnVuY3Rpb24oZSx0KXt7dmFyIG49KGUoXCIuL2V4dGVuZFwiKSxlKFwiLi9jcmVhdGVFbGVtZW50XCIpKTtlKFwiLi9wYXJzZURPTUJ5Q2xhc3NOYW1lc1wiKX10LmV4cG9ydHM9e2luaXQ6ZnVuY3Rpb24oKXt2YXIgZT0wO3RoaXMuc291cmNlTGlzdC5mb3JFYWNoKGZ1bmN0aW9uKHQsaSl7bihcImxpXCIse2FwcGVuZFRvOnRoaXMuRE9Ncy5oZCxzb3VyY2VJbmRleDppLGNsYXNzTmFtZTpcInNvdXJjZSBcIisoaT09PWU/XCJjdXJyXCI6XCJcIiksaW5uZXJIVE1MOnRbMF19KX0uYmluZCh0aGlzKSksdGhpcy5ET01zLnZpZGVvLnNyYz10aGlzLnNvdXJjZUxpc3RbZV1bMV19fX0se1wiLi9jcmVhdGVFbGVtZW50XCI6NyxcIi4vZXh0ZW5kXCI6OSxcIi4vcGFyc2VET01CeUNsYXNzTmFtZXNcIjoxMX1dLDY6W2Z1bmN0aW9uKGUsdCl7dmFyIG49ZShcIi4vdGltZUZvcm1hdFwiKTt0LmV4cG9ydHM9e2luaXQ6ZnVuY3Rpb24oKXt0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJ0aW1ldXBkYXRlXCIsdGhpcy5vblZpZGVvVGltZVVwZGF0ZS5iaW5kKHRoaXMpKSx0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJwbGF5XCIsdGhpcy5vblZpZGVvUGxheS5iaW5kKHRoaXMpKSx0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJwYXVzZVwiLHRoaXMub25WaWRlb1RpbWVQYXVzZS5iaW5kKHRoaXMpKSx0aGlzLnZpZGVvLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkZWRtZXRhZGF0YVwiLHRoaXMub25WaWRlb0xvYWRlZE1ldGFEYXRhLmJpbmQodGhpcykpLHNldEludGVydmFsKHRoaXMudmlkZW9CdWZmZXJlZC5iaW5kKHRoaXMpLDFlMyksdGhpcy5ET01zLnZvbHVtZV9hbmNob3Iuc3R5bGUud2lkdGg9MTAwKnRoaXMudmlkZW8udm9sdW1lK1wiJVwifSxvblZpZGVvVGltZVVwZGF0ZTpmdW5jdGlvbigpe3ZhciBlPXRoaXMudmlkZW8uY3VycmVudFRpbWUsdD10aGlzLnZpZGVvLmR1cmF0aW9uO3RoaXMuRE9Ncy5jdXJyZW50LmlubmVySFRNTD1uKGUpLHRoaXMuRE9Ncy5kdXJhdGlvbi5pbm5lckhUTUw9bih0KSx0aGlzLkRPTXMucHJvZ3Jlc3NfYW5jaG9yLmRyYWdpbmd8fCh0aGlzLkRPTXMucHJvZ3Jlc3NfYW5jaG9yLnN0eWxlLndpZHRoPTEwMCpNYXRoLm1pbihNYXRoLm1heChlL3QsMCksMSkrXCIlXCIpfSx2aWRlb0J1ZmZlcmVkOmZ1bmN0aW9uKCl7dmFyIGU9dGhpcy52aWRlby5idWZmZXJlZCx0PXRoaXMudmlkZW8uY3VycmVudFRpbWUsbj0wPT1lLmxlbmd0aD8wOmUuZW5kKGUubGVuZ3RoLTEpO3RoaXMuRE9Ncy5idWZmZXJlZF9hbmNob3Iuc3R5bGUud2lkdGg9MTAwKk1hdGgubWluKE1hdGgubWF4KG4vdGhpcy52aWRlby5kdXJhdGlvbiwwKSwxKStcIiVcIiwwPT1ufHx0Pj1uP3RoaXMuRE9Ncy5wbGF5ZXIuY2xhc3NMaXN0LmFkZChcImxvYWRpbmdcIik6dGhpcy5ET01zLnBsYXllci5jbGFzc0xpc3QucmVtb3ZlKFwibG9hZGluZ1wiKX0sb25WaWRlb1BsYXk6ZnVuY3Rpb24oKXt0aGlzLkRPTXMucGxheS5jbGFzc0xpc3QucmVtb3ZlKFwicGF1c2VkXCIpfSxvblZpZGVvVGltZVBhdXNlOmZ1bmN0aW9uKCl7dGhpcy5ET01zLnBsYXkuY2xhc3NMaXN0LmFkZChcInBhdXNlZFwiKX0sb25WaWRlb0xvYWRlZE1ldGFEYXRhOmZ1bmN0aW9uKCl7dGhpcy52aWRlby5wcmVsb2FkU3RhcnRUaW1lJiYodGhpcy52aWRlby5jdXJyZW50VGltZT10aGlzLnZpZGVvLnByZWxvYWRTdGFydFRpbWUsZGVsZXRlIHRoaXMudmlkZW8ucHJlbG9hZFN0YXJ0VGltZSl9fX0se1wiLi90aW1lRm9ybWF0XCI6MTR9XSw3OltmdW5jdGlvbihlLHQpe2Z1bmN0aW9uIG4oZSx0KXt2YXIgbj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KGUpO2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIHQpdC5jYWxsKG4pO2Vsc2UgZm9yKHZhciBpIGluIHQpaWYodC5oYXNPd25Qcm9wZXJ0eShpKSlzd2l0Y2goaSl7Y2FzZVwiYXBwZW5kVG9cIjp0W2ldLmFwcGVuZENoaWxkKG4pO2JyZWFrO2Nhc2VcInRleHRcIjp2YXIgbz1kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0W2ldKTtuLmlubmVySFRNTD1cIlwiLG4uYXBwZW5kQ2hpbGQobyk7YnJlYWs7Y2FzZVwiaW5uZXJIVE1MXCI6Y2FzZVwiY2xhc3NOYW1lXCI6Y2FzZVwiaWRcIjpuW2ldPXRbaV07YnJlYWs7Y2FzZVwic3R5bGVcIjp2YXIgcz10W2ldO2Zvcih2YXIgciBpbiBzKXMuaGFzT3duUHJvcGVydHkocikmJihuLnN0eWxlW3JdPXNbcl0pO2JyZWFrO2RlZmF1bHQ6bi5zZXRBdHRyaWJ1dGUoaSx0W2ldK1wiXCIpfXJldHVybiBufXQuZXhwb3J0cz1ufSx7fV0sODpbZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBuKGUpe3JldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChlKX1mdW5jdGlvbiBpKGUpe3RoaXMuX2V2ZW50TWFwPXt9LHRoaXMuX3Jvb3RFbGVtZW50PWUsdGhpcy5faXNSb290RWxlbWVudEJpbmRlZENsaWNrPSExLHRoaXMuX2JpbmRDbGlja0Z1bmN0aW9uPWZ1bmN0aW9uKGUpeyFmdW5jdGlvbiB0KGUsaSl7aSYmaS5ub2RlTmFtZSYmKGkuY2xhc3NMaXN0JiZuKGkuY2xhc3NMaXN0KS5mb3JFYWNoKGZ1bmN0aW9uKHQpe2UudHJpZ2dlcih0LGkpfSksdChlLGkucGFyZW50Tm9kZSkpfSh0aGlzLGUudGFyZ2V0KX0uYmluZCh0aGlzKX12YXIgbz1lKFwiLi9leHRlbmRcIik7byhpLnByb3RvdHlwZSx7b246ZnVuY3Rpb24oZSx0LG4pe3ZvaWQgMD09PXRoaXMuX2V2ZW50TWFwW2VdJiYodGhpcy5fZXZlbnRNYXBbZV09W10pLHRoaXMuX2V2ZW50TWFwW2VdLnB1c2goW3Qsbl0pLHRoaXMuX2lzUm9vdEVsZW1lbnRCaW5kZWRDbGlja3x8KF9pc1Jvb3RFbGVtZW50QmluZGVkQ2xpY2s9ITAsdGhpcy5fcm9vdEVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsdGhpcy5fYmluZENsaWNrRnVuY3Rpb24sITEpKX0sb2ZmOmZ1bmN0aW9uKGUsdCl7aWYodm9pZCAwIT10aGlzLl9ldmVudE1hcFtlXSlmb3IodmFyIG49dGhpcy5fZXZlbnRNYXBbZV0ubGVuZ3RoO24tLTspaWYodGhpcy5fZXZlbnRNYXBbZV1bbl1bMF09PT10KXt0aGlzLl9ldmVudE1hcFtlXS5zcGxpY2UobiwxKTticmVha31mb3IodmFyIGkgaW4gdGhpcy5fZXZlbnRNYXApYnJlYWs7dm9pZCAwPT09aSYmdGhpcy5faXNSb290RWxlbWVudEJpbmRlZENsaWNrJiYoX2lzUm9vdEVsZW1lbnRCaW5kZWRDbGljaz0hMSx0aGlzLl9yb290RWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIix0aGlzLl9iaW5kQ2xpY2tGdW5jdGlvbiwhMSkpfSx0cmlnZ2VyOmZ1bmN0aW9uKGUsdCl7dD12b2lkIDA9PT10P3RoaXMuX3Jvb3RFbGVtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lcyhlKTpbdF0sdC5mb3JFYWNoKGZ1bmN0aW9uKHQpeyh0aGlzLl9ldmVudE1hcFtlXXx8W10pLmZvckVhY2goZnVuY3Rpb24oZSl7ZVswXS5jYWxsKGVbMV0sdCl9KX0uYmluZCh0aGlzKSl9fSksdC5leHBvcnRzPWZ1bmN0aW9uKGUpe3JldHVybiBuZXcgaShlKX19LHtcIi4vZXh0ZW5kXCI6OX1dLDk6W2Z1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gbihlKXtmb3IodmFyIHQsbj1hcmd1bWVudHMubGVuZ3RoLGk9MTtuPmk7KXt0PWFyZ3VtZW50c1tpKytdO2Zvcih2YXIgbyBpbiB0KXQuaGFzT3duUHJvcGVydHkobykmJihlW29dPXRbb10pfXJldHVybiBlfXQuZXhwb3J0cz1ufSx7fV0sMTA6W2Z1bmN0aW9uKGUpe2Z1bmN0aW9uIHQoZSx0LG4saSl7dGhpcy5pZD1lLHRoaXMuc2l6ZT10LnNwbGl0KFwieFwiKSx0aGlzLnNvdXJjZUxpc3Q9bnx8W10sdGhpcy5jb21tZW50cz1pLHRoaXMuaW5pdCgpfWUoXCIuL2NvbXBvbmVudFwiKSh0LGUoXCIuL2NvbXBvbmVudF9idWlsZFwiKSxlKFwiLi9jb21wb25lbnRfZXZlbnRcIiksZShcIi4vY29tcG9uZW50X3ZpZGVvXCIpLGUoXCIuL2NvbXBvbmVudF9zb3VyY2VcIiksZShcIi4vY29tcG9uZW50X2NvbW1lbnRzXCIpKSxNQU1BUGxheWVyPXR9LHtcIi4vY29tcG9uZW50XCI6MSxcIi4vY29tcG9uZW50X2J1aWxkXCI6MixcIi4vY29tcG9uZW50X2NvbW1lbnRzXCI6MyxcIi4vY29tcG9uZW50X2V2ZW50XCI6NCxcIi4vY29tcG9uZW50X3NvdXJjZVwiOjUsXCIuL2NvbXBvbmVudF92aWRlb1wiOjZ9XSwxMTpbZnVuY3Rpb24oZSx0KXtmdW5jdGlvbiBuKGUsdCl7dmFyIG49e307cmV0dXJuIHQuZm9yRWFjaChmdW5jdGlvbih0KXtuW3RdPWUuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSh0KVswXX0pLG59dC5leHBvcnRzPW59LHt9XSwxMjpbZnVuY3Rpb24oZSx0KXt0LmV4cG9ydHM9JyogeyBtYXJnaW46MDsgcGFkZGluZzowOyB9Ym9keSB7IGZvbnQtZmFtaWx5OiBcIlBpbmdIZWlcIixcIkx1Y2lkYSBHcmFuZGVcIiwgXCJMdWNpZGEgU2FucyBVbmljb2RlXCIsIFwiU1RIZWl0aVwiLCBcIkhlbHZldGljYVwiLFwiQXJpYWxcIixcIlZlcmRhbmFcIixcInNhbnMtc2VyaWZcIjsgZm9udC1zaXplOjE2cHg7fWh0bWwsIGJvZHksIC5wbGF5ZXIgeyBoZWlnaHQ6IDEwMCU7IH0ucGxheWVyOi13ZWJraXQtZnVsbC1zY3JlZW4geyB3aWR0aDogMTAwJTsgY3Vyc29yOnVybChkYXRhOmltYWdlL2dpZjtiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUFFQUFBQUJDQVlBQUFBZkZjU0pBQUFBRFVsRVFWUUltV05nWUdCZ0FBQUFCUUFCaDZGTzFBQUFBQUJKUlU1RXJrSmdnZz09KTsgfS5wbGF5ZXI6LW1vei1mdWxsLXNjcmVlbiB7IHdpZHRoOiAxMDAlOyBjdXJzb3I6dXJsKGRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQUVBQUFBQkNBWUFBQUFmRmNTSkFBQUFEVWxFUVZRSW1XTmdZR0JnQUFBQUJRQUJoNkZPMUFBQUFBQkpSVTVFcmtKZ2dnPT0pOyB9LnBsYXllcjpmdWxsLXNjcmVlbiB7IHdpZHRoOiAxMDAlOyBjdXJzb3I6dXJsKGRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxpVkJPUncwS0dnb0FBQUFOU1VoRVVnQUFBQUVBQUFBQkNBWUFBQUFmRmNTSkFBQUFEVWxFUVZRSW1XTmdZR0JnQUFBQUJRQUJoNkZPMUFBQUFBQkpSVTVFcmtKZ2dnPT0pOyB9LnBsYXllciB7XHRcdGJvcmRlci1yYWRpdXM6IDNweDtcdG92ZXJmbG93OiBoaWRkZW47XHRwb3NpdGlvbjogcmVsYXRpdmU7XHRjdXJzb3I6IGRlZmF1bHQ7XHQtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1x0LW1vei11c2VyLXNlbGVjdDogbm9uZTtcdHVzZXItc2VsZWN0OiBub25lO30udmlkZW8tZnJhbWUge1x0Ym94LXNpemluZzogYm9yZGVyLWJveDtcdHBhZGRpbmctYm90dG9tOiA1MHB4O1x0aGVpZ2h0OiAxMDAlO1x0b3ZlcmZsb3c6IGhpZGRlbjtcdHBvc2l0aW9uOiByZWxhdGl2ZTt9LnZpZGVvLWZyYW1lIC5jb21tZW50c3tcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcdHRvcDowO2xlZnQ6MDtcdHdpZHRoOjEwMCU7XHRoZWlnaHQ6MTAwJTtcdC13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZVooMCk7XHQtbW96LXRyYW5zZm9ybTp0cmFuc2xhdGVaKDApO1x0dHJhbnNmb3JtOnRyYW5zbGF0ZVooMCk7XHRwb2ludGVyLWV2ZW50czogbm9uZTt9LnBsYXllcjotd2Via2l0LWZ1bGwtc2NyZWVuIC52aWRlby1mcmFtZSB7IHBhZGRpbmctYm90dG9tOiAwcHg7IH0ucGxheWVyOi1tb3otZnVsbC1zY3JlZW4gLnZpZGVvLWZyYW1lIHsgcGFkZGluZy1ib3R0b206IDBweDsgfS5wbGF5ZXI6ZnVsbC1zY3JlZW4gLnZpZGVvLWZyYW1leyBwYWRkaW5nLWJvdHRvbTogMHB4OyB9LnZpZGVvIHtcdHdpZHRoOiAxMDAlO1x0aGVpZ2h0OiAxMDAlO1x0YmFja2dyb3VuZDogIzAwMDAwMDt9LmNvbnRyb2xsZXIge1x0cG9zaXRpb246IGFic29sdXRlO1x0Ym90dG9tOiAwcHg7XHRsZWZ0OjA7XHRyaWdodDowO1x0YmFja2dyb3VuZDogIzI0MjcyQTtcdGhlaWdodDogNTBweDt9LmNvbnRyb2xsZXIgLmxvYWRpbmctaWNvbiB7XHRkaXNwbGF5OiBub25lO1x0cG9zaXRpb246IGFic29sdXRlO1x0d2lkdGg6IDIwcHg7XHRoZWlnaHQ6IDIwcHg7XHRsaW5lLWhlaWdodDogMjBweDtcdHRleHQtYWxpZ246IGNlbnRlcjtcdGZvbnQtc2l6ZTogMjBweDtcdGNvbG9yOiAjZmZmZmZmO1x0dG9wOiAtMzBweDtcdHJpZ2h0OiAxMHB4O30ucGxheWVyLmxvYWRpbmcgLmNvbnRyb2xsZXIgLmxvYWRpbmctaWNvbiB7XHRkaXNwbGF5OiBibG9jazt9LnBsYXllcjotd2Via2l0LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIHtcdC13ZWJraXQtdHJhbnNmb3JtOnRyYW5zbGF0ZVkoNTBweCk7XHQtd2Via2l0LXRyYW5zaXRpb246IC13ZWJraXQtdHJhbnNmb3JtIDAuM3MgZWFzZTt9LnBsYXllcjotbW96LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIHtcdC1tb3otdHJhbnNmb3JtOnRyYW5zbGF0ZVkoNTBweCk7XHQtbW96LXRyYW5zaXRpb246IC1tb3otdHJhbnNmb3JtIDAuM3MgZWFzZTt9LnBsYXllcjpmdWxsLXNjcmVlbiAuY29udHJvbGxlciB7XHR0cmFuc2Zvcm06dHJhbnNsYXRlWSg1MHB4KTtcdHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjNzIGVhc2U7fS5wbGF5ZXIuYWN0aXZlOi13ZWJraXQtZnVsbC1zY3JlZW4ge1x0Y3Vyc29yOiBkZWZhdWx0O30ucGxheWVyLmFjdGl2ZTotbW96LWZ1bGwtc2NyZWVuIHtcdGN1cnNvcjogZGVmYXVsdDt9LnBsYXllci5hY3RpdmU6ZnVsbC1zY3JlZW4ge1x0Y3Vyc29yOiBkZWZhdWx0O30ucGxheWVyLmFjdGl2ZTotd2Via2l0LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyLC5wbGF5ZXI6LXdlYmtpdC1mdWxsLXNjcmVlbiAuY29udHJvbGxlcjpob3ZlciB7XHQtd2Via2l0LXRyYW5zZm9ybTp0cmFuc2xhdGVZKDApO1x0Y3Vyc29yOiBkZWZhdWx0O30ucGxheWVyLmFjdGl2ZTotbW96LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyLC5wbGF5ZXI6LW1vei1mdWxsLXNjcmVlbiAuY29udHJvbGxlcjpob3ZlciB7XHQtbW96LXRyYW5zZm9ybTp0cmFuc2xhdGVZKDApO1x0Y3Vyc29yOiBkZWZhdWx0O30ucGxheWVyLmFjdGl2ZTpmdWxsLXNjcmVlbiAuY29udHJvbGxlci5wbGF5ZXI6ZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXI6aG92ZXIge1x0dHJhbnNmb3JtOnRyYW5zbGF0ZVkoMCk7XHRjdXJzb3I6IGRlZmF1bHQ7fS5wbGF5ZXIuYWN0aXZlOi13ZWJraXQtZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgLnByb2dyZXNzIC5wcm9ncmVzc19hbmNob3I6YWZ0ZXIsLnBsYXllcjotd2Via2l0LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyOmhvdmVyIC5wcm9ncmVzcyAucHJvZ3Jlc3NfYW5jaG9yOmFmdGVyIHtcdGhlaWdodDoxMnB4O30ucGxheWVyLmFjdGl2ZTotbW96LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIC5wcm9ncmVzcyAucHJvZ3Jlc3NfYW5jaG9yOmFmdGVyLC5wbGF5ZXI6LW1vei1mdWxsLXNjcmVlbiAuY29udHJvbGxlcjpob3ZlciAucHJvZ3Jlc3MgLnByb2dyZXNzX2FuY2hvcjphZnRlciB7XHRoZWlnaHQ6MTJweDt9LnBsYXllci5hY3RpdmU6ZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgLnByb2dyZXNzIC5wcm9ncmVzc19hbmNob3I6YWZ0ZXIsLnBsYXllcjpmdWxsLXNjcmVlbiAuY29udHJvbGxlcjpob3ZlciAucHJvZ3Jlc3MgLnByb2dyZXNzX2FuY2hvcjphZnRlciB7XHRoZWlnaHQ6MTJweDt9LnBsYXllcjotd2Via2l0LWZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIC5wcm9ncmVzcyAucHJvZ3Jlc3NfYW5jaG9yOmFmdGVyIHtcdGhlaWdodDo0cHg7fS5wbGF5ZXI6LW1vei1mdWxsLXNjcmVlbiAuY29udHJvbGxlciAucHJvZ3Jlc3MgLnByb2dyZXNzX2FuY2hvcjphZnRlciB7XHRoZWlnaHQ6NHB4O30ucGxheWVyOmZ1bGwtc2NyZWVuIC5jb250cm9sbGVyIC5wcm9ncmVzcyAucHJvZ3Jlc3NfYW5jaG9yOmFmdGVyIHtcdGhlaWdodDo0cHg7fS5jb250cm9sbGVyIC5wcm9ncmVzcyB7XHRwb3NpdGlvbjogYWJzb2x1dGU7XHR0b3A6MHB4O1x0bGVmdDowO1x0cmlnaHQ6MDtcdGJvcmRlci1yaWdodDogNHB4IHNvbGlkICMxODFBMUQ7XHRib3JkZXItbGVmdDogOHB4IHNvbGlkICNERjY1NTg7XHRoZWlnaHQ6IDRweDtcdGJhY2tncm91bmQ6ICMxODFBMUQ7XHR6LWluZGV4OjE7XHQtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWigwKTtcdC1tb3otdHJhbnNmb3JtOiB0cmFuc2xhdGVaKDApO1x0dHJhbnNmb3JtOiB0cmFuc2xhdGVaKDApO30uY29udHJvbGxlciAucHJvZ3Jlc3M6YWZ0ZXIge1x0Y29udGVudDpcIlwiO1x0ZGlzcGxheTogYmxvY2s7XHRwb3NpdGlvbjogYWJzb2x1dGU7XHR0b3A6MHB4O1x0bGVmdDowO1x0cmlnaHQ6MDtcdGJvdHRvbTotMTBweDtcdGhlaWdodDogMTBweDt9LmNvbnRyb2xsZXIgLnByb2dyZXNzIC5hbmNob3Ige1x0aGVpZ2h0OiA0cHg7XHRiYWNrZ3JvdW5kOiAjREY2NTU4O1x0cG9zaXRpb246IGFic29sdXRlO1x0dG9wOjA7bGVmdDowO30uY29udHJvbGxlciAucHJvZ3Jlc3MgLmFuY2hvcjphZnRlciB7XHRjb250ZW50OlwiXCI7XHRkaXNwbGF5OiBibG9jaztcdHdpZHRoOiAxMnB4O1x0YmFja2dyb3VuZDogI0RGNjU1ODtcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcdHJpZ2h0Oi00cHg7XHR0b3A6IDUwJTtcdGhlaWdodDogMTJweDtcdGJveC1zaGFkb3c6IDAgMCAycHggcmdiYSgwLDAsMCwgMC40KTtcdGJvcmRlci1yYWRpdXM6IDEycHg7XHQtd2Via2l0LXRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcdC1tb3otdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1x0dHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO30uY29udHJvbGxlciAucHJvZ3Jlc3MgLmFuY2hvci5idWZmZXJlZF9hbmNob3Ige1x0XHRwb3NpdGlvbjogcmVsYXRpdmU7XHRiYWNrZ3JvdW5kOiByZ2JhKDI1NSwyNTUsMjU1LDAuMSk7fS5jb250cm9sbGVyIC5wcm9ncmVzcyAuYW5jaG9yLmJ1ZmZlcmVkX2FuY2hvcjphZnRlciB7XHRib3gtc2hhZG93OiBub25lO1x0aGVpZ2h0OiA0cHg7XHR3aWR0aDogNHB4O1x0Ym9yZGVyLXJhZGl1czogMDtcdGJhY2tncm91bmQ6IHJnYmEoMjU1LDI1NSwyNTUsMC4xKTt9LmNvbnRyb2xsZXIgLnJpZ2h0IHtcdGhlaWdodDogNTBweDtcdHBvc2l0aW9uOiBhYnNvbHV0ZTtcdHRvcDowO1x0bGVmdDoxMHB4O1x0cmlnaHQ6MTBweDtcdHBvaW50ZXItZXZlbnRzOiBub25lO30uY29udHJvbGxlciAucGxheSwuY29udHJvbGxlciAudm9sdW1lLC5jb250cm9sbGVyIC50aW1lLC5jb250cm9sbGVyIC5oZCwuY29udHJvbGxlciAuYWxsc2NyZWVuLC5jb250cm9sbGVyIC5ub3JtYWxzY3JlZW4sLmNvbnRyb2xsZXIgLmNvbW1lbnRzLWJ0biwuY29udHJvbGxlciAuZnVsbHNjcmVlbiB7XHRwYWRkaW5nLXRvcDo0cHg7XHRoZWlnaHQ6IDQ2cHg7XHRsaW5lLWhlaWdodDogNTBweDtcdHRleHQtYWxpZ246IGNlbnRlcjtcdGNvbG9yOiAjZWVlZWVlO1x0ZmxvYXQ6bGVmdDtcdHRleHQtc2hhZG93OjAgMCAycHggcmdiYSgwLDAsMCwwLjUpO1x0cG9pbnRlci1ldmVudHM6IGF1dG87fS5jb250cm9sbGVyIC5oZCwuY29udHJvbGxlciAuYWxsc2NyZWVuLC5jb250cm9sbGVyIC5ub3JtYWxzY3JlZW4sLmNvbnRyb2xsZXIgLmNvbW1lbnRzLWJ0biwuY29udHJvbGxlciAuZnVsbHNjcmVlbiB7XHRmbG9hdDpyaWdodDt9LmNvbnRyb2xsZXIgLnBsYXkge1x0d2lkdGg6IDM2cHg7XHRwYWRkaW5nLWxlZnQ6IDEwcHg7XHRjdXJzb3I6IHBvaW50ZXI7fS5jb250cm9sbGVyIC5wbGF5OmFmdGVyIHtcdGZvbnQtZmFtaWx5OiBcIkZvbnRBd2Vzb21lXCI7XHRjb250ZW50OiBcIlxcXFxmMDRjXCI7fS5jb250cm9sbGVyIC5wbGF5LnBhdXNlZDphZnRlciB7XHRjb250ZW50OiBcIlxcXFxmMDRiXCI7fS5jb250cm9sbGVyIC52b2x1bWUge1x0bWluLXdpZHRoOiAzMHB4O1x0cG9zaXRpb246IHJlbGF0aXZlO1x0b3ZlcmZsb3c6IGhpZGRlbjtcdC13ZWJraXQtdHJhbnNpdGlvbjogbWluLXdpZHRoIDAuM3MgZWFzZSAwLjVzO1x0LW1vei10cmFuc2l0aW9uOiBtaW4td2lkdGggMC4zcyBlYXNlIDAuNXM7XHR0cmFuc2l0aW9uOiBtaW4td2lkdGggMC4zcyBlYXNlIDAuNXM7fS5jb250cm9sbGVyIC52b2x1bWU6aG92ZXIge1x0bWluLXdpZHRoOiAxMjhweDt9LmNvbnRyb2xsZXIgLnZvbHVtZTpiZWZvcmUge1x0Zm9udC1mYW1pbHk6IFwiRm9udEF3ZXNvbWVcIjtcdGNvbnRlbnQ6IFwiXFxcXGYwMjhcIjtcdHdpZHRoOiAzNnB4O1x0ZGlzcGxheTogYmxvY2s7fS5jb250cm9sbGVyIC52b2x1bWUgLnByb2dyZXNzIHtcdHdpZHRoOiA3MHB4O1x0dG9wOiAyN3B4O1x0bGVmdDogNDBweDt9LmNvbnRyb2xsZXIgLnRpbWUge1x0Zm9udC1zaXplOiAxMnB4O1x0Zm9udC13ZWlnaHQ6IGJvbGQ7XHRwYWRkaW5nLWxlZnQ6IDEwcHg7fS5jb250cm9sbGVyIC50aW1lIC5jdXJyZW50IHtcdGNvbG9yOiAjREY2NTU4O30uY29udHJvbGxlciAuZnVsbHNjcmVlbiwuY29udHJvbGxlciAuYWxsc2NyZWVuLC5jb250cm9sbGVyIC5jb21tZW50cy1idG4sLmNvbnRyb2xsZXIgLm5vcm1hbHNjcmVlbiB7XHR3aWR0aDogMzZweDtcdGN1cnNvcjogcG9pbnRlcjt9LmNvbnRyb2xsZXIgLmNvbW1lbnRzLWJ0biB7XHRtYXJnaW4tcmlnaHQ6IC0xNXB4O1x0ZGlzcGxheTogbm9uZTt9LnBsYXllci5oYXMtY29tbWVudHMgLmNvbnRyb2xsZXIgLmNvbW1lbnRzLWJ0biB7XHRkaXNwbGF5OiBibG9jazt9LmNvbnRyb2xsZXIgLmNvbW1lbnRzLWJ0bjpiZWZvcmUge1x0Zm9udC1mYW1pbHk6IFwiRm9udEF3ZXNvbWVcIjtcdGNvbnRlbnQ6IFwiXFxcXGYwNzVcIjt9LmNvbnRyb2xsZXIgLmNvbW1lbnRzLWJ0bi5lbmFibGU6YmVmb3JlIHtcdGNvbG9yOiAjREY2NTU4O30uY29udHJvbGxlciAubm9ybWFsc2NyZWVuIHtcdGRpc3BsYXk6IG5vbmU7fS5wbGF5ZXI6LXdlYmtpdC1mdWxsLXNjcmVlbiAuY29udHJvbGxlciAuZnVsbHNjcmVlbiwucGxheWVyOi13ZWJraXQtZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgLmFsbHNjcmVlbiB7XHRkaXNwbGF5OiBub25lO30ucGxheWVyOi13ZWJraXQtZnVsbC1zY3JlZW4gLmNvbnRyb2xsZXIgLm5vcm1hbHNjcmVlbiwucGxheWVyLmFsbHNjcmVlbiAuY29udHJvbGxlciAubm9ybWFsc2NyZWVuIHtcdGRpc3BsYXk6IGJsb2NrO30ucGxheWVyLmFsbHNjcmVlbiAuY29udHJvbGxlciAuYWxsc2NyZWVuIHtcdGRpc3BsYXk6IG5vbmU7fS5jb250cm9sbGVyIC5mdWxsc2NyZWVuOmJlZm9yZSB7XHRmb250LWZhbWlseTogXCJGb250QXdlc29tZVwiO1x0Y29udGVudDogXCJcXFxcZjBiMlwiO30uY29udHJvbGxlciAuYWxsc2NyZWVuOmJlZm9yZSB7XHRmb250LWZhbWlseTogXCJGb250QXdlc29tZVwiO1x0Y29udGVudDogXCJcXFxcZjA2NVwiO30uY29udHJvbGxlciAubm9ybWFsc2NyZWVuOmJlZm9yZSB7XHRmb250LWZhbWlseTogXCJGb250QXdlc29tZVwiO1x0Y29udGVudDogXCJcXFxcZjA2NlwiO30uY29udHJvbGxlciAuaGQge1x0d2hpdGUtc3BhY2U6bm93cmFwO1x0b3ZlcmZsb3c6IGhpZGRlbjtcdG1hcmdpbi1yaWdodDogMTBweDtcdHRleHQtYWxpZ246IHJpZ2h0O30uY29udHJvbGxlciAuaGQ6aG92ZXIgbGkge1x0bWF4LXdpZHRoOiAzMDBweDt9LmNvbnRyb2xsZXIgLmhkIGxpIHtcdGRpc3BsYXk6IGlubGluZS1ibG9jaztcdG1heC13aWR0aDogMHB4O1x0LXdlYmtpdC10cmFuc2l0aW9uOiBtYXgtd2lkdGggMC44cyBlYXNlIDAuM3M7XHQtbW96LXRyYW5zaXRpb246IG1heC13aWR0aCAwLjhzIGVhc2UgMC4zcztcdHRyYW5zaXRpb246IG1heC13aWR0aCAwLjhzIGVhc2UgMC4zcztcdG92ZXJmbG93OiBoaWRkZW47XHRmb250LXNpemU6IDE0cHg7XHRmb250LXdlaWdodDogYm9sZDtcdHBvc2l0aW9uOiByZWxhdGl2ZTtcdGN1cnNvcjogcG9pbnRlcjt9LmNvbnRyb2xsZXIgLmhkIGxpOmJlZm9yZSB7XHRjb250ZW50OiBcIlwiO1x0ZGlzcGxheTogaW5saW5lLWJsb2NrO1x0d2lkdGg6MjBweDt9LmNvbnRyb2xsZXIgLmhkIGxpOmJlZm9yZSB7XHRjb250ZW50OiBcIlwiO1x0ZGlzcGxheTogaW5saW5lLWJsb2NrO1x0d2lkdGg6MjBweDt9LmNvbnRyb2xsZXIgLmhkIGxpLmN1cnIge1x0bWF4LXdpZHRoOiAzMDBweDtcdGN1cnNvcjogZGVmYXVsdDtcdGNvbG9yOiAjREY2NTU4O30uY29udHJvbGxlciAuaGQgbGkuY3VycjphZnRlciB7XHRjb250ZW50OiBcIlwiO1x0ZGlzcGxheTogYmxvY2s7XHRwb3NpdGlvbjogYWJzb2x1dGU7XHR3aWR0aDo0cHg7XHRoZWlnaHQ6NHB4O1x0Ym9yZGVyLXJhZGl1czogNTAlO1x0YmFja2dyb3VuZDogI2ZmZmZmZjtcdGxlZnQ6IDEycHg7XHR0b3A6IDIzcHg7XHRvcGFjaXR5OiAwO1x0LXdlYmtpdC10cmFuc2l0aW9uOiBvcGFjaXR5IDAuNXMgZWFzZSAwLjNzO1x0LW1vei10cmFuc2l0aW9uOiBvcGFjaXR5IDAuNXMgZWFzZSAwLjNzO1x0dHJhbnNpdGlvbjogb3BhY2l0eSAwLjVzIGVhc2UgMC4zczt9J30se31dLDEzOltmdW5jdGlvbihlLHQpe3QuZXhwb3J0cz0nPGRpdiBjbGFzcz1cInBsYXllclwiPlx0PGRpdiBjbGFzcz1cInZpZGVvLWZyYW1lXCI+PHZpZGVvIGNsYXNzPVwidmlkZW9cIiBhdXRvcGxheT1cImF1dG9wbGF5XCI+PC92aWRlbz48Y2FudmFzIGNsYXNzPVwiY29tbWVudHNcIj48L2NhbnZhcz48L2Rpdj5cdDxkaXYgY2xhc3M9XCJjb250cm9sbGVyXCI+XHRcdDxkaXYgY2xhc3M9XCJsb2FkaW5nLWljb24gZmEgZmEtc3BpbiBmYS1jaXJjbGUtby1ub3RjaFwiPjwvZGl2Plx0XHQ8ZGl2IGNsYXNzPVwicHJvZ3Jlc3NcIj5cdFx0XHQ8ZGl2IGNsYXNzPVwiYW5jaG9yIGJ1ZmZlcmVkX2FuY2hvclwiIHN0eWxlPVwid2lkdGg6MCVcIj48L2Rpdj5cdFx0XHQ8ZGl2IGNsYXNzPVwiYW5jaG9yIHByb2dyZXNzX2FuY2hvclwiIHN0eWxlPVwid2lkdGg6MCVcIj48L2Rpdj5cdFx0PC9kaXY+XHRcdDxkaXYgY2xhc3M9XCJyaWdodFwiPlx0XHQgXHRcdFx0IFx0PGRpdiBjbGFzcz1cImZ1bGxzY3JlZW5cIj48L2Rpdj5cdFx0IFx0PGRpdiBjbGFzcz1cImFsbHNjcmVlblwiPjwvZGl2Plx0XHQgXHQ8ZGl2IGNsYXNzPVwibm9ybWFsc2NyZWVuXCI+PC9kaXY+XHRcdCBcdDx1bCBjbGFzcz1cImhkXCI+PC91bD5cdFx0IFx0PGRpdiBjbGFzcz1cImNvbW1lbnRzLWJ0blwiPjwvZGl2Plx0XHQgPC9kaXY+XHRcdCA8ZGl2IGNsYXNzPVwibGVmdFwiPlx0XHQgXHQ8ZGl2IGNsYXNzPVwicGxheSBwYXVzZWRcIj48L2Rpdj5cdFx0IFx0PGRpdiBjbGFzcz1cInZvbHVtZVwiPlx0XHRcdCBcdDxkaXYgY2xhc3M9XCJwcm9ncmVzc1wiPlx0XHRcdCBcdFx0PGRpdiBjbGFzcz1cImFuY2hvciB2b2x1bWVfYW5jaG9yXCIgc3R5bGU9XCJ3aWR0aDowJVwiPjwvZGl2Plx0XHQgXHRcdDwvZGl2Plx0XHQgXHQ8L2Rpdj5cdFx0IFx0PGRpdiBjbGFzcz1cInRpbWVcIj5cdFx0IFx0XHQ8c3BhbiBjbGFzcz1cImN1cnJlbnRcIj4wMDowMDowMDwvc3Bhbj4gLyA8c3BhbiBjbGFzcz1cImR1cmF0aW9uXCI+MDA6MDA6MDA8L3NwYW4+XHRcdCBcdDwvZGl2Plx0XHQgPC9kaXY+XHQ8L2Rpdj48L2Rpdj4nfSx7fV0sMTQ6W2Z1bmN0aW9uKGUsdCl7ZnVuY3Rpb24gbihlLHQpe3JldHVybihBcnJheSh0KS5qb2luKDApK2UpLnNsaWNlKC10KX1mdW5jdGlvbiBpKGUpe3ZhciB0LGk9W107cmV0dXJuWzM2MDAsNjAsMV0uZm9yRWFjaChmdW5jdGlvbihvKXtpLnB1c2gobih0PWUvb3wwLDIpKSxlLT10Km99KSxpLmpvaW4oXCI6XCIpfXQuZXhwb3J0cz1pfSx7fV19LHt9LFsxMF0pO1xuXG4vL2V4cG9ydHNcbm1vZHVsZS5leHBvcnRzID0gTUFNQVBsYXllcjsiLCIvKlxuICogUHVybCAoQSBKYXZhU2NyaXB0IFVSTCBwYXJzZXIpIHYyLjMuMVxuICogRGV2ZWxvcGVkIGFuZCBtYWludGFuaW5lZCBieSBNYXJrIFBlcmtpbnMsIG1hcmtAYWxsbWFya2VkdXAuY29tXG4gKiBTb3VyY2UgcmVwb3NpdG9yeTogaHR0cHM6Ly9naXRodWIuY29tL2FsbG1hcmtlZHVwL2pRdWVyeS1VUkwtUGFyc2VyXG4gKiBMaWNlbnNlZCB1bmRlciBhbiBNSVQtc3R5bGUgbGljZW5zZS4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9hbGxtYXJrZWR1cC9qUXVlcnktVVJMLVBhcnNlci9ibG9iL21hc3Rlci9MSUNFTlNFIGZvciBkZXRhaWxzLlxuICovXG5cbnZhciB0YWcyYXR0ciA9IHtcbiAgICAgICAgYSAgICAgICA6ICdocmVmJyxcbiAgICAgICAgaW1nICAgICA6ICdzcmMnLFxuICAgICAgICBmb3JtICAgIDogJ2FjdGlvbicsXG4gICAgICAgIGJhc2UgICAgOiAnaHJlZicsXG4gICAgICAgIHNjcmlwdCAgOiAnc3JjJyxcbiAgICAgICAgaWZyYW1lICA6ICdzcmMnLFxuICAgICAgICBsaW5rICAgIDogJ2hyZWYnLFxuICAgICAgICBlbWJlZCAgIDogJ3NyYycsXG4gICAgICAgIG9iamVjdCAgOiAnZGF0YSdcbiAgICB9LFxuXG4gICAga2V5ID0gWydzb3VyY2UnLCAncHJvdG9jb2wnLCAnYXV0aG9yaXR5JywgJ3VzZXJJbmZvJywgJ3VzZXInLCAncGFzc3dvcmQnLCAnaG9zdCcsICdwb3J0JywgJ3JlbGF0aXZlJywgJ3BhdGgnLCAnZGlyZWN0b3J5JywgJ2ZpbGUnLCAncXVlcnknLCAnZnJhZ21lbnQnXSwgLy8ga2V5cyBhdmFpbGFibGUgdG8gcXVlcnlcblxuICAgIGFsaWFzZXMgPSB7ICdhbmNob3InIDogJ2ZyYWdtZW50JyB9LCAvLyBhbGlhc2VzIGZvciBiYWNrd2FyZHMgY29tcGF0YWJpbGl0eVxuXG4gICAgcGFyc2VyID0ge1xuICAgICAgICBzdHJpY3QgOiAvXig/OihbXjpcXC8/I10rKTopPyg/OlxcL1xcLygoPzooKFteOkBdKik6PyhbXjpAXSopKT9AKT8oW146XFwvPyNdKikoPzo6KFxcZCopKT8pKT8oKCgoPzpbXj8jXFwvXSpcXC8pKikoW14/I10qKSkoPzpcXD8oW14jXSopKT8oPzojKC4qKSk/KS8sICAvL2xlc3MgaW50dWl0aXZlLCBtb3JlIGFjY3VyYXRlIHRvIHRoZSBzcGVjc1xuICAgICAgICBsb29zZSA6ICAvXig/Oig/IVteOkBdKzpbXjpAXFwvXSpAKShbXjpcXC8/Iy5dKyk6KT8oPzpcXC9cXC8pPygoPzooKFteOkBdKik6PyhbXjpAXSopKT9AKT8oW146XFwvPyNdKikoPzo6KFxcZCopKT8pKCgoXFwvKD86W14/I10oPyFbXj8jXFwvXSpcXC5bXj8jXFwvLl0rKD86Wz8jXXwkKSkpKlxcLz8pPyhbXj8jXFwvXSopKSg/OlxcPyhbXiNdKikpPyg/OiMoLiopKT8pLyAvLyBtb3JlIGludHVpdGl2ZSwgZmFpbHMgb24gcmVsYXRpdmUgcGF0aHMgYW5kIGRldmlhdGVzIGZyb20gc3BlY3NcbiAgICB9LFxuXG4gICAgaXNpbnQgPSAvXlswLTldKyQvO1xuXG5mdW5jdGlvbiBwYXJzZVVyaSggdXJsLCBzdHJpY3RNb2RlICkge1xuICAgIHZhciBzdHIgPSBkZWNvZGVVUkkoIHVybCApLFxuICAgIHJlcyAgID0gcGFyc2VyWyBzdHJpY3RNb2RlIHx8IGZhbHNlID8gJ3N0cmljdCcgOiAnbG9vc2UnIF0uZXhlYyggc3RyICksXG4gICAgdXJpID0geyBhdHRyIDoge30sIHBhcmFtIDoge30sIHNlZyA6IHt9IH0sXG4gICAgaSAgID0gMTQ7XG5cbiAgICB3aGlsZSAoIGktLSApIHtcbiAgICAgICAgdXJpLmF0dHJbIGtleVtpXSBdID0gcmVzW2ldIHx8ICcnO1xuICAgIH1cblxuICAgIC8vIGJ1aWxkIHF1ZXJ5IGFuZCBmcmFnbWVudCBwYXJhbWV0ZXJzXG4gICAgdXJpLnBhcmFtWydxdWVyeSddID0gcGFyc2VTdHJpbmcodXJpLmF0dHJbJ3F1ZXJ5J10pO1xuICAgIHVyaS5wYXJhbVsnZnJhZ21lbnQnXSA9IHBhcnNlU3RyaW5nKHVyaS5hdHRyWydmcmFnbWVudCddKTtcblxuICAgIC8vIHNwbGl0IHBhdGggYW5kIGZyYWdlbWVudCBpbnRvIHNlZ21lbnRzXG4gICAgdXJpLnNlZ1sncGF0aCddID0gdXJpLmF0dHIucGF0aC5yZXBsYWNlKC9eXFwvK3xcXC8rJC9nLCcnKS5zcGxpdCgnLycpO1xuICAgIHVyaS5zZWdbJ2ZyYWdtZW50J10gPSB1cmkuYXR0ci5mcmFnbWVudC5yZXBsYWNlKC9eXFwvK3xcXC8rJC9nLCcnKS5zcGxpdCgnLycpO1xuXG4gICAgLy8gY29tcGlsZSBhICdiYXNlJyBkb21haW4gYXR0cmlidXRlXG4gICAgdXJpLmF0dHJbJ2Jhc2UnXSA9IHVyaS5hdHRyLmhvc3QgPyAodXJpLmF0dHIucHJvdG9jb2wgPyAgdXJpLmF0dHIucHJvdG9jb2wrJzovLycrdXJpLmF0dHIuaG9zdCA6IHVyaS5hdHRyLmhvc3QpICsgKHVyaS5hdHRyLnBvcnQgPyAnOicrdXJpLmF0dHIucG9ydCA6ICcnKSA6ICcnO1xuXG4gICAgcmV0dXJuIHVyaTtcbn1cblxuZnVuY3Rpb24gZ2V0QXR0ck5hbWUoIGVsbSApIHtcbiAgICB2YXIgdG4gPSBlbG0udGFnTmFtZTtcbiAgICBpZiAoIHR5cGVvZiB0biAhPT0gJ3VuZGVmaW5lZCcgKSByZXR1cm4gdGFnMmF0dHJbdG4udG9Mb3dlckNhc2UoKV07XG4gICAgcmV0dXJuIHRuO1xufVxuXG5mdW5jdGlvbiBwcm9tb3RlKHBhcmVudCwga2V5KSB7XG4gICAgaWYgKHBhcmVudFtrZXldLmxlbmd0aCA9PT0gMCkgcmV0dXJuIHBhcmVudFtrZXldID0ge307XG4gICAgdmFyIHQgPSB7fTtcbiAgICBmb3IgKHZhciBpIGluIHBhcmVudFtrZXldKSB0W2ldID0gcGFyZW50W2tleV1baV07XG4gICAgcGFyZW50W2tleV0gPSB0O1xuICAgIHJldHVybiB0O1xufVxuXG5mdW5jdGlvbiBwYXJzZShwYXJ0cywgcGFyZW50LCBrZXksIHZhbCkge1xuICAgIHZhciBwYXJ0ID0gcGFydHMuc2hpZnQoKTtcbiAgICBpZiAoIXBhcnQpIHtcbiAgICAgICAgaWYgKGlzQXJyYXkocGFyZW50W2tleV0pKSB7XG4gICAgICAgICAgICBwYXJlbnRba2V5XS5wdXNoKHZhbCk7XG4gICAgICAgIH0gZWxzZSBpZiAoJ29iamVjdCcgPT0gdHlwZW9mIHBhcmVudFtrZXldKSB7XG4gICAgICAgICAgICBwYXJlbnRba2V5XSA9IHZhbDtcbiAgICAgICAgfSBlbHNlIGlmICgndW5kZWZpbmVkJyA9PSB0eXBlb2YgcGFyZW50W2tleV0pIHtcbiAgICAgICAgICAgIHBhcmVudFtrZXldID0gdmFsO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50W2tleV0gPSBbcGFyZW50W2tleV0sIHZhbF07XG4gICAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgb2JqID0gcGFyZW50W2tleV0gPSBwYXJlbnRba2V5XSB8fCBbXTtcbiAgICAgICAgaWYgKCddJyA9PSBwYXJ0KSB7XG4gICAgICAgICAgICBpZiAoaXNBcnJheShvYmopKSB7XG4gICAgICAgICAgICAgICAgaWYgKCcnICE9PSB2YWwpIG9iai5wdXNoKHZhbCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCdvYmplY3QnID09IHR5cGVvZiBvYmopIHtcbiAgICAgICAgICAgICAgICBvYmpba2V5cyhvYmopLmxlbmd0aF0gPSB2YWw7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIG9iaiA9IHBhcmVudFtrZXldID0gW3BhcmVudFtrZXldLCB2YWxdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKH5wYXJ0LmluZGV4T2YoJ10nKSkge1xuICAgICAgICAgICAgcGFydCA9IHBhcnQuc3Vic3RyKDAsIHBhcnQubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgICBpZiAoIWlzaW50LnRlc3QocGFydCkgJiYgaXNBcnJheShvYmopKSBvYmogPSBwcm9tb3RlKHBhcmVudCwga2V5KTtcbiAgICAgICAgICAgIHBhcnNlKHBhcnRzLCBvYmosIHBhcnQsIHZhbCk7XG4gICAgICAgICAgICAvLyBrZXlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGlmICghaXNpbnQudGVzdChwYXJ0KSAmJiBpc0FycmF5KG9iaikpIG9iaiA9IHByb21vdGUocGFyZW50LCBrZXkpO1xuICAgICAgICAgICAgcGFyc2UocGFydHMsIG9iaiwgcGFydCwgdmFsKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbWVyZ2UocGFyZW50LCBrZXksIHZhbCkge1xuICAgIGlmICh+a2V5LmluZGV4T2YoJ10nKSkge1xuICAgICAgICB2YXIgcGFydHMgPSBrZXkuc3BsaXQoJ1snKTtcbiAgICAgICAgcGFyc2UocGFydHMsIHBhcmVudCwgJ2Jhc2UnLCB2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghaXNpbnQudGVzdChrZXkpICYmIGlzQXJyYXkocGFyZW50LmJhc2UpKSB7XG4gICAgICAgICAgICB2YXIgdCA9IHt9O1xuICAgICAgICAgICAgZm9yICh2YXIgayBpbiBwYXJlbnQuYmFzZSkgdFtrXSA9IHBhcmVudC5iYXNlW2tdO1xuICAgICAgICAgICAgcGFyZW50LmJhc2UgPSB0O1xuICAgICAgICB9XG4gICAgICAgIGlmIChrZXkgIT09ICcnKSB7XG4gICAgICAgICAgICBzZXQocGFyZW50LmJhc2UsIGtleSwgdmFsKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGFyZW50O1xufVxuXG5mdW5jdGlvbiBwYXJzZVN0cmluZyhzdHIpIHtcbiAgICByZXR1cm4gcmVkdWNlKFN0cmluZyhzdHIpLnNwbGl0KC8mfDsvKSwgZnVuY3Rpb24ocmV0LCBwYWlyKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBwYWlyID0gZGVjb2RlVVJJQ29tcG9uZW50KHBhaXIucmVwbGFjZSgvXFwrL2csICcgJykpO1xuICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgIC8vIGlnbm9yZVxuICAgICAgICB9XG4gICAgICAgIHZhciBlcWwgPSBwYWlyLmluZGV4T2YoJz0nKSxcbiAgICAgICAgICAgIGJyYWNlID0gbGFzdEJyYWNlSW5LZXkocGFpciksXG4gICAgICAgICAgICBrZXkgPSBwYWlyLnN1YnN0cigwLCBicmFjZSB8fCBlcWwpLFxuICAgICAgICAgICAgdmFsID0gcGFpci5zdWJzdHIoYnJhY2UgfHwgZXFsLCBwYWlyLmxlbmd0aCk7XG5cbiAgICAgICAgdmFsID0gdmFsLnN1YnN0cih2YWwuaW5kZXhPZignPScpICsgMSwgdmFsLmxlbmd0aCk7XG5cbiAgICAgICAgaWYgKGtleSA9PT0gJycpIHtcbiAgICAgICAgICAgIGtleSA9IHBhaXI7XG4gICAgICAgICAgICB2YWwgPSAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBtZXJnZShyZXQsIGtleSwgdmFsKTtcbiAgICB9LCB7IGJhc2U6IHt9IH0pLmJhc2U7XG59XG5cbmZ1bmN0aW9uIHNldChvYmosIGtleSwgdmFsKSB7XG4gICAgdmFyIHYgPSBvYmpba2V5XTtcbiAgICBpZiAodHlwZW9mIHYgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIG9ialtrZXldID0gdmFsO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheSh2KSkge1xuICAgICAgICB2LnB1c2godmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBvYmpba2V5XSA9IFt2LCB2YWxdO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gbGFzdEJyYWNlSW5LZXkoc3RyKSB7XG4gICAgdmFyIGxlbiA9IHN0ci5sZW5ndGgsXG4gICAgICAgIGJyYWNlLFxuICAgICAgICBjO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpIHtcbiAgICAgICAgYyA9IHN0cltpXTtcbiAgICAgICAgaWYgKCddJyA9PSBjKSBicmFjZSA9IGZhbHNlO1xuICAgICAgICBpZiAoJ1snID09IGMpIGJyYWNlID0gdHJ1ZTtcbiAgICAgICAgaWYgKCc9JyA9PSBjICYmICFicmFjZSkgcmV0dXJuIGk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiByZWR1Y2Uob2JqLCBhY2N1bXVsYXRvcil7XG4gICAgdmFyIGkgPSAwLFxuICAgICAgICBsID0gb2JqLmxlbmd0aCA+PiAwLFxuICAgICAgICBjdXJyID0gYXJndW1lbnRzWzJdO1xuICAgIHdoaWxlIChpIDwgbCkge1xuICAgICAgICBpZiAoaSBpbiBvYmopIGN1cnIgPSBhY2N1bXVsYXRvci5jYWxsKHVuZGVmaW5lZCwgY3Vyciwgb2JqW2ldLCBpLCBvYmopO1xuICAgICAgICArK2k7XG4gICAgfVxuICAgIHJldHVybiBjdXJyO1xufVxuXG5mdW5jdGlvbiBpc0FycmF5KHZBcmcpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHZBcmcpID09PSBcIltvYmplY3QgQXJyYXldXCI7XG59XG5cbmZ1bmN0aW9uIGtleXMob2JqKSB7XG4gICAgdmFyIGtleV9hcnJheSA9IFtdO1xuICAgIGZvciAoIHZhciBwcm9wIGluIG9iaiApIHtcbiAgICAgICAgaWYgKCBvYmouaGFzT3duUHJvcGVydHkocHJvcCkgKSBrZXlfYXJyYXkucHVzaChwcm9wKTtcbiAgICB9XG4gICAgcmV0dXJuIGtleV9hcnJheTtcbn1cblxuZnVuY3Rpb24gcHVybCggdXJsLCBzdHJpY3RNb2RlICkge1xuICAgIGlmICggYXJndW1lbnRzLmxlbmd0aCA9PT0gMSAmJiB1cmwgPT09IHRydWUgKSB7XG4gICAgICAgIHN0cmljdE1vZGUgPSB0cnVlO1xuICAgICAgICB1cmwgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIHN0cmljdE1vZGUgPSBzdHJpY3RNb2RlIHx8IGZhbHNlO1xuICAgIHVybCA9IHVybCB8fCB3aW5kb3cubG9jYXRpb24udG9TdHJpbmcoKTtcblxuICAgIHJldHVybiB7XG5cbiAgICAgICAgZGF0YSA6IHBhcnNlVXJpKHVybCwgc3RyaWN0TW9kZSksXG5cbiAgICAgICAgLy8gZ2V0IHZhcmlvdXMgYXR0cmlidXRlcyBmcm9tIHRoZSBVUklcbiAgICAgICAgYXR0ciA6IGZ1bmN0aW9uKCBhdHRyICkge1xuICAgICAgICAgICAgYXR0ciA9IGFsaWFzZXNbYXR0cl0gfHwgYXR0cjtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYXR0ciAhPT0gJ3VuZGVmaW5lZCcgPyB0aGlzLmRhdGEuYXR0clthdHRyXSA6IHRoaXMuZGF0YS5hdHRyO1xuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHJldHVybiBxdWVyeSBzdHJpbmcgcGFyYW1ldGVyc1xuICAgICAgICBwYXJhbSA6IGZ1bmN0aW9uKCBwYXJhbSApIHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgcGFyYW0gIT09ICd1bmRlZmluZWQnID8gdGhpcy5kYXRhLnBhcmFtLnF1ZXJ5W3BhcmFtXSA6IHRoaXMuZGF0YS5wYXJhbS5xdWVyeTtcbiAgICAgICAgfSxcblxuICAgICAgICAvLyByZXR1cm4gZnJhZ21lbnQgcGFyYW1ldGVyc1xuICAgICAgICBmcGFyYW0gOiBmdW5jdGlvbiggcGFyYW0gKSB7XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHBhcmFtICE9PSAndW5kZWZpbmVkJyA/IHRoaXMuZGF0YS5wYXJhbS5mcmFnbWVudFtwYXJhbV0gOiB0aGlzLmRhdGEucGFyYW0uZnJhZ21lbnQ7XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy8gcmV0dXJuIHBhdGggc2VnbWVudHNcbiAgICAgICAgc2VnbWVudCA6IGZ1bmN0aW9uKCBzZWcgKSB7XG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBzZWcgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEuc2VnLnBhdGg7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNlZyA9IHNlZyA8IDAgPyB0aGlzLmRhdGEuc2VnLnBhdGgubGVuZ3RoICsgc2VnIDogc2VnIC0gMTsgLy8gbmVnYXRpdmUgc2VnbWVudHMgY291bnQgZnJvbSB0aGUgZW5kXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5zZWcucGF0aFtzZWddO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIHJldHVybiBmcmFnbWVudCBzZWdtZW50c1xuICAgICAgICBmc2VnbWVudCA6IGZ1bmN0aW9uKCBzZWcgKSB7XG4gICAgICAgICAgICBpZiAoIHR5cGVvZiBzZWcgPT09ICd1bmRlZmluZWQnICkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEuc2VnLmZyYWdtZW50O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWcgPSBzZWcgPCAwID8gdGhpcy5kYXRhLnNlZy5mcmFnbWVudC5sZW5ndGggKyBzZWcgOiBzZWcgLSAxOyAvLyBuZWdhdGl2ZSBzZWdtZW50cyBjb3VudCBmcm9tIHRoZSBlbmRcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhLnNlZy5mcmFnbWVudFtzZWddO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9O1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0gcHVybDtcbiIsIi8qICDvvINmdW5jdGlvbiBxdWVyeVN0cmluZyNcbiAqICA8IE9iamVjdCAgIOS+i+WmgiB7YToxLGI6MixjOjN9XG4gKiAgPiBTdHJpbmcgICDkvovlpoIgYT0xJmI9MiZjPTNcbiAqICDnlKjkuo7mi7zoo4V1cmzlnLDlnYDnmoRxdWVyeVxuICovXG5mdW5jdGlvbiBxdWVyeVN0cmluZyAob2JqKSB7XG5cdHZhciBxdWVyeSA9IFtdXG5cdGZvciAob25lIGluIG9iaikge1xuXHRcdGlmIChvYmouaGFzT3duUHJvcGVydHkob25lKSkge1xuXHRcdFx0cXVlcnkucHVzaChbb25lLCBvYmpbb25lXV0uam9pbignPScpKVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gcXVlcnkuam9pbignJicpXG59XG5tb2R1bGUuZXhwb3J0cyA9IHF1ZXJ5U3RyaW5nIiwiLyogIDkxcG9ybiBcbiAqICBAU25vb3plIDIwMTUtNy0yNlxuICovXG52YXIgY2FuUGxheU0zVTggPSByZXF1aXJlKCcuL2NhblBsYXlNM1U4JylcbnZhciBhamF4ICAgICAgICA9IHJlcXVpcmUoJy4vYWpheCcpXG52YXIgbG9nICAgICAgICAgPSByZXF1aXJlKCcuL2xvZycpXG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAodXJsKSB7XG5cdGlmICh3aW5kb3cuc28gJiYgd2luZG93LnNvLnZhcmlhYmxlcykge1xuXHRcdHZhciBmaWxlSWQgPSB3aW5kb3cuc28udmFyaWFibGVzLmZpbGVcblx0XHR2YXIgc2VjQ29kZSA9IHdpbmRvdy5zby52YXJpYWJsZXMuc2VjY29kZVxuXHRcdHZhciBtYXhfdmlkID0gd2luZG93LnNvLnZhcmlhYmxlcy5tYXhfdmlkXG5cdFx0cmV0dXJuICEhZmlsZUlkICYgISFzZWNDb2RlICYgISFtYXhfdmlkICYgXG5cdFx0XHQvdmlld192aWRlb1xcLnBocFxcP3ZpZXdrZXkvLnRlc3QoIHVybC5hdHRyKCdzb3VyY2UnKSApXG5cdH1cblx0cmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XHRcblx0Ly92YXIgbWVkaWFTcGFjZUhUTUwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1lZGlhc3BhY2VcIikuaW5uZXJIVE1MXG5cdC8vdmFyIGZpbGVJZCA9IC9maWxlJywnKC4qPyknL2kuZXhlYyhtZWRpYVNwYWNlSFRNTClbMV1cblx0Ly92YXIgc2VjQ29kZSA9IC9zZWNjb2RlJywnKC4qPyknL2kuZXhlYyhtZWRpYVNwYWNlSFRNTClbMV1cblx0Ly92YXIgbWF4X3ZpZCA9IC9tYXhfYmlkJywnKC4qPyknL2kuZXhlYyhtZWRpYVNwYWNlSFRNTClbMV1cblx0dmFyIGZpbGVJZCA9IHdpbmRvdy5zby52YXJpYWJsZXMuZmlsZVxuXHR2YXIgc2VjQ29kZSA9IHdpbmRvdy5zby52YXJpYWJsZXMuc2VjY29kZVxuXHR2YXIgbWF4X3ZpZCA9IHdpbmRvdy5zby52YXJpYWJsZXMubWF4X3ZpZFxuXHRcblxuXHR2YXIgbXA0ID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuXHRcdGFqYXgoe1xuXHRcdFx0dXJsOiAnaHR0cDovL3d3dy45MXBvcm4uY29tL2dldGZpbGUucGhwJyxcblx0XHRcdGpzb25wOiBmYWxzZSxcblx0XHRcdHBhcmFtOiB7XG5cdFx0XHRcdFZJRDogZmlsZUlkLFxuXHRcdFx0XHRtcDQ6ICcwJyxcblx0XHRcdFx0c2VjY29kZTogc2VjQ29kZSxcblx0XHRcdFx0bWF4X3ZpZDogbWF4X3ZpZFxuXHRcdFx0fSxcblx0XHRcdGNvbnRlbnRUeXBlOiAnbm90SlNPTicsXG5cdFx0XHRjYWxsYmFjazogZnVuY3Rpb24ocGFyYW0pe1xuXHRcdFx0XHRpZihwYXJhbSA9PSAtMSB8fCBwYXJhbS5jb2RlID09IC0xKSByZXR1cm4gbG9nKCfop6PmnpA5MXBvcm7op4bpopHlnLDlnYDlpLHotKUnKVxuXHRcdFx0XHRtcDRVcmwgPSBwYXJhbS5zcGxpdCgnPScpWzFdLnNwbGl0KCcmJylbMF1cblx0XHRcdFx0dmFyIHVybHMgPSBbXVxuXHRcdFx0XHR1cmxzLnB1c2goWyfkvY7muIXniYgnLCBtcDRVcmxdKVxuXHRcdFx0XHRsb2coJ+ino+aekDkxcG9ybuinhumikeWcsOWdgOaIkOWKnyAnICsgdXJscy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtyZXR1cm4gJzxhIGhyZWY9JytpdGVtWzFdKyc+JytpdGVtWzBdKyc8L2E+J30pLmpvaW4oJyAnKSwgMilcblx0XHRcdFx0Ly8gY29uc29sZS5pbmZvKHVybHMpXG5cdFx0XHRcdHJldHVybiBjYWxsYmFjayh1cmxzKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fTtcblx0bXA0KGNhbGxiYWNrKVxufVxuXG5cblxuIiwiLyogIGFjZnVuXG4gKiAgQHpoYW5nZ2VcbiAqL1xudmFyIHB1cmwgICAgICA9IHJlcXVpcmUoJy4vcHVybCcpO1xudmFyIGxvZyAgICAgICA9IHJlcXVpcmUoJy4vbG9nJyk7XG52YXIgYWpheCAgICAgICAgPSByZXF1aXJlKCcuL2FqYXgnKTtcbnZhciBpc01vYmlsZTtcblxuZXhwb3J0cy5tYXRjaCA9IGZ1bmN0aW9uICh1cmwpIHtcbiAgICBpZiAoIHVybC5hdHRyKCdob3N0JykuaW5kZXhPZignYWNmdW4udHYnKSA+PSAwKSB7XG4gICAgICAgIGlmICgvXi4qXFwvdlxcL2FjXFxkKyQvLnRlc3QodXJsLmF0dHIoJ3BhdGgnKSkpIHtcbiAgICAgICAgICAgIGlzTW9iaWxlID0gZmFsc2U7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodXJsLnBhcmFtKCdhYycpKSB7XG4gICAgICAgICAgICBpc01vYmlsZSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5mdW5jdGlvbiBnZXRBdih1cmwpIHtcbiAgICBpZiAoaXNNb2JpbGUpIHtcbiAgICAgICAgcmV0dXJuIHVybC5wYXJhbSgnYWMnKTtcbiAgICB9XG4gICAgcmV0dXJuIHVybC5hdHRyKCdwYXRoJykubWF0Y2goL14uKlxcL3ZcXC9hYyhcXGQrKS4qJC8pWzFdO1xufVxuXG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG4gICAgbG9nKCflvIDlp4vop6PmnpBhY2Z1buWcsOWdgGJ5IHpoYW5nZ2UnKTtcbiAgICB2YXIgYXYgPSBnZXRBdih1cmwpO1xuICAgIHZhciBzb3VyY2VVcmwgPSBcImh0dHA6Ly9hcGkuYWl4aWZhbi5jb20vdmlkZW9zL1wiICsgYXY7XG4gICAgYWpheCgge1xuICAgICAgICB1cmw6IHNvdXJjZVVybCxcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgJ2RldmljZVR5cGUnOiBcIjFcIlxuICAgICAgICB9LFxuICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgaWYgKGRhdGEuY29kZSA9PSAyMDApIHtcbiAgICAgICAgICAgICAgICB2YXIgc291cmNkSWQgPSBkYXRhLmRhdGEudmlkZW9zWzBdLnNvdXJjZUlkO1xuICAgICAgICAgICAgICAgIHZhciByZWFsVXJsID0gXCJodHRwOi8vYXBpLmFpeGlmYW4uY29tL3BsYXlzL1wiICsgc291cmNkSWQgKyBcIi9yZWFsU291cmNlXCI7XG4gICAgICAgICAgICAgICAgYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogcmVhbFVybCxcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2RldmljZVR5cGUnOiAnMSdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2s6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmNvZGUgPT0gMjAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVybHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmRhdGEuZmlsZXMucmV2ZXJzZSgpLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmxzLnB1c2goW2l0ZW0uZGVzY3JpcHRpb24sIGl0ZW0udXJsWzBdXSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2FsbGJhY2sodXJscylcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59OyIsIi8qICBiaWxpYmxpIFxuICogIEDmnLHkuIBcbiAqL1xudmFyIHB1cmwgICAgICA9IHJlcXVpcmUoJy4vcHVybCcpXG52YXIgbG9nICAgICAgID0gcmVxdWlyZSgnLi9sb2cnKVxudmFyIGh0dHBQcm94eSA9IHJlcXVpcmUoJy4vaHR0cFByb3h5JylcblxuZnVuY3Rpb24gcGFkKG51bSwgbikgeyBcblx0cmV0dXJuIChBcnJheShuKS5qb2luKDApICsgbnVtKS5zbGljZSgtbilcbn1cblxuZXhwb3J0cy5tYXRjaCA9IGZ1bmN0aW9uICh1cmwpIHtcblx0cmV0dXJuIHVybC5hdHRyKCdob3N0JykuaW5kZXhPZignYmlsaWJpbGknKSA+PSAwICYmIC9eXFwvdmlkZW9cXC9hdlxcZCtcXC8kLy50ZXN0KHVybC5hdHRyKCdkaXJlY3RvcnknKSlcbn1cblxuZXhwb3J0cy5nZXRWaWRlb3MgPSBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaykge1xuXHRsb2coJ+W8gOWni+ino+aekGJpbGlibGnop4bpopHlnLDlnYAnKVxuXHR2YXIgYWlkID0gdXJsLmF0dHIoJ2RpcmVjdG9yeScpLm1hdGNoKC9eXFwvdmlkZW9cXC9hdihcXGQrKVxcLyQvKVsxXVxuXHR2YXIgcGFnZSA9IChmdW5jdGlvbiAoKSB7XG5cdFx0cGFnZU1hdGNoID0gdXJsLmF0dHIoJ2ZpbGUnKS5tYXRjaCgvXmluZGV4XFxfKFxcZCspXFwuaHRtbCQvKVxuXHRcdHJldHVybiBwYWdlTWF0Y2ggPyBwYWdlTWF0Y2hbMV0gOiAxXG5cdH0oKSlcblx0aHR0cFByb3h5KFxuXHRcdCdodHRwOi8vd3d3LmJpbGliaWxpLmNvbS9tL2h0bWw1JywgXG5cdFx0J2dldCcsIFxuXHRcdHthaWQ6IGFpZCwgcGFnZTogcGFnZX0sXG5cdGZ1bmN0aW9uIChycykge1xuXHRcdGlmIChycyAmJiBycy5zcmMpIHtcblx0XHRcdGxvZygn6I635Y+W5YiwPGEgaHJlZj1cIicrcnMuc3JjKydcIj7op4bpopHlnLDlnYA8L2E+LCDlubblvIDlp4vop6PmnpBiaWxpYmxp5by55bmVJylcblx0XHRcdHZhciBzb3VyY2UgPSBbIFsnYmlsaWJpbGknLCBycy5zcmNdIF1cdFx0XHRcblx0XHRcdGh0dHBQcm94eShycy5jaWQsICdnZXQnLCB7fSwgZnVuY3Rpb24gKHJzKSB7XG5cblx0XHRcdFx0aWYgKHJzICYmIHJzLmkpIHtcdFx0XHRcdFx0XG5cdFx0XHRcdFx0dmFyIGNvbW1lbnRzID0gW10uY29uY2F0KHJzLmkuZCB8fCBbXSlcblx0XHRcdFx0XHRjb21tZW50cyA9IGNvbW1lbnRzLm1hcChmdW5jdGlvbiAoY29tbWVudCkge1xuXHRcdFx0XHRcdFx0dmFyIHAgPSBjb21tZW50WydAcCddLnNwbGl0KCcsJylcblx0XHRcdFx0XHRcdHN3aXRjaCAocFsxXSB8IDApIHtcblx0XHRcdFx0XHRcdFx0Y2FzZSA0OiAgcFsxXSA9ICdib3R0b20nOyBicmVha1xuXHRcdFx0XHRcdFx0XHRjYXNlIDU6ICBwWzFdID0gICd0b3AnOyBicmVha1xuXHRcdFx0XHRcdFx0XHRkZWZhdWx0OiBwWzFdID0gJ2xvb3AnXG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRcdFx0XHR0aW1lOiBwYXJzZUZsb2F0KHBbMF0pLFxuXHRcdFx0XHRcdFx0XHRwb3M6ICBwWzFdLFxuXHRcdFx0XHRcdFx0XHRjb2xvcjogJyMnICsgcGFkKChwWzNdIHwgMCkudG9TdHJpbmcoMTYpLCA2KSxcblx0XHRcdFx0XHRcdFx0dGV4dDogY29tbWVudFsnI3RleHQnXVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pLnNvcnQoZnVuY3Rpb24gKGEsIGIpIHtcblx0XHRcdFx0XHRcdHJldHVybiBhLnRpbWUgLSBiLnRpbWVcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHRcdGxvZygn5LiA5YiH6aG65Yip5byA5aeL5pKt5pS+JywgMilcblx0XHRcdFx0XHRjYWxsYmFjayhzb3VyY2UsIGNvbW1lbnRzKVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGxvZygn6Kej5p6QYmlsaWJsaeW8ueW5leWksei0pSwg5L2G5YuJ5by65Y+v5Lul5pKt5pS+JywgMilcblx0XHRcdFx0XHRjYWxsYmFjayhzb3VyY2UpXG5cdFx0XHRcdH1cblxuXHRcdFx0fSwge2d6aW5mbGF0ZToxLCB4bWw6MX0pXG5cdFx0fSBlbHNlIHtcblx0XHRcdGxvZygn6Kej5p6QYmlsaWJsaeinhumikeWcsOWdgOWksei0pScsIDIpXG5cdFx0XHRjYWxsYmFjayhmYWxzZSlcblx0XHR9XG5cdH0pXG59XG4iLCIvKiAgdHVkb3UgXG4gKiAgQOacseS4gFxuICovXG52YXIgY2FuUGxheU0zVTggPSByZXF1aXJlKCcuL2NhblBsYXlNM1U4JylcbnZhciBhamF4ICAgICAgICA9IHJlcXVpcmUoJy4vYWpheCcpXG52YXIgbG9nICAgICAgICAgPSByZXF1aXJlKCcuL2xvZycpXG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAodXJsKSB7XG5cdHJldHVybiB0cnVlO1xufVxuXG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG5cdGFqYXgoe1xuXHRcdHVybDogJ2h0dHA6Ly9hY2Z1bmZpeC5zaW5hYXBwLmNvbS9tYW1hLnBocCcsXG5cdFx0anNvbnA6IHRydWUsXG5cdFx0cGFyYW06IHtcblx0XHRcdHVybDogdXJsLmF0dHIoJ3NvdXJjZScpXG5cdFx0fSxcblx0XHRjYWxsYmFjazogZnVuY3Rpb24ocGFyYW0pIHtcblx0XHRcdGlmIChwYXJhbS5jb2RlICE9IDIwMCkge1xuXHRcdFx0XHRjYWxsYmFjayhmYWxzZSk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgc291cmNlID0gY2FuUGxheU0zVTggJiYgcGFyYW0ubTN1OCA/IHBhcmFtLm0zdTggOiBwYXJhbS5tcDQ7XG5cdFx0XHR2YXIgcnMgPSBbXTtcblx0XHRcdGlmIChzb3VyY2UpIHtcblx0XHRcdFx0Zm9yKHR5cGUgaW4gc291cmNlKSB7XG5cdFx0XHRcdFx0cnMucHVzaChbdHlwZSwgc291cmNlW3R5cGVdXSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2FsbGJhY2socnMpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSlcbn0iLCIvKiAgaHVuYW50diBcbiAqICBA5oOF6L+35rW36b6fcGl6emFcbiAqL1xudmFyIGNhblBsYXlNM1U4ID0gcmVxdWlyZSgnLi9jYW5QbGF5TTNVOCcpXG52YXIgYWpheCAgICAgICAgPSByZXF1aXJlKCcuL2FqYXgnKVxudmFyIGxvZyAgICAgICAgID0gcmVxdWlyZSgnLi9sb2cnKVxuZXhwb3J0cy5tYXRjaCA9IGZ1bmN0aW9uICh1cmwpIHtcblx0cmV0dXJuIC93d3dcXC5odW5hbnR2XFwuY29tLy50ZXN0KHVybC5hdHRyKCdob3N0JykpXG59XG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG5cdC8v6IqS5p6c5Y+w5rKh5pyJbXA0IG8o4pWv4pah4pWwKW9cblx0aWYgKGNhblBsYXlNM1U4KSB7XG5cdFx0dmFyIGdldFBhcmFtcyA9IGZ1bmN0aW9uKHJlcV91cmwpe1xuXHRcdFx0dmFyIHBhcmFtc191cmwgPSByZXFfdXJsLnNwbGl0KFwiP1wiKVsxXTtcblx0XHRcdHZhciBwYXJhbXNfdG1wID0gbmV3IEFycmF5KCk7XG5cdFx0XHRwYXJhbXNfdG1wID0gcGFyYW1zX3VybC5zcGxpdChcIiZcIik7XG5cdFx0XHR2YXIgcGFyYW1zID0ge307XG5cdFx0XHRmb3Ioa2V5IGluIHBhcmFtc190bXApe1xuXHRcdFx0XHRwYXJhbSA9IHBhcmFtc190bXBba2V5XTtcblx0XHRcdFx0aXRlbSA9IG5ldyBBcnJheSgpO1xuXHRcdFx0XHRpdGVtID0gcGFyYW1zX3RtcFtrZXldLnNwbGl0KFwiPVwiKTtcblx0XHRcdFx0aWYgKGl0ZW1bMF0gIT0gJycpIHtcblx0XHQgICAgXHRcdHBhcmFtc1tpdGVtWzBdXSA9IGl0ZW1bMV07XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBwYXJhbXM7XG5cdFx0fVxuXG5cdFx0dmFyIG0zdThfcmVxX3Bhcm1zID0gJyZmbXQ9NiZwbm89NyZtM3U4PTEnO1xuXHRcdHZhciBzdHJfb3JpZyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdGbGFzaFZhcnMnKVswXS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG5cdFx0dmFyIHN0cl90bXAgPSBzdHJfb3JpZy5zcGxpdChcIiZmaWxlPVwiKVsxXTtcblx0XHR2YXIgcmVxX3VybCA9IHN0cl90bXAuc3BsaXQoXCIlMjZmbXRcIilbMF07XG5cdFx0cmVxX3VybCA9IHJlcV91cmwgKyBtM3U4X3JlcV9wYXJtcztcblx0XHRyZXFfdXJsID0gZGVjb2RlVVJJQ29tcG9uZW50KHJlcV91cmwpO1xuXHRcdHBhcmFtcyA9IGdldFBhcmFtcyhyZXFfdXJsKTtcblxuXHRcdC8v6I635Y+W5LiJ56eN5riF5pmw5bqmXG5cdFx0dmFyIGxpbWl0cmF0ZSA9IG5ldyBBcnJheSgpO1xuXHRcdGxpbWl0cmF0ZSA9IFsnNTcwJywgJzEwNTYnLCAnMTYxNSddO1xuXHRcdHVybHMgPSBuZXcgQXJyYXkoKTtcblx0XHRwYXJhbXMubGltaXRyYXRlID0gbGltaXRyYXRlWzBdO1xuXHRcdHRleHQgPSBcIuagh+a4hVwiO1xuXHRcdGFqYXgoe1xuXHRcdFx0XHR1cmw6ICdodHRwOi8vcGN2Y3IuY2RuLmltZ28udHYvbmNycy92b2QuZG8nLFxuXHRcdFx0XHRqc29ucDogdHJ1ZSxcblx0XHRcdFx0cGFyYW06IHBhcmFtcyxcblx0XHRcdFx0Y2FsbGJhY2s6IGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdGlmIChkYXRhLnN0YXR1cyA9PSAnb2snKSB1cmxzLnB1c2goW3RleHQsIGRhdGEuaW5mb10pXG5cdFx0XHRcdFx0cGFyYW1zLmxpbWl0cmF0ZSA9IGxpbWl0cmF0ZVsxXTtcblx0XHRcdFx0XHR0ZXh0ID0gXCLpq5jmuIVcIjtcblx0XHRcdFx0XHRhamF4KHtcblx0XHRcdFx0XHRcdFx0dXJsOiAnaHR0cDovL3BjdmNyLmNkbi5pbWdvLnR2L25jcnMvdm9kLmRvJyxcblx0XHRcdFx0XHRcdFx0anNvbnA6IHRydWUsXG5cdFx0XHRcdFx0XHRcdHBhcmFtOiBwYXJhbXMsXG5cdFx0XHRcdFx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdFx0XHRpZiAoZGF0YS5zdGF0dXMgPT0gJ29rJykgdXJscy5wdXNoKFt0ZXh0LCBkYXRhLmluZm9dKVxuXHRcdFx0XHRcdFx0XHRcdHBhcmFtcy5saW1pdHJhdGUgPSBsaW1pdHJhdGVbMl07XG5cdFx0XHRcdFx0XHRcdFx0dGV4dCA9IFwi6LaF5riFXCI7XG5cdFx0XHRcdFx0XHRcdFx0YWpheCh7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdHVybDogJ2h0dHA6Ly9wY3Zjci5jZG4uaW1nby50di9uY3JzL3ZvZC5kbycsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGpzb25wOiB0cnVlLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRwYXJhbTogcGFyYW1zLFxuXHRcdFx0XHRcdFx0XHRcdFx0XHRjYWxsYmFjazogZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKGRhdGEuc3RhdHVzID09ICdvaycpIHVybHMucHVzaChbdGV4dCwgZGF0YS5pbmZvXSlcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gY2FsbGJhY2sodXJscyk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdH1lbHNle1xuXHRcdGxvZygn6K+35L2/55SoU2FmYXJp6KeC55yL5pys6KeG6aKRJyk7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIGNhbGxiYWNrKCk7XG5cdFx0fSwgMjAwMCk7XG5cdH1cbn0iLCIvKiAgaXFpeWkgXG4gKiAgQOacseS4gFxuICovXG52YXIgY2FuUGxheU0zVTggPSByZXF1aXJlKCcuL2NhblBsYXlNM1U4JylcbnZhciBxdWVyeVN0cmluZyA9IHJlcXVpcmUoJy4vcXVlcnlTdHJpbmcnKVxudmFyIGFqYXggPSByZXF1aXJlKCcuL2FqYXgnKVxudmFyIGh0dHBQcm94eSA9IHJlcXVpcmUoJy4vaHR0cFByb3h5JylcbnZhciBsb2cgPSByZXF1aXJlKCcuL2xvZycpXG5cbmZ1bmN0aW9uIGdldENvb2tpZShjX25hbWUpIHtcbiAgICBpZiAoZG9jdW1lbnQuY29va2llLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY19zdGFydCA9IGRvY3VtZW50LmNvb2tpZS5pbmRleE9mKGNfbmFtZSArIFwiPVwiKVxuICAgICAgICBpZiAoY19zdGFydCAhPSAtMSkge1xuICAgICAgICAgICAgY19zdGFydCA9IGNfc3RhcnQgKyBjX25hbWUubGVuZ3RoICsgMVxuICAgICAgICAgICAgY19lbmQgPSBkb2N1bWVudC5jb29raWUuaW5kZXhPZihcIjtcIiwgY19zdGFydClcbiAgICAgICAgICAgIGlmIChjX2VuZCA9PSAtMSkgY19lbmQgPSBkb2N1bWVudC5jb29raWUubGVuZ3RoXG4gICAgICAgICAgICByZXR1cm4gdW5lc2NhcGUoZG9jdW1lbnQuY29va2llLnN1YnN0cmluZyhjX3N0YXJ0LCBjX2VuZCkpXG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIFwiXCJcbn1cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgcmV0dXJuIC9eaHR0cDpcXC9cXC93d3dcXC5pcWl5aVxcLmNvbS8udGVzdCh1cmwuYXR0cignc291cmNlJykpICYmICEhd2luZG93LlEuUGFnZUluZm9cbn1cblxuZXhwb3J0cy5nZXRWaWRlb3MgPSBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaykge1xuICAgIHZhciB1aWQgPSAnJztcbiAgICB0cnl7XG4gICAgdWlkID0gSlNPTi5wYXJzZShnZXRDb29raWUoJ1AwMDAwMicpKS51aWRcbiAgICB9Y2F0Y2goZSkge31cbiAgICB2YXIgY3VwaWQgPSAncWNfMTAwMDAxXzEwMDEwMicgLy/ov5nkuKrlhpnmrbvlkKdcbiAgICB2YXIgdHZJZCA9IHdpbmRvdy5RLlBhZ2VJbmZvLnBsYXlQYWdlSW5mby50dklkXG4gICAgdmFyIGFsYnVtSWQgPSB3aW5kb3cuUS5QYWdlSW5mby5wbGF5UGFnZUluZm8uYWxidW1JZFxuICAgIHZhciB2aWQgPSB3aW5kb3cuUS5QYWdlSW5mby5wbGF5UGFnZUluZm8udmlkIHx8XG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmbGFzaGJveCcpLmdldEF0dHJpYnV0ZSgnZGF0YS1wbGF5ZXItdmlkZW9pZCcpXG5cbiAgICB2YXIgaHR0cFByb3h5T3B0cyA9IHt0ZXh0OiB0cnVlLCB1YTogJ01vemlsbGEvNS4wIChpUGFkOyBDUFUgaVBob25lIE9TIDhfMSBsaWtlIE1hYyBPUyBYKSBBcHBsZVdlYktpdC82MDAuMS40IChLSFRNTCwgbGlrZSBHZWNrbykgVmVyc2lvbi84LjAgTW9iaWxlLzEyQjQxMCBTYWZhcmkvNjAwLjEuNCd9XG5cbiAgICBodHRwUHJveHkobG9jYXRpb24uaHJlZiwgJ2dldCcsIHt9LCBmdW5jdGlvbihycykge1xuICAgICAgICB2YXIgbSA9IHJzLm1hdGNoKC88c2NyaXB0W14+XSo+XFxzKihldmFsLio7KVxccyooPz08XFwvc2NyaXB0Pik8XFwvc2NyaXB0Pi8pXG4gICAgICAgIHdpbmRvdy5fX3FsdCA9IHdpbmRvdy5fX3FsdCB8fCB7TUFNQTJQbGFjZUhvbGRlcjogdHJ1ZX1cbiAgICAgICAgd2luZG93LlFQID0gd2luZG93LlFQIHx8IHt9XG4gICAgICAgIHdpbmRvdy5RUC5fcmVhZHkgPSBmdW5jdGlvbiAoZSkge2lmKHRoaXMuX2lzUmVhZHkpe2UmJmUoKX1lbHNle2UmJnRoaXMuX3dhaXRzLnB1c2goZSl9fVxuICAgICAgICBldmFsKG1bMV0pXG4gICAgICAgIHZhciBwYXJhbSA9IHdlb3JqamlnaCh0dklkKVxuICAgICAgICBwYXJhbS51aWQgPSB1aWRcbiAgICAgICAgcGFyYW0uY3VwaWQgPSBjdXBpZFxuICAgICAgICBwYXJhbS5wbGF0Rm9ybSA9ICdoNSdcbiAgICAgICAgcGFyYW0udHlwZSA9IGNhblBsYXlNM1U4ID8gJ20zdTgnIDogJ21wNCcsXG4gICAgICAgIHBhcmFtLnF5cGlkID0gdHZJZCArICdfMjEnXG4gICAgICAgIGFqYXgoe1xuICAgICAgICAgICAgdXJsOiAnaHR0cDovL2NhY2hlLm0uaXFpeWkuY29tL2pwL3RtdHMvJyt0dklkKycvJyt2aWQrJy8nLFxuICAgICAgICAgICAganNvbnA6IHRydWUsXG4gICAgICAgICAgICBwYXJhbTogcGFyYW0sXG4gICAgICAgICAgICBjYWxsYmFjazogZnVuY3Rpb24gKHJzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNvdXJjZSA9IFtdXG4gICAgICAgICAgICAgICAgaWYgKHJzLmRhdGEubTN1dHgubGVuZ3RoID4gMCkgc291cmNlLnB1c2goWyfpq5jmuIUnLCBycy5kYXRhLm0zdXR4XSlcbiAgICAgICAgICAgICAgICBpZiAocnMuZGF0YS5tM3UubGVuZ3RoID4gMCkgc291cmNlLnB1c2goWyfmoIfmuIUnLCBycy5kYXRhLm0zdV0pXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soc291cmNlKVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH0sIGh0dHBQcm94eU9wdHMpXG59XG4iLCIvKiAgdHVkb3UgXG4gKiAgQOacseS4gFxuICovXG52YXIgY2FuUGxheU0zVTggPSByZXF1aXJlKCcuL2NhblBsYXlNM1U4JylcbnZhciBhamF4ICAgICAgICA9IHJlcXVpcmUoJy4vYWpheCcpXG52YXIgbG9nICAgICAgICAgPSByZXF1aXJlKCcuL2xvZycpXG52YXIgeW91a3UgICAgICAgPSByZXF1aXJlKCcuL3NlZWtlcl95b3VrdScpXG5cbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAodXJsKSB7XG5cdHZhciBfaWQgPSB3aW5kb3cuaWlkIHx8ICh3aW5kb3cucGFnZUNvbmZpZyAmJiB3aW5kb3cucGFnZUNvbmZpZy5paWQpIHx8ICh3aW5kb3cuaXRlbURhdGEgJiYgd2luZG93Lml0ZW1EYXRhLmlpZClcblx0dmFyIHlvdWt1Q29kZSA9IHdpbmRvdy5pdGVtRGF0YSAmJiB3aW5kb3cuaXRlbURhdGEudmNvZGVcblx0cmV0dXJuIC90dWRvdVxcLmNvbS8udGVzdCh1cmwuYXR0cignaG9zdCcpKSAmJiAoeW91a3VDb2RlIHx8IF9pZClcbn1cblxuZXhwb3J0cy5nZXRWaWRlb3MgPSBmdW5jdGlvbiAodXJsLCBjYWxsYmFjaykge1x0XG5cdHZhciB5b3VrdUNvZGUgPSB3aW5kb3cuaXRlbURhdGEgJiYgd2luZG93Lml0ZW1EYXRhLnZjb2RlXG5cdGlmICh5b3VrdUNvZGUpIHtcblx0XHRyZXR1cm4geW91a3UucGFyc2VZb3VrdUNvZGUoeW91a3VDb2RlLCBjYWxsYmFjaylcblx0fVxuXHR2YXIgX2lkID0gd2luZG93LmlpZCB8fCAod2luZG93LnBhZ2VDb25maWcgJiYgd2luZG93LnBhZ2VDb25maWcuaWlkKSB8fCAod2luZG93Lml0ZW1EYXRhICYmIHdpbmRvdy5pdGVtRGF0YS5paWQpO1xuXHR2YXIgbTN1OCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcdFx0XG5cdFx0dmFyIHVybHMgPSBbXG5cdFx0XHRbJ+WOn+eUuycsICdodHRwOi8vdnIudHVkb3UuY29tL3YycHJveHkvdjIubTN1OD9pdD0nICsgX2lkICsgJyZzdD01J10sXG5cdFx0XHRbJ+i2hea4hScsICdodHRwOi8vdnIudHVkb3UuY29tL3YycHJveHkvdjIubTN1OD9pdD0nICsgX2lkICsgJyZzdD00J10sXG5cdFx0XHRbJ+mrmOa4hScsICdodHRwOi8vdnIudHVkb3UuY29tL3YycHJveHkvdjIubTN1OD9pdD0nICsgX2lkICsgJyZzdD0zJ10sXG5cdFx0XHRbJ+agh+a4hScsICdodHRwOi8vdnIudHVkb3UuY29tL3YycHJveHkvdjIubTN1OD9pdD0nICsgX2lkICsgJyZzdD0yJ11cblx0XHRdXG5cdFx0dmFyIF9zXG5cdFx0aWYod2luZG93Lml0ZW1EYXRhICYmIHdpbmRvdy5pdGVtRGF0YS5zZWdzKXtcblx0XHRcdHVybHMgPSBbXVxuXHRcdFx0X3MgICA9IEpTT04ucGFyc2Uod2luZG93Lml0ZW1EYXRhLnNlZ3MpXG5cdFx0XHRpZihfc1s1XSkgdXJscy5wdXNoKFsn5Y6f55S7JywgJ2h0dHA6Ly92ci50dWRvdS5jb20vdjJwcm94eS92Mi5tM3U4P2l0PScgKyBfaWQgKyAnJnN0PTUnXSlcblx0XHRcdGlmKF9zWzRdKSB1cmxzLnB1c2goWyfotoXmuIUnLCAnaHR0cDovL3ZyLnR1ZG91LmNvbS92MnByb3h5L3YyLm0zdTg/aXQ9JyArIF9pZCArICcmc3Q9NCddKVxuXHRcdFx0aWYoX3NbM10pIHVybHMucHVzaChbJ+mrmOa4hScsICdodHRwOi8vdnIudHVkb3UuY29tL3YycHJveHkvdjIubTN1OD9pdD0nICsgX2lkICsgJyZzdD0zJ10pXG5cdFx0XHRpZihfc1syXSkgdXJscy5wdXNoKFsn5qCH5riFJywgJ2h0dHA6Ly92ci50dWRvdS5jb20vdjJwcm94eS92Mi5tM3U4P2l0PScgKyBfaWQgKyAnJnN0PTInXSlcblx0XHR9XHRcdFxuXHRcdGxvZygn6Kej5p6QdHVkb3Xop4bpopHlnLDlnYDmiJDlip8gJyArIHVybHMubWFwKGZ1bmN0aW9uIChpdGVtKSB7cmV0dXJuICc8YSBocmVmPScraXRlbVsxXSsnPicraXRlbVswXSsnPC9hPid9KS5qb2luKCcgJyksIDIpXG5cdFx0Y2FsbGJhY2sodXJscylcblx0fTtcblx0dmFyIG1wNCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcblx0XHRhamF4KHtcblx0XHRcdHVybDogJ2h0dHA6Ly92ci50dWRvdS5jb20vdjJwcm94eS92Mi5qcycsXG5cdFx0XHRwYXJhbToge1xuXHRcdFx0XHRpdDogX2lkLFxuXHRcdFx0XHRzdDogJzUyJTJDNTMlMkM1NCdcblx0XHRcdH0sXG5cdFx0XHRqc29ucDogJ2pzb25wJyxcblx0XHRcdGNhbGxiYWNrOiBmdW5jdGlvbihwYXJhbSl7XG5cdFx0XHRcdGlmKHBhcmFtID09PSAtMSB8fCBwYXJhbS5jb2RlID09IC0xKSByZXR1cm4gbG9nKCfop6PmnpB0dWRvdeinhumikeWcsOWdgOWksei0pScpXG5cdFx0XHRcdGZvcih2YXIgdXJscz1bXSxpPTAsbGVuPXBhcmFtLnVybHMubGVuZ3RoOyBpPGxlbjsgaSsrKXsgdXJscy5wdXNoKFtpLCBwYXJhbS51cmxzW2ldXSk7IH1cblx0XHRcdFx0bG9nKCfop6PmnpB0dWRvdeinhumikeWcsOWdgOaIkOWKnyAnICsgdXJscy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtyZXR1cm4gJzxhIGhyZWY9JytpdGVtWzFdKyc+JytpdGVtWzBdKyc8L2E+J30pLmpvaW4oJyAnKSwgMilcblx0XHRcdFx0cmV0dXJuIGNhbGxiYWNrKHVybHMpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9O1xuXHRjYW5QbGF5TTNVOCA/IG0zdTgoY2FsbGJhY2spIDogbXA0KGNhbGxiYWNrKVxufSIsIi8qICB5b3VrdSBcbiAqICBA5pyx5LiAXG4gKi9cbnZhciBjYW5QbGF5TTNVOCA9IHJlcXVpcmUoJy4vY2FuUGxheU0zVTgnKVxudmFyIGFqYXggICAgICAgID0gcmVxdWlyZSgnLi9hamF4JylcbnZhciBsb2cgICAgICAgICA9IHJlcXVpcmUoJy4vbG9nJylcbmV4cG9ydHMubWF0Y2ggPSBmdW5jdGlvbiAodXJsKSB7XG5cdHJldHVybiAvdlxcLnlvdWt1XFwuY29tLy50ZXN0KHVybC5hdHRyKCdob3N0JykpICYmICEhd2luZG93LnZpZGVvSWRcbn1cbnZhciBwYXJzZVlvdWt1Q29kZSA9IGV4cG9ydHMucGFyc2VZb3VrdUNvZGUgPSBmdW5jdGlvbiAoX2lkLCBjYWxsYmFjaykge1xuXHRsb2coJ+W8gOWni+ino+aekHlvdWt16KeG6aKR5Zyw5Z2AJylcdFxuXHR2YXIgbWtfYTMgPSAnYjRldCc7XG5cdHZhciBta19hNCA9ICdib2E0Jztcblx0dmFyIHVzZXJDYWNoZV9hMSA9ICc0Jztcblx0dmFyIHVzZXJDYWNoZV9hMiA9ICcxJztcblx0dmFyIHJzO1xuXHR2YXIgc2lkO1xuXHR2YXIgdG9rZW47XG5cdGZ1bmN0aW9uIGRlY29kZTY0KGEpIHtcblx0XHRpZiAoIWEpXG5cdFx0XHRyZXR1cm4gXCJcIjtcblx0XHRhID0gYS50b1N0cmluZygpO1xuXHRcdHZhciBiLCBjLCBkLCBlLCBmLCBnLCBoLCBpID0gbmV3IEFycmF5KC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCA2MiwgLTEsIC0xLCAtMSwgNjMsIDUyLCA1MywgNTQsIDU1LCA1NiwgNTcsIDU4LCA1OSwgNjAsIDYxLCAtMSwgLTEsIC0xLCAtMSwgLTEsIC0xLCAtMSwgMCwgMSwgMiwgMywgNCwgNSwgNiwgNywgOCwgOSwgMTAsIDExLCAxMiwgMTMsIDE0LCAxNSwgMTYsIDE3LCAxOCwgMTksIDIwLCAyMSwgMjIsIDIzLCAyNCwgMjUsIC0xLCAtMSwgLTEsIC0xLCAtMSwgLTEsIDI2LCAyNywgMjgsIDI5LCAzMCwgMzEsIDMyLCAzMywgMzQsIDM1LCAzNiwgMzcsIDM4LCAzOSwgNDAsIDQxLCA0MiwgNDMsIDQ0LCA0NSwgNDYsIDQ3LCA0OCwgNDksIDUwLCA1MSwgLTEsIC0xLCAtMSwgLTEsIC0xKTtcblx0XHRmb3IgKGcgPSBhLmxlbmd0aCwgZiA9IDAsIGggPSBcIlwiOyBnID4gZjspIHtcblx0XHRcdGRvXG5cdFx0XHRcdGIgPSBpWzI1NSAmIGEuY2hhckNvZGVBdChmKyspXTtcblx0XHRcdHdoaWxlIChnID4gZiAmJiAtMSA9PSBiKTtcblx0XHRcdGlmICgtMSA9PSBiKVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGRvXG5cdFx0XHRcdGMgPSBpWzI1NSAmIGEuY2hhckNvZGVBdChmKyspXTtcblx0XHRcdHdoaWxlIChnID4gZiAmJiAtMSA9PSBjKTtcblx0XHRcdGlmICgtMSA9PSBjKVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGggKz0gU3RyaW5nLmZyb21DaGFyQ29kZShiIDw8IDIgfCAoNDggJiBjKSA+PiA0KTtcblx0XHRcdGRvIHtcblx0XHRcdFx0aWYgKGQgPSAyNTUgJiBhLmNoYXJDb2RlQXQoZisrKSwgNjEgPT0gZClcblx0XHRcdFx0XHRyZXR1cm4gaDtcblx0XHRcdFx0ZCA9IGlbZF1cblx0XHRcdH1cblx0XHRcdHdoaWxlIChnID4gZiAmJiAtMSA9PSBkKTtcblx0XHRcdGlmICgtMSA9PSBkKVxuXHRcdFx0XHRicmVhaztcblx0XHRcdGggKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoMTUgJiBjKSA8PCA0IHwgKDYwICYgZCkgPj4gMik7XG5cdFx0XHRkbyB7XG5cdFx0XHRcdGlmIChlID0gMjU1ICYgYS5jaGFyQ29kZUF0KGYrKyksIDYxID09IGUpXG5cdFx0XHRcdFx0cmV0dXJuIGg7XG5cdFx0XHRcdGUgPSBpW2VdXG5cdFx0XHR9XG5cdFx0XHR3aGlsZSAoZyA+IGYgJiYgLTEgPT0gZSk7XG5cdFx0XHRpZiAoLTEgPT0gZSlcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRoICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKDMgJiBkKSA8PCA2IHwgZSlcblx0XHR9XG5cdFx0cmV0dXJuIGhcblx0fVxuXG5cdGZ1bmN0aW9uIEQoYSkge1xuXHRcdGlmICghYSkgcmV0dXJuIFwiXCI7XG5cdFx0dmFyIGEgPSBhLnRvU3RyaW5nKCksXG5cdFx0XHRjLCBiLCBmLCBlLCBnLCBoO1xuXHRcdGYgPSBhLmxlbmd0aDtcblx0XHRiID0gMDtcblx0XHRmb3IgKGMgPSBcIlwiOyBiIDwgZjspIHtcblx0XHRcdGUgPSBhLmNoYXJDb2RlQXQoYisrKSAmIDI1NTtcblx0XHRcdGlmIChiID09IGYpIHtcblx0XHRcdFx0YyArPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIi5jaGFyQXQoZSA+PiAyKTtcblx0XHRcdFx0YyArPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIi5jaGFyQXQoKGUgJiAzKSA8PCA0KTtcblx0XHRcdFx0YyArPSBcIj09XCI7XG5cdFx0XHRcdGJyZWFrXG5cdFx0XHR9XG5cdFx0XHRnID0gYS5jaGFyQ29kZUF0KGIrKyk7XG5cdFx0XHRpZiAoYiA9PSBmKSB7XG5cdFx0XHRcdGMgKz0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCIuY2hhckF0KGUgPj4gMik7XG5cdFx0XHRcdGMgKz0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCIuY2hhckF0KChlICYgMykgPDwgNCB8IChnICYgMjQwKSA+PiA0KTtcblx0XHRcdFx0YyArPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIi5jaGFyQXQoKGcgJlxuXHRcdFx0XHRcdDE1KSA8PCAyKTtcblx0XHRcdFx0YyArPSBcIj1cIjtcblx0XHRcdFx0YnJlYWtcblx0XHRcdH1cblx0XHRcdGggPSBhLmNoYXJDb2RlQXQoYisrKTtcblx0XHRcdGMgKz0gXCJBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvXCIuY2hhckF0KGUgPj4gMik7XG5cdFx0XHRjICs9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrL1wiLmNoYXJBdCgoZSAmIDMpIDw8IDQgfCAoZyAmIDI0MCkgPj4gNCk7XG5cdFx0XHRjICs9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrL1wiLmNoYXJBdCgoZyAmIDE1KSA8PCAyIHwgKGggJiAxOTIpID4+IDYpO1xuXHRcdFx0YyArPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky9cIi5jaGFyQXQoaCAmIDYzKVxuXHRcdH1cblx0XHRyZXR1cm4gY1xuXHR9XG5cblx0ZnVuY3Rpb24gRShhLCBjKSB7XG5cdFx0Zm9yICh2YXIgYiA9IFtdLCBmID0gMCwgaSwgZSA9IFwiXCIsIGggPSAwOyAyNTYgPiBoOyBoKyspIGJbaF0gPSBoO1xuXHRcdGZvciAoaCA9IDA7IDI1NiA+IGg7IGgrKykgZiA9IChmICsgYltoXSArIGEuY2hhckNvZGVBdChoICUgYS5sZW5ndGgpKSAlIDI1NiwgaSA9IGJbaF0sIGJbaF0gPSBiW2ZdLCBiW2ZdID0gaTtcblx0XHRmb3IgKHZhciBxID0gZiA9IGggPSAwOyBxIDwgYy5sZW5ndGg7IHErKykgaCA9IChoICsgMSkgJSAyNTYsIGYgPSAoZiArIGJbaF0pICUgMjU2LCBpID0gYltoXSwgYltoXSA9IGJbZl0sIGJbZl0gPSBpLCBlICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYy5jaGFyQ29kZUF0KHEpIF4gYlsoYltoXSArIGJbZl0pICUgMjU2XSk7XG5cdFx0cmV0dXJuIGVcblx0fVxuXG5cdGZ1bmN0aW9uIEYoYSwgYykge1xuXHRcdGZvciAodmFyIGIgPSBbXSwgZiA9IDA7IGYgPCBhLmxlbmd0aDsgZisrKSB7XG5cdFx0XHRmb3IgKHZhciBpID0gMCwgaSA9IFwiYVwiIDw9IGFbZl0gJiYgXCJ6XCIgPj0gYVtmXSA/IGFbZl0uY2hhckNvZGVBdCgwKSAtIDk3IDogYVtmXSAtIDAgKyAyNiwgZSA9IDA7IDM2ID4gZTsgZSsrKVxuXHRcdFx0XHRpZiAoY1tlXSA9PSBpKSB7XG5cdFx0XHRcdFx0aSA9IGU7XG5cdFx0XHRcdFx0YnJlYWtcblx0XHRcdFx0fVxuXHRcdFx0YltmXSA9IDI1IDwgaSA/IGkgLSAyNiA6IFN0cmluZy5mcm9tQ2hhckNvZGUoaSArIDk3KVxuXHRcdH1cblx0XHRyZXR1cm4gYi5qb2luKFwiXCIpXG5cdH1cblx0XG5cdHZhciBQbGF5TGlzdERhdGEgPSBmdW5jdGlvbihhLCBiLCBjKSB7XG5cdFx0XHR2YXIgZCA9IHRoaXM7XG5cdFx0XHRuZXcgRGF0ZTtcblx0XHRcdHRoaXMuX3NpZCA9IHNpZCwgdGhpcy5fZmlsZVR5cGUgPSBjLCB0aGlzLl92aWRlb1NlZ3NEaWMgPSB7fTtcblx0XHRcdHRoaXMuX2lwID0gYS5zZWN1cml0eS5pcDtcblx0XHRcdHZhciBlID0gKG5ldyBSYW5kb21Qcm94eSwgW10pLFxuXHRcdFx0XHRmID0gW107XG5cdFx0XHRmLnN0cmVhbXMgPSB7fSwgZi5sb2dvcyA9IHt9LCBmLnR5cGVBcnIgPSB7fSwgZi50b3RhbFRpbWUgPSB7fTtcblx0XHRcdGZvciAodmFyIGcgPSAwOyBnIDwgYi5sZW5ndGg7IGcrKykge1xuXHRcdFx0XHRmb3IgKHZhciBoID0gYltnXS5hdWRpb19sYW5nLCBpID0gITEsIGogPSAwOyBqIDwgZS5sZW5ndGg7IGorKylcblx0XHRcdFx0XHRpZiAoZVtqXSA9PSBoKSB7XG5cdFx0XHRcdFx0XHRpID0gITA7XG5cdFx0XHRcdFx0XHRicmVha1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0aSB8fCBlLnB1c2goaClcblx0XHRcdH1cblx0XHRcdGZvciAodmFyIGcgPSAwOyBnIDwgZS5sZW5ndGg7IGcrKykge1xuXHRcdFx0XHRmb3IgKHZhciBrID0gZVtnXSwgbCA9IHt9LCBtID0ge30sIG4gPSBbXSwgaiA9IDA7IGogPCBiLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdFx0dmFyIG8gPSBiW2pdO1xuXHRcdFx0XHRcdGlmIChrID09IG8uYXVkaW9fbGFuZykge1xuXHRcdFx0XHRcdFx0aWYgKCFkLmlzVmFsaWRUeXBlKG8uc3RyZWFtX3R5cGUpKVxuXHRcdFx0XHRcdFx0XHRjb250aW51ZTtcblx0XHRcdFx0XHRcdHZhciBwID0gZC5jb252ZXJ0VHlwZShvLnN0cmVhbV90eXBlKSxcblx0XHRcdFx0XHRcdFx0cSA9IDA7XG5cdFx0XHRcdFx0XHRcIm5vbmVcIiAhPSBvLmxvZ28gJiYgKHEgPSAxKSwgbVtwXSA9IHE7XG5cdFx0XHRcdFx0XHR2YXIgciA9ICExO1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgcyBpbiBuKVxuXHRcdFx0XHRcdFx0XHRwID09IG5bc10gJiYgKHIgPSAhMCk7XG5cdFx0XHRcdFx0XHRyIHx8IG4ucHVzaChwKTtcblx0XHRcdFx0XHRcdHZhciB0ID0gby5zZWdzO1xuXHRcdFx0XHRcdFx0aWYgKG51bGwgPT0gdClcblx0XHRcdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdFx0XHR2YXIgdSA9IFtdO1xuXHRcdFx0XHRcdFx0ciAmJiAodSA9IGxbcF0pO1xuXHRcdFx0XHRcdFx0Zm9yICh2YXIgdiA9IDA7IHYgPCB0Lmxlbmd0aDsgdisrKSB7XG5cdFx0XHRcdFx0XHRcdHZhciB3ID0gdFt2XTtcblx0XHRcdFx0XHRcdFx0aWYgKG51bGwgPT0gdylcblx0XHRcdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRcdFx0dmFyIHggPSB7fTtcblx0XHRcdFx0XHRcdFx0eC5ubyA9IHYsIFxuXHRcdFx0XHRcdFx0XHR4LnNpemUgPSB3LnNpemUsIFxuXHRcdFx0XHRcdFx0XHR4LnNlY29uZHMgPSBOdW1iZXIody50b3RhbF9taWxsaXNlY29uZHNfdmlkZW8pIC8gMWUzLCBcblx0XHRcdFx0XHRcdFx0eC5taWxsaXNlY29uZHNfdmlkZW8gPSBOdW1iZXIoby5taWxsaXNlY29uZHNfdmlkZW8pIC8gMWUzLCBcblx0XHRcdFx0XHRcdFx0eC5rZXkgPSB3LmtleSwgeC5maWxlSWQgPSB0aGlzLmdldEZpbGVJZChvLnN0cmVhbV9maWxlaWQsIHYpLCBcblx0XHRcdFx0XHRcdFx0eC5zcmMgPSB0aGlzLmdldFZpZGVvU3JjKGosIHYsIGEsIG8uc3RyZWFtX3R5cGUsIHguZmlsZUlkKSwgXG5cdFx0XHRcdFx0XHRcdHgudHlwZSA9IHAsIFxuXHRcdFx0XHRcdFx0XHR1LnB1c2goeClcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdGxbcF0gPSB1XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdHZhciB5ID0gdGhpcy5sYW5nQ29kZVRvQ04oaykua2V5O1xuXHRcdFx0XHRmLmxvZ29zW3ldID0gbSwgZi5zdHJlYW1zW3ldID0gbCwgZi50eXBlQXJyW3ldID0gblx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHR0aGlzLl92aWRlb1NlZ3NEaWMgPSBmLCB0aGlzLl92aWRlb1NlZ3NEaWMubGFuZyA9IHRoaXMubGFuZ0NvZGVUb0NOKGVbMF0pLmtleVxuXHRcdH0sXG5cdFx0UmFuZG9tUHJveHkgPSBmdW5jdGlvbihhKSB7XG5cdFx0XHR0aGlzLl9yYW5kb21TZWVkID0gYSwgdGhpcy5jZ19odW4oKVxuXHRcdH07XG5cdFJhbmRvbVByb3h5LnByb3RvdHlwZSA9IHtcblx0XHRjZ19odW46IGZ1bmN0aW9uKCkge1xuXHRcdFx0dGhpcy5fY2dTdHIgPSBcIlwiO1xuXHRcdFx0Zm9yICh2YXIgYSA9IFwiYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXpBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWi9cXFxcOi5fLTEyMzQ1Njc4OTBcIiwgYiA9IGEubGVuZ3RoLCBjID0gMDsgYiA+IGM7IGMrKykge1xuXHRcdFx0XHR2YXIgZCA9IHBhcnNlSW50KHRoaXMucmFuKCkgKiBhLmxlbmd0aCk7XG5cdFx0XHRcdHRoaXMuX2NnU3RyICs9IGEuY2hhckF0KGQpLCBhID0gYS5zcGxpdChhLmNoYXJBdChkKSkuam9pbihcIlwiKVxuXHRcdFx0fVxuXHRcdH0sXG5cdFx0Y2dfZnVuOiBmdW5jdGlvbihhKSB7XG5cdFx0XHRmb3IgKHZhciBiID0gYS5zcGxpdChcIipcIiksIGMgPSBcIlwiLCBkID0gMDsgZCA8IGIubGVuZ3RoIC0gMTsgZCsrKVxuXHRcdFx0XHRjICs9IHRoaXMuX2NnU3RyLmNoYXJBdChiW2RdKTtcblx0XHRcdHJldHVybiBjXG5cdFx0fSxcblx0XHRyYW46IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmV0dXJuIHRoaXMuX3JhbmRvbVNlZWQgPSAoMjExICogdGhpcy5fcmFuZG9tU2VlZCArIDMwMDMxKSAlIDY1NTM2LCB0aGlzLl9yYW5kb21TZWVkIC8gNjU1MzZcblx0XHR9XG5cdH0sIFBsYXlMaXN0RGF0YS5wcm90b3R5cGUgPSB7XG5cdFx0Z2V0RmlsZUlkOiBmdW5jdGlvbihhLCBiKSB7XG5cdFx0XHRpZiAobnVsbCA9PSBhIHx8IFwiXCIgPT0gYSlcblx0XHRcdFx0cmV0dXJuIFwiXCI7XG5cdFx0XHR2YXIgYyA9IFwiXCIsXG5cdFx0XHRcdGQgPSBhLnNsaWNlKDAsIDgpLFxuXHRcdFx0XHRlID0gYi50b1N0cmluZygxNik7XG5cdFx0XHQxID09IGUubGVuZ3RoICYmIChlID0gXCIwXCIgKyBlKSwgZSA9IGUudG9VcHBlckNhc2UoKTtcblx0XHRcdHZhciBmID0gYS5zbGljZSgxMCwgYS5sZW5ndGgpO1xuXHRcdFx0cmV0dXJuIGMgPSBkICsgZSArIGZcblx0XHR9LFxuXHRcdGlzVmFsaWRUeXBlOiBmdW5jdGlvbihhKSB7XG5cdFx0XHRyZXR1cm4gXCIzZ3BoZFwiID09IGEgfHwgXCJmbHZcIiA9PSBhIHx8IFwiZmx2aGRcIiA9PSBhIHx8IFwibXA0aGRcIiA9PSBhIHx8IFwibXA0aGQyXCIgPT0gYSB8fCBcIm1wNGhkM1wiID09IGEgPyAhMCA6ICExXG5cdFx0fSxcblx0XHRjb252ZXJ0VHlwZTogZnVuY3Rpb24oYSkge1xuXHRcdFx0dmFyIGIgPSBhO1xuXHRcdFx0c3dpdGNoIChhKSB7XG5cdFx0XHRcdGNhc2UgXCJtM3U4XCI6XG5cdFx0XHRcdFx0YiA9IFwibXA0XCI7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCIzZ3BoZFwiOlxuXHRcdFx0XHRcdGIgPSBcIjNncGhkXCI7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJmbHZcIjpcblx0XHRcdFx0XHRiID0gXCJmbHZcIjtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImZsdmhkXCI6XG5cdFx0XHRcdFx0YiA9IFwiZmx2XCI7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJtcDRoZFwiOlxuXHRcdFx0XHRcdGIgPSBcIm1wNFwiO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwibXA0aGQyXCI6XG5cdFx0XHRcdFx0YiA9IFwiaGQyXCI7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJtcDRoZDNcIjpcblx0XHRcdFx0XHRiID0gXCJoZDNcIlxuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIGJcblx0XHR9LFxuXHRcdGxhbmdDb2RlVG9DTjogZnVuY3Rpb24oYSkge1xuXHRcdFx0dmFyIGIgPSBcIlwiO1xuXHRcdFx0c3dpdGNoIChhKSB7XG5cdFx0XHRcdGNhc2UgXCJkZWZhdWx0XCI6XG5cdFx0XHRcdFx0YiA9IHtcblx0XHRcdFx0XHRcdGtleTogXCJndW95dVwiLFxuXHRcdFx0XHRcdFx0dmFsdWU6IFwi5Zu96K+tXCJcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiZ3VveXVcIjpcblx0XHRcdFx0XHRiID0ge1xuXHRcdFx0XHRcdFx0a2V5OiBcImd1b3l1XCIsXG5cdFx0XHRcdFx0XHR2YWx1ZTogXCLlm73or61cIlxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJ5dWVcIjpcblx0XHRcdFx0XHRiID0ge1xuXHRcdFx0XHRcdFx0a2V5OiBcInl1ZVwiLFxuXHRcdFx0XHRcdFx0dmFsdWU6IFwi57Kk6K+tXCJcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiY2h1YW5cIjpcblx0XHRcdFx0XHRiID0ge1xuXHRcdFx0XHRcdFx0a2V5OiBcImNodWFuXCIsXG5cdFx0XHRcdFx0XHR2YWx1ZTogXCLlt53or51cIlxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJ0YWlcIjpcblx0XHRcdFx0XHRiID0ge1xuXHRcdFx0XHRcdFx0a2V5OiBcInRhaVwiLFxuXHRcdFx0XHRcdFx0dmFsdWU6IFwi5Y+w5rm+XCJcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwibWluXCI6XG5cdFx0XHRcdFx0YiA9IHtcblx0XHRcdFx0XHRcdGtleTogXCJtaW5cIixcblx0XHRcdFx0XHRcdHZhbHVlOiBcIumXveWNl1wiXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImVuXCI6XG5cdFx0XHRcdFx0YiA9IHtcblx0XHRcdFx0XHRcdGtleTogXCJlblwiLFxuXHRcdFx0XHRcdFx0dmFsdWU6IFwi6Iux6K+tXCJcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiamFcIjpcblx0XHRcdFx0XHRiID0ge1xuXHRcdFx0XHRcdFx0a2V5OiBcImphXCIsXG5cdFx0XHRcdFx0XHR2YWx1ZTogXCLml6Xor61cIlxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJrclwiOlxuXHRcdFx0XHRcdGIgPSB7XG5cdFx0XHRcdFx0XHRrZXk6IFwia3JcIixcblx0XHRcdFx0XHRcdHZhbHVlOiBcIumfqeivrVwiXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImluXCI6XG5cdFx0XHRcdFx0YiA9IHtcblx0XHRcdFx0XHRcdGtleTogXCJpblwiLFxuXHRcdFx0XHRcdFx0dmFsdWU6IFwi5Y2w5bqmXCJcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwicnVcIjpcblx0XHRcdFx0XHRiID0ge1xuXHRcdFx0XHRcdFx0a2V5OiBcInJ1XCIsXG5cdFx0XHRcdFx0XHR2YWx1ZTogXCLkv4Tor61cIlxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJmclwiOlxuXHRcdFx0XHRcdGIgPSB7XG5cdFx0XHRcdFx0XHRrZXk6IFwiZnJcIixcblx0XHRcdFx0XHRcdHZhbHVlOiBcIuazleivrVwiXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcImRlXCI6XG5cdFx0XHRcdFx0YiA9IHtcblx0XHRcdFx0XHRcdGtleTogXCJkZVwiLFxuXHRcdFx0XHRcdFx0dmFsdWU6IFwi5b636K+tXCJcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwiaXRcIjpcblx0XHRcdFx0XHRiID0ge1xuXHRcdFx0XHRcdFx0a2V5OiBcIml0XCIsXG5cdFx0XHRcdFx0XHR2YWx1ZTogXCLmhI/or61cIlxuXHRcdFx0XHRcdH07XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgXCJlc1wiOlxuXHRcdFx0XHRcdGIgPSB7XG5cdFx0XHRcdFx0XHRrZXk6IFwiZXNcIixcblx0XHRcdFx0XHRcdHZhbHVlOiBcIuilv+ivrVwiXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0Y2FzZSBcInBvXCI6XG5cdFx0XHRcdFx0YiA9IHtcblx0XHRcdFx0XHRcdGtleTogXCJwb1wiLFxuXHRcdFx0XHRcdFx0dmFsdWU6IFwi6JGh6K+tXCJcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlIFwidGhcIjpcblx0XHRcdFx0XHRiID0ge1xuXHRcdFx0XHRcdFx0a2V5OiBcInRoXCIsXG5cdFx0XHRcdFx0XHR2YWx1ZTogXCLms7Dor61cIlxuXHRcdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdHJldHVybiBiXG5cdFx0fSxcblx0XHRnZXRWaWRlb1NyYzogZnVuY3Rpb24oYSwgYiwgYywgZCwgZSwgZiwgZykge1xuXHRcdFx0dmFyIGggPSBjLnN0cmVhbVthXSxcblx0XHRcdFx0aSA9IGMudmlkZW8uZW5jb2RlaWQ7XG5cdFx0XHRpZiAoIWkgfHwgIWQpXG5cdFx0XHRcdHJldHVybiBcIlwiO1xuXHRcdFx0dmFyIGogPSB7XG5cdFx0XHRcdFx0Zmx2OiAwLFxuXHRcdFx0XHRcdGZsdmhkOiAwLFxuXHRcdFx0XHRcdG1wNDogMSxcblx0XHRcdFx0XHRoZDI6IDIsXG5cdFx0XHRcdFx0XCIzZ3BoZFwiOiAxLFxuXHRcdFx0XHRcdFwiM2dwXCI6IDBcblx0XHRcdFx0fSxcblx0XHRcdFx0ayA9IGpbZF0sXG5cdFx0XHRcdGwgPSB7XG5cdFx0XHRcdFx0Zmx2OiBcImZsdlwiLFxuXHRcdFx0XHRcdG1wNDogXCJtcDRcIixcblx0XHRcdFx0XHRoZDI6IFwiZmx2XCIsXG5cdFx0XHRcdFx0bXA0aGQ6IFwibXA0XCIsXG5cdFx0XHRcdFx0bXA0aGQyOiBcIm1wNFwiLFxuXHRcdFx0XHRcdFwiM2dwaGRcIjogXCJtcDRcIixcblx0XHRcdFx0XHRcIjNncFwiOiBcImZsdlwiLFxuXHRcdFx0XHRcdGZsdmhkOiBcImZsdlwiXG5cdFx0XHRcdH0sXG5cdFx0XHRcdG0gPSBsW2RdLFxuXHRcdFx0XHRuID0gYi50b1N0cmluZygxNik7XG5cdFx0XHQxID09IG4ubGVuZ3RoICYmIChuID0gXCIwXCIgKyBuKTtcblx0XHRcdHZhciBvID0gaC5zZWdzW2JdLnRvdGFsX21pbGxpc2Vjb25kc192aWRlbyAvIDFlMyxcblx0XHRcdFx0cCA9IGguc2Vnc1tiXS5rZXk7XG5cdFx0XHQoXCJcIiA9PSBwIHx8IC0xID09IHApICYmIChwID0gaC5rZXkyICsgaC5rZXkxKTtcblx0XHRcdHZhciBxID0gXCJcIjtcblx0XHRcdGMuc2hvdyAmJiAocSA9IGMuc2hvdy5wYXkgPyBcIiZ5cHJlbWl1bT0xXCIgOiBcIiZ5bW92aWU9MVwiKTtcblx0XHRcdHZhciByID0gXCIvcGxheWVyL2dldEZsdlBhdGgvc2lkL1wiICsgc2lkICsgXCJfXCIgKyBuICsgXCIvc3QvXCIgKyBtICsgXCIvZmlsZWlkL1wiICsgZSArIFwiP0s9XCIgKyBwICsgXCImaGQ9XCIgKyBrICsgXCImbXlwPTAmdHM9XCIgKyBvICsgXCImeXBwPTBcIiArIHEsXG5cdFx0XHRcdHMgPSBbMTksIDEsIDQsIDcsIDMwLCAxNCwgMjgsIDgsIDI0LCAxNywgNiwgMzUsIDM0LCAxNiwgOSwgMTAsIDEzLCAyMiwgMzIsIDI5LCAzMSwgMjEsIDE4LCAzLCAyLCAyMywgMjUsIDI3LCAxMSwgMjAsIDUsIDE1LCAxMiwgMCwgMzMsIDI2XSxcblx0XHRcdFx0dCA9IGVuY29kZVVSSUNvbXBvbmVudChlbmNvZGU2NChFKEYobWtfYTQgKyBcInBvelwiICsgdXNlckNhY2hlX2EyLCBzKS50b1N0cmluZygpLCBzaWQgKyBcIl9cIiArIGUgKyBcIl9cIiArIHRva2VuKSkpO1xuXHRcdFx0cmV0dXJuIHIgKz0gXCImZXA9XCIgKyB0LCByICs9IFwiJmN0eXBlPTEyXCIsIHIgKz0gXCImZXY9MVwiLCByICs9IFwiJnRva2VuPVwiICsgdG9rZW4sIHIgKz0gXCImb2lwPVwiICsgdGhpcy5faXAsIHIgKz0gKGYgPyBcIi9wYXNzd29yZC9cIiArIGYgOiBcIlwiKSArIChnID8gZyA6IFwiXCIpLCByID0gXCJodHRwOi8vay55b3VrdS5jb21cIiArIHJcblx0XHR9XG5cdH07XG5cblx0YWpheCh7XG5cdFx0dXJsOiAnaHR0cDovL3BsYXkueW91a3UuY29tL3BsYXkvZ2V0Lmpzb24/dmlkPScgKyBfaWQgKyAnJmN0PTEyJyxcblx0XHRqc29ucDogdHJ1ZSxcblx0XHRjYWxsYmFjazogZnVuY3Rpb24gKHBhcmFtKSB7XG5cdFx0XHRpZihwYXJhbSA9PSAtMSkge1xuXHRcdFx0XHRsb2coJ+ino+aekHlvdWt16KeG6aKR5Zyw5Z2A5aSx6LSlJywgMilcblx0XHRcdH1cblx0XHRcdHJzID0gcGFyYW07XG5cdFx0XHR2YXIgYSA9IHBhcmFtLmRhdGEsXG5cdFx0XHRcdGMgPSBFKEYobWtfYTMgKyBcIm8wYlwiICsgdXNlckNhY2hlX2ExLCBbMTksIDEsIDQsIDcsIDMwLCAxNCwgMjgsIDgsIDI0LFxuXHRcdFx0XHRcdDE3LCA2LCAzNSwgMzQsIDE2LCA5LCAxMCwgMTMsIDIyLCAzMiwgMjksIDMxLCAyMSwgMTgsIDMsIDIsIDIzLCAyNSwgMjcsIDExLCAyMCwgNSwgMTUsIDEyLCAwLCAzMywgMjZcblx0XHRcdFx0XSkudG9TdHJpbmcoKSwgZGVjb2RlNjQoYS5zZWN1cml0eS5lbmNyeXB0X3N0cmluZykpO1xuXHRcdFx0YyAgICAgPSBjLnNwbGl0KFwiX1wiKTtcblx0XHRcdHNpZCAgID0gY1swXTtcblx0XHRcdHRva2VuID0gY1sxXTtcblx0XHRcdGlmICggY2FuUGxheU0zVTggJiYgbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKCdQbGF5U3RhdGlvbicpID09PSAtMSApIHtcblx0XHRcdFx0dmFyIGVwICA9IGVuY29kZVVSSUNvbXBvbmVudChEKEUoRihta19hNCArIFwicG96XCIgKyB1c2VyQ2FjaGVfYTIsIFsxOSwgMSwgNCwgNywgMzAsIDE0LCAyOCwgOCwgMjQsIDE3LCA2LCAzNSwgMzQsIDE2LCA5LCAxMCwgMTMsIDIyLCAzMiwgMjksIDMxLCAyMSwgMTgsIDMsIDIsIDIzLCAyNSwgMjcsIDExLCAyMCwgNSwgMTUsIDEyLCAwLCAzMywgMjZdKS50b1N0cmluZygpLCBzaWQgKyBcIl9cIiArIF9pZCArIFwiX1wiICsgdG9rZW4pKSk7XG5cdFx0XHRcdHZhciBvaXAgPSBhLnNlY3VyaXR5LmlwO1xuXHRcdFx0XHR2YXIgc291cmNlID0gW1xuXHRcdFx0XHRcdFsn6LaF5riFJywgJ2h0dHA6Ly9wbC55b3VrdS5jb20vcGxheWxpc3QvbTN1OD92aWQ9JytfaWQrJyZ0eXBlPWhkMiZjdHlwZT0xMiZrZXlmcmFtZT0xJmVwPScrZXArJyZzaWQ9JytzaWQrJyZ0b2tlbj0nK3Rva2VuKycmZXY9MSZvaXA9JytvaXBdLFxuXHRcdFx0XHRcdFsn6auY5riFJywgJ2h0dHA6Ly9wbC55b3VrdS5jb20vcGxheWxpc3QvbTN1OD92aWQ9JytfaWQrJyZ0eXBlPW1wNCZjdHlwZT0xMiZrZXlmcmFtZT0xJmVwPScrZXArJyZzaWQ9JytzaWQrJyZ0b2tlbj0nK3Rva2VuKycmZXY9MSZvaXA9JytvaXBdLFxuXHRcdFx0XHRcdFsn5qCH5riFJywgJ2h0dHA6Ly9wbC55b3VrdS5jb20vcGxheWxpc3QvbTN1OD92aWQ9JytfaWQrJyZ0eXBlPWZsdiZjdHlwZT0xMiZrZXlmcmFtZT0xJmVwPScrZXArJyZzaWQ9JytzaWQrJyZ0b2tlbj0nK3Rva2VuKycmZXY9MSZvaXA9JytvaXBdXG5cdFx0XHRcdF07XG5cdFx0XHRcdGxvZygn6Kej5p6QeW91a3Xop4bpopHlnLDlnYDmiJDlip8gJyArIHNvdXJjZS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtyZXR1cm4gJzxhIGhyZWY9JytpdGVtWzFdKyc+JytpdGVtWzBdKyc8L2E+J30pLmpvaW4oJyAnKSwgMilcblx0XHRcdFx0Y2FsbGJhY2soc291cmNlKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciB0ID0gbmV3IFBsYXlMaXN0RGF0YShhLCBhLnN0cmVhbSwgJ21wNCcpXG5cdFx0XHRcdHZhciBzb3VyY2UgPSBbXG5cdFx0XHRcdFx0WyfmoIfmuIUnLCB0Ll92aWRlb1NlZ3NEaWMuc3RyZWFtc1snZ3VveXUnXVsnM2dwaGQnXVswXS5zcmNdXG5cdFx0XHRcdF07XG5cdFx0XHRcdGxvZygn6Kej5p6QeW91a3Xop4bpopHlnLDlnYDmiJDlip8gJyArIHNvdXJjZS5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtyZXR1cm4gJzxhIGhyZWY9JytpdGVtWzFdKyc+JytpdGVtWzBdKyc8L2E+J30pLmpvaW4oJyAnKSwgMilcblx0XHRcdFx0Y2FsbGJhY2soc291cmNlKTtcblx0XHRcdH1cblx0XHR9XG5cdH0pXG59XG5leHBvcnRzLmdldFZpZGVvcyA9IGZ1bmN0aW9uICh1cmwsIGNhbGxiYWNrKSB7XG5cdHBhcnNlWW91a3VDb2RlKHdpbmRvdy52aWRlb0lkLCBjYWxsYmFjaylcbn0iLCJtb2R1bGUuZXhwb3J0cyA9IFtcblx0cmVxdWlyZSgnLi9zZWVrZXJfYmlsaWJpbGknKSxcblx0cmVxdWlyZSgnLi9zZWVrZXJfeW91a3UnKSxcblx0cmVxdWlyZSgnLi9zZWVrZXJfdHVkb3UnKSxcblx0cmVxdWlyZSgnLi9zZWVrZXJfaXFpeWknKSxcblx0cmVxdWlyZSgnLi9zZWVrZXJfaHVuYW50dicpLFxuXHRyZXF1aXJlKCcuL3NlZWtlcl9hY2Z1bicpLFxuXHRyZXF1aXJlKCcuL3NlZWtlcl85MXBvcm4nKVxuXHQvLyAscmVxdWlyZSgnLi9zZWVrZXJfZXhhbXBsZScpXG5dXG4iXX0=
