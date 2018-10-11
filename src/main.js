import Vue from 'vue';
import Vuex from 'vuex';
import 'material-design-icons/iconfont/material-icons.css';
import { Vuetify, transitions } from 'vuetify';
import 'vuetify/src/stylus/app.styl';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueAnalytics from 'vue-analytics';
import App from '@/App';
import { i18n } from '@/i18n';
import router from '@/router';
import store from '@/store';
import '@/style.scss';

Vue.config.productionTip = false;

// TODO: Firefox doesnt allow to load external script
if (browserName === 'chrome') {
  Vue.use(VueAnalytics, {
    id: 'UA-78514802-2',
    // In Chrome extension, must close checking protocol.
    set: [{ field: 'checkProtocolTask', value: null }],
    checkDuplicate: true,
    router,
    debug: {
      sendHitTask: localStorage.getItem('analytics') !== 'false',
    },
  });
}

Vue.use(Vuex);
Vue.use(Vuetify, {
  components: {
    Vuetify,
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
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  mounted() {
    if (window.__PRERENDER_INJECTED) {
      document.dispatchEvent(new Event('render-event'));
    }
  },
  render: h => h(App),
});
