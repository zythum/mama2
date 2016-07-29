/*  pandatv
 *
 *  @pczb
 */
var log       = require('./log')
var canPlayM3U8 = require('./canPlayM3U8')
var ajax = require('./ajax')
var httpProxy = require('./httpProxy')

exports.match = function () {
  return /^http\:\/\/www\.panda\.tv\/(([0-9]+$)|(lpl$)|(act\/.*))/.test(location.href)
}

exports.getVideos = function (url, callback) {
  if(!canPlayM3U8){
    log('use safari please')
    callback(false);
    return;
  }

  var room_id = window.PDR.getRoomId()
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
            var arry = new Array()
            var baseaddr = jsonobj.data.videoinfo.address;
            arry.push(['超清', baseaddr.replace('_small\.m3u8', "\.m3u8")])
            arry.push(['高清', baseaddr.replace('_small\.m3u8', "_mid\.m3u8")])
            arry.push(['标清', baseaddr])
            callback(arry)
          }else {
            callback(false)
          }
        })
}
