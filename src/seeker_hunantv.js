/*  hunantv 
 *  @情迷海龟pizza
 */
var canPlayM3U8 = require('./canPlayM3U8')
var ajax        = require('./ajax')
var log         = require('./log')
exports.match = function (url) {
	return /www\.hunantv\.com/.test(url.attr('host'))
}
exports.getVideos = function (url, callback) {
	//芒果台没有mp4 o(╯□╰)o
	if (canPlayM3U8) {
		var getParams = function(req_url){
			var params_url = req_url.split("?")[1];
			var params_tmp = new Array();
			params_tmp = params_url.split("&");
			var params = {};
			for(key in params_tmp){
				param = params_tmp[key];
				item = new Array();
				item = params_tmp[key].split("=");
				if (item[0] != '') {
		    		params[item[0]] = item[1];
				}
			}
			return params;
		}

		var m3u8_req_parms = '&fmt=6&pno=7&m3u8=1';
		var str_orig = document.getElementsByName('FlashVars')[0].getAttribute('value');
		var str_tmp = str_orig.split("&file=")[1];
		var req_url = str_tmp.split("%26fmt")[0];
		req_url = req_url + m3u8_req_parms;
		req_url = decodeURIComponent(req_url);
		params = getParams(req_url);

		//获取三种清晰度
		var limitrate = new Array();
		limitrate = ['570', '1056', '1615'];
		urls = new Array();
		params.limitrate = limitrate[0];
		text = "标清";
		ajax({
				url: 'http://pcvcr.cdn.imgo.tv/ncrs/vod.do',
				jsonp: true,
				param: params,
				callback: function(data){
					if (data.status == 'ok') urls.push([text, data.info])
					params.limitrate = limitrate[1];
					text = "高清";
					ajax({
							url: 'http://pcvcr.cdn.imgo.tv/ncrs/vod.do',
							jsonp: true,
							param: params,
							callback: function(data){
								if (data.status == 'ok') urls.push([text, data.info])
								params.limitrate = limitrate[2];
								text = "超清";
								ajax({
										url: 'http://pcvcr.cdn.imgo.tv/ncrs/vod.do',
										jsonp: true,
										param: params,
										callback: function(data){
											if (data.status == 'ok') urls.push([text, data.info])
											return callback(urls);
										}
									});
							}
						});
				}
			});
	}else{
		log('请使用Safari观看本视频');
		setTimeout(function(){
			return callback();
		}, 2000);
	}
}