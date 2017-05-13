/*  pandatv
 *
 *  @pczb
 */
var log       = require('./log')
var canPlayM3U8 = require('./canPlayM3U8')
var ajax = require('./ajax')
var httpProxy = require('./httpProxy')

exports.match = function () {
  // 调整url匹配 by @monotone
  return /^http\:\/\/www\.panda\.tv\/.*/.test(location.href)
}

function GetQueryString(name)
{
  var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if(r!=null)
    return  unescape(r[2]);
  return null;
}

exports.getVideos = function (url, callback) {
  if(!canPlayM3U8){
    log('use safari please')
    callback(false);
    return;
  }

  var room_id = url.attr('path').match(/^\/([0-9]+)$/)[1]

  /* 其他 URL 格式获取房间 ID 号
   * 
   * 2017年05月13日 by @monotone
   */

  // query参数中获取
  if(room_id == null){
    room_id = GetQueryString('roomid');
  } 

  // 从源码中获取
  if(room_id == null){
    var roomContainer = document.getElementById('dva-room-container');
    if(roomContainer == null){
      log('找不到视频容器。')
      return;
    }
    var room_id = null;
    var divs = roomContainer.getElementsByTagName('DIV');
    for (var i = divs.length - 1; i >= 0; i--) {
      room_id = divs[i].getAttribute('data-room-id');
      if(room_id != null){
        break;
      }
    }
  }


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
