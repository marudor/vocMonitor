// @flow
/* eslint camelcase: 0, no-eval: 0 */
'use strict';

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const node_env = (process.env.NODE_ENV || 'development').trim();

const __DEV__ = node_env !== 'production';
//Plugins die in allen Konfigurationen nötig sind
const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(node_env),
      BLUEBIRD_DEBUG: JSON.stringify(0),
      BLUEBIRD_WARNINGS: JSON.stringify(0),
      BLUEBIRD_LONG_STACK_TRACES: JSON.stringify(0),
    },
    __DEV__: JSON.stringify(__DEV__),
    __PROD__: JSON.stringify(!__DEV__),
    __WEB__: JSON.stringify(true),
    __APP__: JSON.stringify(false),
    __TEST__: JSON.stringify(false),
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'html-loader!src/index.html',
    minify: {},
  }),
  new webpack.optimize.CommonsChunkPlugin({
    minChunks: 3,
    async: true,
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      eslint: {
        configFile: './.eslintrc.js',
        failOnWarning: false,
        failOnError: true,
        quiet: true,
      },
    },
    minimize: !__DEV__,
    debug: false,
  }),
];
let name;
const outputPath = path.resolve('www');

const entry = {
  Common: './src/entry.js',
};
name = '[name].js';

if (node_env === 'production') {
  //In Production wird ein Hash an den Output gepackt
  name = '[name]-[hash].js';
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
      screwIe8: true,
      sourceMap: false,
    })
  );
}

const webpackConfig = {
  context: __dirname,
  resolve: {
    // mainFields: ['jsnext:main', 'browser', 'main'],
    extensions: ['.web.js', '.web.jsx', '.js', '.jsx', '.json'],
    modules: [path.resolve('src'), 'node_modules'],
    alias: {
      'draft-js': '@marudor/draft-js',
      i18next: 'i18next/i18next.min.js',
      bluebird: 'bluebird/js/browser/bluebird.min.js',
      // 'react-modal': '@marudor/react-modal',
      theme: 'api/Theme/index.js',
    },
  },
  entry,
  output: {
    path: outputPath,
    filename: name,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|primusClient)/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, 'src')],
        query: { cacheDirectory: true },
      },
      {
        test: /\.(CSS|css)\.js$/,
        exclude: /(node_modules)/,
        include: [path.resolve(__dirname, 'src')],
        loader: 'inline-css-loader',
      },
      { test: /\.pdf$/, loader: 'file-loader' },
      { test: /\.(eot|ttf|otf|svg|woff2?)(\?.*)?$/, loader: 'file-loader' },
      { test: /\.(jpg|png|gif|jpeg|ico)$/, loader: 'file-loader' },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      { test: /\.css$/, loader: 'style-loader?insertAt=top!css-loader' },
    ],
    noParse: [
      /primusClient\.js/,
      /.*primusClient.*/,
      /react\\dist\\react(-with-addons)?\.js/,
      /.*bluebird.*/,
    ],
  },
  plugins: [...plugins],
  //Proxy einstellungen um ans Backend zu dirigieren
  devServer: {
    overlay: true,
    clientLogLevel: 'none',
    compress: true,
    contentBase: 'www/',
    historyApiFallback: true,
    noInfo: true,
    quiet: true,
    proxy: {
      '/api/*': {
        target: 'http://localhost:9042',
        toProxy: true,
        changeOrigin: true,
        xfwd: true,
        logLevel: 'silent',
        pathRewrite: { '^/api': '' },
      },
      '/primus/*': {
        target: 'http://127.0.0.1:3000',
        ws: true,
        logLevel: 'silent',
      },
    },
  },
  devtool: '',
};

if (process.env.NODE_ENV !== 'production') {
  //Art der Sourcemap
  webpackConfig.devtool = 'source-map';
  webpackConfig.module.rules.push({
    enforce: 'pre',
    test: /.jsx?$/,
    loader: 'eslint-loader',
    include: [path.resolve(__dirname, 'src')],
    exclude: /(.*\.config.*|.*node_modules.*|.*inferno.*)/,
  });
}

if (process.env.DASHBOARD) {
  const DashboardPlugin = require('webpack-dashboard/plugin');

  webpackConfig.plugins.push(new DashboardPlugin());
}

module.exports = webpackConfig;
