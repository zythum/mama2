/*  秒拍
 *  @朱一
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
    if (url && url[1]) callback([['秒拍', url[1]]])
  }, httpProxyOpts)
}