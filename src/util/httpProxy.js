/*  ＃function httpProxy#
 *  < {
 *      url:       String 请求地址
 *      method:    String 请求方法GET,POST,etc.
 *      param:     Object 请求参数
 *      xml:       Bool   是否需要做xml2json 可缺省, 默认fasle
 *      gzinflate: Bool   是否需要做gzinflate 可缺省, 默认fasle
 *      context:   Any    callback回调的this指向 可缺省
 *    }
 *  }
 *  < Function      请求的callback, 如果失败返回－1， 成功返回内容
 *  用于发起跨域的ajax请求。既接口返回跨域又不支持jsonp协议的
 */

import {ajax}        from './ajax'
import {queryString} from './queryString'

const proxyUrl = 'http://zythum.sinaapp.com/mama2/proxy.php'

export function httpProxy (options = {}, callback) {
  ajax({
    url: proxyUrl,
    param : {
      params: encodeURIComponent(queryString(options.param)),//上行参数
      referrer: encodeURIComponent((options.referrer || location.href).split('#')[0]),
      url: encodeURIComponent(options.url.split('#')[0]),
      post: options.method === 'post' ? 1 : 0,
      xml: options.xml ? 1 : 0,
      text: options.text ? 1 : 0,
      gzinflate: options.gzinflate ? 1 : 0,
      ua: encodeURIComponent(options.ua || navigator.userAgent)
    },
    jsonp: true,
    context: options.context
  }, callback)
}
