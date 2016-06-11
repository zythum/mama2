/*  iqiyi
 *  @朱一
 */
import { assert } from './util/index'
export default { match, getVideos }

function match (url) {
  return /^http:\/\/www\.iqiyi\.com/.test(url.attr('source'))
}
function getVideos (url, callback) {
  assert(false, '因为爱奇艺的某些原因不让播, 所以你热就热吧。')
}
