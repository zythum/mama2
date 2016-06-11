/*  mgtv
 *  @情迷海龟pizza
 *  貌似芒果 tv改版了，现在不一样了。所以朱一修改了
 */

import { canPlayM3U8, ajax, assert } from './util/index'
export default { match, getVideos }

function match (url) {
  return /www\.mgtv\.com/.test(url.attr('host')) &&
    window.VIDEOINFO && window.VIDEOINFO.vid
}

function getVideos (url, callback) {
  let ajaxOptions = {
    url: 'http://m.api.hunantv.com/video/getbyid',
    param: {videoId: window.VIDEOINFO.vid},
    jsonp: true
  }
  ajax(ajaxOptions, (response) => {
    assert(response.code === 200 && !!response.data, '解析失败')
    let videoSourceUrl = canPlayM3U8 ? response.data.m3u8Url : response.data.mp4Url
    videoSourceUrl = videoSourceUrl[videoSourceUrl.length - 1]
    ajax({url: videoSourceUrl, jsonp: true}, (response) => {
      assert(!!response.info, '解析失败')
      callback([['芒果tv', response.info]])
    })
  })
}