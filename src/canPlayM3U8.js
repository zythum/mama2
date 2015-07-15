/*  ＃Bool canPlayM3U8＃
 *  返回浏览器是否支持m3u8格式的视频播放。
 *  目前chrome,firefox只支持mp4
 */
module.exports = !!document.createElement('video').canPlayType('application/x-mpegURL')