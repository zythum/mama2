/*  ＃function queryString#
 *  < Object   例如 {a:1,b:2,c:3}
 *  > String   例如 a=1&b=2&c=3
 *  用于拼装url地址的query
 */
export function queryString (obj) {
  let query = []
  for (let one in obj) {
    if (obj.hasOwnProperty(one)) {
      query.push([one, obj[one]].join('='))
    }
  }
  return query.join('&')
}