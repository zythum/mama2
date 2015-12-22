/*  acfun
 *  @zhangge
 */
var purl      = require('./purl');
var log       = require('./log');
var ajax        = require('./ajax');
var isMobile;

exports.match = function (url) {
    if ( url.attr('host').indexOf('acfun.tv') >= 0) {
        if (/^.*\/v\/ac\d+$/.test(url.attr('path'))) {
            isMobile = false;
            return true;
        }
        if (url.param('ac')) {
            isMobile = true;
            return true;
        }
    }
    return false;
};

function getAv(url) {
    if (isMobile) {
        return url.param('ac');
    }
    return url.attr('path').match(/^.*\/v\/ac(\d+).*$/)[1];
}

exports.getVideos = function (url, callback) {
    log('开始解析acfun地址by zhangge');
    var av = getAv(url);
    var sourceUrl = "http://api.aixifan.com/videos/" + av;
    ajax( {
        url: sourceUrl,
        headers: {
            'deviceType': "1"
        },
        callback: function(data) {
            if (data.code == 200) {
                var sourcdId = data.data.videos[0].sourceId;
                var realUrl = "http://api.aixifan.com/plays/" + sourcdId + "/realSource";
                ajax({
                    url: realUrl,
                    headers: {
                        'deviceType': '1'
                    },
                    callback: function(data) {
                        if (data.code == 200) {
                            var urls = [];
                            data.data.files.reverse().forEach(function(item) {
                                urls.push([item.description, item.url[0]])
                            });
                            return callback(urls)
                        }
                    }
                });
            }
        }
    });
};