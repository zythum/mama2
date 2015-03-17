/*  ＃Bool canPlayM3U8＃
 *	返回浏览器是否支持m3u8格式的视频播放。
 *	目前chrome,firefox只支持mp4
 */
var canPlayM3U8 = require('./canPlayM3U8')

/*  ＃function jsonp＃
 *	< String
 *	log, 会在页面和console中输出log
 */
var jsonp = require('./jsonp')

/*  ＃function log＃
 *	< String
 *	log, 会在页面和console中输出log
 */
var log = require('./log')

/*  ＃function match＃
 *	< Bool
 *
 *	返回是否该页面匹配这个解析脚本，
 *  这个脚本会在页面的环境中运行。window是页面的window。
 *  你可以从location中或者页面特征中找到是否需要匹配执行下面脚本
 *  ＃注意＃：
 *  如果match方法返回true就不会再遍历其他的seeker脚本了。所以请尽量严禁
 */
exports.match = function () {
	//举个例子
	return /^http\:\/\/example.com/.test(location.href) && !!window.example
}

/*  ＃function getVideos＃
 *	< callback([["影片名称", "影片地址"], ["影片名称2", "影片地址2"]...])
 *  
 *	如果上面的match方法返回true。那么就会执行到getVideos方法
 *  该方法用于获取视频源地址
 *  同样
 *  这个脚本会在页面的环境中运行。window是页面的window。
 *  你可以从location中或者页面特征中找到获取视频源地址的方法
 *  该脚本用callback方法提交，格式为[["影片名称", "影片地址"], ["影片名称2", "影片地址2"]...]
 */
exports.getVideos = function (callback) {
	//举个例子
	callback([
		["高清": "http://xxxxx.xxxx.xxx/xxx/xxx/xxx/xxx.m3u8"],
		["标清": "http://xxxxx.xxxx.xxx/xxx/xxx/xxx/xxx.mp4"]
	])
}