/* dilidili
 * @gdshen95
 */
var httpProxy = require('./httpProxy');
var cheerio = require('cheerio');
var purl = require('./purl');
var log = require('./log');
var queryString = require('./queryString');

exports.match = function (url) {
    return /^www.dilidili.com/.test(url.attr('host'));
};

exports.getVideos = function (url, callback) {
    log('开始解析dilidili视频地址');
    var userlink = url.attr('source');

    $ = cheerio.load(window.document.body.innerHTML);
    var src = $('iframe').attr('src');

    var url = purl(src);
    var vid = url.param('vid');
    var type = url.param('v');
    var sign = url.param('sign');

    httpProxy(src, 'get', null, function (res) {
        var tmsign = res.match(/tmsign=[0-9a-z]{32}/)[0];
        tmsign = tmsign.substr(7);

        var hd = 3;
        var queryStr = queryString({h5url:null,
            type:type,
            vid:vid,
            hd:hd,
            sign:sign,
            tmsign:tmsign,
            ajax:1,
            userlink:userlink});

        var src = 'https://player.005.tv:60000/parse.php?' + queryStr;
        log('获取到<a href="'+src+'">视频地址</a>');
        httpProxy(src, 'get', null, function (res) {
            callback([['dilidili', res]]);
        }, {text:true});
    }, {text:true})
};