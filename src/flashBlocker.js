/*  
 *  用于屏蔽页面上的所有flash
 */
var flashText = '<div style="text-shadow:0 0 2px #eee;letter-spacing:-1px;background:#eee;font-weight:bold;padding:0;font-family:arial,sans-serif;font-size:30px;color:#ccc;width:152px;height:52px;border:4px solid #ccc;border-radius:12px;position:absolute;top:50%;left:50%;margin:-30px 0 0 -80px;text-align:center;line-height:52px;">Flash</div>';

var count = 0;
var flashBlocks = {};
//点击时间触发
var click2ShowFlash = function(e){
	var index = this.getAttribute('data-flash-index');
	var flash = flashBlocks[index];
	flash.setAttribute('data-flash-show','isshow');
	this.parentNode.insertBefore(flash, this);
	this.parentNode.removeChild(this);
	this.removeEventListener('click', click2ShowFlash, false);
};

var createAPlaceHolder = function(flash, width, height){
	var index = count++;
	var style = document.defaultView.getComputedStyle(flash, null);
	var positionType = style.position;
		positionType = positionType === 'static' ? 'relative' : positionType;
	var margin       = style['margin'];
	var display      = style['display'] == 'inline' ? 'inline-block' : style['display'];
	var style = [
		'',
		'width:'    + width  +'px',
		'height:'   + height +'px',
		'position:' + positionType,
		'margin:'   + margin,
		'display:'  + display,
		'margin:0',
		'padding:0',
		'border:0',
		'border-radius:1px',
		'cursor:pointer',
		'background:-webkit-linear-gradient(top, rgba(240,240,240,1)0%,rgba(220,220,220,1)100%)',			
		''
	]
	flashBlocks[index] = flash;
	var placeHolder = document.createElement('div');
	placeHolder.setAttribute('title', '&#x70B9;&#x6211;&#x8FD8;&#x539F;Flash');
	placeHolder.setAttribute('data-flash-index', '' + index);
	flash.parentNode.insertBefore(placeHolder, flash);
	flash.parentNode.removeChild(flash);
	placeHolder.addEventListener('click', click2ShowFlash, false);
	placeHolder.style.cssText += style.join(';');
	placeHolder.innerHTML = flashText;
	return placeHolder;
};

var parseFlash = function(target){
	if(target instanceof HTMLObjectElement) {
		if(target.innerHTML.trim() == '') return;
		if(target.getAttribute("classid") && !/^java:/.test(target.getAttribute("classid"))) return;			
	} else if(!(target instanceof HTMLEmbedElement)) return;

	var width = target.offsetWidth;
	var height = target.offsetHeight;		

	if(width > 160 && height > 60){
		createAPlaceHolder(target, width, height);
	}
};

var handleBeforeLoadEvent = function(e){
	var target = e.target
	if(target.getAttribute('data-flash-show') == 'isshow') return;
	parseFlash(target);
};

module.exports = function() {	
	var embeds = document.getElementsByTagName('embed');
	var objects = document.getElementsByTagName('object');
	for(var i=0,len=objects.length; i<len; i++) objects[i] && parseFlash(objects[i]);
	for(var i=0,len=embeds.length; i<len; i++)	embeds[i] && parseFlash(embeds[i]);
}
// document.addEventListener("beforeload", handleBeforeLoadEvent, true);
