const defaultState = {
  version: null,
  cards: {},
  validCards: [],
  trends: {
    data: [],
    dt: null,
  },
  doodle: {
    data: {},
    dt: null,
  },
  backgroundLocal: {
    filename: null,
    dataUrl: '',
  },
  google: {
    accessToken: null,
    refreshToken: null,
    exp: 0,
  },
};

export default {
  state: defaultState,
  mutations: {
    SET_VERSION(state, version) {
      state.version = version;
    },
    SET_CARD_CACHE(state, { key, data }) {
      if (!data || !Object.keys(data).length) return;
      state.cards[key] = Object.assign({}, data, { CACHE_DT: Date.now() });
    },
    DEL_CARD_CACHE(state, key) {
      if (state.cards[key]) delete state.cards[key];
    },
    DEL_CARDS_CACHE(state) {
      state.cards = {};
    },
    SET_TRENDS_CACHE(state, trends) {
      state.trends.dt = trends && trends.length ? Date.now() : null;
      state.trends.data = trends;
    },
    SET_DOODLE_CACHE(state, doodle) {
      state.doodle.dt = doodle && doodle.url ? Date.now() : null;
      state.doodle.data = doodle;
    },
    ADD_VALID_CARD(state, key) {
      if (state.validCards.indexOf(key) > -1) return;
      state.validCards.push(key);
    },
    DEL_VALID_CARD(state, key) {
      state.validCards = state.validCards.filter(f => f !== key);
    },
    SET_BACKGROUND_LOCAL(state, data) {
      state.backgroundLocal = data;
    },
    SET_GOOGLE(state, data) {
      state.google = { ...state.google, ...data };
    },
    DEL_GOOGLE(state) {
      state.google = defaultState.google;
    },
  },
};
