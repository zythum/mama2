/*  youku 
 *  @朱一
 */
var canPlayM3U8 = require('./canPlayM3U8')
var ajax        = require('./ajax')
var log         = require('./log')
var videoId     = window.videoId || window.PageConfig.currentEncodeVid;

var dic = [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]
var mk = {a3: 'b4et', a4: 'boa4'}
var userCache = { a1: "4", a2: "1" }

function urlParameter (query) {
    var search = []
    for (var item in query) search.push(item + "=" + query[item])
    return search.join("&")
}

exports.match = function (url) {
  return /v\.youku\.com/.test(url.attr('host')) && !!videoId
}
exports.parseYoukuCode = function (videoId, callback) {
  ajax({
    url: 'http://play.youku.com/play/get.json?vid=' + videoId + '&ct=12', jsonp: true,
    callback: function (param) {
      if(param == -1) log('解析youku视频地址失败', 2)
      var data = param.data;            
      
      var sid_token = rc4(translate(mk.a3 + "o0b" + userCache.a1, dic).toString(), decode64(data.security.encrypt_string)).split("_");
      userCache.sid = sid_token[0];
      userCache.token = sid_token[1]; 

      if ( canPlayM3U8 ) {
        var urlquery = {
          vid: videoId,
          type: '[[type]]',
          ts: parseInt((new Date).getTime() / 1e3),
          keyframe: 0,
          ep: encodeURIComponent(encode64(rc4(translate(mk.a4 + "poz" + userCache.a2, dic).toString(), userCache.sid + "_" + videoId + "_" + userCache.token))),
          sid: userCache.sid,
          token: userCache.token,
          ctype: 12,
          ev: 1,
          oip: data.security.ip,
          client_id: "youkumobileplaypage"
        }

        var videoSource = "http://pl.youku.com/playlist/m3u8?" + urlParameter(urlquery);
        callback([
          ['超清', videoSource.replace('[[type]]', 'hd2')],
          ['高清', videoSource.replace('[[type]]', 'mp4')],
          ['标清', videoSource.replace('[[type]]', 'flv')]
        ])
      } else {
        var playListData = new PlayListData(data, data.stream, 'mp4')
        console.log(playListData._videoSegsDic.streams)
        callback([['标清', playListData._videoSegsDic.streams['guoyu']['3gphd'][0].src]])
      }
    }
  })
}
exports.getVideos = function (url, callback) {
  exports.parseYoukuCode(videoId, callback)
}

//优酷自己加密算法
function decode64(a) {
  if (!a)
    return "";
  a = a.toString();
  var b, c, d, e, f, g, h, i = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
  for (g = a.length, f = 0, h = ""; g > f;) {
    do
      b = i[255 & a.charCodeAt(f++)];
    while (g > f && -1 == b);
    if (-1 == b)
      break;
    do
      c = i[255 & a.charCodeAt(f++)];
    while (g > f && -1 == c);
    if (-1 == c)
      break;
    h += String.fromCharCode(b << 2 | (48 & c) >> 4);
    do {
      if (d = 255 & a.charCodeAt(f++), 61 == d)
        return h;
      d = i[d]
    }
    while (g > f && -1 == d);
    if (-1 == d)
      break;
    h += String.fromCharCode((15 & c) << 4 | (60 & d) >> 2);
    do {
      if (e = 255 & a.charCodeAt(f++), 61 == e)
        return h;
      e = i[e]
    }
    while (g > f && -1 == e);
    if (-1 == e)
      break;
    h += String.fromCharCode((3 & d) << 6 | e)
  }
  return h
}

function encode64(a) {
  if (!a)
    return "";
  a = a.toString();
  var b, c, d, e, f, g, h = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (d = a.length, c = 0, b = ""; d > c;) {
    if (e = 255 & a.charCodeAt(c++), c == d) {
      b += h.charAt(e >> 2), b += h.charAt((3 & e) << 4), b += "==";
      break
    }
    if (f = a.charCodeAt(c++), c == d) {
      b += h.charAt(e >> 2), b += h.charAt((3 & e) << 4 | (240 & f) >> 4), b += h.charAt((15 & f) << 2), b += "=";
      break
    }
    g = a.charCodeAt(c++), b += h.charAt(e >> 2), b += h.charAt((3 & e) << 4 | (240 & f) >> 4), b += h.charAt((15 & f) << 2 | (192 & g) >> 6), b += h.charAt(63 & g)
  }
  return b
}

