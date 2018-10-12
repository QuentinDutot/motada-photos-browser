const webpack = require("webpack");
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');

module.exports = {
  entry: './src/client/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'bundle.[hash].js'
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
    new BundleAnalyzerPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new HtmlWebpackPlugin({ filename: path.resolve(__dirname, './dist')+'/index.html', template: './src/client/index.template.html', alwaysWriteToDisk: true }),
    new HtmlWebpackHarddiskPlugin({ outputPath: path.resolve(__dirname, './dist') }),
    new WebpackCleanupPlugin()
  ]
};
