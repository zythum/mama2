/*  91porn 
 *  @Snooze 2015-7-26
 */
var canPlayM3U8 = require('./canPlayM3U8')
var ajax        = require('./ajax')
var log         = require('./log')

exports.match = function (url) {
	return /view_video\.php\?viewkey/.test(window.location.href) 
}

exports.getVideos = function (url, callback) {	
	//var mediaSpaceHTML = document.getElementById("mediaspace").innerHTML
	//var fileId = /file','(.*?)'/i.exec(mediaSpaceHTML)[1]
	//var secCode = /seccode','(.*?)'/i.exec(mediaSpaceHTML)[1]
	//var max_vid = /max_bid','(.*?)'/i.exec(mediaSpaceHTML)[1]
	var fileId = window.so.variables.file
	var secCode = window.so.variables.seccode
	var max_vid = window.so.variables.max_vid
	

	var mp4 = function(callback){
		ajax({
			url: 'http://www.91porn.com/getfile.php',
			jsonp: false,
			param: {
				VID: fileId,
				mp4: '0',
				seccode: secCode,
				max_vid: max_vid
			},
			contentType: 'notJSON',
			callback: function(param){
				if(param == -1 || param.code == -1) return log('解析91porn视频地址失败')
				mp4Url = param.split('=')[1].split('&')[0]
				var urls = []
				urls.push(['低清版', mp4Url])
				log('解析91porn视频地址成功 ' + urls.map(function (item) {return '<a href='+item[1]+'>'+item[0]+'</a>'}).join(' '), 2)
				console.info(urls)
				return callback(urls);
			}
		});
	};
	mp4(callback)
}



