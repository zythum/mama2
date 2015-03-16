var createElement = require('./createElement')

var proxyUrl = 'http://zythum.sinaapp.com/mama2/proxy.php'

var callbackPrefix = 'MAMA2_HTTP_PROXY_CALLBACK'
var callbackCount  = 0
var timeoutDelay   = 10000

function noop () {}

function callbackHandle () {
	return callbackPrefix + callbackCount++
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

function httpProxy (url, type, params, callback, opts) {
	opts = opts || {}
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
		src: proxyUrl + '?' + queryString({
			url: encodeURIComponent(url),
			post: type === 'post' ? 1 : 0,
			params: encodeURIComponent(queryString(params)),
			callback: _callbackHandle,
			xml: opts.xml ? 1 : 0,
			gzinflate: opts.gzinflate ? 1 : 0
		})
	})
}

module.exports = httpProxy