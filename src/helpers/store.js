import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import settings from './settings';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  strictMode: true,
  asyncStorage: true,
  storage: {
    getItem: key => new Promise((resolve, reject) => {
      chrome.storage.sync.get(key, (data) => {
        if (chrome.runtime.error) return reject(chrome.runtime.error);
        if (!data[key]) return resolve(null);
        return resolve(data[key]);
      });
    }),
    setItem: (key, value) => new Promise((resolve, reject) => {
      chrome.storage.sync.set({
        [key]: value,
      }, () => {
        if (chrome.runtime.error) return reject(chrome.runtime.error);
        return resolve(value);
      });
    }),
    removeItem: key => chrome.storage.sync.remove(key),
    clear: () => new Promise((resolve, reject) => {
      chrome.storage.sync.clear(() => {
        if (chrome.runtime.error) return reject(chrome.runtime.error);
        return resolve(true);
      });
    }),
  },
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
};

export default new Vuex.Store({
  modules: {
    settings,
  },
  plugins: [
    vuexLocal.plugin,
    vuexPersistEmitter(),
  ],
  state: {
    cards: {},
  },
  mutations: {
    RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION,
    updateCards(state, cards) {
      state.cards = cards;
    },
  },
});
