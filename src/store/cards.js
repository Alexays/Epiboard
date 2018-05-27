export default {
  state: [],
  mutations: {
    SET_CARDS(state, cards) {
      state.length = 0;
      for (let i = 0; i < cards.length; i += 1) state.push(cards[i]);
    },
    ADD_CARD(state, card) {
      state.push(card);
    },
    ADD_CARD_FIRST(state, card) {
      state.unshift(card);
    },
    DEL_CARD(state, card) {
      const idx = state.indexOf(card);
      if (idx > -1) {
        state.splice(idx, 1);
      }
    },
  },
};
