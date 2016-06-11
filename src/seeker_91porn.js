/*  91porn
 *  @Snooze 2015-7-26
 */

import { ajax, assert } from './util/index'
export default { match, getVideos }

function match (url) {
  if (window.so && window.so.variables) {
    let {fileId, secCode, max_vid} = getWebsiteConfig()
    return !!fileId & !!secCode & !!max_vid &
      /view_video\.php\?viewkey/.test( url.attr('source') )
  }
  return false
}

function getVideos (url, callback) {
  let {VID, secCode, max_vid} = getWebsiteConfig()
  let ajaxOptions = {
    url: 'http://www.91porn.com/getfile.php',
    jsonp: false,
    param: {
      VID: VID,
      seccode: secCode,
      max_vid: max_vid,
      mp4: '0'
    },
    contentType: 'notJSON'
  }
  ajax(ajaxOptions,  (response) => {
    assert(response != -1 && response.code != -1, '解析91porn视频地址失败')
    return callback([
      [ '低清版', response.split('=')[1].split('&')[0] ]
    ])
  })
}

function getWebsiteConfig () {
  return {
    fileId:  window.so.variables.file,
    secCode: window.so.variables.seccode,
    max_vid: window.so.variables.max_vid
  }
}