function rc4(a, b) {
  for (var c, d = [], e = 0, f = "", g = 0; 256 > g; g++)
    d[g] = g;
  for (g = 0; 256 > g; g++)
    e = (e + d[g] + a.charCodeAt(g % a.length)) % 256, c = d[g], d[g] = d[e], d[e] = c;
  g = 0, e = 0;
  for (var h = 0; h < b.length; h++)
    g = (g + 1) % 256, e = (e + d[g]) % 256, c = d[g], d[g] = d[e], d[e] = c, f += String.fromCharCode(b.charCodeAt(h) ^ d[(d[g] + d[e]) % 256]);
  return f
}

function translate(a, b) {
  for (var c = [], d = 0; d < a.length; d++) {
    var e = 0;
    e = a[d] >= "a" && a[d] <= "z" ? a[d].charCodeAt(0) - "a".charCodeAt(0) : a[d] - "0" + 26;
    for (var f = 0; 36 > f; f++)
      if (b[f] == e) {
        e = f;
        break
      }
    e > 25 ? c[d] = e - 26 : c[d] = String.fromCharCode(e + 97)
  }
  return c.join("")
}

//mp4 获取播放地址
function PlayListData (a, b, c) {
  var d = this;
  new Date;
  this._sid = userCache.sid, this._fileType = c, this._videoSegsDic = {};
  this._ip = a.security.ip;
  var e = (new RandomProxy, []),
    f = [];
  f.streams = {}, f.logos = {}, f.typeArr = {}, f.totalTime = {};
  for (var g = 0; g < b.length; g++) {
    for (var h = b[g].audio_lang, i = !1, j = 0; j < e.length; j++)
      if (e[j] == h) {
        i = !0;
        break
      }
    i || e.push(h)
  }
  for (var g = 0; g < e.length; g++) {
    for (var k = e[g], l = {}, m = {}, n = [], j = 0; j < b.length; j++) {
      var o = b[j];
      if (k == o.audio_lang) {
        if (!d.isValidType(o.stream_type))
          continue;
        var p = d.convertType(o.stream_type),
          q = 0;
        "none" != o.logo && (q = 1), m[p] = q;
        var r = !1;
        for (var s in n)
          p == n[s] && (r = !0);
        r || n.push(p);
        var t = o.segs;
        if (null == t)
          continue;
        var u = [];
        r && (u = l[p]);
        for (var v = 0; v < t.length; v++) {
          var w = t[v];
          if (null == w)
            break;
          var x = {};
          x.no = v, 
          x.size = w.size, 
          x.seconds = Number(w.total_milliseconds_video) / 1e3, 
          x.milliseconds_video = Number(o.milliseconds_video) / 1e3, 
          x.key = w.key, x.fileId = this.getFileId(o.stream_fileid, v), 
          x.src = this.getVideoSrc(j, v, a, o.stream_type, x.fileId), 
          x.type = p, 
          u.push(x)
        }
        l[p] = u
      }
    }
    var y = this.langCodeToCN(k).key;
    f.logos[y] = m, f.streams[y] = l, f.typeArr[y] = n        
  }
  this._videoSegsDic = f, this._videoSegsDic.lang = this.langCodeToCN(e[0]).key
}

