export default {
  state: {
    cards: {},
  },
  mutations: {
    SET_CARD_SETTINGS(state, { key, data }) {
      state.cards[key] = data;
    },
    DEL_CARD_SETTINGS(state, key) {
      if (state.cards[key]) delete state.cards[key];
    },
  },
  actions: {
    setCardSettings({ commit }, settings) {
      commit('SET_CARD_SETTINGS', settings);
    },
    delCardSettings({ commit }, key) {
      commit('DEL_CARD_SETTINGS', key);
    },
  },
};
