const path = require("path");
const { merge } = require("webpack-merge");
const baseConfig = require("./base.config");

module.exports = merge(baseConfig, {
  mode: "production",
  entry: "./index.ts",
  output: {
    path: path.resolve(__dirname, "../dist"),
    filename: "dyno-router.js",
    chunkFilename: "dyno-router-chunk-[chunkhash:8].js",
    clean: true,
    library: {
      type: "module", // 让输出的 bundle 是 ES Module 格式
    },
  },
  experiments: {
    outputModule: true, // 允许输出 ES Module
  },
  externalsType: "module",
});
