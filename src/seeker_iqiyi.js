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

    var httpProxyOpts = {text: true, ua: 'Mozilla/5.0 (iPad; CPU iPhone OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B410 Safari/600.1.4'}

    httpProxy(location.href, 'get', {}, function(rs) {
        var m = rs.match(/<script[^>]*>\s*(eval.*;)\s*(?=<\/script>)<\/script>/)
        window.__qlt = window.__qlt || {MAMA2PlaceHolder: true}
        window.QP = window.QP || {}
        window.QP._ready = function (e) {if(this._isReady){e&&e()}else{e&&this._waits.push(e)}}
        eval(m[1])
        var param = {};
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
                if (rs.data.m3utx.length > 0) source.push(['高清', rs.data.m3utx])
                if (rs.data.m3u.length > 0) source.push(['标清', rs.data.m3u])
                callback(source)
            }
        })
    }, httpProxyOpts)
}
