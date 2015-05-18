/*  iqiyi 
 *  @朱一
 */
var canPlayM3U8 = require('./canPlayM3U8')
var queryString = require('./queryString')
var ajax = require('./ajax')
var httpProxy = require('./httpProxy')
var log = require('./log')

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}

exports.match = function (url) {
    return /tv\.sohu\.com/.test(url.attr('host'))
}

exports.getVideos = function (url, callback) {
    var vid = window.vid;
    var uid = getCookie('SUV');
    function shift_en (i) {var t = i.length, e = 0; return this.replace(/[0-9a-zA-Z]/g, function(s) {var a = s.charCodeAt(0), n = 65, o = 26; a >= 97 ? n = 97 : 65 > a && (n = 48, o = 10); var r = a - n; return String.fromCharCode((r + i[e++%t])%o + n) }) }
    
    function m3u8 (callback) {
        ajax({
            url: 'http://pad.tv.sohu.com/playinfo',
            jsonp: true,
            param: {
                vid: vid,
                playlistid: 0, 
                sig: shift_en.call("" + (new Date).getTime(), [23, 12, 131, 1321]), 
                key: shift_en.call(vid, [23, 12, 131, 1321]),
                uid: uid
            },
            callback: function(param){
                var url = '';
                switch(param.quality) {
                    case 2:  url = param.norVid;   break;
                    case 1:  url = param.highVid;  break;
                    case 21: url = param.superVid; break;
                    case 31: url = param.oriVid;   break;
                    default: url = param.highVid;
                }
                callback( [ ['高清', url.replace(/ipad\d+\_/, 'ipad'+vid+'_') + '&uid=' + uid +'&ver=' + param.quality + '&prod=h5&pt=2&pg=1&ch=' + param.cid] ] );
            }
        })
    }

    function mp4(callback) {
        ajax({
            url: 'http://api.tv.sohu.com/v4/video/info/'+vid+'.json',
            jsonp: true,
            param: {
                site: 1,
                api_key: '695fe827ffeb7d74260a813025970bd5',
                sver: 1.0,
                partner: 1
            },
            callback: function(param){
                callback( [['高清', param.data.url_high_mp4 ]]);
            }
        })
    }
    canPlayM3U8 ? m3u8(callback) : mp4(callback);
}
