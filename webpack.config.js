const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  // devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  mode: 'production',
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  output: {
    filename: 'uni.min.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: 'umd',
    library: 'Uni',
    umdNamedDefine: true
  },
  node: {
    fs: 'empty'
  }
};

// const path = require('path');
// const TerserPlugin = require('terser-webpack-plugin');

// module.exports = {
//   entry: {
//     'uni.min': './src/index.ts'
//   },
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: '[name].js',
//     libraryTarget: 'umd',
//     library: 'Uni',
//     umdNamedDefine: true
//   },
//   resolve: {
//     extensions: ['.ts', '.tsx', '.js']
//   },
//   devtool: 'source-map',
//   optimization: {
//     minimize: true,
//     minimizer: [new TerserPlugin()],
//   },
//   module: {
//     loaders: [{
//       test: /\.tsx?$/,
//       loader: 'awesome-typescript-loader',
//       exclude: /node_modules/,
//       query: {
//         declaration: false,
//       }
//     }],
//     rules: [
//       /* ... */
//       {
//         test: /crypto\.wasm$/,
//         type: "javascript/auto", // ← !!
//         loader: "file-loader",
//         options: {
//           publicPath: "dist/"
//         }
//       }
//     ]
//   }
// };
