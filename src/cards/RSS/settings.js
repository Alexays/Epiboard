import * as VList from 'vuetify/es5/components/VList';

// @vue/component
export default {
  name: 'RSS',
  components: {
    ...VList,
  },
  data() {
    return {
      feeds: ['https://news.google.com/news/rss/'],
      newFeed: '',
    };
  },
  methods: {
    addFeed(url) {
      if (url.trim().length === 0) return;
      this.newFeed = '';
      this.feeds.push(url);
    },
    removeFeed(idx) {
      this.feeds.splice(idx, 1);
    },
  },
};
