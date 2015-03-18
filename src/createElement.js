/*
 * 用于简单创建html节点
 */
function createElement (tagName, attributes) {
	var element = document.createElement(tagName)
	if ( typeof attributes === 'function' ) {
		attributes.call(element)
	} else {
		for (var attribute in attributes) {
			if ( attributes.hasOwnProperty(attribute) ) {
				switch (attribute) {
				case 'appendTo':
					attributes[attribute].appendChild(element)
					break
				case 'innerHTML':
				case 'className':
				case 'id':
					element[attribute] = attributes[attribute]
					break
				case 'style':
					var styles = attributes[attribute]
					for (var name in styles)
						if ( styles.hasOwnProperty(name) )
							element.style[name] = styles[name]
					break
				default:
					element.setAttribute(attribute, attributes[attribute] + '')
				}
			}
		}
	}
	return element
}

module.exports = createElement