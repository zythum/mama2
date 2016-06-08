/*  tudou 
 *  @朱一
 */
import {canPlayM3U8, ajax, log} from './util/index'
export default {match, getVideos}

export function match (url) {
  return true;
}

export function getVideos (url, callback) {
  ajax({
    url: 'http://acfunfix.sinaapp.com/mama.php',
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
