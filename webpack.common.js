const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'uni.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Uni',
    libraryTarget: 'umd'
  },
  node: {
    fs: 'empty'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      /* ... */
      {
        test: /crypto\.wasm$/,
        type: "javascript/auto", // ← !!
        loader: "file-loader",
        options: {
          publicPath: "dist/"
        }
      }
    ]
  }
};
