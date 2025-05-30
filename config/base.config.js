const path = require("path");

module.exports = {
  mode: "none",
  entry: "./index.ts",
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "dyno-router.js",
    chunkFilename: "dyno-router-chunk-[chunkhash:8].js",
    clean: true,
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
    descriptionFiles: ["package.json"],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/, // 匹配 .ts, .tsx, .js, .jsx
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};
