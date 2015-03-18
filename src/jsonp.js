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