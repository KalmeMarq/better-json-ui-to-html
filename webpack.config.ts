import * as path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import webpackdevserver from 'webpack-dev-server'

const config: webpack.Configuration | { devServer: webpackdevserver.Configuration }= {
  entry: path.resolve(__dirname, 'src/index.ts'),
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  devServer: {
    liveReload: true,
    hot: true,
    port: 8080
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.ts/,
            exclude: /node_modules/,
            use: {
              loader: 'ts-loader'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'template/index.html')
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'template/resources'),
          to: path.resolve(__dirname, 'public/resources')
        }
      ]
    })
  ]
}

export default config