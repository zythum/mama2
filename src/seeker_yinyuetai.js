var log = require('./log');
var ajax = require(('./ajax'));


// 您好：
// 	我是一名前端初学者，水平有限，还请见谅。
// 	以下是存在的一些问题，我始终没能解决，不知道还有没有可用价值，如果实在难堪，就请忽略这个脚本吧。

// 		1 从网站拿到的h5资源基本都是flv格式，少数会员级别的是MP4格式，不过实际测试flv格式播放时的资源占用率不是很多；
// 		2 经常出现一会能播放一会不能播的问题，即使是同一个视频，然而在地址栏中打开总是可以播放。可能由于sourcemap在我的机子上有点问题，无法定位到具体出错的地方，所以我也不知道发生了什么。
	
//  麻烦您了
// 	联系方式：mhcgrq@gmail.com

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
			for (var i = 0; i < video.length; i++) {
				data.push([mode[i], video[i].videoUrl]);
			}
			console.log(data);
		}
	});

	callback(data);
}

