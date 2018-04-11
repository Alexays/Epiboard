export default {
  state: {},
  mutations: {
    SET_CARD_SETTINGS(state, { card, settings }) {
      state[card] = settings;
    },
    DEL_CARD_SETTINGS(state, key) {
      if (state[key]) delete state[key];
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
