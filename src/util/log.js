/*  ＃function log＃
 *  < String
 *  log, 会在页面和console中输出log
 */

let logInterval

export function log (msg, delay = 10) {
  clearTimeout(logInterval)
  if(window.console && console.log)
    console.log('%c MAMA2 %c %s', 'background:#24272A; color:#ffffff', '', msg)

  iframeLogger.show('<span style="color:#DF6558">MAMA2 &gt;</span> ' + msg)
  logInterval = setTimeout(() => iframeLogger.hide(), delay*1000)
  return msg
}

export function assert (condition, message) {
  if (!condition) throw log(message, 2)
}

let iframeLogger = (() => {
  const iframeStyle = 'height:30px;border:none;position:fixed;z-index:1000000;top:0;left:0'
  const iframeInsideStyle =
    '<style>'+
      '*{margin:0;padding:0;font-family:"PingHei","Lucida Grande","Lucida Sans Unicode","STHeiti","Helvetica","Arial","Verdana","sans-serif"}'+
      'body{padding:0 20px;background:#24272A;color:#ffffff;font-size:14px;white-space:nowrap;line-height:30px;}'+
    '</style>'

  let logFrame
  function initLogFrame () {
    logFrame = document.createElement('iframe')
    logFrame.src = 'about:blank;'
    logFrame.style.cssText = iframeStyle
  }

  function formateForHTML (log) {
    return log.replace(/\[(.*?)\]\((.*?)\)/g,
      (_, description, src) => `<a href="${src}" target="_blank">${description}</a>`)
  }

  function show (log) {
    if (!logFrame) initLogFrame()
    document.body.appendChild(logFrame)
    logFrame.style.width = '10px'
    logFrame.contentWindow.document.body.innerHTML = iframeInsideStyle + formateForHTML(log)
    logFrame.style.width = logFrame.contentWindow.document.body.scrollWidth + 20 + 'px'
  }

  function hide () {
    if (logFrame) document.body.removeChild(logFrame)
  }
  return { show, hide }
})()

