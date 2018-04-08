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
      .then(res => new Promise((resolve, reject) => {
        if (!res) return reject(new Error('Insufficient permission'));
        return http.get(this.feeds[0], (data) => {
          resolve(data);
        });
      }))
      .then(res => res.pipe(feedparser))
      .finally(() => this.$emit('init'));
  },
};
