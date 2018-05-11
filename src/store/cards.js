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
    DEL_CARD(state, card) {
      const idx = state.indexOf(card);
      if (idx > -1) {
        state.splice(idx, 1);
      }
    },
  },
  actions: {
    setCards({ commit }, cards) {
      commit('SET_CARDS', cards);
    },
    addCard({ commit }, card) {
      commit('ADD_CARD', card);
    },
    delCard({ commit }, card) {
      commit('DEL_CARD', card);
    },
  },
};
