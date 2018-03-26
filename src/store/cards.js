export default {
  state: [],
  mutations: {
    SET_CARDS(state, cards) {
      state.length = 0;
      for (let i = 0; i < cards.length; i += 1) state.push(cards[i]);
    },
  },
  actions: {
    setCards({ commit }, cards) {
      commit('SET_CARDS', cards);
    },
  },
};
