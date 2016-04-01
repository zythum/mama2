/*  115 vip only
 *  @HugoLee 2016.4.1
 */

exports.match = function (url) {
  return url.attr('source').indexOf('play.html?pickcode=') >= 0 || /^http\:\/\/115.com/.test(url.attr('source'))
}
exports.getVideos = function (url, callback) {
	document.body.removeChild(document.getElementsByTagName("iframe")[0])
  callback([["115老司机", "http://115.com/?ct=download&ac=video&pickcode="+url.data.param.query.pickcode]])
}
