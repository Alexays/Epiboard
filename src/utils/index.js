import global from '@/utils/global';
import gauth from '@/utils/gauth';

const utils = {
  ...global,
  gauth,
};

/* eslint-disable no-param-reassign */
export default {
  install(Vue) {
    Vue.utils = utils;
    Vue.prototype.$utils = utils;
  },
};
