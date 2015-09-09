var webpack = require('webpack');

module.exports = {

  output: {
    library: 'meteor-seamless-immutable-cursor',
    libraryTarget: 'umd'
  },

  externals: [
    {
      "seamless-immutable": {
        root: "Immutable",
        commonjs2: "seamless-immutable",
        commonjs: "seamless-immutable",
        amd: "seamless-immutable"
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
