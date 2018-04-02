import global from '@/utils/global';

const utils = Object.assign(
  {},
  global,
);

/* eslint-disable no-param-reassign */
export default {
  install(Vue) {
    Vue.utils = utils;
    Vue.prototype.$utils = utils;
  },
};
