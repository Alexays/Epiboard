const glob = require('glob');

const isProduction = process.env.NODE_ENV === 'production';
const browserName = process.env.BUILD_TARGET || 'chrome';
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
    delete keys.settings[excludeCards[i]];
  }
}
if (excludeCards.length && isProduction) {
  console.log(`Warning: "${excludeCards.join(',')}" are excludes from build.`);
}

module.exports = keys;
