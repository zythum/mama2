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