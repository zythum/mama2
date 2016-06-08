/*  tudou
 *  @朱一
 */
import {canPlayM3U8, ajax, log} from './util/index'
import {parseYoukuCode} from './seeker_youku'
export default {match, getVideos}

function getId () {
  return window.iid || (window.pageConfig && window.pageConfig.iid) || (window.itemData && window.itemData.iid)
}

function youkuCode() {
  return window.itemData && window.itemData.vcode
}

function match (url) {
  return /tudou\.com/.test(url.attr('host')) && (youkuCode() || getId())
}

function getVideos (url, callback) {
  let _youkuCode = youkuCode()
  if (_youkuCode) return parseYoukuCode(_youkuCode, callback)

  ;(canPlayM3U8 ? m3u8 : mp4)(getId(), callback)
}

function m3u8 (id, callback) {
    let urls = [
      ['原画', `http://vr.tudou.com/v2proxy/v2.m3u8?it=${id}&st=5`],
      ['超清', `http://vr.tudou.com/v2proxy/v2.m3u8?it=${id}&st=4`],
      ['高清', `http://vr.tudou.com/v2proxy/v2.m3u8?it=${id}&st=3`],
      ['标清', `http://vr.tudou.com/v2proxy/v2.m3u8?it=${id}&st=2`]
    ]
    if (window.itemData && window.itemData.segs) {
      urls = []
      let _s = JSON.parse(window.itemData.segs)
      if(_s[5]) urls.push(['原画', `http://vr.tudou.com/v2proxy/v2.m3u8?it=${id}&st=5`])
      if(_s[4]) urls.push(['超清', `http://vr.tudou.com/v2proxy/v2.m3u8?it=${id}&st=4`])
      if(_s[3]) urls.push(['高清', `http://vr.tudou.com/v2proxy/v2.m3u8?it=${id}&st=3`])
      if(_s[2]) urls.push(['标清', `http://vr.tudou.com/v2proxy/v2.m3u8?it=${id}&st=2`])
    }
    callback(urls)
  };
  function mp4 (id, callback) {
    ajax({
      url: 'http://vr.tudou.com/v2proxy/v2.js',
      param: {
        it: id,
        st: '52%2C53%2C54'
      },
      jsonp: 'jsonp',
      callback: (param) => {
        if(param === -1 || param.code == -1) return log('解析tudou视频地址失败')
        let urls = [];
        for(let [index, url] of param.urls) urls.push([index, url]);
        return callback(urls);
      }
    });
  };