var path = require('path')
var webpack = require('webpack')

module.exports = {
  entry: ['./src/index'],
  output: {
    path: path.resolve(__dirname, './dest'),
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
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['$super', '$', 'exports', 'require']
      }
    })
  ],
  devtool: 'source-map'
}
