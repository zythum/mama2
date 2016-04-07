/*  115 vip only
 *  @HugoLee 2016.4.1
 */

var flashText = '<div style="text-shadow:0 0 2px #eee;letter-spacing:-1px;background:#eee;font-weight:bold;padding:0;font-family:arial,sans-serif;font-size:30px;color:#ccc;width:152px;height:52px;border:4px solid #ccc;border-radius:12px;position:absolute;top:50%;left:50%;margin:-30px 0 0 -80px;text-align:center;line-height:52px;">Flash</div>';

var iframe=document.getElementsByTagName("iframe")[0]
var style = [
    '',
    'width:100%',
    'height:100%',
    'cursor:pointer',
    'background-color:#eee',     
    ''
  ]
var click2ShowFlash=function(){
	document.body.appendChild(iframe)
}
var blockframe=function(){
	//var iframeSrc=iframe.src
	//var iframeStyle=iframe.style
	document.body.removeChild(iframe)
	var placeHolder = document.createElement('div');
	  placeHolder.setAttribute('title', '&#x70B9;&#x6211;&#x8FD8;&#x539F;Flash');
	  placeHolder.addEventListener('click', click2ShowFlash, false);
	  placeHolder.innerHTML = flashText;	
	  placeHolder.style.cssText += style.join(';');
	document.body.appendChild(placeHolder)
//console.log(iframeStyle)
}
exports.match = function (url) {
  return url.attr('source').indexOf('play.html?pickcode=') >= 0 || /^http\:\/\/115.com/.test(url.attr('source'))
}
exports.getVideos = function (url, callback) {
	blockframe()
	//document.body.removeChild(document.getElementsByTagName("iframe")[0])
  callback([["115老司机", "http://115.com/?ct=download&ac=video&pickcode="+url.data.param.query.pickcode]])
}
