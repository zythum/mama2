/*  ＃function queryString#
 *  < Object   例如 {a:1,b:2,c:3}
 *  > String   例如 a=1&b=2&c=3
 *  用于拼装url地址的query
 */
function queryString (obj) {
	var query = []
	for (one in obj) {
		if (obj.hasOwnProperty(one)) {
			query.push([one, obj[one]].join('='))
		}
	}
	return query.join('&')
}
module.exports = queryString