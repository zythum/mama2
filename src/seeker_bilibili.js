/*  bilibli
 * appkey from https://github.com/zacyu/bilibili-helper/
 *  @朱一
 */
import { log, assert, httpProxy, getCookie } from './util/index'
export default { match, getVideos }

const appkey = 'f3bb208b3d081dc8'

function pad(num, n) {
  return (Array(n).join(0) + num).slice(-n)
}

function match (url) {
  let directory = url.attr('directory')
  return url.attr('host').indexOf('bilibili') >= 0 &&
    (
      /^\/video\/av\d+\/$/.test(directory) ||
      /^\/anime\/v\/\d+$/.test(directory)
    )
}

function getVideos (url, callback) {
  let page = (() => {
    let pageMatch = url.attr('file').match(/^index\_(\d+)\.html$/)
    return pageMatch ? pageMatch[1] : 1
  })()
  let directory = url.attr('directory')

  if (/^\/anime\/v\/\d+$/.test(directory)) {
    let httpProxyOpts = {
      url: 'http://bangumi.bilibili.com/web_api/episode/get_source',
      param: {episode_id: url.attr('directory').match(/^\/anime\/v\/(\d+)$/)[1]}
    }
    httpProxy(httpProxyOpts, (response) => {
      assert(response && response.code === 0, '获取av号失败')
      getVideoSourceByCid(response.result.cid, callback)
    })
  } else {
    getVideoSourceByAid(directory.match(/^\/video\/av(\d+)\/$/)[1], page, callback)
  }
}

function getVideoSourceByAid (aid, page, callback) {
  let videoSource = []
  let cidHttpProxyOptions = {
    url: 'http://www.bilibili.com/m/html5',
    param: {aid: aid, page: page, sid: getCookie('sid')}
  }
  httpProxy(cidHttpProxyOptions, (response) => {

    assert(!!response && !!response.src, '没有获取到视频内容')
    videoSource.push(['bilibili', response.src])

    let commentSrc = response.cid
    let cid = commentSrc.split('/')
    cid = cid[cid.length - 1].split('.')[0]

    getVideoSourceByCid(cid, callback, videoSource)
  })
}

function getVideoSourceByCid (cid, callback, videoSource=[]) {
  let videoHttpProxyOptions = {
    url: 'http://interface.bilibili.com/playurl',
    param: {otype: 'json', appkey: appkey, cid: cid, quality: 4, type: 'mp4'}
  }
  httpProxy(videoHttpProxyOptions, function (response) {
    let durl = response && response.durl && response.durl[0]
    if (durl && durl.backup_url && durl.backup_url[0]) {
      videoSource.unshift(['bilibili HD', durl.backup_url[0]])
    } else if (durl && durl.url) {
      videoSource.unshift(['bilibili HD', durl.url])
    }
    getComments(`http://comment.bilibili.com/${cid}.xml`, (comments) => {
      if (comments) {
        log('解析bilibli弹幕失败, 但勉强可以播放', 2)
        return callback(videoSource)
      }
      callback(videoSource, comments)
    })
  })
}

function getComments (commentSrc, callback) {
  log('开始解析bilibli弹幕')
  let commentsHttpProxyOptions = {url: commentSrc, gzinflate:1, xml:1 }
  httpProxy(commentsHttpProxyOptions, (response) => {
    if (!response || !response.i) return callback(false)

    let comments = [].concat(response.i.d || [])
      .map( (comment) => {
        let p = comment['@p'].split(',')
        switch (p[1] | 0) {
          case 4:  p[1] = 'bottom'; break
          case 5:  p[1] = 'top';    break
          default: p[1] = 'loop'
        }
        return {
          time: parseFloat(p[0]),
          pos:  p[1],
          color: '#' + pad((p[3] | 0).toString(16), 6),
          text: comment['#text']
        }
      })
      .sort( (a, b) => a.time - b.time )
    callback(comments)
  })
}
