var path = require('path');
//const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './lib/main.js',
    output: {
        path: __dirname,
        filename: 'main.js'
    },
    devtool: 'inline-source-map',
    module: {
        loaders: [
//            { loader: 'babel-loader', options: {          plugins: [require('babel-plugin-transform-object-rest-spread')] } }
        ]
    },
 plugins: [
//   new UglifyJSPlugin()
 ]
};
