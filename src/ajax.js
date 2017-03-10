/*  ＃function ajax#
 *  < {
 *    url:          String   请求地址
 *    param:        Object   请求参数.可缺省
 *    method:       String   请求方法GET,POST,etc. 可缺省，默认是GET 
 *    callback:     Function 请求的callback, 如果失败返回－1， 成功返回内容
 *    contentType:  String   返回内容的格式。如果是JOSN会做JSON Parse， 可缺省,默认是json
 *    context:      Any      callback回调函数的this指向。可缺省
 *  }
 *  用于发起ajax或者jsonp请求
 */

var jsonp       = require('./jsonp')
var noop        = require('./noop')
var queryString = require('./queryString')

function defalutOption (option, defalutValue) {
  return option === undefined ? defalutValue : option
}

function joinUrl (url, queryString) {
  if (queryString.length === 0) return url
  return url + (url.indexOf('?') === -1 ? '?' : '&') + queryString
}

function ajax (options) {
  var url         = defalutOption(options.url, '')
  var query       = queryString( defalutOption(options.param, {}) )
  var method      = defalutOption(options.method, 'GET')
  var callback    = defalutOption(options.callback, noop)
  var contentType = defalutOption(options.contentType, 'json')
  var context     = defalutOption(options.context, null)

  if (options.jsonp) {
    return jsonp(
      joinUrl(url, query),
      callback.bind(context),
      typeof options.jsonp === 'string' ? options.jsonp : undefined
    )
  }

  var xhr = new XMLHttpRequest()
  if (method.toLowerCase() === 'get') {
    url = joinUrl(url, query)
    query = ''
  }
  xhr.open(method, url, true)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8')
  xhr.send(query)
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 ) {
      if (xhr.status === 200) {
        var data = xhr.responseText
        if (contentType.toLowerCase() === 'json') {
          try {
            data = JSON.parse(data)
          } catch(e) {
            data = -1
          }         
        }
        return callback.call(context, data)
      } else {
        return callback.call(context, -1)
      }
    }
  }
}
module.exports = ajax;

/*=====huge====*/
