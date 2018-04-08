import global from '@/utils/global';
import permissions from '@/utils/permissions';

const utils = {
  ...global,
  ...{ permissions },
};

/* eslint-disable no-param-reassign */
export default {
  install(Vue) {
    Vue.utils = utils;
    Vue.prototype.$utils = utils;
  },
};
