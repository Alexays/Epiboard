export default {
  state: {
    version: null,
    cards: {},
  },
  mutations: {
    SET_VERSION(state, version) {
      state.version = version;
    },
    SET_CARD_CACHE(state, { key, data }) {
      state.cards[key] = data;
    },
    DEL_CARD_CACHE(state, key) {
      delete state.cards[key];
    },
  },
  actions: {
    setVersion({ commit }, version) {
      commit('SET_VERSION', version);
    },
    setCardCache({ commit }, payload) {
      commit('SET_CARD_CACHE', payload);
    },
    delCardCache({ commit }, key) {
      commit('DEL_CARD_CACHE', key);
    },
  },
};
