export default {
  name: 'RSS',
  components: {},
  data() {
    return {
      feeds: ['https://news.google.com/news/rss/'],
    };
  },
  methods: {
    addFeed(url) {
      if (url.trim().length === 0) return;
      this.feeds.push(url);
    },
    removeFeed(idx) {
      this.feeds.splice(idx, 1);
    },
  },
  mounted() {
  },
};
