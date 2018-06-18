const initialState = {
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
  doodle: {
    enabled: false,
  },
  header: {
    design: 'full',
    background: 'random',
    backgroundUrl: '',
  },
  debug: false,
};

export default {
  state: initialState,
  mutations: {
    SET_SETTINGS(state, data) {
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i += 1) {
        if (state[keys[i]] !== undefined) state[keys[i]] = data[keys[i]];
      }
    },
    RESET_SETTINGS(state) {
      const keys = Object.keys(initialState);
      for (let i = 0; i < keys.length; i += 1) {
        state[keys[i]] = initialState[keys[i]];
      }
    },
  },
};
