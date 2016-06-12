/*  百度盘
 *  @朱一 格式关系只能播放可播放的格式。这边强制判断mp4可播放。其他不行。
 */

import { ajax, assert } from './util/index'
export default { match, getVideos }

function match (url) {
  return url.attr('host').indexOf('pan.baidu.com') >= 0 &&
    window.yunData && getFilePath(url)
}

function getVideos (url, callback) {
  let bdstoken = yunData.MYBDSTOKEN
  let filePath = getFilePath(url)

  assert(!!filePath, '没有检测到播放内容')

  let pathArray = decodeURIComponent(filePath).split('/')
  let fileName = pathArray.pop()
  let parentPath = pathArray.join('/')

  assert(fileName.split('.').pop() === 'mp4', '只能播放mp4格式的文件')

  let ajaxOptions = {
    url: '/api/categorylist',
    param: {
      parent_path: parentPath,
      bdstoken: bdstoken,
      page: 1, num: 500, category: 1,
      channel: 'chunlei', web: 1, app_id: '250528'
    }
  }

  ajax(ajaxOptions, (response) => {
    assert(!!response.info, '没有获取到解析内容')
    for (let file of response.info)
      if (file.server_filename === fileName)
        return getVideoFromFsid(file.fs_id, callback)
  })
}

function getVideoFromFsid (fsid, callback) {
  let timeStamp = yunData.timestamp
  let sign1 = yunData.sign1
  let k = 0; // sign2 里面的 k 没有var ...写代码也不仔细一点
  let sign2; eval('sign2 = ' + yunData.sign2)
  let sign3 = yunData.sign3
  let sign = encodeBase64(sign2(sign3, sign1))
  let ajaxOptions = {
    url: '/api/download',
    method: 'POST',
    param: {
      sign: encodeURIComponent(sign),
      timestamp: timeStamp,
      fidlist: `["${fsid}"]`,
      type: 'dlink'
    }
  }
  ajax(ajaxOptions, (response) => {
    if (response.dlink && response.dlink[0] && response.dlink[0].dlink)
      callback([["百毒盘", decodeURIComponent(response.dlink[0].dlink)]])
  })
}

function getFilePath (url) {
  let fileName = url.attr('source').split('/')
  fileName = fileName[fileName.length - 1].split('&')
  for (let t of fileName) {
    t = t.split('=')
    if (t[0] === 'path') return t[1]
  }
  return false
}

//get from baidupan source
function encodeBase64 (G) {
  let C = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
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
