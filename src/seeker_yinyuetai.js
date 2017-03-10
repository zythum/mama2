var log = require('./log');
var ajax = require(('./ajax'));


exports.match = function (url) {
  log(url.attr('host').indexOf('v.yinyuetai.com') >= 0 && /^\/video\/\d+/.test(url.attr('directory')));
  // log(/^\/video\/h5\/\d+/.test(url.attr('directory')));
  // log(url.attr('directory'));
  return url.attr('host').indexOf('v.yinyuetai.com') >= 0 && /^\/video\/\d+/.test(url.attr('directory'));
}

exports.getVideos = function (url, callback) {
	var h5 = "html5";
	var vid = /\d+$/.exec(url.attr('directory'));
	var ts =+ (new Date);
	var url = 'http://ext.yinyuetai.com/main/get-h-mv-info?json=true&videoId=' + vid + '&_=' + ts;
	 // + '&v=' + h5

	var data = [];

	ajax({
		url: url,
		jsonp: true,
		callback: function(res) {
			console.log(res);
			var video = res.videoInfo.coreVideoInfo.videoUrlModels;
			var mode = ['普清', '高清', '超清', '会员'];
			var index;
			for (var i = 0; i < video.length; i++) {
				index = video[i].videoUrl.search(/(flv|mp4)/) + 3;
				data.push([mode[i], video[i].videoUrl.slice(0, index)]);
			}
			console.log(data);
			callback(data);
		}
	});
}

//	少数情况下会出现如下错误，目前不清楚是怎么回事，有时候出现这种情况后，重新打开一遍就又可以播放了
// GET http://120.192.249.220:9090/data4/1/c/3a/c/a38df997fecc82d251482b4bcf6c3ac1/hc.yinyuetai.com/CDD8015436C4EAFED49290FE1AA16449.flv?type=data 404 (Not Found)
// index.js:480 Uncaught (in promise) DOMException: The element has no supported sources.
