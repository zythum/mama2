/*
 *  用于屏蔽页面上的所有flash
 */
const flashStyle = [
  'text-shadow:0 0 2px #eee',
  'letter-spacing:-1px',
  'background:#eee',
  'font-weight:bold',
  'padding:0',
  'font-family:arial,sans-serif',
  'font-size:30px',
  'color:#ccc',
  'width:152px',
  'height:52px',
  'border:4px solid #ccc',
  'border-radius:12px',
  'position:absolute',
  'top:50%',
  'left:50%',
  'margin:-30px 0 0 -80px',
  'text-align:center',
  'line-height:52px'
]
const flashText = `<div style="${flashStyle.join(';')}">Flash</div>`

let count = 0;
let flashBlocks = {};
//点击时间触发
function click2ShowFlash (e) {
  let index = this.getAttribute('data-flash-index');
  let flash = flashBlocks[index];
  flash.setAttribute('data-flash-show','isshow');
  this.parentNode.insertBefore(flash, this);
  this.parentNode.removeChild(this);
  this.removeEventListener('click', click2ShowFlash, false);
};

function createAPlaceHolder (flash, width, height) {
  let index = count++;
  let style = document.defaultView.getComputedStyle(flash, null);
  let positionType = style.position;
  positionType = positionType === 'static' ? 'relative' : positionType;
  let margin = style['margin'];
  let display = style['display'] == 'inline' ? 'inline-block' : style['display'];
  style = [
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
  let placeHolder = document.createElement('div');
  placeHolder.setAttribute('title', '&#x70B9;&#x6211;&#x8FD8;&#x539F;Flash');
  placeHolder.setAttribute('data-flash-index', '' + index);
  flash.parentNode.insertBefore(placeHolder, flash);
  flash.parentNode.removeChild(flash);
  placeHolder.addEventListener('click', click2ShowFlash, false);
  placeHolder.style.cssText += style.join(';');
  placeHolder.innerHTML = flashText;
  return placeHolder;
};

function parseFlash (target) {
  if(target instanceof HTMLObjectElement) {
    if(target.innerHTML.trim() == '') return;
    if(target.getAttribute("classid") && !/^java:/.test(target.getAttribute("classid"))) return;
  } else if(!(target instanceof HTMLEmbedElement)) return;

  let width = target.offsetWidth;
  let height = target.offsetHeight;

  if(width > 160 && height > 60){
    createAPlaceHolder(target, width, height);
  }
};

export default () => {
  let embeds = document.getElementsByTagName('embed');
  let objects = document.getElementsByTagName('object');
  for(let i=0,len=objects.length; i<len; i++) objects[i] && parseFlash(objects[i]);
  for(let i=0,len=embeds.length; i<len; i++)  embeds[i] && parseFlash(embeds[i]);
}
