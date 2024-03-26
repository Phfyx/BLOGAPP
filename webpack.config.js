const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  //Aller chercher le point d'entrée de l'application
  entry: {
    main: path.join(__dirname, "src", "index.js"),
    form: path.join(__dirname, "src", "form", "form.js"),
    topbar: path.join(__dirname, "src", "assets", "javascripts", "topbar.js"),
  },
  //Aller chercher le point de sortie de l'application
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /(node_modules)/,
        use: ["babel-loader"],
      },
      {
        test: /\.scss/,
        exclude: /(node_modules)/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: path.join(__dirname, "src", "index.html"),
      chunks: ["main", "topbar"],
    }),
    new HtmlWebpackPlugin({
      filename: "form.html",
      template: path.join(__dirname, "src", "form/form.html"),
      chunks: ["form", "topbar"],
    }),
    new CopyWebpackPlugin({
        patterns: [
            {
                from: 'src/assets',
                to: 'assets'
            }
        ]
    })
  ],
  stats: "minimal",
  devtool: "source-map",
  mode: "development",
  devServer: {
    static: path.resolve(__dirname, "./dist"),
    open: true,
    port: 4000,
  },
};
