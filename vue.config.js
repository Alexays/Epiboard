/* eslint-disable import/no-extraneous-dependencies */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PrerenderSPAPlugin = require('prerender-spa-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const zipafolder = require('zip-a-folder');
const { log, error } = require('@vue/cli-shared-utils');
const { DefinePlugin, ContextReplacementPlugin } = require('webpack');
const glob = require('glob');
const path = require('path');
const fs = require('fs');
const { version, name } = require('./package.json');

const isProduction = process.env.NODE_ENV === 'production';
const browserName = process.env.BUILD_TARGET || 'chrome';
const excludeCards = [];

const cards = {};

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
    cards[key] = {};
  }
  if (file === 'settings.vue' && cards[key]) {
    cards[key].settingsCmp = true;
  }
  if (file === 'manifest.json' && cards[key]) {
    const manifest = require(`./src/cards/${src}`); // eslint-disable-line
    const { browsers } = manifest;
    if (browsers && browsers.length && browsers.indexOf(browserName) === -1) {
      excludeCards.push(key);
    } else {
      cards[key].settings = manifest.settings;
      if (manifest.more) {
        if (manifest.more[browserName]) {
          manifest.more = manifest.more[browserName];
        }
      }
      if (manifest.settings) delete manifest.settings;
      if (Object.keys(manifest).length) {
        cards[key].manifest = manifest;
      }
    }
  }
}

// Remove cards not compatible with browsers listed in manifest
for (let i = 0; i < excludeCards.length; i += 1) {
  const key = excludeCards[i];
  if (cards[key]) delete cards[key];
}

// Filter permissions listed in cards manifest with optional permissions
const { optional_permissions } = require(`./src/manifest-${browserName}.json`); // eslint-disable-line
const cardsKeys = Object.keys(cards);
for (let i = 0; i < cardsKeys.length; i += 1) {
  const key = cardsKeys[i];
  if (cards[key].manifest && cards[key].manifest.permissions) {
    cards[key].manifest.permissions = cards[key].manifest.permissions
      .filter(f => optional_permissions.indexOf(f) > -1);
    if (!cards[key].manifest.permissions.length) delete cards[key].manifest.permissions;
  }
}


const getLangs = () => {
  const langs = {};
  log('Retrieve main langs...');
  let langsPath = glob.sync('./src/i18n/*.json');
  for (let i = 0; i < langsPath.length; i += 1) {
    const lang = langsPath[i].replace('./src/i18n/', '').replace('.json', '');
    langs[lang] = require(langsPath[i]); // eslint-disable-line
  }
  log('Retrieve and filter cards langs...');
  const langsName = Object.keys(langs);
  langsPath = glob.sync('./src/cards/*/langs/*.json')
    .filter((f) => {
      const splitted = f.split('/');
      return cardsKeys.indexOf(splitted[3]) > -1
        && langsName.indexOf(splitted[5].replace('.json', '')) > -1;
    });
  for (let i = 0; i < langsPath.length; i += 1) {
    const splitted = langsPath[i].split('/');
    const cardName = splitted[3];
    const lang = splitted[5].replace('.json', '');
    langs[lang][cardName] = require(langsPath[i]); // eslint-disable-line
    if (cards[cardName].langs) {
      cards[cardName].langs.push(lang);
    } else {
      // eslint-disable-next-line no-param-reassign
      cards[cardName].langs = [lang];
    }
  }
  return langs;
};

