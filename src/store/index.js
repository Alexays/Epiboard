import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import cards from './cards';
import settings from './settings';
import cache from './cache';
import cardsSettings from './cards_settings';

Vue.use(Vuex);

const vuexSync = new VuexPersistence({
  strictMode: true,
  asyncStorage: true,
  modules: ['settings', 'cards', 'cardsSettings'],
  storage: {
    getItem: key => browser.storage.sync.get(key).then((data) => {
      if (!data[key]) return null;
      return data[key];
    }),
    setItem: (key, value) => browser.storage.sync.set({
      [key]: value,
    }),
    removeItem: key => browser.storage.sync.remove(key),
    clear: () => browser.storage.sync.clear(),
  },
});

const vuexLocal = new VuexPersistence({
  strictMode: true,
  asyncStorage: true,
  modules: ['cache'],
  storage: {
    getItem: key => browser.storage.local.get(key).then((data) => {
      if (!data[key]) return null;
      return data[key];
    }),
    setItem: (key, value) => browser.storage.local.set({
      [key]: value,
    }),
    removeItem: key => browser.storage.local.remove(key),
    clear: () => browser.storage.local.clear(),
  },
});

const vuexPersistEmitter = () => (store) => {
  /* eslint-disable no-param-reassign */
  store._vm.$root.$data['vuex-persit-wait'] = 0;
  store.subscribe((mutation) => {
    if (mutation.type === 'RESTORE_MUTATION') store._vm.$root.$data['vuex-persit-wait'] += 1;
    if (store._vm.$root.$data['vuex-persit-wait'] === 2) {
      store._vm.$root.$emit('storageReady');
    }
  });
  /* eslint-enable no-param-reassign */
};

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
    vuexPersistEmitter(),
  ],
  mutations: {
    RESTORE_MUTATION: vuexSync.RESTORE_MUTATION,
    RESTORE_MUTATION_LOCAL: vuexLocal.RESTORE_MUTATION,
  },
});
