import global from '@/utils/global';

const utils = {
  ...global,
};

/* eslint-disable no-param-reassign */
export default {
  install(Vue) {
    Vue.utils = utils;
    Vue.prototype.$utils = utils;
  },
};
