/*  秒拍
 *  @朱一
 */

import { httpProxy } from './util/index'
export default { match, getVideos }

function match (url) {
  return /\.miaopai\.com\/show/.test(url.attr('source'))
}

function getVideos (url, callback) {
  const httpProxyOpts = {
    text: true,
    ua: 'Mozilla/5.0 (iPad; CPU iPhone OS 8_1 like Mac OS X) '+
        'AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12B410 Safari/600.1.4'
  }
  httpProxy(location.href, 'get', {}, (result) => {
    let url = result.match(/<video(?:.*?)src=[\"\'](.+?)[\"\'](?!<)(?:.*)\>(?:[\n\r\s]*?)(?:<\/video>)*/)
    if (url && url[1]) callback([['秒拍', url[1]]])
  }, httpProxyOpts)
}