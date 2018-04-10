import FeedParser from 'feedparser';
import http from 'http';

export default {
  name: 'RSS',
  props: ['settings'],
  components: {},
  data() {
    return {
      feeds: ['https://news.google.com/news/rss/'],
      items: [],
      newFeed: '',
      dialog: false,
    };
  },
  methods: {
    init() {
      return this.$utils.permissions.allowed({
        origins: this.feeds || [],
      }).then((res) => {
        if (res) return res;
        throw new Error('Insufficient permission');
      });
    },
    getFeed(url) {
      return new Promise((resolve) => {
        http.get(url, (data) => {
          resolve(data);
        });
      });
    },
    addFeed(url) {
      if (url.trim().length === 0) return;
      this.feeds.push(url);
      this.newFeed = '';
      const feedparser = new FeedParser({});
      const vue = this;
      feedparser.on('readable', function readable() {
        const stream = this;
        for (let item = stream.read(); item; item = stream.read()) {
          vue.items.unshift(item);
        }
      });
      this.$utils.permissions.allowed({
        origins: [url],
      }).then((res) => {
        if (res) return this.getFeed(url);
        throw new Error('Insufficient permission');
      }).then((res) => {
        res.pipe(feedparser);
      });
    },
    removeFeed(idx) {
      this.feeds.splice(idx, -1);
    },
  },
  mounted() {
    const vue = this;
    const feedparser = new FeedParser({});
    feedparser.on('readable', function readable() {
      const stream = this;
      for (let item = stream.read(); item; item = stream.read()) {
        vue.items.push(item);
      }
    });
    this.init()
      .then(() => Promise.all(this.feeds.map(f => this.getFeed(f))))
      .then((res) => {
        for (let i = 0; i < res.length; i += 1) {
          res[i].pipe(feedparser);
        }
      })
      .finally(() => this.$emit('init'));
  },
};
