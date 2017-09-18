//var debug = process.env.NODE_ENV !== "production";
//var webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: ["./signin.js", "./browser.js"],
  output: {
    path: __dirname,
    filename: "bundle.js",
    libraryTarget: 'var',
    library: 'LibEntryPoint'
  }
};