function RandomProxy (a) {
  this._randomSeed = a, this.cg_hun()
};
RandomProxy.prototype = {
  cg_hun: function() {
    this._cgStr = "";
    for (var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890", b = a.length, c = 0; b > c; c++) {
      var d = parseInt(this.ran() * a.length);
      this._cgStr += a.charAt(d), a = a.split(a.charAt(d)).join("")
    }
  },
  cg_fun: function(a) {
    for (var b = a.split("*"), c = "", d = 0; d < b.length - 1; d++)
      c += this._cgStr.charAt(b[d]);
    return c
  },
  ran: function() {
    return this._randomSeed = (211 * this._randomSeed + 30031) % 65536, this._randomSeed / 65536
  }
  }, PlayListData.prototype = {
  getFileId: function(a, b) {
    if (null == a || "" == a)
      return "";
    var c = "",
      d = a.slice(0, 8),
      e = b.toString(16);
    1 == e.length && (e = "0" + e), e = e.toUpperCase();
    var f = a.slice(10, a.length);
    return c = d + e + f
  },
  isValidType: function(a) {
    return "3gphd" == a || "flv" == a || "flvhd" == a || "mp4hd" == a || "mp4hd2" == a || "mp4hd3" == a ? !0 : !1
  },
  convertType: function(a) {
    var b = a;
    switch (a) {
      case "m3u8":
        b = "mp4";
        break;
      case "3gphd":
        b = "3gphd";
        break;
      case "flv":
        b = "flv";
        break;
      case "flvhd":
        b = "flv";
        break;
      case "mp4hd":
        b = "mp4";
        break;
      case "mp4hd2":
        b = "hd2";
        break;
      case "mp4hd3":
        b = "hd3"
    }
    return b
  },
  langCodeToCN: function(a) {
    var b = "";
    switch (a) {
      case "default":
        b = {
          key: "guoyu",
          value: "国语"
        };
        break;
      case "guoyu":
        b = {
          key: "guoyu",
          value: "国语"
        };
        break;
      case "yue":
        b = {
          key: "yue",
          value: "粤语"
        };
        break;
      case "chuan":
        b = {
          key: "chuan",
          value: "川话"
        };
        break;
      case "tai":
        b = {
          key: "tai",
          value: "台湾"
        };
        break;
      case "min":
        b = {
          key: "min",
          value: "闽南"
        };
        break;
      case "en":
        b = {
          key: "en",
          value: "英语"
        };
        break;
      case "ja":
        b = {
          key: "ja",
          value: "日语"
        };
        break;
      case "kr":
        b = {
          key: "kr",
          value: "韩语"
        };
        break;
      case "in":
        b = {
          key: "in",
          value: "印度"
        };
        break;
      case "ru":
        b = {
          key: "ru",
          value: "俄语"
        };
        break;
      case "fr":
        b = {
          key: "fr",
          value: "法语"
        };
        break;
      case "de":
        b = {
          key: "de",
          value: "德语"
        };
        break;
      case "it":
        b = {
          key: "it",
          value: "意语"
        };
        break;
      case "es":
        b = {
          key: "es",
          value: "西语"
        };
        break;
      case "po":
        b = {
          key: "po",
          value: "葡语"
        };
        break;
      case "th":
        b = {
          key: "th",
          value: "泰语"
        }
    }
    return b
  },
  getVideoSrc: function(a, b, c, d, e, f, g) {
    var h = c.stream[a],
      i = c.video.encodeid;
    if (!i || !d)
      return "";
    var j = {
        flv: 0,
        flvhd: 0,
        mp4: 1,
        hd2: 2,
        "3gphd": 1,
        "3gp": 0
      },
      k = j[d],
      l = {
        flv: "flv",
        mp4: "mp4",
        hd2: "flv",
        mp4hd: "mp4",
        mp4hd2: "mp4",
        "3gphd": "mp4",
        "3gp": "flv",
        flvhd: "flv"
      },
      m = l[d],
      n = b.toString(16);
    1 == n.length && (n = "0" + n);
    var o = h.segs[b].total_milliseconds_video / 1e3,
      p = h.segs[b].key;
    ("" == p || -1 == p) && (p = h.key2 + h.key1);
    var q = "";
    c.show && (q = c.show.pay ? "&ypremium=1" : "&ymovie=1");
    var r = "/player/getFlvPath/sid/" + userCache.sid + "_" + n + "/st/" + m + "/fileid/" + e + "?K=" + p + "&hd=" + k + "&myp=0&ts=" + o + "&ypp=0" + q,
      s = [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26],
      t = encodeURIComponent(encode64(rc4(translate(mk.a4 + "poz" + userCache.a2, dic).toString(), userCache.sid + "_" + e + "_" + userCache.token)));
    return r += "&ep=" + t, r += "&ctype=12", r += "&ev=1", r += "&token=" + userCache.token, r += "&oip=" + this._ip, r += (f ? "/password/" + f : "") + (g ? g : ""), r = "http://k.youku.com" + r
  }
}
