/*  bilibli 
 *  @朱一
 */
var purl      = require('./purl')
var log       = require('./log')
var httpProxy = require('./httpProxy')
var getCookie = require('./getCookie')

function pad(num, n) { 
  return (Array(n).join(0) + num).slice(-n)
}

exports.match = function (url) {
  return url.attr('host').indexOf('bilibili') >= 0 && /^\/video\/av\d+\/$/.test(url.attr('directory'))
}

exports.getVideos = function (url, callback) {
  log('开始解析bilibli视频地址')
  var aid = url.attr('directory').match(/^\/video\/av(\d+)\/$/)[1]
  var page = (function () {
    pageMatch = url.attr('file').match(/^index\_(\d+)\.html$/)
    return pageMatch ? pageMatch[1] : 1
  }())
  
  httpProxy(
    'http://www.bilibili.com/m/html5', 
    'get', 
    {aid: aid, page: page, sid: getCookie('sid')},
  function (rs) {
    if (rs && rs.src) {
      log('获取到<a href="'+rs.src+'">视频地址</a>, 并开始解析bilibli弹幕')
      var source = [ ['bilibili', rs.src] ]

      var commentSrc = rs.cid
      var cid = commentSrc.split('/')
      cid = cid[cid.length - 1].split('.')[0]

      httpProxy(
        'http://interface.bilibili.com/playurl',
        'get', 
        {otype: 'json', appkey: '95acd7f6cc3392f3', cid: cid, quality: 4, type: 'mp4'},
      function (rs) {
        if (rs && rs.durl && rs.durl[0] && rs.durl[0].backup_url && rs.durl[0].backup_url[0]) {          
          source.unshift(['bilibili HD', rs.durl[0].backup_url[0]])
        } else if (rs && rs.durl && rs.durl[0] && rs.durl[0].url) {
          source.unshift(['bilibili HD', rs.durl[0].url])
        }

        httpProxy(commentSrc, 'get', {}, function (rs) {
          if (rs && rs.i) {
            var comments = [].concat(rs.i.d || [])
            comments = comments.map(function (comment) {
              var p = comment['@p'].split(',')
              switch (p[1] | 0) {
                case 4:  p[1] = 'bottom'; break
                case 5:  p[1] =  'top'; break
                default: p[1] = 'loop'
              }
              return {
                time: parseFloat(p[0]),
                pos:  p[1],
                color: '#' + pad((p[3] | 0).toString(16), 6),
                text: comment['#text']
              }
            }).sort(function (a, b) {
              return a.time - b.time
            })
            log('一切顺利开始播放', 2)
            callback(source, comments)
          } else {
            log('解析bilibli弹幕失败, 但勉强可以播放', 2)
            callback(source)
          }

        }, {gzinflate:1, xml:1})
      })
    } else {
      log('解析bilibli视频地址失败', 2)
      callback(false)
    }
  })
}
