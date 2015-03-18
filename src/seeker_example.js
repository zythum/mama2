//============目前已有的工具函数==============

/*  ＃Bool canPlayM3U8＃
 *  返回浏览器是否支持m3u8格式的视频播放。
 *  目前chrome,firefox只支持mp4
 */
var canPlayM3U8 = require('./canPlayM3U8')



/*  ＃function queryString#
 *  < Object   例如 {a:1,b:2,c:3}
 *  > String   例如 a=1&b=2&c=3
 *  用于拼装url地址的query
 */
var queryString = require('./queryString')



/*  ＃function ajax#
 *  < {
 *    url:          String   请求地址
 *    method:       String   请求方法GET,POST,etc. 可缺省，默认是GET 
 *    param:        Object   请求参数.可缺省 
 *    callback:     Function 请求的callback, 如果失败返回－1， 成功返回内容
 *    contentType:  String   返回内容的格式。如果是JOSN会做JSON Parse， 可缺省,默认是json
 *    context:      Any      callback回调函数的this指向。可缺省
 *  }
 *  用于发起ajax或者jsonp请求
 */
var ajax = require('./ajax')


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
var httpProxy = require('./httpProxy')


/*  ＃function log＃
 *  < String
 *  < Number  log在页面出现的时间。可缺省
 *  log, 会在页面和console中输出log
 */
var log = require('./log')



//============下面是重点，每个seeker必须有==============


/*  ＃function match＃
 *  > Bool
 *
 *  返回是否该页面匹配这个解析脚本，
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