// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import Vuetify from 'vuetify';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueLazyload from 'vue-lazyload';
import App from '@/App';
import router from '@/router';
import store from '@/helpers/store';

window.chrome = require('webextension-polyfill');

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(Vuetify);
Vue.use(VueAxios, axios);
Vue.use(VueLazyload, {
  filter: {
    progressive(listener) {
      const isCDN = /i.imgur.com/;
      if (isCDN.test(listener.src)) {
        /* eslint-disable no-param-reassign */
        listener.el.setAttribute('lazy-progressive', 'true');
        const idx = listener.src.lastIndexOf('.');
        listener.loading = `${listener.src.substr(0, idx)}t${listener.src.substr(idx)}`;
      }
    },
  },
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App,
  },
});
Vue.directive('init', {
  isLiteral: true,
  bind: (el, binding, vnode) => {
    if (!binding.value) return;
    Object.assign(vnode.componentInstance.$data, JSON.parse(localStorage.getItem(`cache_${binding.value}`)) || {});
  },
});
Vue.filter('bytes', (nb) => {
  let bytes = nb;
  const thresh = 1024;
  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }
  const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let i = -1;
  do {
    bytes /= thresh;
    i += 1;
  } while (Math.abs(bytes) >= thresh && i < units.length - 1);
  return `${bytes.toFixed(1)} ${units[i]}`;
});

Vue.filter('truncate', (string, nb) => {
  if (string.length < nb) {
    return string;
  }
  return `${string.substring(0, nb)}...`;
});

Vue.filter('filename', string => string.substring(string.lastIndexOf('/') + 1));
