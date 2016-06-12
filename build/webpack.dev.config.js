var path = require('path')
var webpack = require('webpack')
var Chinese2unicodePlugin = require('./webpack-plugin-chinese2unicode')

module.exports = {
  entry: ['./src/index'],
  output: {
    path: './dest',
    filename: 'index.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel",
      query: { presets: ['es2015'] }
    }],
    noParse: [ /player\.js$/ ]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new Chinese2unicodePlugin()
  ],
  devtool: 'source-map'
}
