/*
 * 用于简单创建html节点
 */
export function createElement (tagName, attributes) {
  let element = document.createElement(tagName)
  if ( typeof attributes === 'function' ) {
    attributes.call(element)
  } else {
    for (let attributeName in attributes) {
      if ( attributes.hasOwnProperty(attributeName) ) {
        switch (attributeName) {
        case 'appendTo':
          attributes[attributeName].appendChild(element)
          break
        case 'innerHTML':
        case 'className':
        case 'id':
          element[attributeName] = attributes[attributeName]
          break
        case 'style':
          let styles = attributes[attributeName]
          for (let styleName in styles)
            if ( styles.hasOwnProperty(styleName) )
              element.style[styleName] = styles[styleName]
          break
        default:
          if (attributeName.indexOf('on') === 0) {
            if (typeof attributes[attributeName] === 'function') 
              element[attributeName] = attributes[attributeName]
          } else 
            element.setAttribute(attributeName, attributes[attributeName] + '')
        }
      }
    }
  }
  return element
}