import Vue from 'vue';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueAnalytics from 'vue-analytics';
import Vuetify from 'vuetify/lib';
import App from '@/App';
import { i18n } from '@/i18n';
import router from '@/router';
import store from '@/store';
import 'vuetify/src/stylus/app.styl';
import '@/style.scss';

Vue.config.productionTip = false;

// TODO: Firefox doesnt allow to load external script
if (browserName === 'chrome' && !window.__PRERENDER_INJECTED) {
  Vue.use(VueAnalytics, {
    id: 'UA-78514802-2',
    // In Chrome extension, must close checking protocol.
    set: [{ field: 'checkProtocolTask', value: null }],
    router,
    debug: {
      sendHitTask: localStorage.getItem('analytics') !== 'false',
    },
  });
}

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: '#607D8B',
    secondary: '#546E7A',
    accent: '#2196F3',
    foreground: '#ffffff',
  },
});
Vue.use(VueAxios, axios);
// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  i18n,
  router,
  store,
  render: h => h(App),
});
