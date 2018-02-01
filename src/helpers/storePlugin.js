import store from './store';

export default {
  store,
  install(Vue) {
    /* eslint-disable no-param-reassign */
    Vue.prototype.$store = store;
  },
};
