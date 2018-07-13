/* eslint-disable import/no-extraneous-dependencies */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const { log } = require('@vue/cli-shared-utils');
const { DefinePlugin } = require('webpack');
const { version, name } = require('./package.json');
const glob = require('glob');

const isProduction = process.env.NODE_ENV === 'production';
const browserName = process.env.BUILD_TARGET || 'chrome';
const excludeCards = ['Tasks'];

const getCards = () => {
  const keys = {
    cards: {},
    settings: {},
  };

  const paths = glob
    .sync('./src/cards/*/+(index.vue|settings.vue|manifest.json)')
    .map(f => f.replace('./src/cards/', ''))
    .filter(f => excludeCards.indexOf(f.split('/')[0]) === -1 || !isProduction);

  for (let i = 0; i < paths.length; i += 1) {
    const path = paths[i].replace('./src/cards/', '');
    const [key, file] = path.split('/');
    if (file === 'index.vue') {
      keys.cards[key] = { ...(keys.cards[key] || {}), ...{ cmp: path } };
    }
    if (file === 'settings.vue') {
      keys.settings[key] = path;
    }
    if (file === 'manifest.json') {
      const manifest = require(`./src/cards/${path}`); // eslint-disable-line
      const { browsers } = manifest;
      if (browsers && browsers.length && browsers.indexOf(browserName) === -1) {
        excludeCards.push(key);
      } else {
        keys.cards[key] = { ...(keys.cards[key] || {}), ...manifest };
      }
    }
  }

  // Remove cards not compatible with browsers listed in manifest
  for (let i = 0; i < excludeCards.length; i += 1) {
    const key = excludeCards[i];
    if (keys.cards[key]) delete keys.cards[key];
    if (keys.settings[key]) delete keys.settings[key];
  }

  if (excludeCards.length && isProduction) {
    log(`\nWarning: "${excludeCards.join(',')}" are excludes from build.`);
  }

  return keys;
};

module.exports = {
  configureWebpack: (config) => {
    // Copy proper manifest to dist
    config.plugins.push(new CopyWebpackPlugin([{
      from: `./src/manifest_${browserName}.json`,
      to: 'manifest.json',
      transform: (content) => {
        const jsonContent = JSON.parse(content);
        jsonContent.version = version;
        return JSON.stringify(jsonContent, null, 2);
      },
    }]));
    // Define variable in the extension
    const cards = getCards();
    config.plugins.push(new DefinePlugin({
      Cards: JSON.stringify(cards),
      browserName: JSON.stringify(browserName),
    }));
    // Create dist zip
    config.plugins.push(new ZipPlugin({
      path: '../',
      filename: `${name}-${version}.zip`,
    }));
    // Add bundle analyzer
    // const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
    // config.plugins.push(new BundleAnalyzerPlugin());
  },
};
