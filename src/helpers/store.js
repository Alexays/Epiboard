import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persisted-preprocess-state';
import settings from './settings';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    settings,
  },
  plugins: [
    createPersistedState({
      storage: {
        getItem: key => new Promise((resolve, reject) => {
          chrome.storage.sync.get(key, (data) => {
            if (chrome.runtime.error) return reject(chrome.runtime.error);
            if (!data[key]) return resolve(null);
            return resolve(data[key]);
          });
        }),
        setItem: (key, value) => new Promise((resolve, reject) => {
          // Promise.resolve(JSON.parse(value))
          //   .then((data) => {
          //     chrome.storage.sync.set({
          //       [key]: data,
          //     }, () => {
          //       if (chrome.runtime.error) reject(chrome.runtime.error);
          //       console.log(value);
          //       resolve(value);
          //     });
          //   }).catch(() => {
          chrome.storage.sync.set({
            [key]: value,
          }, () => {
            if (chrome.runtime.error) return reject(chrome.runtime.error);
            return resolve(value);
          });
          // });
        }),
        removeItem: key => chrome.storage.sync.remove(key),
        clear: () => new Promise((resolve, reject) => {
          chrome.storage.sync.clear(() => {
            if (chrome.runtime.error) return reject(chrome.runtime.error);
            return resolve(true);
          });
        }),
      },
    }),
  ],
  state: {
    cards: {},
  },
  mutations: {
    updateCards(state, cards) {
      state.cards = cards;
    },
  },
});
