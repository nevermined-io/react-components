const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: './dist/node/index.js',
  externals: [nodeExternals()],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'commonjs'
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, 'dist/node'),
      cleanOnceBeforeBuildPatterns: ['**/*.js', '**/*.scss']
    }),
    new MiniCssExtractPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        include: path.resolve(__dirname, './dist/node')
      }
    ]
  }
}
