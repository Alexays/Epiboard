export default {
  state: {
    dark: {
      enabled: true,
      auto: true,
      from: '22:00',
      to: '9:00',
    },
    trends: {
      enabled: true,
      country: 'france',
    },
    header: {
      design: 'full',
      background: 'random',
    },
    debug: false,
  },
  mutations: {
    SET_SETTINGS(state, data) {
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i += 1) {
        if (state[keys[i]] !== undefined) state[keys[i]] = data[keys[i]];
      }
    },
  },
  actions: {
    setSettings({ commit }, settings) {
      commit('SET_SETTINGS', settings);
    },
  },
};
