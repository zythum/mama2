# 妈妈再也不用担心我的 MacBook 发热了计划2

> 妈妈计划用于解决在看视频网站时 MacBook 发热严重的问题。使用 video 来替换原来的 flash 播放器。

[具体查看这里 http://zythum.github.io/mama2/](http://zythum.github.io/mama2/)

__目前鹅厂视频－－腾讯视频已经原生支持 Video 播放了。大家可以去试下__

目前网站支持列表:

+ 哔哩哔哩弹幕视频网 @朱一
+ 优酷-中国领先视频网站 @朱一
+ 土豆-每个人都是生活的导演 @朱一
+ ~~爱奇艺-中国领先的视频门户 @朱一~~
+ 搜狐视频 @朱一
+ 芒果tv [@zhshipu](https://github.com/zhshipu)
+ 熊猫tv [@pczb](https://github.com/pczb)
+ 91porn
+ 百度网盘 @朱一
+ 音悦台 [@mhcgrq](https://github.com/mhcgrq)
+ 秒拍 @朱一

感谢 [一环同学](http://weibo.com/justashit)提供的缺省解析服务（如果不是上面的网站，能播放的都是一环同学的功劳。）



## 众人拾柴火焰高 计划
> 加入妈妈计划开发，视频网站的解析朱一一个人确实是搞不过来。每个视频网站的解析规则可能会不定时的改变。朱一每天也就看看优酷或者 bilibili，不大可能照顾到所有网站（毕竟是个业余项目 QAQ）。所以如果你觉得妈妈计划不错，想帮助妈妈计划做的更好，恳请您加入*众人拾柴火焰高*计划。

### 搭建本地环境

[具体查看这里 http://zythum.github.io/mama2/](http://zythum.github.io/mama2/)

MAMA2 需要本地环境: `node` `npm` `gulp`

clone 到本地后执行: `$ npm install`

然后执行: `$ npm start` 或者 `$ gulp`

本地启动的 httpServer 默认为 `http://localhost:8000`

那么本地环境就搭建好了。

⚠注意: 在开发工程中，确保你的本地环境时开启状态

开发使用收藏夹脚本:[拖拽我到收藏夹](javascript:void\(function\(u,s\){s=document.body.appendChild\(document.createElement\('script'\)\);s.src=u+'?ts='+Date.now\(\);s.charset='UTF-8'}\('http://localhost:8000/dest/index.js'\)\))

### 开发说明

现在的目录结构是这样的

![image](http://zythum.github.io/mama2/images/ll.png)

很凌乱有木有。QAQ

其实一般只需要编写用于获取视频地址的逻辑，我这边称为`seeker`。所以只需要注意 `seeker-` 打头的文件，和 `seekers` 的文件就可以了

### 举个例子 🌰
我们要为名为 `example` 的视频网站写 seeker 脚本


在 src 目录下创建 seeker_example.js 文件。

我已经创建好了。文件是这样的

注释很丰富的样子。所以大家看注释吧。嚯嚯嚯嚯

```javascript
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
 *      xml:        是否需要做xml2json 可缺省
 *      gzinflate   是否需要做gzinflate 可缺省
 *      context     callback回调的this指向 可缺省
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
 *  如果match方法返回true就不会再遍历其他的seeker脚本了。所以请尽量严谨
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
```

然后需要在 seekers.js 文件中加上一行

```javascript
module.exports = [
	require('./seeker_bilibili'),
	require('./seeker_youku'),
	require('./seeker_example') //在这边加上一行，#注意上一个逗号#
]
```

大功告成！用浏览器上的开发用收藏夹脚本测试下。

如果测试 ok 的话, 那么把代码 pull request 给朱一吧。

不方便 pull request？

那么用 email 给朱一也是可以的: `zythum02#gmail.com`


## License

MAMA2 is under the MIT License.

据说总是需要放个证书的。
