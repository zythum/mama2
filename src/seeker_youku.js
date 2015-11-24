/*  youku 
 *  @朱一
 */
var canPlayM3U8 = require('./canPlayM3U8')
var ajax        = require('./ajax')
var log         = require('./log')
exports.match = function (url) {
	return /v\.youku\.com/.test(url.attr('host')) && !!window.videoId
}
var parseYoukuCode = exports.parseYoukuCode = function (_id, callback) {
	log('开始解析youku视频地址')	
	var mk_a3 = 'b4et';
	var mk_a4 = 'boa4';
	var userCache_a1 = '4';
	var userCache_a2 = '1';
	var rs;
	var sid;
	var token;
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

	function D(a) {
		if (!a) return "";
		var a = a.toString(),
			c, b, f, e, g, h;
		f = a.length;
		b = 0;
		for (c = ""; b < f;) {
			e = a.charCodeAt(b++) & 255;
			if (b == f) {
				c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
				c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4);
				c += "==";
				break
			}
			g = a.charCodeAt(b++);
			if (b == f) {
				c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
				c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4 | (g & 240) >> 4);
				c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((g &
					15) << 2);
				c += "=";
				break
			}
			h = a.charCodeAt(b++);
			c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(e >> 2);
			c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((e & 3) << 4 | (g & 240) >> 4);
			c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt((g & 15) << 2 | (h & 192) >> 6);
			c += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charAt(h & 63)
		}
		return c
	}

	function E(a, c) {
		for (var b = [], f = 0, i, e = "", h = 0; 256 > h; h++) b[h] = h;
		for (h = 0; 256 > h; h++) f = (f + b[h] + a.charCodeAt(h % a.length)) % 256, i = b[h], b[h] = b[f], b[f] = i;
		for (var q = f = h = 0; q < c.length; q++) h = (h + 1) % 256, f = (f + b[h]) % 256, i = b[h], b[h] = b[f], b[f] = i, e += String.fromCharCode(c.charCodeAt(q) ^ b[(b[h] + b[f]) % 256]);
		return e
	}

	function F(a, c) {
		for (var b = [], f = 0; f < a.length; f++) {
			for (var i = 0, i = "a" <= a[f] && "z" >= a[f] ? a[f].charCodeAt(0) - 97 : a[f] - 0 + 26, e = 0; 36 > e; e++)
				if (c[e] == i) {
					i = e;
					break
				}
			b[f] = 25 < i ? i - 26 : String.fromCharCode(i + 97)
		}
		return b.join("")
	}
	
	var PlayListData = function(a, b, c) {
			var d = this;
			new Date;
			this._sid = sid, this._fileType = c, this._videoSegsDic = {};
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
		},
		RandomProxy = function(a) {
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
			var r = "/player/getFlvPath/sid/" + sid + "_" + n + "/st/" + m + "/fileid/" + e + "?K=" + p + "&hd=" + k + "&myp=0&ts=" + o + "&ypp=0" + q,
				s = [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26],
				t = encodeURIComponent(encode64(E(F(mk_a4 + "poz" + userCache_a2, s).toString(), sid + "_" + e + "_" + token)));
			return r += "&ep=" + t, r += "&ctype=12", r += "&ev=1", r += "&token=" + token, r += "&oip=" + this._ip, r += (f ? "/password/" + f : "") + (g ? g : ""), r = "http://k.youku.com" + r
		}
	};

	ajax({
		url: 'http://play.youku.com/play/get.json?vid=' + _id + '&ct=12',
		jsonp: true,
		callback: function (param) {
			if(param == -1) {
				log('解析youku视频地址失败', 2)
			}
			rs = param;
			var a = param.data,
				c = E(F(mk_a3 + "o0b" + userCache_a1, [19, 1, 4, 7, 30, 14, 28, 8, 24,
					17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26
				]).toString(), decode64(a.security.encrypt_string));
			c     = c.split("_");
			sid   = c[0];
			token = c[1];
			if ( canPlayM3U8 && navigator.userAgent.indexOf('PlayStation') === -1 ) {
				var ep  = encodeURIComponent(D(E(F(mk_a4 + "poz" + userCache_a2, [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26]).toString(), sid + "_" + _id + "_" + token)));
				var oip = a.security.ip;
				var source = [
					['超清', 'http://pl.youku.com/playlist/m3u8?vid='+_id+'&type=hd2&ctype=12&keyframe=1&ep='+ep+'&sid='+sid+'&token='+token+'&ev=1&oip='+oip],
					['高清', 'http://pl.youku.com/playlist/m3u8?vid='+_id+'&type=mp4&ctype=12&keyframe=1&ep='+ep+'&sid='+sid+'&token='+token+'&ev=1&oip='+oip],
					['标清', 'http://pl.youku.com/playlist/m3u8?vid='+_id+'&type=flv&ctype=12&keyframe=1&ep='+ep+'&sid='+sid+'&token='+token+'&ev=1&oip='+oip]
				];
				log('解析youku视频地址成功 ' + source.map(function (item) {return '<a href='+item[1]+'>'+item[0]+'</a>'}).join(' '), 2)
				callback(source);
			} else {
				var t = new PlayListData(a, a.stream, 'mp4')
				var source = [
					['标清', t._videoSegsDic.streams['guoyu']['3gphd'][0].src]
				];
				log('解析youku视频地址成功 ' + source.map(function (item) {return '<a href='+item[1]+'>'+item[0]+'</a>'}).join(' '), 2)
				callback(source);
			}
		}
	})
}
exports.getVideos = function (url, callback) {
	parseYoukuCode(window.videoId, callback)
}