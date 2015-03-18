(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*  ＃function ajax#
 *  < {
 *    url:          String   请求地址
 *    param:        Object   请求参数.可缺省
 *    method:       String   请求方法GET,POST,etc. 可缺省，默认是GET 
 *    callback:     Function 请求的callback, 如果失败返回－1， 成功返回内容
 *    contentType:  String   返回内容的格式。如果是JOSN会做JSON Parse， 可缺省,默认是json
 *    context:      Any      callback回调函数的this指向。可缺省
 *  }
 *  用于发起ajax或者jsonp请求
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
	if (method === 'get') {
		url = joinUrl(url, query)
		query = ''
	}
	xhr.open(method, url, true)
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
	xhr.send(query)
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 ) {
			if (xhr.status === 200) {
				var data = request.responseText
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
},{"./jsonp":7,"./noop":10,"./queryString":13}],2:[function(require,module,exports){
/*  ＃Bool canPlayM3U8＃
 *  返回浏览器是否支持m3u8格式的视频播放。
 *  目前chrome,firefox只支持mp4
 */
module.exports = !!document.createElement('video').canPlayType('application/x-mpegURL')
},{}],3:[function(require,module,exports){
/*
 * 用于简单创建html节点
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
},{}],4:[function(require,module,exports){
var flashBlocker  = require('./flashBlocker')
var createElement = require('./createElement')
var player        = require('./player')
var log           = require('./log')
var mamaKey       = require('./mamaKey')
var seekers       = require('./seekers')
var matched

if (window[mamaKey] != true) {

window[mamaKey] = true

function seeked (source, comments) {
	if (source === false) {
		delete window[mamaKey]
		return
	}
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
	var container = createElement('div', {
		appendTo: mask,
		style: {
			width: '800px',
			height: '400px',
			position: 'absolute',
			top: '50%',
			left: '50%',
			marginTop: '-200px',
			marginLeft: '-400px',
			borderRadius: '2px',
			boxShadow: '0 0 2px #000000, 0 0 200px #000000'
		}
	})
	var container = createElement('div', {
		appendTo: mask,
		innerHTML: '<div id="MAMA2_video_placeHolder"></div>',
		style: {
			width: '800px',
			height: '400px',
			position: 'absolute',
			backgroundColor: '#000000',
			top: '50%',
			left: '50%',
			marginTop: '-200px',
			marginLeft: '-400px',
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
		player.video.src = "about:blank"
		delete window[mamaKey]
	}
	var player = new MAMAPlayer('MAMA2_video_placeHolder', '800x400', source, comments)
	player.iframe.contentWindow.focus();
	flashBlocker()
	player.iframe.style.display = 'block'
}

seekers.forEach(function (seeker) {
	if (matched === true) return
	if (!!seeker.match() === true) {
		matched = true
		seeker.getVideos(seeked)		
	}
})

if (matched === undefined) {
	log('对不起，没有找到可以解析的内容', 2)
}


}
},{"./createElement":3,"./flashBlocker":5,"./log":8,"./mamaKey":9,"./player":11,"./seekers":17}],5:[function(require,module,exports){
/*  
 *  用于屏蔽页面上的所有flash
 */
var flashText = '<div style="text-shadow:0 0 2px #eee;letter-spacing:-1px;background:#eee;font-weight:bold;padding:0;font-family:arial,sans-serif;font-size:30px;color:#ccc;width:152px;height:52px;border:4px solid #ccc;border-radius:12px;position:absolute;top:50%;left:50%;margin:-30px 0 0 -80px;text-align:center;line-height:52px;">Flash</div>';

var count = 0;
var flashBlocks = {};
//点击时间触发
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
/*  ＃function httpProxy#
 *  < String        请求地址
 *  < String        请求方法GET,POST,etc.
 *  < Object        请求参数
 *  < Function      请求的callback, 如果失败返回－1， 成功返回内容
 *  < {
 *      xml:       Bool   是否需要做xml2json 可缺省, 默认fasle
 *      gzinflate: Bool   是否需要做gzinflate 可缺省, 默认fasle
 *      context:   Any    callback回调的this指向 可缺省
 *    }
 *  }
 *  用于发起跨域的ajax请求。既接口返回跨域又不支持jsonp协议的
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
			params: encodeURIComponent(queryString(params)),//上行参数
			
			url: encodeURIComponent(url),
			post: type === 'post' ? 1 : 0,			
			xml: opts.xml ? 1 : 0,
			gzinflate: opts.gzinflate ? 1 : 0
		},
		jsonp: true,
		callback: callback,
		context: opts.context
	})
}

module.exports = httpProxy
},{"./ajax":1,"./createElement":3,"./queryString":13}],7:[function(require,module,exports){
/*  ＃function jsonp#
 *  jsonp方法。推荐使用ajax方法。ajax包含了jsonp
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
},{"./createElement":3,"./noop":10}],8:[function(require,module,exports){
/*  ＃function log＃
 *  < String
 *  log, 会在页面和console中输出log
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
	console && console.log('%c MAMA2 %c %s', 'background:#24272A; color:#ffffff', '', msg)

	document.body.appendChild(MAMALogDOM)
	logTimer = setTimeout(function () {
		document.body.removeChild(MAMALogDOM)
	}, delay*1000 || logDelay)
}
module.exports = log
},{"./createElement":3}],9:[function(require,module,exports){
//妈妈计划唯一值
module.exports = 'MAMAKEY_田琴是这个世界上最可爱的女孩子呵呵呵呵，我要让全世界都在知道'
},{}],10:[function(require,module,exports){
//空方法
module.exports = function () {}
},{}],11:[function(require,module,exports){
// MAMAPlayer 
// https://github.com/zythum/mamaplayer
!function e(t,o,i){function n(r,a){if(!o[r]){if(!t[r]){var l="function"==typeof require&&require;if(!a&&l)return l(r,!0);if(s)return s(r,!0);throw new Error("Cannot find module '"+r+"'")}var c=o[r]={exports:{}};t[r][0].call(c.exports,function(e){var o=t[r][1][e];return n(o?o:e)},c,c.exports,e,t,o,i)}return o[r].exports}for(var s="function"==typeof require&&require,r=0;r<i.length;r++)n(i[r]);return n}({1:[function(e,t){function o(e){for(var t=[],o=1;o<arguments.length;o++){var n=arguments[o],s=n.init;t.push(s),delete n.init,i(e.prototype,n)}e.prototype.init=function(){t.forEach(function(e){e.call(this)}.bind(this))}}var i=e("./extend");t.exports=o},{"./extend":9}],2:[function(e,t){var o=e("./player.css"),i=e("./player.html"),n=(e("./extend"),e("./createElement")),s=e("./parseDOMByClassNames");t.exports={init:function(){var e=function(){var e=this.iframe.contentDocument.getElementsByTagName("head")[0],t=this.iframe.contentDocument.body;n("style",function(){e.appendChild(this);try{this.styleSheet.cssText=o}catch(t){this.appendChild(document.createTextNode(o))}}),n("link",{appendTo:e,href:"http://libs.cncdn.cn/font-awesome/4.3.0/css/font-awesome.min.css",rel:"stylesheet",type:"text/css"}),t.innerHTML=i,this.DOMs=s(t,["player","video","video-frame","comments","comments-btn","play","progress_anchor","buffered_anchor","fullscreen","allscreen","hd","volume_anchor","current","duration"]),this.video=this.DOMs.video}.bind(this),t=document.getElementById(this.id),r=this.iframe=n("iframe",{allowTransparency:!0,frameBorder:"no",scrolling:"no",src:"about:blank",mozallowfullscreen:"mozallowfullscreen",webkitallowfullscreen:"webkitallowfullscreen",style:{width:this.size[0]+"px",height:this.size[1]+"px",overflow:"hidden"}});t&&t.parentNode?(t.parentNode.replaceChild(r,t),e()):(document.body.appendChild(r),e(),document.body.removeChild(r))}}},{"./createElement":7,"./extend":9,"./parseDOMByClassNames":11,"./player.css":12,"./player.html":13}],3:[function(e,t){var o=(e("./createElement"),.1),i=25,n=4e3,s='bold 18px "PingHei","Lucida Grande", "Lucida Sans Unicode", "STHeiti", "Helvetica","Arial","Verdana","sans-serif"';t.exports={init:function(){setInterval(this.onCommentTimeUpdate.bind(this),80),this.lastCommnetUpdateTime=0,this.lastCommnetIndex=0,this.commentLoopPreQueue=[],this.commentLoopQueue=[],this.commentButtonPreQueue=[],this.commentButtonQueue=[],this.commentTopPreQueue=[],this.commentTopQueue=[],this.enableComment=void 0===this.comments?!1:!0,this.canvas=this.DOMs.comments.getContext("2d"),this.DOMs.player.classList.add("has-comments"),this.DOMs["comments-btn"].classList.add("enable"),this.DOMs.comments.display=this.enableComment?"block":"none"},drawText:function(e,t,o,i){this.canvas.fillStyle=i,this.canvas.strokeText(e,0|t,0|o),this.canvas.fillText(e,0|t,0|o)},drawCommentTop:function(){var e=Date.now();this.canvas.textAlign="center",this.commentTopQueue.forEach(function(t,o){void 0!=t&&(e>t.startTime+commentTopOrTopShowDuration?this.commentTopQueue[o]=void 0:this.drawText(t.text,this.canvasWidth/2,i*o,t.color))}.bind(this));for(var t;t=this.commentTopPreQueue.shift();)t={startTime:e,text:t.text,color:t.color},this.commentTopQueue.forEach(function(e,o){t&&void 0===e&&(e=this.commentTopQueue[o]=t,this.drawText(e.text,this.canvasWidth/2,i*o,e.color),t=void 0)}.bind(this)),t&&(this.commentTopQueue.push(t),this.drawText(t.text,this.canvasWidth/2,i*(this.commentTopQueue.length-1),t.color))},drawCommentBottom:function(){var e=Date.now(),t=this.video.offsetHeight+10;this.canvas.textAlign="center",this.commentButtonQueue.forEach(function(o,s){void 0!=o&&(e>o.startTime+n?this.commentButtonQueue[s]=void 0:this.drawText(o.text,this.canvasWidth/2,t-i*(s+1),o.color))}.bind(this));for(var o;o=this.commentButtonPreQueue.shift();)o={startTime:e,text:o.text,color:o.color},this.commentButtonQueue.forEach(function(e,n){o&&void 0===e&&(e=this.commentButtonQueue[n]=o,this.drawText(e.text,this.canvasWidth/2,t-i*(n+1),e.color),o=void 0)}.bind(this)),o&&(this.commentButtonQueue.push(o),this.drawText(o.text,this.canvasWidth/2,t-i*this.commentButtonQueue.length,o.color))},createLoopComment:function(e,t){return void 0===e?!1:{startTime:t,text:e.text,color:e.color,width:this.canvas.measureText(e.text).width+20}},drawCommentLoop:function(){{var e=Date.now(),t=this.video.offsetWidth,n=this.video.offsetHeight,s=this.canvasWidth;this.canvasHeight}this.canvas.textAlign="left";for(var r=n/i|0,a=-1;++a<r;){var l=this.commentLoopQueue[a];if(void 0===l&&(l=this.commentLoopQueue[a]=[]),this.commentLoopPreQueue.length>0){var c=0===l.length?void 0:l[l.length-1];if(void 0===c||(e-c.startTime)*o>c.width){var h=this.createLoopComment(this.commentLoopPreQueue.shift(),e);h&&l.push(h)}}this.commentLoopQueue[a]=l.filter(function(n){var r=(e-n.startTime)*o;return 0>r||r>n.width+t?!1:(this.drawText(n.text,s-r,i*a+20,n.color),!0)}.bind(this))}for(var d=this.commentLoopQueue.length-r;d-->0;)this.commentLoopQueue.pop()},drawComment:function(){var e=this.DOMs["video-frame"].offsetWidth,t=this.DOMs["video-frame"].offsetHeight;e!=this.canvasWidth&&(this.DOMs.comments.setAttribute("width",e),this.canvasWidth=e),t!=this.canvasHeight&&(this.DOMs.comments.setAttribute("height",t),this.canvasHeight=t),this.canvas.clearRect(0,0,this.canvasWidth,this.canvasHeight),this.canvas.strokeStyle="black",this.canvas.lineWidth=2,this.canvas.font=s,this.drawCommentLoop(),this.drawCommentBottom()},onCommentTimeUpdate:function(){if(this.enableComment!==!1){var e=this.video.currentTime;if(Math.abs(e-this.lastCommnetUpdateTime)<=1&&e>this.lastCommnetUpdateTime){var t=0;for(this.lastCommnetIndex&&this.comments[this.lastCommnetIndex].time<=this.lastCommnetUpdateTime&&(t=this.lastCommnetIndex);++t<this.comments.length;)if(!(this.comments[t].time<=this.lastCommnetUpdateTime)){if(this.comments[t].time>e)break;switch(this.comments[t].pos){case"bottom":this.commentButtonPreQueue.push(this.comments[t]);break;case"top":this.commentTopPreQueue.push(this.comments[t]);break;default:this.commentLoopPreQueue.push(this.comments[t])}this.lastCommnetIndex=t}}try{this.drawComment()}catch(o){}this.lastCommnetUpdateTime=e}}}},{"./createElement":7}],4:[function(e,t){function o(e){return Array.prototype.slice.call(e)}function i(e,t,o,i){function n(t){var o=(t.clientX-e.parentNode.getBoundingClientRect().left)/e.parentNode.offsetWidth;return Math.min(Math.max(o,0),1)}function s(t){1==t.which&&(l=!0,e.draging=!0,r(t))}function r(e){if(1==e.which&&l===!0){var t=n(e);o(t)}}function a(t){if(1==t.which&&l===!0){var s=n(t);o(s),i(s),l=!1,delete e.draging}}var l=!1;o=o||function(){},i=i||function(){},e.parentNode.addEventListener("mousedown",s),t.addEventListener("mousemove",r),t.addEventListener("mouseup",a)}var n=(e("./createElement"),e("./delegateClickByClassName")),s=e("./timeFormat");t.exports={init:function(){var e=this.iframe.contentDocument,t=n(e);t.on("play",this.onPlayClick,this),t.on("video-frame",this.onVideoClick,this),t.on("source",this.onSourceClick,this),t.on("allscreen",this.onAllScreenClick,this),t.on("fullscreen",this.onfullScreenClick,this),t.on("normalscreen",this.onNormalScreenClick,this),t.on("comments-btn",this.oncommentsBtnClick,this),e.documentElement.addEventListener("keydown",this.onKeyDown.bind(this),!1),this.DOMs.player.addEventListener("mousemove",this.onMouseActive.bind(this)),i(this.DOMs.progress_anchor,e,this.onProgressAnchorWillSet.bind(this),this.onProgressAnchorSet.bind(this)),i(this.DOMs.volume_anchor,e,this.onVolumeAnchorWillSet.bind(this))},onKeyDown:function(e){switch(e.preventDefault(),e.keyCode){case 32:this.onPlayClick();break;case 39:this.video.currentTime=Math.min(this.video.duration,this.video.currentTime+10);break;case 37:this.video.currentTime=Math.max(0,this.video.currentTime-10);break;case 38:this.video.volume=Math.min(1,this.video.volume+.1),this.DOMs.volume_anchor.style.width=100*this.video.volume+"%";break;case 40:this.video.volume=Math.max(0,this.video.volume-.1),this.DOMs.volume_anchor.style.width=100*this.video.volume+"%";break;case 65:this.DOMs.player.classList.contains("allscreen")?this.onNormalScreenClick():this.onAllScreenClick();break;case 70:this.DOMs.player.classList.contains("fullscreen")||this.onfullScreenClick()}},onVideoClick:function(){void 0==this.videoClickDblTimer?this.videoClickDblTimer=setTimeout(function(){this.videoClickDblTimer=void 0,this.onPlayClick()}.bind(this),300):(clearTimeout(this.videoClickDblTimer),this.videoClickDblTimer=void 0,document.fullscreenElement||document.mozFullScreenElement||document.webkitFullscreenElement?this.onNormalScreenClick():this.onfullScreenClick())},onMouseActive:function(){this.DOMs.player.classList.add("active"),clearTimeout(this.MouseActiveTimer),this.MouseActiveTimer=setTimeout(function(){this.DOMs.player.classList.remove("active")}.bind(this),1e3)},onPlayClick:function(){this.DOMs.play.classList.contains("paused")?(this.video.play(),this.DOMs.play.classList.remove("paused")):(this.video.pause(),this.DOMs.play.classList.add("paused"))},onSourceClick:function(e){e.classList.contains("curr")||(this.video.preloadStartTime=this.video.currentTime,this.video.src=this.sourceList[0|e.getAttribute("sourceIndex")][1],o(e.parentNode.childNodes).forEach(function(t){e===t?t.classList.add("curr"):t.classList.remove("curr")}.bind(this)))},onProgressAnchorWillSet:function(e){var t=this.video.duration,o=t*e;this.DOMs.current.innerHTML=s(o),this.DOMs.duration.innerHTML=s(t),this.DOMs.progress_anchor.style.width=100*e+"%"},onProgressAnchorSet:function(e){this.video.currentTime=this.video.duration*e},onVolumeAnchorWillSet:function(e){this.video.volume=e,this.DOMs.volume_anchor.style.width=100*e+"%"},onAllScreenClick:function(){var e=document.documentElement.clientWidth,t=document.documentElement.clientHeight;this.iframe.style.cssText=";position:fixed;top:0;left:0;width:"+e+"px;height:"+t+"px;z-index:999999;",this.allScreenWinResizeFunction=this.allScreenWinResizeFunction||function(){this.iframe.style.width=document.documentElement.clientWidth+"px",this.iframe.style.height=document.documentElement.clientHeight+"px"}.bind(this),window.removeEventListener("resize",this.allScreenWinResizeFunction),window.addEventListener("resize",this.allScreenWinResizeFunction),this.DOMs.player.classList.add("allscreen")},onfullScreenClick:function(){["webkitRequestFullScreen","mozRequestFullScreen","requestFullScreen"].forEach(function(e){this.DOMs.player[e]&&this.DOMs.player[e]()}.bind(this)),this.onMouseActive()},onNormalScreenClick:function(){window.removeEventListener("resize",this.allScreenWinResizeFunction),this.iframe.style.cssText=";width:"+this.size[0]+"px;height:"+this.size[1]+"px;",["webkitCancelFullScreen","mozCancelFullScreen","cancelFullScreen"].forEach(function(e){document[e]&&document[e]()}),this.DOMs.player.classList.remove("allscreen")},oncommentsBtnClick:function(){this.enableComment=!this.DOMs["comments-btn"].classList.contains("enable"),this.enableComment?(setTimeout(function(){this.DOMs.comments.style.display="block"}.bind(this),80),this.DOMs["comments-btn"].classList.add("enable")):(this.DOMs.comments.style.display="none",this.DOMs["comments-btn"].classList.remove("enable"))}}},{"./createElement":7,"./delegateClickByClassName":8,"./timeFormat":14}],5:[function(e,t){{var o=(e("./extend"),e("./createElement"));e("./parseDOMByClassNames")}t.exports={init:function(){var e=0;this.sourceList.forEach(function(t,i){o("li",{appendTo:this.DOMs.hd,sourceIndex:i,className:"source "+(i===e?"curr":""),innerHTML:t[0]})}.bind(this)),this.DOMs.video.src=this.sourceList[e][1]}}},{"./createElement":7,"./extend":9,"./parseDOMByClassNames":11}],6:[function(e,t){var o=e("./timeFormat");t.exports={init:function(){this.video.addEventListener("timeupdate",this.onVideoTimeUpdate.bind(this)),this.video.addEventListener("play",this.onVideoPlay.bind(this)),this.video.addEventListener("pause",this.onVideoTimePause.bind(this)),this.video.addEventListener("loadedmetadata",this.onVideoLoadedMetaData.bind(this)),setInterval(this.videoBuffered.bind(this),1e3),this.DOMs.volume_anchor.style.width=100*this.video.volume+"%"},onVideoTimeUpdate:function(){var e=this.video.currentTime,t=this.video.duration;this.DOMs.current.innerHTML=o(e),this.DOMs.duration.innerHTML=o(t),this.DOMs.progress_anchor.draging||(this.DOMs.progress_anchor.style.width=100*Math.min(Math.max(e/t,0),1)+"%")},videoBuffered:function(){var e=this.video.buffered,t=this.video.currentTime,o=0==e.length?0:e.end(e.length-1);this.DOMs.buffered_anchor.style.width=100*Math.min(Math.max(o/this.video.duration,0),1)+"%",0==o||t>=o?this.DOMs.player.classList.add("loading"):this.DOMs.player.classList.remove("loading")},onVideoPlay:function(){this.DOMs.play.classList.remove("paused")},onVideoTimePause:function(){this.DOMs.play.classList.add("paused")},onVideoLoadedMetaData:function(){this.video.preloadStartTime&&(this.video.currentTime=this.video.preloadStartTime,delete this.video.preloadStartTime)}}},{"./timeFormat":14}],7:[function(e,t){function o(e,t){var o=document.createElement(e);if("function"==typeof t)t.call(o);else for(var i in t)if(t.hasOwnProperty(i))switch(i){case"appendTo":t[i].appendChild(o);break;case"text":var n=document.createTextNode(t[i]);o.innerHTML="",o.appendChild(n);break;case"innerHTML":case"className":case"id":o[i]=t[i];break;case"style":var s=t[i];for(var r in s)s.hasOwnProperty(r)&&(o.style[r]=s[r]);break;default:o.setAttribute(i,t[i]+"")}return o}t.exports=o},{}],8:[function(e,t){function o(e){return Array.prototype.slice.call(e)}function i(e){this._eventMap={},this._rootElement=e,this._isRootElementBindedClick=!1,this._bindClickFunction=function(e){!function t(e,i){i&&i.nodeName&&(i.classList&&o(i.classList).forEach(function(t){e.trigger(t,i)}),t(e,i.parentNode))}(this,e.target)}.bind(this)}var n=e("./extend");n(i.prototype,{on:function(e,t,o){void 0===this._eventMap[e]&&(this._eventMap[e]=[]),this._eventMap[e].push([t,o]),this._isRootElementBindedClick||(_isRootElementBindedClick=!0,this._rootElement.addEventListener("click",this._bindClickFunction,!1))},off:function(e,t){if(void 0!=this._eventMap[e])for(var o=this._eventMap[e].length;o--;)if(this._eventMap[e][o][0]===t){this._eventMap[e].splice(o,1);break}for(var i in this._eventMap)break;void 0===i&&this._isRootElementBindedClick&&(_isRootElementBindedClick=!1,this._rootElement.removeEventListener("click",this._bindClickFunction,!1))},trigger:function(e,t){t=void 0===t?this._rootElement.getElementsByTagNames(e):[t],t.forEach(function(t){(this._eventMap[e]||[]).forEach(function(e){e[0].call(e[1],t)})}.bind(this))}}),t.exports=function(e){return new i(e)}},{"./extend":9}],9:[function(e,t){function o(e){for(var t,o=arguments.length,i=1;o>i;){t=arguments[i++];for(var n in t)t.hasOwnProperty(n)&&(e[n]=t[n])}return e}t.exports=o},{}],10:[function(e){function t(e,t,o,i){this.id=e,this.size=t.split("x"),this.sourceList=o||[],this.comments=i,this.init()}window.MAMAPlayer=t,e("./component")(t,e("./component_build"),e("./component_event"),e("./component_video"),e("./component_source"),e("./component_comments"))},{"./component":1,"./component_build":2,"./component_comments":3,"./component_event":4,"./component_source":5,"./component_video":6}],11:[function(e,t){function o(e,t){var o={};return t.forEach(function(t){o[t]=e.getElementsByClassName(t)[0]}),o}t.exports=o},{}],12:[function(e,t){t.exports='* { margin:0; padding:0; }body { font-family: "PingHei","Lucida Grande", "Lucida Sans Unicode", "STHeiti", "Helvetica","Arial","Verdana","sans-serif"; font-size:16px;}html, body, .player { height: 100%; }.player:-webkit-full-screen { width: 100%; cursor:url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==); }.player:-moz-full-screen { width: 100%; cursor:url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==); }.player:full-screen { width: 100%; cursor:url(data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==); }.player {		border-radius: 3px;	overflow: hidden;	position: relative;	cursor: default;	-webkit-user-select: none;	-moz-user-select: none;	user-select: none;}.video-frame {	box-sizing: border-box;	padding-bottom: 50px;	height: 100%;	overflow: hidden;	position: relative;}.video-frame .comments{	position: absolute;	top:0;left:0;	width:100%;	height:100%;	-webkit-transform:translateZ(0);	-moz-transform:translateZ(0);	transform:translateZ(0);}.player:-webkit-full-screen .video-frame { padding-bottom: 0px; }.player:-moz-full-screen .video-frame { padding-bottom: 0px; }.player:full-screen .video-frame{ padding-bottom: 0px; }.video {	width: 100%;	height: 100%;	background: #000000;}.controller {	position: absolute;	bottom: 0px;	left:0;	right:0;	background: #24272A;	height: 50px;}.controller .loading-icon {	display: none;	position: absolute;	width: 20px;	height: 20px;	line-height: 20px;	text-align: center;	font-size: 20px;	color: #ffffff;	top: -30px;	right: 10px;}.player.loading .controller .loading-icon {	display: block;}.player:-webkit-full-screen .controller {	-webkit-transform:translateY(50px);	-webkit-transition: -webkit-transform 0.3s ease;}.player:-moz-full-screen .controller {	-moz-transform:translateY(50px);	-moz-transition: -moz-transform 0.3s ease;}.player:full-screen .controller {	transform:translateY(50px);	transition: transform 0.3s ease;}.player.active:-webkit-full-screen {	cursor: default;}.player.active:-moz-full-screen {	cursor: default;}.player.active:full-screen {	cursor: default;}.player.active:-webkit-full-screen .controller,.player:-webkit-full-screen .controller:hover {	-webkit-transform:translateY(0);	cursor: default;}.player.active:-moz-full-screen .controller,.player:-moz-full-screen .controller:hover {	-moz-transform:translateY(0);	cursor: default;}.player.active:full-screen .controller.player:full-screen .controller:hover {	transform:translateY(0);	cursor: default;}.player.active:-webkit-full-screen .controller .progress .progress_anchor:after,.player:-webkit-full-screen .controller:hover .progress .progress_anchor:after {	height:12px;}.player.active:-moz-full-screen .controller .progress .progress_anchor:after,.player:-moz-full-screen .controller:hover .progress .progress_anchor:after {	height:12px;}.player.active:full-screen .controller .progress .progress_anchor:after,.player:full-screen .controller:hover .progress .progress_anchor:after {	height:12px;}.player:-webkit-full-screen .controller .progress .progress_anchor:after {	height:4px;}.player:-moz-full-screen .controller .progress .progress_anchor:after {	height:4px;}.player:full-screen .controller .progress .progress_anchor:after {	height:4px;}.controller .progress {	position: absolute;	top:0px;	left:0;	right:0;	border-right: 4px solid #181A1D;	border-left: 8px solid #DF6558;	height: 4px;	background: #181A1D;	z-index:1;	-webkit-transform: translateZ(0);	-moz-transform: translateZ(0);	transform: translateZ(0);}.controller .progress:after {	content:"";	display: block;	position: absolute;	top:0px;	left:0;	right:0;	bottom:-10px;	height: 10px;}.controller .progress .anchor {	height: 4px;	background: #DF6558;	position: absolute;	top:0;left:0;}.controller .progress .anchor:after {	content:"";	display: block;	width: 12px;	background: #DF6558;	position: absolute;	right:-4px;	top: 50%;	height: 12px;	box-shadow: 0 0 2px rgba(0,0,0, 0.4);	border-radius: 12px;	-webkit-transform: translateY(-50%);	-moz-transform: translateY(-50%);	transform: translateY(-50%);}.controller .progress .anchor.buffered_anchor {		position: relative;	background: rgba(255,255,255,0.1);}.controller .progress .anchor.buffered_anchor:after {	box-shadow: none;	height: 4px;	width: 4px;	border-radius: 0;	background: rgba(255,255,255,0.1);}.controller .right {	height: 50px;	position: absolute;	top:0;	left:10px;	right:10px;	pointer-events: none;}.controller .play,.controller .volume,.controller .time,.controller .hd,.controller .allscreen,.controller .normalscreen,.controller .comments-btn,.controller .fullscreen {	padding-top:4px;	height: 46px;	line-height: 50px;	text-align: center;	color: #eeeeee;	float:left;	text-shadow:0 0 2px rgba(0,0,0,0.5);	pointer-events: auto;}.controller .hd,.controller .allscreen,.controller .normalscreen,.controller .comments-btn,.controller .fullscreen {	float:right;}.controller .play {	width: 36px;	padding-left: 10px;	cursor: pointer;}.controller .play:after {	font-family: "FontAwesome";	content: "";}.controller .play.paused:after {	content: "";}.controller .volume {	min-width: 30px;	position: relative;	overflow: hidden;	-webkit-transition: min-width 0.3s ease 0.5s;	-moz-transition: min-width 0.3s ease 0.5s;	transition: min-width 0.3s ease 0.5s;}.controller .volume:hover {	min-width: 128px;}.controller .volume:before {	font-family: "FontAwesome";	content: "";	width: 36px;	display: block;}.controller .volume .progress {	width: 70px;	top: 27px;	left: 40px;}.controller .time {	font-size: 12px;	font-weight: bold;	padding-left: 10px;}.controller .time .current {	color: #DF6558;}.controller .fullscreen,.controller .allscreen,.controller .comments-btn,.controller .normalscreen {	width: 36px;	cursor: pointer;}.controller .comments-btn {	margin-right: -15px;	display: none;}.player.has-comments .controller .comments-btn {	display: block;}.controller .comments-btn:before {	font-family: "FontAwesome";	content: "";}.controller .comments-btn.enable:before {	color: #DF6558;}.controller .normalscreen {	display: none;}.player:-webkit-full-screen .controller .fullscreen,.player:-webkit-full-screen .controller .allscreen {	display: none;}.player:-webkit-full-screen .controller .normalscreen,.player.allscreen .controller .normalscreen {	display: block;}.player.allscreen .controller .allscreen {	display: none;}.controller .fullscreen:before {	font-family: "FontAwesome";	content: "";}.controller .allscreen:before {	font-family: "FontAwesome";	content: "";}.controller .normalscreen:before {	font-family: "FontAwesome";	content: "";}.controller .hd {	white-space:nowrap;	overflow: hidden;	margin-right: 10px;	text-align: right;}.controller .hd:hover li {	max-width: 300px;}.controller .hd li {	display: inline-block;	max-width: 0px;	-webkit-transition: max-width 0.8s ease 0.3s;	-moz-transition: max-width 0.8s ease 0.3s;	transition: max-width 0.8s ease 0.3s;	overflow: hidden;	font-size: 14px;	font-weight: bold;	position: relative;	cursor: pointer;}.controller .hd li:before {	content: "";	display: inline-block;	width:20px;}.controller .hd li:before {	content: "";	display: inline-block;	width:20px;}.controller .hd li.curr {	max-width: 300px;	cursor: default;	color: #DF6558;}.controller .hd li.curr:after {	content: "";	display: block;	position: absolute;	width:4px;	height:4px;	border-radius: 50%;	background: #ffffff;	left: 12px;	top: 23px;	opacity: 0;	-webkit-transition: opacity 0.5s ease 0.3s;	-moz-transition: opacity 0.5s ease 0.3s;	transition: opacity 0.5s ease 0.3s;}'},{}],13:[function(e,t){t.exports='<div class="player">	<div class="video-frame"><video class="video" autoplay="autoplay"></video><canvas class="comments"></canvas></div>	<div class="controller">		<div class="loading-icon fa fa-spin fa-circle-o-notch"></div>		<div class="progress">			<div class="anchor buffered_anchor" style="width:0%"></div>			<div class="anchor progress_anchor" style="width:0%"></div>		</div>		<div class="right">		 			 	<div class="fullscreen"></div>		 	<div class="allscreen"></div>		 	<div class="normalscreen"></div>		 	<ul class="hd"></ul>		 	<div class="comments-btn"></div>		 </div>		 <div class="left">		 	<div class="play paused"></div>		 	<div class="volume">			 	<div class="progress">			 		<div class="anchor volume_anchor" style="width:0%"></div>		 		</div>		 	</div>		 	<div class="time">		 		<span class="current">00:00:00</span> / <span class="duration">00:00:00</span>		 	</div>		 </div>	</div></div>'},{}],14:[function(e,t){function o(e,t){return(Array(t).join(0)+e).slice(-t)}function i(e){var t,i=[];return[3600,60,1].forEach(function(n){i.push(o(t=e/n|0,2)),e-=t*n}),i.join(":")}t.exports=i},{}]},{},[10]);
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
/*  ＃function queryString#
 *  < Object   例如 {a:1,b:2,c:3}
 *  > String   例如 a=1&b=2&c=3
 *  用于拼装url地址的query
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
var purl      = require('./purl')
var log       = require('./log')
var httpProxy = require('./httpProxy')

exports.match = function () {
	var url = purl(location.href)
	return url.attr('host').indexOf('bilibili') >= 0 && /^\/video\/av\d+\/$/.test(url.attr('directory'))
}

exports.getVideos = function (callback) {
	log('开始解析bilibli视频地址')
	var url = purl(location.href)
	var aid = url.attr('directory').match(/^\/video\/av(\d+)\/$/)[1]
	var page = (function () {
		pageMatch = url.attr('file').match(/^index\_(\d+)\.html$/)
		return pageMatch ? pageMatch[1] : 1
	}())
	httpProxy(
		'http://m.acg.tv/m/html5', 
		'get', 
		{aid: aid, page: page},
	function (rs) {
		if (rs && rs.src) {
			log('获取到<a href="'+rs.src+'">视频地址</a>, 并开始解析bilibli弹幕')
			var source = [ ['bilibili', rs.src] ]			
			httpProxy(rs.cid, 'get', {}, function (rs) {
				if (rs && rs.i) {					
					var comments = rs.i.d
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
							color: '#' + (p[3] | 0).toString(16),
							text: comment['#text']
						}
					}).sort(function (a, b) {
						return a.time - b.time
					})
					log('一切顺利开始播放', 2)
					callback(source, comments)
				} else {
					log('开始解析bilibli弹幕失败, 但勉强可以播放', 2)
					callback(source)
				}

			}, {gzinflate:1, xml:1})
		} else {
			log('解析bilibli视频地址失败', 2)
			callback(false)
		}
	})
}
},{"./httpProxy":6,"./log":8,"./purl":12}],15:[function(require,module,exports){
var canPlayM3U8 = require('./canPlayM3U8')
var ajax        = require('./ajax')
var log         = require('./log')
var youku       = require('./seeker_youku')

exports.match = function () {
	var _id = window.iid || (window.pageConfig && window.pageConfig.iid) || (window.itemData && window.itemData.iid)
	var youkuCode = window.itemData && window.itemData.vcode
	return /tudou\.com/.test(window.location.host) && (youkuCode || _id)
}

exports.getVideos = function (callback) {	
	var youkuCode = window.itemData && window.itemData.vcode
	if (youkuCode) {
		return youku.parseYoukuCode(youkuCode, callback)
	}
	var _id = window.iid || (window.pageConfig && window.pageConfig.iid) || (window.itemData && window.itemData.iid);
	var m3u8 = function(callback){		
		var urls = [
			['原画', 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + _id + '&st=5'],
			['超清', 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + _id + '&st=4'],
			['高清', 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + _id + '&st=3'],
			['标清', 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + _id + '&st=2']
		]
		var _s
		if(window.itemData && window.itemData.segs){
			urls = []
			_s   = JSON.parse(window.itemData.segs)
			if(_s[5]) urls.push(['原画', 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + _id + '&st=5'])
			if(_s[4]) urls.push(['超清', 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + _id + '&st=4'])
			if(_s[3]) urls.push(['高清', 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + _id + '&st=3'])
			if(_s[2]) urls.push(['标清', 'http://vr.tudou.com/v2proxy/v2.m3u8?it=' + _id + '&st=2'])
		}		
		log('解析tudou视频地址成功 ' + urls.map(function (item) {return '<a href='+item[1]+'>'+item[0]+'</a>'}).join(' '), 2)
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
			callbck: function(param){
				if(param === -1 || param.code == -1) return log('解析tudou视频地址失败')
				for(var urls=[],i=0,len=param.urls.length; i<len; i++){ urls.push([i, param.urls[i]]); }
				log('解析tudou视频地址成功 ' + urls.map(function (item) {return '<a href='+item[1]+'>'+item[0]+'</a>'}).join(' '), 2)
				return callback(urls);
			}
		});
	};
	canPlayM3U8 ? m3u8(callback) : mp4(callback)
}
},{"./ajax":1,"./canPlayM3U8":2,"./log":8,"./seeker_youku":16}],16:[function(require,module,exports){
var canPlayM3U8 = require('./canPlayM3U8')
var ajax        = require('./ajax')
var log         = require('./log')
exports.match = function () {
	return /v\.youku\.com/.test(location.host) && !!window.videoId
}
var parseYoukuCode = exports.parseYoukuCode = function (_id, callback) {
	log('开始解析youku视频地址')	
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
				log('解析youku视频地址失败', 2)
			}
			rs = param;
			var a = param.data[0],
				c = E(F(mk_a3 + "o0b" + userCache_a1, [19, 1, 4, 7, 30, 14, 28, 8, 24,
					17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26
				]).toString(), na(a.ep));
			c     = c.split("_");
			sid   = c[0];
			token = c[1];
			if ( !/PlayStation/.test(window.navigator.userAgent) && canPlayM3U8) {
				var ep  = encodeURIComponent(D(E(F(mk_a4 + "poz" + userCache_a2, [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]).toString(), sid + "_" + _id + "_" + token)));
				var oip = a.ip;
				var source = [
					['超清', 'http://pl.youku.com/playlist/m3u8?vid='+_id+'&type=hd2&ctype=12&keyframe=1&ep='+ep+'&sid='+sid+'&token='+token+'&ev=1&oip='+oip],
					['高清', 'http://pl.youku.com/playlist/m3u8?vid='+_id+'&type=mp4&ctype=12&keyframe=1&ep='+ep+'&sid='+sid+'&token='+token+'&ev=1&oip='+oip],
					['标清', 'http://pl.youku.com/playlist/m3u8?vid='+_id+'&type=flv&ctype=12&keyframe=1&ep='+ep+'&sid='+sid+'&token='+token+'&ev=1&oip='+oip]
				];
				log('解析youku视频地址成功 ' + source.map(function (item) {return '<a href='+item[1]+'>'+item[0]+'</a>'}).join(' '), 2)

				callback(source);
			} else {
				var t = new T(a);
				var source = [
					['标清', t._videoSegsDic['3gphd'][0].src]
				];
				log('解析youku视频地址成功 ' + source.map(function (item) {return '<a href='+item[1]+'>'+item[0]+'</a>'}).join(' '), 2)
				callback(source);
			}
		}
	})
}
exports.getVideos = function (callback) {
	parseYoukuCode(window.videoId, callback)
}
},{"./ajax":1,"./canPlayM3U8":2,"./log":8}],17:[function(require,module,exports){
module.exports = [
	require('./seeker_bilibili'),
	require('./seeker_youku'),
	require('./seeker_tudou')
	// ,require('./seeker_example')
]
},{"./seeker_bilibili":14,"./seeker_tudou":15,"./seeker_youku":16}]},{},[4])