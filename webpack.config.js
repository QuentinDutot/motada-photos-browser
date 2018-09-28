const webpack = require("webpack");
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/client/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'/*, 'eslint-loader'*/]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: ['url-loader']
      }
    ]
  },
  devServer: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:8080'
    }
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './src/client/index.html', inject: false })
  ]
};
