/*  tudou
 *  @朱一
 */
import { canPlayM3U8, assert, ajax } from './util/index'
export default { match, getVideos }

export function match (url) { return true }

export function getVideos (url, callback) {
  ajax({
    url: 'http://acfunfix.sinaapp.com/mama.php',
    jsonp: true,
    param: { url: url.attr('source') }
  },
  (response) => {
    assert(response.code == 200, '解析失败')
    let source = canPlayM3U8 && response.m3u8 ? response.m3u8 : response.mp4
    let rs = []
    if (source) for(let type in source) rs.push([type, source[type]])
    callback(rs)
  })
}
