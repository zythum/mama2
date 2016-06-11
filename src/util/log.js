/*  ＃function log＃
 *  < String
 *  log, 会在页面和console中输出log
 */

import { createElement } from './createElement'

let MAMALogDOM
let logTimer

export function log (msg, delay = 10) {
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

  if(window.console && console.log)
    console.log('%c MAMA2 %c %s', 'background:#24272A; color:#ffffff', '', msg)
  document.body.appendChild(MAMALogDOM).innerHTML =
    '<span style="color:#DF6558">MAMA2 &gt;</span> ' + msg
  logTimer = setTimeout(() => document.body.removeChild(MAMALogDOM), delay*1000)
  return msg
}

export function assert (condition, message) {
  if (!condition) throw log(message, 2)
}
