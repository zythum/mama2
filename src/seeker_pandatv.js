/*  pandatv
 *
 *  @pczb
 */
var log       = require('./log')
var canPlayM3U8 = require('./canPlayM3U8')
var ajax = require('./ajax')
var httpProxy = require('./httpProxy')

exports.match = function () {
  return /^http\:\/\/www\.panda\.tv\/[0-9]+$/.test(location.href)
}

exports.getVideos = function (url, callback) {
  if(!canPlayM3U8){
    log('use safari please')
    callback(false);
    return;
  }
  
  var room_id = url.attr('path').match(/^\/([0-9]+)$/)[1]
  var m3u8_api = 'http://room.api.m.panda.tv/index.php?method=room.shareapi&roomid='
  httpProxy(
        m3u8_api + room_id,
        "GET",
        {},
        function(result){
          if(result === -1){
            callback(false)
          }
          jsonobj = eval(result)
          if(jsonobj.errno == 0 && jsonobj.data.videoinfo.address != ""){
            callback([['未知', jsonobj.data.videoinfo.address]])
          }else {
            callback(false)
          }
        })
}
