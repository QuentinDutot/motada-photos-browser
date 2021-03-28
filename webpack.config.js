'use strict'

const path = require('path')
const glob = require('glob')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const PurgeCssPlugin = require('purgecss-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = (env, argv) => ({
  entry: './src/client/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.[contenthash].js',
    clean: true,
  },
	target: ['web', 'es5'],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
				use: 'babel-loader',
      },
      {
        test: /\.css$/,
				use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  devtool: argv.mode === 'production' ? false : 'inline-source-map',
  devServer: {
    port: 3000,
    proxy: { '/api': 'http://localhost:8080' },
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, './dist')+'/index.html',
      template: './src/client/index.template.html',
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin({
      outputPath: path.resolve(__dirname, './dist'),
    }),
    new MiniCssExtractPlugin({
      filename: 'style.[contenthash].css',
    }),
    new CssMinimizerPlugin(),
    new PurgeCssPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`,  { nodir: true }),
      defaultExtractor: content => content.match(/[\w-:/]+(?<!:)/g) || [],
    }),
    new CopyWebpackPlugin({
      patterns: [{ from: './src/client/favicon.ico' }],
    }),
		// new ESLintPlugin({
    //   eslintPath: require.resolve('eslint'), extensions: ['js', 'jsx'],
    // }),
  ],
})
