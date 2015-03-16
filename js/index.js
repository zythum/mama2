var flashBlocker  = require('./flashBlocker')

var createElement = require('./createElement')
var player        = require('./player')
var log           = require('./log')

var mamaKey       = 'MAMAKEY_田琴是这个世界上最可爱的女孩子呵呵呵呵，我要让全世界都在知道'
var matched

if (window[mamaKey] != true) {

window[mamaKey] = true

function seeked (source, comments) {
	if (source === false) {
		delete window[mamaKey]
		return
	}
	var mask = createElement('div', {
		appendTo: document.body,
		style: {
			position: 'fixed',
			background: 'rgba(0,0,0,0.8)',
			top: '0',
			left: '0',
			width: '100%',
			height: '100%',
			zIndex: '999999'
		}
	})
	var container = createElement('div', {
		appendTo: mask,
		style: {
			width: '800px',
			height: '400px',
			position: 'absolute',
			top: '50%',
			left: '50%',
			marginTop: '-200px',
			marginLeft: '-400px',
			borderRadius: '2px',
			boxShadow: '0 0 2px #000000, 0 0 200px #000000'
		}
	})
	var container = createElement('div', {
		appendTo: mask,
		innerHTML: '<div id="MAMA2_video_placeHolder"></div>',
		style: {
			width: '800px',
			height: '400px',
			position: 'absolute',
			backgroundColor: '#000000',
			top: '50%',
			left: '50%',
			marginTop: '-200px',
			marginLeft: '-400px',
			borderRadius: '2px',
			overflow: 'hidden'
		}
	})
	createElement('div', {
		appendTo: container,
		innerHTML: '&times;',
		style: {
			width: '20px',
			height: '20px',
			lineHeight: '20px',
			textAlign: 'center',
			position: 'absolute',
			color: '#ffffff',
			fontSize: '20px',
			top: '5px',
			right: '5px',
			textShadow: '0 0 2px #000000',
			fontWeight: 'bold',
			fontFamily: 'Garamond, "Apple Garamond"',
			cursor: 'pointer'
		}
	}).onclick = function () {
		document.body.removeChild(mask)
		player.video.src = "about:blank"
		delete window[mamaKey]
	}
	var player = new MAMAPlayer('MAMA2_video_placeHolder', '800x400', source, comments)
	flashBlocker()
	player.iframe.style.display = 'block'
}

[
	require('./seeker_bilibili'),
	require('./seeker_youku')


].forEach(function (seeker) {
	if (matched === true) return
	if (seeker.match() === true) {
		matched = true
		seeker.getVideos(seeked)		
	}
})

if (matched === undefined) {
	log('对不起，没有找到可以解析的内容', 2)
}


}