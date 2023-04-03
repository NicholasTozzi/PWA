//Bundles Javascript and HTML together for optimized performance.
//essentially this creates our dist folder.
const HtmlWebpackPlugin = require("html-webpack-plugin");

//Generates a manifest file for the app
const WebpackPwaManifest = require("webpack-pwa-manifest");

//navigates file explorer
const path = require("path");

//Generates a service worker for the app, which allows the app to work offline and cache resources.
const { InjectManifest } = require("workbox-webpack-plugin");

module.exports = () => {
  return {  //returns a webpack configuration object
    mode: "development", // In development mode, webpack generates code that is easy to debug and understand.
    entry: {
      //!specifies entry point for application
      main: "./src/js/index.js", //main entry
      install: "./src/js/install.js", //install entry
    },
    output: {
      //!specifies output directory and file names for the webpack bundle
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [
      //!Generates HTML file with specified template and injects bundle files
      new HtmlWebpackPlugin({
        template: "./index.html", //template directory
        title: "J.A.T.E",
      }),
      new InjectManifest({
        //!Generates a service worker for the app.
        swSrc: "./src-sw.js", //! this file contains logic for the service worker
        swDest: "src-sw.js",
      }),
      new WebpackPwaManifest({
        //Generates a manifest file for the app
        fingerprints: false,
        inject: true,
        name: "Just Another Text Editor",
        short_name: "J.A.T.E",
        description: "Takes notes with JavaScript syntax highlighting!",
        background_color: "#BEE3DB",
        theme_color: "#FAF9F9",
        start_url: "/",
        publicPath: "/",
        icons: [
          {
            src: path.resolve("src/images/logo.png"),
            sizes: [96, 128, 192, 256, 384, 512],
            destination: path.join("assets", "icons"),
          },
        ],
      }),
    ],

    module: {
      //configures webpack module rules
      //!Lets it read the compressed code
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"], //Allows webpack to import and load CSS files.
        },
        {
          test: /\.m?js$/, //?
          exclude: /node_modules/,
          use: {
            //?
            loader: "babel-loader", //Allows webpack to use Babel to transpile JavaScript code.
            options: {
              //A set of plugins that allow developers to use the latest JavaScript features.
              presets: ["@babel/preset-env"],
              plugins: [
                "@babel/plugin-proposal-object-rest-spread",
                "@babel/transform-runtime",
              ],
            },
          },
        },
      ],
    },
  };
};
