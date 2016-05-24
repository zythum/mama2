/*  douyu
 *  @朱一
 */
var canPlayM3U8 = require('./canPlayM3U8')
var ajax        = require('./ajax')
var log         = require('./log')
var httpProxy   = require('./httpProxy')

exports.match = function (url) {
  return canPlayM3U8 && url.attr('host').indexOf('douyu') >= 0 && window.$ROOM && window.$ROOM.room_id
}

exports.getVideos = function (url, callback) {
  httpProxy(
    'http://m.douyu.com/html5/live', 
    'get', 
    {roomId: window.$ROOM.room_id},
  function (rs) {
    callback([["斗鱼", rs.data.hls_url]])
  })
}