const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack'); // to access built-in plugins

module.exports = (env) => { return {
  entry: {
    'fund-es5-dev': ['./index.js'],
  },
  module: {
    rules: [
        {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-proposal-object-rest-spread','@babel/plugin-transform-react-jsx']
            }
        }
    ]
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    compress: true,
    port: 8080,
    historyApiFallback: true,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'index.html',   baseUrl: '/'}),
    new webpack.ProgressPlugin(),
  ],
  mode: 'development',
  devtool: 'source-map'
 }
};
