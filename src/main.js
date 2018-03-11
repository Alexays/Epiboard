// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import Vuex from 'vuex';
import VApp from 'vuetify/es5/components/VApp';
import Vuetify from 'vuetify/es5/components/Vuetify';
import VGrid from 'vuetify/es5/components/VGrid';
import * as VCard from 'vuetify/es5/components/VCard';
import VBtn from 'vuetify/es5/components/VBtn';
import VIcon from 'vuetify/es5/components/VIcon';
import VMenu from 'vuetify/es5/components/VMenu';
import VList from 'vuetify/es5/components/VList';
import VTabs from 'vuetify/es5/components/VTabs';
import VToolbar from 'vuetify/es5/components/VToolbar';
import VTextField from 'vuetify/es5/components/VTextField';
import VCheckbox from 'vuetify/es5/components/VCheckbox';
import VChip from 'vuetify/es5/components/VChip';
import VSelect from 'vuetify/es5/components/VSelect';
import VSwitch from 'vuetify/es5/components/VSwitch';
import VSpeedDial from 'vuetify/es5/components/VSpeedDial';
import VProgressLinear from 'vuetify/es5/components/VProgressLinear';
import VProgressCircular from 'vuetify/es5/components/VProgressCircular';
import transitions from 'vuetify/es5/components/transitions';
import directives from 'vuetify/es5/directives';
import axios from 'axios';
import VueAxios from 'vue-axios';
import VueLazyload from 'vue-lazyload';
import pick from 'lodash/pick';
import App from '@/App';
import router from '@/router';
import store from '@/helpers/store';
import 'vuetify/src/stylus/app.styl';

window.chrome = require('webextension-polyfill');

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(Vuetify, {
  components: {
    Vuetify,
    VApp,
    ...VCard,
    VGrid,
    VBtn,
    VIcon,
    VMenu,
    VList,
    VTabs,
    VToolbar,
    VTextField,
    VCheckbox,
    VChip,
    VSelect,
    VSwitch,
    VSpeedDial,
    VProgressLinear,
    VProgressCircular,
  },
  directives,
  transitions,
});
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
  render: h => h(App),
});
Vue.directive('init', {
  isLiteral: true,
  bind: (el, binding, vnode) => {
    if (!binding.value) return;
    const keys = Object.keys(vnode.componentInstance.$data);
    Object.assign(vnode.componentInstance.$data, pick(JSON.parse(localStorage.getItem(`cache_${binding.value}`)) || {}, keys));
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

Vue.filter('filename', string => (string ? string.substring(string.lastIndexOf('/') + 1) : ''));
