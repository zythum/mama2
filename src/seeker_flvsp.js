/*  tudou 
 *  @朱一
 */
var canPlayM3U8 = require('./canPlayM3U8')
var ajax        = require('./ajax')
var log         = require('./log')

exports.match = function (url) {
  return true;
}

exports.getVideos = function (url, callback) {
  ajax({
    url: '//acfunfix.sinaapp.com/mama.php',
    jsonp: true,
    param: {
      url: url.attr('source')
    },
    callback: function(param) {
      if (param.code != 200) {
        callback(false);
      }
      var source = canPlayM3U8 && param.m3u8 ? param.m3u8 : param.mp4;
      var rs = [];
      if (source) {
        for(type in source) {
          rs.push([type, source[type]]);
        }
        callback(rs);
      }
    }
  })
}
