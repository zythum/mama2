/*  pandatv
 *
 *  @pczb
 */

import { assert, canPlayM3U8, httpProxy } from './util/index'
export default { match, getVideos }

function match () {
  return /^http\:\/\/www\.panda\.tv\/[0-9]+$/.test(location.href)
}

function getVideos (url, callback) {
  assert(canPlayM3U8, '请使用safari浏览器')

  let room_id = url.attr('path').match(/^\/([0-9]+)$/)[1]
  let m3u8_api = 'http://room.api.m.panda.tv/index.php?method=room.shareapi&roomid='
  httpProxy({url : m3u8_api + room_id}, (response) => {
    assert(response != -1, '获取失败')
    if (response.errno == 0 && response.data.videoinfo.address != "") {
      let arry = new Array()
      let baseaddr = response.data.videoinfo.address
      arry.push(['超清', baseaddr.replace('_small\.m3u8', "\.m3u8")])
      arry.push(['高清', baseaddr.replace('_small\.m3u8', "_mid\.m3u8")])
      arry.push(['标清', baseaddr])
      callback(arry)
    }else {
      callback(false)
    }
  })
}
