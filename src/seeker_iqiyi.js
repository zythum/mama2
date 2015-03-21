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
exports.match = function () {
    return /^http:\/\/www\.iqiyi\.com/.test(location.href) && !!window.Q.PageInfo
}

exports.getVideos = function (callback) {
    var uid = JSON.parse(getCookie('P00002')).uid
    var cupid = 'qc_100001_100103' //这个写死吧
    var tvId = window.Q.PageInfo.playPageInfo.tvId
    var albumId = window.Q.PageInfo.playPageInfo.albumId
    var vid = window.Q.PageInfo.playPageInfo.vid

    var httpProxyOpts = {text: true, ua: 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_1 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B410 Safari/600.1.4'}
    httpProxy(location.href.replace('www.iqiyi', 'm.iqiyi'), 'get', {}, function(rs) {
        var m = rs.match(/<script[^>]*>(eval.*)(?=<\/script>)<\/script>/);
        eval(m[1]);
        var param = weorjjigh(tvId)
        param.uid = uid
        param.cupid = cupid
        param.platForm = 'h5'
        param.type = canPlayM3U8 ? 'm3u8' : 'mp4',
        param.qypid = tvId + '_21'
        ajax({
            url: 'http://cache.m.iqiyi.com/jp/tmts/354791500/d01671316959eb63b6b2191ea7b32f12/',
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
