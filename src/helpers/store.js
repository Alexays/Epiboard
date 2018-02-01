import Vue from 'vue';
import Vuex from 'vuex';
import Settings from '@/settings';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    settings: Settings.map(f => ({
      [f.name]: f.value,
    })).reduce((a, x) => Object.assign(a, x)),
  },
  mutations: {
    update(state, settings) {
      state.settings = settings;
    },
  },
});
