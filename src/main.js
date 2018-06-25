import Vue from 'vue';
import Vuex from 'vuex';
import VApp from 'vuetify/es5/components/VApp';
import Vuetify from 'vuetify/es5/components/Vuetify';
import VGrid from 'vuetify/es5/components/VGrid';
import * as VCard from 'vuetify/es5/components/VCard';
import VBtn from 'vuetify/es5/components/VBtn';
import VIcon from 'vuetify/es5/components/VIcon';
import VTextField from 'vuetify/es5/components/VTextField';
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
    VTextField,
    VProgressLinear,
    VProgressCircular,
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
Vue.directive('init', {
  isLiteral: true,
  bind: (el, binding, vnode) => {
    if (!binding.value) return;
    const keys = Object.keys(vnode.componentInstance.$data);
    const data = binding.value.settings
      ? vnode.context.$store.state.cardsSettings.cards[binding.value.key] || {}
      : vnode.context.$store.state.cache.cards[binding.value.key] || {};
    if (!binding.value.settings) {
      const { CACHE_DT } = data;
      if (CACHE_DT) {
        // Default cache timeout is 60s
        const cacheValidity = ((Cards.cards[binding.value.key].cacheValidity || 60) * 1000);
        /* eslint-disable-next-line no-param-reassign */
        vnode.componentInstance.VALID_CACHE = Date.now() < CACHE_DT + cacheValidity;
      }
    }
    for (let i = 0; i < keys.length; i += 1) {
      if (vnode.componentInstance.$data[keys[i]] !== undefined && data[keys[i]] !== undefined) {
        /* eslint-disable-next-line no-param-reassign */
        vnode.componentInstance.$data[keys[i]] = data[keys[i]];
      }
    }
  },
  unbind: (el, binding, vnode) => {
    if (binding.value.settings && vnode.context && vnode.context.saveSettings) {
      vnode.context.saveSettings(vnode.componentInstance.$data);
    }
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
  if (!string) return '';
  const trimmed = string.trim();
  if (trimmed.length < nb) {
    return trimmed;
  }
  return `${trimmed.substring(0, nb)}...`;
});

Vue.filter('filename', string => (string ? string.substring(string.lastIndexOf(string.indexOf('/') > -1 ? '/' : '\\') + 1) : ''));
