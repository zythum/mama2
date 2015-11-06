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
},{"./createElement":4,"./flashBlocker":5,"./log":8,"./mamaKey":9,"./player":11,"./purl":12,"./seeker_flvsp":16,"./seekers":21}],2:[function(require,module,exports){
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
	return url + (url.indexOf('?') ? '?' : '&') + queryString
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

},{"./httpProxy":6,"./log":8,"./purl":12}],16:[function(require,module,exports){
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
},{"./ajax":2,"./canPlayM3U8":3,"./log":8}],17:[function(require,module,exports){
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
},{"./ajax":2,"./canPlayM3U8":3,"./log":8}],18:[function(require,module,exports){
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

},{"./ajax":2,"./canPlayM3U8":3,"./httpProxy":6,"./log":8,"./queryString":13}],19:[function(require,module,exports){
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
},{"./ajax":2,"./canPlayM3U8":3,"./log":8,"./seeker_youku":20}],20:[function(require,module,exports){
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

	function na(a) {
		if (!a) return "";
		var a = a.toString(),
			c, b, f, i, e, h = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27,
				28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
			];
		i = a.length;
		f = 0;
		for (e = ""; f < i;) {
			do c = h[a.charCodeAt(f++) & 255]; while (f < i && -1 == c);
			if (-1 == c) break;
			do b = h[a.charCodeAt(f++) & 255]; while (f < i && -1 == b);
			if (-1 == b) break;
			e += String.fromCharCode(c << 2 | (b & 48) >> 4);
			do {
				c = a.charCodeAt(f++) & 255;
				if (61 == c) return e;
				c = h[c]
			} while (f < i && -1 == c);
			if (-1 == c) break;
			e += String.fromCharCode((b & 15) << 4 | (c & 60) >> 2);
			do {
				b = a.charCodeAt(f++) & 255;
				if (61 == b) return e;
				b = h[b]
			} while (f < i && -1 == b);
			if (-1 == b) break;
			e += String.fromCharCode((c &
				3) << 6 | b)
		}
		return e
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
	function T (a, c) {
		this._sid = sid;
		this._seed = a.seed;
		this._fileType = c;
		var b = new U(this._seed);
		this._streamFileIds = a.streamfileids;
		this._videoSegsDic = {};
		for (c in a.segs) {		
			for (var f = [], i = 0, g = 0; g < a.segs[c].length; g++) {
				var h = a.segs[c][g],
					q = {};
				q.no = h.no;
				q.size = h.size;
				q.seconds = h.seconds;
				h.k && (q.key = h.k);
				q.fileId = this.getFileId(a.streamfileids, c, parseInt(g), b);
				q.type = c;
				q.src = this.getVideoSrc(h.no, a, c, q.fileId);
				f[i++] = q
			}
			this._videoSegsDic[c] = f
		}	
	}

	function U (a) {
		this._randomSeed = a;
		this.cg_hun();
	};
	U.prototype = {
		cg_hun: function() {
			this._cgStr = "";
			for (var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890", c = a.length, b = 0; b < c; b++) {
				var f = parseInt(this.ran() * a.length);
				this._cgStr += a.charAt(f);
				a = a.split(a.charAt(f)).join("")
			}
		},
		cg_fun: function(a) {
			for (var a = a.split("*"), c = "", b = 0; b < a.length - 1; b++) c += this._cgStr.charAt(a[b]);
			return c
		},
		ran: function() {
			this._randomSeed = (211 * this._randomSeed +
				30031) % 65536;
			return this._randomSeed / 65536
		}
	};
	T.prototype = {
		getFileId: function(a, c, b, f) {
			for (var i in a)
				if (i == c) {
					streamFid = a[i];
					break
				}
			if ("" == streamFid) return "";
			c = f.cg_fun(streamFid);
			a = c.slice(0, 8);
			b = b.toString(16);
			1 == b.length && (b = "0" + b);
			b = b.toUpperCase();
			c = c.slice(10, c.length);
			return a + b + c
		},
		getVideoSrc: function(a, c, d, f, i, g) {
			if (!c.videoid || !d) return "";
			var h = {
				flv: 0,
				flvhd: 0,
				mp4: 1,
				hd2: 2,
				"3gphd": 1,
				"3gp": 0
			}[d],
				q = {
					flv: "flv",
					mp4: "mp4",
					hd2: "flv",
					"3gphd": "mp4",
					"3gp": "flv"
				}[d],
				k = a.toString(16);
			1 == k.length && (k =
				"0" + k);
			var l = c.segs[d][a].seconds,
				a = c.segs[d][a].k;
			if ("" == a || -1 == a) a = c.key2 + c.key1;
			d = "";
			c.show && (d = c.show.show_paid ? "&ypremium=1" : "&ymovie=1");
			c = "/player/getFlvPath/sid/" + sid + "_" + k + "/st/" + q + "/fileid/" + f + "?K=" + a + "&hd=" + h + "&myp=0&ts=" + l + "&ypp=0" + d;
			f = encodeURIComponent(D(E(F(mk_a4 + "poz" + userCache_a2, [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]).toString(), sid + "_" + f + "_" + token)));
			c = c + ("&ep=" + f) + "&ctype=12&ev=1" + ("&token=" + token);
			c += "&oip=" + rs.data[0].ip;
			return "http://k.youku.com" + (c + ((i ? "/password/" + i : "") + (g ? g : "")))
		}
	};
	ajax({
		url: 'http://v.youku.com/player/getPlaylist/VideoIDS/' + _id + '/Pf/4/ctype/12/ev/1',
		jsonp: '__callback',
		callback: function (param) {
			if(param == -1) {
				log('\u89e3\u6790youku\u89c6\u9891\u5730\u5740\u5931\u8d25', 2)
			}
			rs = param;
			var a = param.data[0],
				c = E(F(mk_a3 + "o0b" + userCache_a1, [19, 1, 4, 7, 30, 14, 28, 8, 24,
					17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26
				]).toString(), na(a.ep));
			c     = c.split("_");
			sid   = c[0];
			token = c[1];
			if ( canPlayM3U8 && navigator.userAgent.indexOf('PlayStation') === -1 ) {
				var ep  = encodeURIComponent(D(E(F(mk_a4 + "poz" + userCache_a2, [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]).toString(), sid + "_" + _id + "_" + token)));
				var oip = a.ip;
				var source = [
					['\u8d85\u6e05', 'http://pl.youku.com/playlist/m3u8?vid='+_id+'&type=hd2&ctype=12&keyframe=1&ep='+ep+'&sid='+sid+'&token='+token+'&ev=1&oip='+oip],
					['\u9ad8\u6e05', 'http://pl.youku.com/playlist/m3u8?vid='+_id+'&type=mp4&ctype=12&keyframe=1&ep='+ep+'&sid='+sid+'&token='+token+'&ev=1&oip='+oip],
					['\u6807\u6e05', 'http://pl.youku.com/playlist/m3u8?vid='+_id+'&type=flv&ctype=12&keyframe=1&ep='+ep+'&sid='+sid+'&token='+token+'&ev=1&oip='+oip]
				];
				log('\u89e3\u6790youku\u89c6\u9891\u5730\u5740\u6210\u529f ' + source.map(function (item) {return '<a href='+item[1]+'>'+item[0]+'</a>'}).join(' '), 2)

				callback(source);
			} else {
				var t = new T(a);
				var source = [
					['\u6807\u6e05', t._videoSegsDic['3gphd'][0].src]
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
},{"./ajax":2,"./canPlayM3U8":3,"./log":8}],21:[function(require,module,exports){
module.exports = [
	require('./seeker_bilibili'),
	require('./seeker_youku'),
	require('./seeker_tudou'),
	require('./seeker_iqiyi'),
	require('./seeker_hunantv'),
	require('./seeker_91porn')
	// ,require('./seeker_example')
]

},{"./seeker_91porn":14,"./seeker_bilibili":15,"./seeker_hunantv":17,"./seeker_iqiyi":18,"./seeker_tudou":19,"./seeker_youku":20}]},{},[1]);
