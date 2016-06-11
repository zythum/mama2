/*  douyu
 *  @朱一
 */

import { canPlayM3U8, httpProxy } from './util/index'
export default { match, getVideos }

function match (url) {
  return canPlayM3U8 &&
    url.attr('host').indexOf('douyu') >= 0 &&
    window.$ROOM &&
    window.$ROOM.room_id
}

function getVideos (url, callback) {
  httpProxy(
    {url: 'http://m.douyu.com/html5/live', param: {roomId: window.$ROOM.room_id} },
    (rs) => callback([
      ["斗鱼", rs.data.hls_url]
    ])
  )
}