const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./base.config");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(baseConfig, {
  mode: "development",
  entry: "./demo/src/index.tsx",
  output: {
    path: path.resolve(__dirname, "../demo/dist"),
    filename: "dyno-router.js",
    chunkFilename: "dyno-router-chunk-[chunkhash:8].js",
    clean: true,
    publicPath: "/dyno-demo",
  },
  module: {
    rules: [
      {
        test: /\.less?/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true, // 启用CSS Modules
              esModule: false, // 强制使用 ES6 模块导出
            },
          },
          "less-loader",
        ],
      },
      {
        test: /\.png$/,
        type: 'asset/resource'
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./demo/index.html",
      inject: "body",
      favicon: "./demo/assets/favicon.ico", // 👈 添加这一行
    }),
  ],
  devServer: {
    host: "0.0.0.0",
    port: 8888,
    open: true,
    compress: true,
    historyApiFallback: true,
    static: [
      {
        directory: path.resolve(__dirname, "../demo/dist"),
        publicPath: "/", // 静态文件的路径
      },
      {
        directory: path.resolve(__dirname, "../demo/dist"),
        publicPath: "/dyno-demo", // 静态文件的路径
      },
    ],
  },
});
