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
};
