// @vue/component
export default {
  name: 'RSS',
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
