import flashBlocker  from './flashBlocker'
import MAMAPlayer    from './player'
import mamaKey       from './mamakey'
import * as seekers  from './seekers'
import flvsp         from './seeker_flvsp'
import {
  createElement,
  log,
  purl
} from './util/index'

if (window[mamaKey] = true) {
  let matched
  let url = purl(location.href)
  if (url.attr('host') === 'zythum.sinaapp.com' &&
    url.attr('directory') === '/mama2/ps4/' && url.param('url') ) {
    url = purl(url.param('url'))
  }

  for (let seekerName in seekers) {
    let seeker = seekers[seekerName]
    if (matched === true) break;
    if (!!seeker.match(url) === true) {
      log('开始解析内容地址')
      matched = true
      seeker.getVideos(url, seeked)
    }
  }

  if (matched === undefined) {
    log('尝试使用<a target="_blank" href="http://weibo.com/justashit">一环同学</a>提供的解析服务', 2)
    flvsp.getVideos(url, seeked)
  }
}

function seeked (source, comments) {
  if (!source) {
    log('解析内容地址失败', 2)
    delete window[mamaKey]
    return
  }
  log('解析内容地址完成'+source.map((i)=>{return `<a href="${i[1]}" target="_blank">${i[0]}</a>`}).join(' '), 2)
  flashBlocker()
  initPlayer(source, comments, () => delete window[mamaKey] )
  window[mamaKey] = true
}

function initPlayer (source, comments, onclosed) {
    let mask = createElement('div', {
    appendTo: document.body,
    style: {
      position: 'fixed',
      background: 'rgba(0,0,0,0.8)',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '999999'
    }
  })
  createElement('div', {
    appendTo: mask,
    style: {
      width: '1000px',
      height: '500px',
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: '-250px',
      marginLeft: '-500px',
      borderRadius: '2px',
      boxShadow: '0 0 2px #000000, 0 0 200px #000000',
    }
  })
  createElement('div', {
    appendTo: mask,
    innerHTML: '<a style="color:#555555;" href="http://zythum.sinaapp.com/mama2/" target="_blank">MAMA2: 妈妈再也不用担心我的 MacBook 发热计划</a>',
    style: {
      position: 'absolute',
      bottom: '10px',
      left: '0',
      right: '0',
      height: '20px',
      lineHeight: '20px',
      textAlign: 'center',
      fontSize:'12px',
      fontFamily: 'arial, sans-serif'
    }
  })
  let container = createElement('div', {
    appendTo: mask,
    innerHTML: '<div id="MAMA2_video_placeHolder"></div>',
    style: {
      width: '1000px',
      height: '500px',
      position: 'absolute',
      backgroundColor: '#000000',
      top: '50%',
      left: '50%',
      marginTop: '-250px',
      marginLeft: '-500px',
      borderRadius: '2px',
      overflow: 'hidden'
    }
  })
  createElement('div', {
    appendTo: container,
    innerHTML: '&times;',
    style: {
      width: '20px',
      height: '20px',
      lineHeight: '20px',
      textAlign: 'center',
      position: 'absolute',
      color: '#ffffff',
      fontSize: '20px',
      top: '5px',
      right: '5px',
      textShadow: '0 0 2px #000000',
      fontWeight: 'bold',
      fontFamily: 'Garamond, "Apple Garamond"',
      cursor: 'pointer'
    },
    onclick () {
      document.body.removeChild(mask)
      player.video.src = 'about:blank'
      onclosed();
    }
  })

  let player = new MAMAPlayer('MAMA2_video_placeHolder', '1000x500', source, comments)
  player.iframe.style.display = 'block'
  player.iframe.contentWindow.focus()
}