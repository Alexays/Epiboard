export default {
  name: 'TopSites',
  components: {},
  data() {
    return {
      maxSites: 5,
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
