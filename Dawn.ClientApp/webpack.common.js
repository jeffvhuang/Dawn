const { pathHelper, getVendorName } = require("./buildHelpers");
const WriteFilePlugin = require("write-file-webpack-plugin");
const AssetsPlugin = require("assets-webpack-plugin");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const WarningsToErrorsPlugin = require("warnings-to-errors-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");

function getOutputDir() {
  // return pathHelper("../Dawn.Web/wwwroot/bundle");
  return pathHelper("dist", "bundle");
}

module.exports = function(env) {
  return {
    output: {
      path: getOutputDir(),
      publicPath: "/",
      filename: env.production ? "[name].[contenthash].js" : "[name].js"
    },
    optimization: {
      noEmitOnErrors: true,
      splitChunks: {
        name: getVendorName(env),
        chunks: "all"
      }
    },
    performance: {
      hints: false
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          include: [pathHelper("src")],
          use: [{ loader: "ts-loader", options: { transpileOnly: true } }]
        },
        {
          test: /\.css$/,
          use: [
            "style-loader", // creates style nodes from JS strings
            "css-loader",
            "postcss-loader"
          ]
        },
        {
          test: /\.scss$/,
          include: [pathHelper("src")],
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                modules: {
                  localIdentName: "[local]-[hash:base64:5]"
                },
                importLoaders: 1
              }
            },
            "sass-loader"
          ]
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: "style-loader"
            },
            {
              loader: "css-loader" // translates CSS into CommonJS
            },
            {
              loader: "less-loader", // compiles Less to CSS
              options: {
                modifyVars: {
                  "primary-color": "#1A95B6",
                  "link-color": "#1A95B6",
                  "border-radius-base": "4px"
                },
                javascriptEnabled: true
              }
            }
          ]
        }
      ]
    },
    plugins: [
      // new CleanWebpackPlugin(["dist"]),
      new HtmlWebPackPlugin({
        template: "./public/index.html",
        filename: "./index.html",
        favicon: "./public/favicon.ico",
        inject: true
      }),
      new WriteFilePlugin(),
      new AssetsPlugin({
        path: getOutputDir()
      }),
      new CaseSensitivePathsPlugin(),
      new WarningsToErrorsPlugin(),
      new ForkTsCheckerWebpackPlugin({
        eslint: true
      }),
      new ManifestPlugin()
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
      alias: {
        App: pathHelper("app"),
        Components: pathHelper("app", "components"),
        Api: pathHelper("app", "api"),
        Enums: pathHelper("app", "enums"),
        Styles: pathHelper("app", "styles"),
        Helpers: pathHelper("app", "helpers"),
        Constants: pathHelper("app", "constants"),
        Stores: pathHelper("app", "stores")
      }
    }
  };
};
