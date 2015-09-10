var webpack = require('webpack');

module.exports = {

  output: {
    library: 'meteor-immutable-cursor',
    libraryTarget: 'umd'
  },

  externals: [
    {
      "immutable": {
        root: "Immutable",
        commonjs2: "immutable",
        commonjs: "immutable",
        amd: "immutable"
      }
    }
  ],

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules|setGlobalImmutableCursor\.js/, loader: 'babel?loose=all' }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]

};
