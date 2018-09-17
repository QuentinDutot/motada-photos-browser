const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'/*, 'eslint-loader'*/]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(gif|eot|woff|woff2|ttf|svg)$/,
        loaders: ['url-loader']
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ],
  resolve: { extensions: ['.js', '.jsx'] },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  }
};
