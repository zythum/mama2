/*  yinyuetai
 *  mhcgrq@gmail.com
 */

import { ajax } from './util/index'
export default { match, getVideos }

function match (url) {
  return url.attr('host').indexOf('v.yinyuetai.com') >= 0 && /^\/video\/\d+/.test(url.attr('directory'))
}

function getVideos (url, callback) {
	let vid = /\d+$/.exec(url.attr('directory'))
	let ts = +new Date()
	let data = []

	ajax({
		url: `http://ext.yinyuetai.com/main/get-h-mv-info?json=true&videoId=${vid}&_=${ts}`,
		jsonp: true
	}, (res) => {
		let video = res.videoInfo.coreVideoInfo.videoUrlModels
		let mode = ['普清', '高清', '超清', '会员']
		for (let i = 0; i < video.length; i++) {
			let index = video[i].videoUrl.search(/(flv|mp4)/) + 3
			data.push([mode[i], video[i].videoUrl.slice(0, index)])
		}
		callback(data)
	})
}