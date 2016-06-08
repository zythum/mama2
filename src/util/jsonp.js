/*  ＃function jsonp#
 *  jsonp方法。推荐使用ajax方法。ajax包含了jsonp
 */
import {createElement} from './createElement'
import {noop}          from './noop'

const callbackPrefix = 'MAMA2_HTTP_JSONP_CALLBACK'
const timeoutDelay = 10000
let callbackCount = 0

function callbackHandle () {
  return callbackPrefix + callbackCount++
}

export function jsonp (url, callback, callbackKey) {

  callbackKey = callbackKey || 'callback'

  const _callbackHandle = callbackHandle()
  
  window[_callbackHandle] = (rs) => {
    clearTimeout(timeoutTimer)
    window[_callbackHandle] = noop
    callback(rs)
    document.body.removeChild(script)
  }

  let timeoutTimer = setTimeout( () => {
    window[_callbackHandle](-1)
  }, timeoutDelay)

  let script = createElement('script', {
    appendTo: document.body,
    src: url + (url.indexOf('?') >= 0 ? '&' : '?') + callbackKey + '=' + _callbackHandle
  })
}