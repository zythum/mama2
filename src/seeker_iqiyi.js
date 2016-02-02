/*  iqiyi 
 *  @朱一
 */
var canPlayM3U8 = require('./canPlayM3U8')
var queryString = require('./queryString')
var getCookie = require('./getCookie')
var ajax = require('./ajax')
var httpProxy = require('./httpProxy')
var log = require('./log')

function formatVd (vd) {
  switch (vd) {
    case 1:  return {index: 2, text: '标清'  }
    case 2:  return {index: 3, text: '高清'  }
    case 96: return {index: 1, text: '渣画质' }
    default: return {index: 0, text: '未知'  }
  }
}

exports.match = function (url) {
  return /^http:\/\/www\.iqiyi\.com/.test(url.attr('source')) && !!window.Q.PageInfo
}

exports.getVideos = function (url, callback) {
  var uid = '';
  try{
    uid = JSON.parse(getCookie('P00002')).uid
  }catch(e) {}
  var cupid = 'qc_100001_100102' //这个写死吧
  var tvId = window.Q.PageInfo.playPageInfo.tvId
  var albumId = window.Q.PageInfo.playPageInfo.albumId
  var vid = window.Q.PageInfo.playPageInfo.vid ||
    document.getElementById('flashbox').getAttribute('data-player-videoid')

  var param = weorjjigh(tvId)
  param.uid = uid
  param.cupid = cupid
  param.platForm = 'h5'
  param.type = canPlayM3U8 ? 'm3u8' : 'mp4',
  param.qypid = tvId + '_21'
  ajax({
    url: 'http://cache.m.iqiyi.com/jp/tmts/'+tvId+'/'+vid+'/',
    jsonp: true,
    param: param,
    callback: function (rs) {
      var source = []      
      if (rs.data.vidl && rs.data.vidl.length) {
        source = rs.data.vidl
          .map(function (data) {
            var vData = formatVd(data.vd);
            vData.m3u = data.m3u;
            return vData;
          })
          .sort(function (dataA, dataB) {
            return dataB.index - dataA.index
          })
          .map(function (data) {
            return [data.text, data.m3u]
          })
      } else {
        if (rs.data.m3u.length > 0) source = ['标清', rs.data.m3u]
      }
      callback(source)
    }
  })
}