const generateLangsFile = (langs) => {
  log('Generating langs files...');
  const langsNames = Object.keys(langs);
  for (let i = 0; i < langsNames.length; i += 1) {
    fs.writeFileSync(
      `./src/langs/${langsNames[i]}.js`,
      `// This file is auto generated, do not modify it manually.
// To modify it look in the i18n folder
export default ${JSON.stringify(langs[langsNames[i]], null, 0)}\n`,
    );
  }
};

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
  // Disable source-map in production
  productionSourceMap: !isProduction,
  configureWebpack: (config) => {
    if (isProduction) {
      /* eslint-disable no-param-reassign */
      // Remove node polyfill
      config.node = false;
      // Prefer version as hash for production for long caching
      const id = `${version}`;
      config.output.filename = config.output.filename.replace('[contenthash:8]', id);
      config.output.chunkFilename = config.output.chunkFilename.replace('[contenthash:8]', id);
      // MiniCssExtractPlugin
      const miniCss = config.plugins.find(f => f.constructor.name === 'MiniCssExtractPlugin');
      if (miniCss) {
        const { options } = miniCss;
        options.filename = options.filename.replace('[contenthash:8]', id);
        options.chunkFilename = options.chunkFilename.replace('[contenthash:8]', id);
      }
      /* eslint-enable no-param-reassign */
      config.optimization.minimizer.push(new OptimizeCSSAssetsPlugin({}));
    }
    // Copy proper manifest to dist
    config.plugins.push(new CopyWebpackPlugin([{
      from: `./src/manifest-${browserName}.json`,
      to: 'manifest.json',
      transform: (content) => {
        const jsonContent = JSON.parse(content);
        jsonContent.version = version;
        if (!isProduction) {
          jsonContent.content_security_policy = "script-src 'self' 'unsafe-eval'; object-src 'self'";
        }
        return JSON.stringify(jsonContent, null, 2);
      },
    }]));
    // Exclude cards from build
    if (excludeCards.length) {
      const nonExcluded = Object.keys(cards)
        .filter(f => excludeCards.indexOf(f) === -1);
      if (nonExcluded.length > 0) {
        config.plugins.push(new ContextReplacementPlugin(
          /cards$/,
          new RegExp(`${nonExcluded.join('|')}`),
        ));
      }
    }
    // Define variable in the extension
    config.plugins.push(new DefinePlugin({
      browserName: JSON.stringify(browserName),
    }));
    // Pre-render
    if (isProduction && (!process.env.TRAVIS || !process.env.CI)) {
      config.plugins.push(new PrerenderSPAPlugin({
        staticDir: path.join(__dirname, 'dist'),
        routes: ['/'],
        postProcess(route) {
          // eslint-disable-next-line
          route.html = route.html
            .replace(/<script (.*?)>/g, '<script $1 defer>')
            .replace(/<style(.*?)id="vuetify-theme-stylesheet"(.*?)>(.*?)<\/style>/gs, '')
            .replace('id="app"', 'id="app" data-server-rendered="true"');
          if (browserName !== 'chrome') {
            // eslint-disable-next-line
            route.html = route.html
              .replace(/<script(.*?)src="https:\/\/www.google-analytics.com\/analytics.js"(.*?)><\/script>/g, '');
          }
          return route;
        },
        renderer: new PrerenderSPAPlugin.PuppeteerRenderer({
          inject: {},
          renderAfterDocumentEvent: 'render-event',
          headless: false,
          skipThirdPartyRequests: true,
        }),
      }));
    }
    config.plugins.push({
      apply: (compiler) => {
        log('');
        if (excludeCards.length && isProduction) {
          log(`Warning: "${excludeCards.join(',')}" will be excluded from build.`);
        }
        // Get langs
        const langs = getLangs(cards);
        generateLangsFile(langs);
        const definePlugin = compiler.options.plugins
          .find(f => f.constructor.name === 'DefinePlugin');
        const langKeys = Object.keys(langs);
        if (definePlugin) {
          definePlugin.definitions.CardsObj = JSON.stringify(cards);
          definePlugin.definitions.Langs = JSON.stringify(langKeys
            .map(f => ({ locale: f, name: langs[f].name })));
        }
        // Remove eval and create dist zip
        compiler.hooks.done.tap('DonePlugin', () => {
          const BUNDLE_DIR = path.join(__dirname, './dist/js');
          glob(`${BUNDLE_DIR}/*.js`, {}, (er, files) => {
            for (let i = 0; i < files.length; i += 1) {
              removeEvals(files[i]).catch(error);
            }
          });
          if (isProduction && (!process.env.TRAVIS || !process.env.CI)) {
            zipafolder.zip('./dist', `${name}-${version}.zip`, (err) => {
              if (err) log(err);
            });
          }
        });
      },
    });
  },
};
