import Settings from '@/settings';

export default {
  state: {
    global: Settings.map(f => ({
      [f.name]: f.value,
    })).reduce((a, x) => Object.assign(a, x)),
    dark: false,
  },
  mutations: {
    SET_SETTINGS(state, {
      key,
      settings,
    }) {
      state[key] = settings;
    },
  },
  actions: {
    setSettings({
      commit,
    }, settings) {
      commit('SET_SETTINGS', settings);
    },
  },
};
