const locales = Langs.map(e => e.locale);
const langs = navigator.languages.filter(f => locales.indexOf(f) > -1);

const initialState = {
  dark: {
    enabled: true,
    auto: true,
    from: '21:00',
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
    customMessage: false,
    message: '',
  },
  theme: {
    primary: '#607D8B',
    secondary: '#546E7A',
    light: false,
    customFont: false,
    font: '',
    customCssUrl: '',
  },
  lang: langs[0] || 'en',
  hour24: false,
  tutorial: false,
  debug: false,
  whatsnew: true,
  donate: 500,
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
    RESET_SETTING(state, key) {
      state[key] = initialState[key];
    },
    SET_TUTORIAL(state, tutorial) {
      state.tutorial = tutorial;
    },
    SET_WHATSNEW(state, whatsnew) {
      state.whatsnew = whatsnew;
    },
    DECREASE_DONATE(state) {
      state.donate -= 1;
    },
    RESET_DONATE(state) {
      state.donate = initialState.donate;
    },
  },
};
