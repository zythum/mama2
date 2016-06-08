/*  百度盘
 *  @朱一 格式关系只能播放可播放的格式。这边强制判断mp4可播放。其他不行。
 */

import {canPlayM3U8, ajax, log} from './util/index'
export default {match, getVideos}

function getFilePath (url) {
  let fileName = url.attr('source').split('/')[fileName.length - 1].split('&')
  for (let t of fileName) {
    t = t.split('=')
    if (t[0] === 'path') return t[1]
  }
  return false
}

function match (url) {
  return url.attr('host').indexOf('pan.baidu.com') >= 0 && window.yunData && getFilePath(url)
}

function getVideos (url, callback) {
  var bdstoken = yunData.MYBDSTOKEN
  var timeStamp = yunData.timestamp
  var sign1 = yunData.sign1
  var sign2; eval('sign2 = ' + yunData.sign2)
  var sign3 = yunData.sign3
  var sign = encodeBase64(sign2(sign3, sign1))
  var filePath = getFilePath(url)
  if (!filePath) {
    log('没有检测到播放内容', 2)
    return;
  }

  var pathArray = decodeURIComponent(filePath).split('/')
  var fileName = pathArray.pop()
  var parentPath = pathArray.join('/')

  if (fileName.split('.').pop() !== 'mp4') {
    log('只能播放mp4格式的文件', 2)
    return;
  }

  function getVideoFromFsid (fsid) {
    ajax({
      url: '/api/download',
      method: 'POST',
      param: {sign: encodeURIComponent(sign), timestamp: timeStamp, fidlist: '["'+fsid+'"]', type: 'dlink'},
      callback: function (res) {
        if (res.dlink && res.dlink[0] && res.dlink[0].dlink)
          callback([["百毒盘", decodeURIComponent(res.dlink[0].dlink)]])
      }
    })
  }

  ajax({
    url: '/api/categorylist',
    param: {parent_path: parentPath, page: 1, num: 500, category: 1, bdstoken: bdstoken, channel: 'chunlei', web: 1, app_id: '250528'},
    callback: function (res) {
      if (!res.info) return;
      for (var i = 0, len = res.info.length; i < len; i++) {
        if (res.info[i].server_filename === fileName) {
          getVideoFromFsid(res.info[i].fs_id)
          break
        }
      }
    }
  })
}

function encodeBase64(G) {
    var C = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      B, A, _, F, D, E;
    _ = G.length;
    A = 0;
    B = "";
    while (A < _) {
      F = G.charCodeAt(A++) & 255;
      if (A == _) {
        B += C.charAt(F >> 2);
        B += C.charAt((F & 3) << 4);
        B += "==";
        break;
      }
      D = G.charCodeAt(A++);
      if (A == _) {
        B += C.charAt(F >> 2);
        B += C.charAt(((F & 3) << 4) | ((D & 240) >> 4));
        B += C.charAt((D & 15) << 2);
        B += "=";
        break;
      }
      E = G.charCodeAt(A++);
      B += C.charAt(F >> 2);
      B += C.charAt(((F & 3) << 4) | ((D & 240) >> 4));
      B += C.charAt(((D & 15) << 2) | ((E & 192) >> 6));
      B += C.charAt(E & 63);
    }
    return B;
  };
