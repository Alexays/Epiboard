import Vue from 'vue';
import Vuex from 'vuex';
import VApp from 'vuetify/es5/components/VApp';
import Vuetify from 'vuetify/es5/components/Vuetify';
import VGrid from 'vuetify/es5/components/VGrid';
import * as VCard from 'vuetify/es5/components/VCard';
import VBtn from 'vuetify/es5/components/VBtn';
import VIcon from 'vuetify/es5/components/VIcon';
import VProgressLinear from 'vuetify/es5/components/VProgressLinear';
import VProgressCircular from 'vuetify/es5/components/VProgressCircular';
import transitions from 'vuetify/es5/components/transitions';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueAnalytics from 'vue-analytics';
import App from '@/App';
import router from '@/router';
import store from '@/store';
import utils from '@/utils';
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
    ...VCard,
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

Vue.filter('truncate', (string, nb) => {
  if (!string) return '';
  const trimmed = string.trim();
  if (trimmed.length < nb) {
    return trimmed;
  }
  return `${trimmed.substring(0, nb)}...`;
});

Vue.filter('filename', string => (string ? string.substring(string.lastIndexOf(string.indexOf('/') > -1 ? '/' : '\\') + 1) : ''));
