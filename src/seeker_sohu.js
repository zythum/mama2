/*  sohu
 *  @朱一
 */

import { canPlayM3U8, ajax, getCookie } from './util/index'
export default { match, getVideos }

function match (url) {
  return /tv\.sohu\.com/.test(url.attr('host'))
}

function getVideos (url, callback) {
    let vid = window.vid
    let uid = getCookie('SUV')
    canPlayM3U8 ? m3u8(vid, uid, callback) : mp4(vid, uid, callback)
}
function m3u8(vid, uid, callback) {
  let ajaxOptions = {
    url: 'http://pad.tv.sohu.com/playinfo',
    jsonp: true,
    param: {
      vid: vid,
      playlistid: 0,
      sig: shift_en.call('' + (new Date).getTime(), [23, 12, 131, 1321]),
      key: shift_en.call(vid, [23, 12, 131, 1321]),
      uid: uid
    }
  }
  ajax(ajaxOptions, (response) => {
    let url = '';
    switch (response.quality) {
      case 2:  url = response.norVid;   break
      case 1:  url = response.highVid;  break
      case 21: url = response.superVid; break
      case 31: url = response.oriVid;   break
      default: url = response.highVid
    }
    callback([
      ['高清', url.replace(/ipad\d+\_/, 'ipad' + vid + '_') +
        `&uid=${uid}&ver=${response.quality}&prod=h5&pt=2&pg=1&ch=${response.cid}`]
    ])
  })
}

function mp4(vid, uid, callback) {
  let ajaxOptions = {
    url: `http://api.tv.sohu.com/v4/video/info/${vid}.json`,
    jsonp: true,
    param: {
      site: 1,
      api_key: '695fe827ffeb7d74260a813025970bd5',
      sver: 1.0,
      partner: 1
    }
  }
  ajax(ajaxOptions, (param) => callback([['高清', param.data.url_high_mp4]]) )
}

function shift_en (i) {
  let t = i.length, e = 0
  return this.replace(/[0-9a-zA-Z]/g, (s) => {
    let a = s.charCodeAt(0), n = 65, o = 26
    a >= 97 ? n = 97 : 65 > a && (n = 48, o = 10)
    let r = a - n
    return String.fromCharCode((r + i[e++ % t]) % o + n)
  })
}