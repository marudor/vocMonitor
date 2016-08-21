// @flow

const config = require('@terse/webpack').api()
.entry('src/entry.js')
.plugin('webpack.NoErrorsPlugin')
.plugin('html-webpack-plugin', {
  filename: 'index.html',
  template: 'html!src/index.html',
  minify: {},
})
.plugin('webpack.optimize.CommonsChunkPlugin', {
  async: true,
  minChunks: 3,
  children: true,
})
.output({
  path: 'www',
  filename: '[name]-[hash].js',
  publicPath: '/',
})
.target('web')
.when('development', api => api
.preLoader('eslint', '.jsx?', {
  exclude: /node_modules/,
})
.sourcemap('#source-map')
)
.when('production', api => api
.plugin('webpack.LoaderOptionsPlugin', {
  minimize: true,
  debug: false,
})
.plugin('webpack.optimize.UglifyJsPlugin', {
  compress: {
    warnings: false,
  },
  outout: {
    comments: false,
  },
  screwIe8: true,
  sourceMap: false,
})
)
.getConfig();

if (process.env.DASHBOARD) {
  const Dashboard = require('webpack-dashboard');
  const DashboardPlugin = require('webpack-dashboard/plugin');

  const dashboard = new Dashboard();
  config.plugins.push(new DashboardPlugin(dashboard.setData));
}

config.eslint = {
  configFile: './.eslintrc.js',
  failOnWarning: false,
  failOnError: true,
};

config.resolve = {
  extensions: ['', '.js', '.jsx', '.json'],
};

config.module.loaders = [
  {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    loader: 'babel',
    query: { cacheDirectory: true },
  }, {
    test: /\.css$/,
    loader: 'style!css',
  }, {
    test: /\.(eot|ttf|svg|otf)(\?v=.*)?$/,
    loader: 'url',
  },
];

module.exports = config;
