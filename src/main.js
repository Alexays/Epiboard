import Vue from 'vue';
import Vuex from 'vuex';
import {
  Vuetify,
  VApp,
  VGrid,
  VCard,
  VBtn,
  VIcon,
  VProgressLinear,
  VProgressCircular,
  transitions,
} from 'vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueAnalytics from 'vue-analytics';
import App from '@/App';
import router from '@/router';
import store from '@/store';
import utils from '@/utils';
import '@babel/polyfill'; // eslint-disable-line
import 'vuetify/src/stylus/app.styl';
import './style.scss';

Vue.config.productionTip = false;

Vue.use(VueAnalytics, {
  id: 'UA-78514802-2',
  // In Chrome extension, must close checking protocol.
  set: [{ field: 'checkProtocolTask', value: null }],
  disableScriptLoader: browserName !== 'chrome',
  router,
  debug: {
    sendHitTask: localStorage.getItem('analytics') !== 'false' && browserName === 'chrome',
  },
});
Vue.use(Vuex);
Vue.use(Vuetify, {
  components: {
    Vuetify,
    VApp,
    VCard,
    VGrid,
    VBtn,
    VIcon,
    VProgressLinear,
    VProgressCircular,
  },
  theme: {
    primary: '#607D8B',
    secondary: '#546E7A',
    accent: '#2196F3',
    foreground: '#ffffff',
  },
  transitions,
});
Vue.use(VueAxios, axios);
Vue.use(utils);
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
});

Vue.filter('bytes', (nb) => {
  if (!nb || Number.isNaN(parseFloat(nb)) || !Number.isFinite(nb)) return '-';
  const units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB'];
  const idx = Math.floor(Math.log(nb) / Math.log(1024));
  return `${(nb / (1024 ** Math.floor(idx))).toFixed(1)} ${units[idx]}`;
});

Vue.filter('truncate', (string, nb) => {
  if (!string) return '';
  const trimmed = string.trim();
  if (trimmed.length < nb) {
    return trimmed;
  }
  return `${trimmed.substring(0, nb)}...`;
});

Vue.filter('filename', string => (string ? string.substring(string.lastIndexOf(string.indexOf('/') > -1 ? '/' : '\\') + 1) : ''));
