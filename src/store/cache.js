export default {
  state: {
    version: null,
    cards: {},
    trends: {
      data: [],
      dt: null,
    },
  },
  mutations: {
    SET_VERSION(state, version) {
      state.version = version;
    },
    SET_CARD_CACHE(state, { key, data }) {
      state.cards[key] = { ...data, ...{ CACHE_DT: Date.now() } };
    },
    DEL_CARD_CACHE(state, key) {
      if (state.cards[key]) delete state.cards[key];
    },
    SET_TRENDS_CACHE(state, trends) {
      state.trends.dt = Date.now();
      state.trends.data = trends;
    },
  },
};
