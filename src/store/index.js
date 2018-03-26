import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import cards from './cards';
import settings from './settings';
import cache from './cache';

Vue.use(Vuex);

const vuexSync = new VuexPersistence({
  strictMode: true,
  asyncStorage: true,
  modules: ['settings', 'cards'],
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
  storage: window.localStorage,
  modules: ['cache'],
});

const vuexPersistEmitter = () => (store) => {
  /* eslint-disable no-param-reassign */
  store._vm.$root.$data['vue-persist-patch-delay'] = true;
  store.subscribe((mutation) => {
    if (mutation.type === 'RESTORE_MUTATION') {
      store._vm.$root.$data['vue-persist-patch-delay'] = false;
      store._vm.$root.$emit('storageReady');
    }
  });
  /* eslint-enable no-param-reassign */
};

export default new Vuex.Store({
  modules: {
    cards,
    settings,
    cache,
  },
  plugins: [
    vuexSync.plugin,
    vuexLocal.plugin,
    vuexPersistEmitter(),
  ],
  mutations: {
    RESTORE_MUTATION: vuexSync.RESTORE_MUTATION,
  },
});
