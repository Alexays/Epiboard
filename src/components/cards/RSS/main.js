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
