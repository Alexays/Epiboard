'use strict'
const path = require('path')
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const WebpackShellPlugin = require('webpack-shell-plugin')
const ZipPlugin = require('zip-webpack-plugin')
const glob = require('glob')
const isProduction = process.env.NODE_ENV === 'production';
const browserName = process.env.BUILD_TARGET || 'chrome';
const { name, version } = require('../package.json');

const getCards = () => {
  const excludeCards = ['Tasks'];
  const keys = {
    cards: {},
    settings: {},
  };
  const cardsKeys = glob.sync('./src/cards/*/+(index.vue|settings.vue|manifest.json)')
    .map(f => f.replace('./src/cards/', ''));
  for (let i = 0; i < cardsKeys.length; i += 1) {
    const key = cardsKeys[i].split('/')[0];
    if (excludeCards.indexOf(key) > -1 && isProduction) {
      continue;
    }
    if (cardsKeys[i].endsWith('index.vue')) {
      keys.cards[key] = { ...(keys.cards[key] || {}), ...{ cmp: cardsKeys[i] }};
    } else if (cardsKeys[i].endsWith('settings.vue')) {
      keys.settings[key] = cardsKeys[i];
    } else if (cardsKeys[i].endsWith('manifest.json')) {
      const manifest = require(`../src/cards/${cardsKeys[i]}`);
      if (manifest.browsers && manifest.browsers.length && manifest.browsers.indexOf(browserName) === -1) {
        excludeCards.push(key);
        continue;
      }
      keys.cards[key] = { ...(keys.cards[key] || {}), ...manifest};
    }
  }
  for (let i = 0; i < excludeCards.length; i += 1) {
    if (keys.cards[excludeCards[i]]) {
      delete keys.cards[excludeCards[i]];
    }
    if (keys.settings[excludeCards[i]]) {
      delete keys.cards[excludeCards[i]];
    }
  }
  if (excludeCards.length && isProduction) {
    console.log(`Warning: "${excludeCards.join(',')}" are excludes from build.`);
  }
  console.log(keys);
  return keys;
};

const webpackConfig = merge(baseWebpackConfig, {
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      ...utils.styleLoaders({
        sourceMap: config.build.productionSourceMap,
        extract: true,
        usePostCSS: true
      }),
      // Required until https://github.com/mozilla/webextension-polyfill/pull/86 is merged
      {
        test: require.resolve('webextension-polyfill'),
        use: 'imports-loader?browser=>undefined',
      },
    ],
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    filename: utils.assetsPath('js/[name].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `"${process.env.NODE_ENV}"`
      },
    }),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      chunkFilename: utils.assetsPath('css/[id].[contenthash].css'),
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        minifyCSS: true,
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks
      chunksSortMode: 'dependency'
    }),
    // copy custom static assets
    new CopyWebpackPlugin([{
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, `../config/manifest_${browserName}.json`),
        to: path.resolve(config.build.assetsRoot, './manifest.json'),
        transform: (content) => {
          const jsonContent = JSON.parse(content);
          // Add devtool
          if (!isProduction && browserName === 'chrome') {
            jsonContent.content_security_policy.replace("script-src 'self'", "script-src 'self' http://localhost:8098")
          }
          jsonContent.version = version;
          return JSON.stringify(jsonContent, null, 2);
        },
      }
    ]),
    new webpack.ProvidePlugin({
      browser: 'webextension-polyfill',
    }),
    new webpack.DefinePlugin({
      Cards: JSON.stringify(getCards()),
      browserName: JSON.stringify(browserName),
    }),
    new ZipPlugin({
      path: '../',
      filename: `${name}-${version}.zip`,
    }),
  ],
  optimization: {
    // keep module.id stable when vendor modules does not change
    namedChunks: true,
    hashedModuleIds: true,
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false
          }
        },
        sourceMap: config.build.productionSourceMap,
        parallel: true
      }),
      // Compress extracted CSS. We are using this plugin so that possible
      // duplicated CSS from different components can be deduped.
      new OptimizeCSSPlugin({
        cssProcessorOptions: {
          ...(config.build.productionSourceMap ? {
            map: {
              inline: false
            }
          } : {}),
          ...{
            safe: true,
            cssProcessorOptions: { safe: true, discardComments: { removeAll: true } },
          },
        },
      }),
    ],
  },
})

if (isProduction) {
  webpackConfig.plugins.push(new WebpackShellPlugin({
    onBuildEnd: ['node ./build/remove-evals.js']
  }))
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
