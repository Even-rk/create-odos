import path from "path";
import { fileURLToPath } from "url";
import TerserPlugin from "terser-webpack-plugin";
import webpack from "webpack";

export default {
  mode: "production",
  entry: "./index.js",
  target: "node",
  output: {
    path: path.resolve(process.cwd(), "dist"),
    filename: "index.js",
    libraryTarget: "commonjs2",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
          compress: {
            drop_console: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: [
              'babel-plugin-transform-import-meta'
            ]
          }
        },
      },
    ],
  },
  externals: [
    /^[a-z\-0-9]+$/, // 排除所有node_modules依赖
  ],
  resolve: {
    extensions: [".js"],
  },
  plugins: [
    // 使用环境变量替代import.meta.url
    new webpack.DefinePlugin({
      "process.env.PACKAGE_ROOT": JSON.stringify("."),
      "import.meta.url": "undefined",
      "import.meta": JSON.stringify({
        url: "file:///placeholder.js"
      })
    }),
  ],
};
