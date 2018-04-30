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
const glob = require('glob')

const env = require('../config/prod.env')

const version = require('../package.json').version;

const transformManifestJson = (content) => {
  const jsonContent = JSON.parse(content);
  jsonContent.version = version;
  return JSON.stringify(jsonContent, null, 2);
};

const getCards = () => {
  const keys = {
    cards: {},
    settings: {},
  };
  const cardsKeys = glob.sync('./src/components/cards/*/+(index|settings).vue')
    .map(f => f.replace('./src/components/cards/', ''));
  for (let i = 0; i < cardsKeys.length; i += 1) {
    if (cardsKeys[i].endsWith('index.vue')) {
      keys.cards[cardsKeys[i].split('/')[0]] = cardsKeys[i];
    } else if (cardsKeys[i].endsWith('settings.vue')) {
      keys.settings[cardsKeys[i].split('/')[0]] = cardsKeys[i];
    }
  }
  return keys;
};

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
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
    filename: utils.assetsPath('js/[name].js'),
    chunkFilename: utils.assetsPath('js/[name].js')
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),
    // copy custom static assets
    new CopyWebpackPlugin([{
        from: path.resolve(__dirname, '../static'),
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      },
      {
        from: path.resolve(__dirname, `../config/manifest_${process.env.BUILD_TARGET || 'chrome'}.json`),
        to: path.resolve(config.build.assetsRoot, './manifest.json'),
        transform: transformManifestJson,
      }
    ]),
    new webpack.ProvidePlugin({
      browser: 'webextension-polyfill',
      d3: 'd3',
    }),
    new webpack.DefinePlugin({
      Cards: JSON.stringify(getCards()),
    }),
    new WebpackShellPlugin({
      onBuildEnd: ['node ./build/remove-evals.js']
    }),
  ],
  optimization: {
    concatenateModules: true,
    occurrenceOrder: true,
    splitChunks: {
      chunks: 'async',
      cacheGroups: {
        vendor: {
          name: 'vendor',
          test: /[\\/]node_modules[\\/].*\.js$/,
          chunks: 'initial',
          priority: -10,
        },
        app: {
          name: 'app',
          minChunks: 3,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: 'single',
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
        cssProcessorOptions: config.build.productionSourceMap ? {
          safe: true,
          map: {
            inline: false
          }
        } : {
          safe: true
        }
      }),
    ],
  },
})

if (config.build.productionGzip) {
  const CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
