/*  iqiyi 
 *  @朱一
 */
import {log} from './util/index'
export default {match, getVideos}

function match (url) {
  return /^http:\/\/www\.iqiyi\.com/.test(url.attr('source')) && !!window.Q.PageInfo
}
function getVideos (url, callback) {
  log('因为爱奇艺的某些原因不让播, 所以你热就热吧。')
}
