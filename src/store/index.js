import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import cards from './cards';
import settings from './settings';
import cache from './cache';
import cardsSettings from './cards_settings';

if (window.__PRERENDER_INJECTED) {
  window.browser = {
    storage: {
      sync: {
        get: () => Promise.resolve({ vuex: '{"settings":{"tutorial":true}}' }),
      },
      local: {
        get: () => Promise.resolve({}),
      },
    },
    identity: {
      getRedirectURL: () => '',
    },
  };
} else {
  window.browser = require('webextension-polyfill'); // eslint-disable-line
}

Vue.use(Vuex);

const vuexSync = new VuexPersistence({
  asyncStorage: true,
  modules: ['settings', 'cards', 'cardsSettings'],
  storage: {
    getItem: key => browser.storage.sync.get(key).then(data => data[key]),
    setItem: (key, value) => browser.storage.sync.set({ [key]: value }),
    removeItem: key => browser.storage.sync.remove(key),
    clear: () => browser.storage.sync.clear(),
  },
});

const vuexLocal = new VuexPersistence({
  asyncStorage: true,
  modules: ['cache'],
  storage: {
    getItem: key => browser.storage.local.get(key).then(data => data[key]),
    setItem: (key, value) => browser.storage.local.set({ [key]: value }),
    removeItem: key => browser.storage.local.remove(key),
    clear: () => browser.storage.local.clear(),
  },
});

export default new Vuex.Store({
  modules: {
    cards,
    settings,
    cardsSettings,
    cache,
  },
  plugins: [
    vuexSync.plugin,
    vuexLocal.plugin,
  ],
});
