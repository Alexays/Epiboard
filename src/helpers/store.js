import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import chrome from 'webextension-polyfill';
import settings from './settings';

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  strictMode: true,
  asyncStorage: true,
  storage: {
    getItem: key => chrome.storage.sync.get(key).then((data) => {
      if (!data[key]) return null;
      return data[key];
    }),
    setItem: (key, value) => chrome.storage.sync.set({
      [key]: value,
    }),
    removeItem: key => chrome.storage.sync.remove(key),
    clear: () => chrome.storage.sync.clear(),
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
    cards: [],
  },
  mutations: {
    RESTORE_MUTATION: vuexLocal.RESTORE_MUTATION,
    updateCards(state, cards) {
      state.cards = cards;
    },
  },
});
