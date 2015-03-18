/*  ＃function log＃
 *  < String
 *  log, 会在页面和console中输出log
 */

var createElement = require('./createElement')
var MAMALogDOM
var logTimer
var logDelay = 10000

function log (msg, delay) {
	if ( MAMALogDOM === undefined ) {
		MAMALogDOM = createElement('div', {
			style: {
				backgroundColor: '#24272A',
				color: '#ffffff',
				position: 'fixed',
				zIndex: '1000000',
				top: '0',
				left: '0',
				padding: '5px 10px',
				fontSize: '14px'
			}
		})
	}
	clearTimeout(logTimer)
	
	MAMALogDOM.innerHTML = '<span style="color:#DF6558">MAMA2 &gt;</span> ' + msg
	console && console.log('%c MAMA2 %c %s', 'background:#24272A; color:#ffffff', '', msg)

	document.body.appendChild(MAMALogDOM)
	logTimer = setTimeout(function () {
		document.body.removeChild(MAMALogDOM)
	}, delay*1000 || logDelay)
}
module.exports = log