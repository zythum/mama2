/*  bilibli 
 *  @朱一
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
	log('开始解析bilibli视频地址')
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
			log('获取到<a href="'+rs.src+'">视频地址</a>, 并开始解析bilibli弹幕')
			var source = [ ['bilibili', rs.src] ]			
			httpProxy(rs.cid, 'get', {}, function (rs) {
				if (rs && rs.i && rs.i.d) {					
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
							color: '#' + pad((p[3] | 0).toString(16), 6),
							text: comment['#text']
						}
					}).sort(function (a, b) {
						return a.time - b.time
					})
					log('一切顺利开始播放', 2)
					callback(source, comments)
        }
        else if (rs && rs.i) {					
					log('一切顺利开始播放', 2)
					callback(source)
				} else {
					log('解析bilibli弹幕失败, 但勉强可以播放', 2)
					callback(source)
				}

			}, {gzinflate:1, xml:1})
		} else {
			log('解析bilibli视频地址失败', 2)
			callback(false)
		}
	})
}
