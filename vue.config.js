/* eslint-disable import/no-extraneous-dependencies */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');
const { log } = require('@vue/cli-shared-utils');
const { DefinePlugin } = require('webpack');
const { version, name } = require('./package.json');
const glob = require('glob');
const path = require('path');
const fs = require('fs');

const isProduction = process.env.NODE_ENV === 'production';
const browserName = process.env.BUILD_TARGET || 'chrome';
const excludeCards = [];

const keys = {};

const paths = glob
  .sync('./src/cards/*/+(index.vue|settings.vue|manifest.json)')
  .map(f => f.replace('./src/cards/', ''))
  .filter(f => excludeCards.indexOf(f.split('/')[0]) === -1 || !isProduction)
  .sort((a, b) => (b.endsWith('index.vue') - a.endsWith('index.vue')
  || b.endsWith('settings.vue') - a.endsWith('settings.vue')));

for (let i = 0; i < paths.length; i += 1) {
  const src = paths[i].replace('./src/cards/', '');
  const [key, file] = src.split('/');
  if (file === 'index.vue') {
    keys[key] = {};
  }
  if (file === 'settings.vue' && keys[key]) {
    keys[key].settings = true;
  }
  if (file === 'manifest.json' && keys[key]) {
    const manifest = require(`./src/cards/${src}`); // eslint-disable-line
    const { browsers } = manifest;
    if (browsers && browsers.length && browsers.indexOf(browserName) === -1) {
      excludeCards.push(key);
    } else {
      if (keys[key].settings) {
        keys[key].settings = manifest.settings;
        if (manifest.settings) delete manifest.settings;
      }
      if (Object.keys(manifest).length) {
        keys[key].manifest = manifest;
      }
    }
  }
}


// Remove cards not compatible with browsers listed in manifest
for (let i = 0; i < excludeCards.length; i += 1) {
  const key = excludeCards[i];
  if (keys[key]) delete keys[key];
}

if (excludeCards.length && isProduction) {
  log(`\nWarning: "${excludeCards.join(',')}" are excludes from build.`);
}

const removeEvals = file => new Promise((resolve, reject) => {
  fs.readFile(file, 'utf8', (readErr, data) => {
    if (readErr) return reject(readErr);
    const regex = isProduction
      ? /;([a-z])=function\(\){return this}\(\);try{\1=\1\|\|Function\("return this"\)\(\)\|\|\([0,1],eval\)\("this"\)}catch\(t\){"object"==typeof window&&\(\1=window\)}/g
      : /;\\r\\n\\r\\n\/\/ This works in non-strict mode(?:.){1,304}/g;
    if (!regex.test(data)) return resolve();
    const cleaned = data.replace(regex, '=window;');
    return fs.writeFile(file, cleaned, (writeErr) => {
      log(`Bundle ${file} now OK !`);
      if (writeErr) return reject(writeErr);
      return resolve();
    });
  });
});

module.exports = {
  chainWebpack: (config) => {
    // Exclude cards from build
    if (excludeCards.length) {
      const excluded = excludeCards.join('|');
      const r = new RegExp(`(${excluded})`);
      config.externals((context, request, callback) => {
        if (r.test(path.resolve(context, request))) {
          return callback(null, 'commonjs');
        }
        return callback();
      });
    }
  },
  configureWebpack: (config) => {
    if (isProduction) {
      /* eslint-disable no-param-reassign */
      // Disable source-map in production
      config.devtool = false;
      // Remove node polyfill
      config.node = false;
      // Prefer use size as hash & add version in production
      const id = `[id].${version}`;
      config.optimization.moduleIds = 'size';
      config.optimization.chunkIds = 'size';
      config.output.filename = config.output.filename.replace('[chunkhash:8]', id);
      config.output.chunkFilename = config.output.chunkFilename.replace('[chunkhash:8]', id);
      // MiniCssExtractPlugin
      const miniCss = config.plugins.find(f => f.options && f.options.filename);
      if (miniCss) {
        const { options } = miniCss;
        options.filename = options.filename.replace('[contenthash:8]', id);
        options.chunkFilename = options.chunkFilename.replace('[contenthash:8]', id);
      }
      /* eslint-enable no-param-reassign */
    }
    // Copy proper manifest to dist
    config.plugins.push(new CopyWebpackPlugin([{
      from: `./src/manifest-${browserName}.json`,
      to: 'manifest.json',
      transform: (content) => {
        const jsonContent = JSON.parse(content);
        jsonContent.version = version;
        return JSON.stringify(jsonContent, null, 2);
      },
    }]));
    // Define variable in the extension
    config.plugins.push(new DefinePlugin({
      Cards: JSON.stringify(keys),
      browserName: JSON.stringify(browserName),
    }));
    // Create dist zip
    config.plugins.push(new ZipPlugin({
      path: '../',
      filename: `${name}-${version}.zip`,
    }));
    // Remove eval
    config.plugins.push({
      apply: (compiler) => {
        compiler.hooks.afterEmit.tap('AfterEmitPlugin', () => {
          const BUNDLE_DIR = path.join(__dirname, './dist/js');
          glob(`${BUNDLE_DIR}/*.js`, {}, (er, files) => {
            for (let i = 0; i < files.length; i += 1) {
              removeEvals(files[i]).catch(console.error);
            }
          });
        });
      },
    });
  },
};
