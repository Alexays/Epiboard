import * as VList from 'vuetify/es5/components/VList';
import VTextField from 'vuetify/es5/components/VTextField';

// @vue/component
export default {
  name: 'RSS',
  components: {
    ...VList,
    VTextField,
  },
  data() {
    return {
      settings: {},
      newFeed: '',
    };
  },
  methods: {
    addFeed(url) {
      if (url.trim().length === 0) return;
      this.newFeed = '';
      this.settings.feeds.push(url);
    },
    removeFeed(idx) {
      this.settings.feeds.splice(idx, 1);
    },
  },
};
