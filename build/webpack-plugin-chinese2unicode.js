//将中文妆成\uxxxxx的形式。
//避免在一些不是utf-8的网站上文字显示乱码

function toUnicode (s) {
  return s.replace(/([\u4E00-\u9FA5]|[\uFE30-\uFFA0])/g, function() {
    return '\\u' + RegExp['$1'].charCodeAt(0).toString(16)
  })
}

function Chinese2unicodePlugin () {}
Chinese2unicodePlugin.prototype.apply = function (compiler) {
  compiler.plugin('emit', function (compilation, callback) {
    for (var assetName in compilation.assets) {
      var asset = compilation.assets[assetName]
      compilation.assets[assetName] = (function (source) {
        return {
          source: function () { return source },
          size: function () { return source.length }
        }
      }(toUnicode(asset.source())))
    }
    callback()
  })
}

module.exports = Chinese2unicodePlugin