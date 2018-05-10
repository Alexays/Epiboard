import FeedParser from 'feedparser';
import http from 'http';

export default {
  name: 'RSS',
  props: ['settings'],
  components: {},
  data() {
    return {
      items: [],
      newFeed: '',
      dialog: false,
    };
  },
  computed: {
    sortedFeeds() {
      return this.items.sort((a, b) => b.date - a.date);
    },
  },
  methods: {
    init() {
      return this.$utils.permissions.allowed({
        origins: this.settings.feeds || [],
      }).then((res) => {
        if (res) return res;
        throw new Error('Insufficient permission');
      });
    },
    fetch(url) {
      return new Promise((resolve, reject) => {
        if (!url) return reject(new Error('Bad URL'));
        const feedparser = new FeedParser({ addmeta: false });
        const items = [];
        feedparser
          .on('error', err => reject(err))
          .on('readable', () => {
            for (let item = feedparser.read(); item; item = feedparser.read()) {
              [item.image, item.imageUrl] = item.description.match(/<img [^>]*src="([^"]+)"/);
              items.push(item);
            }
          }).on('end', () => {
            resolve(items);
          });
        return http.get(url, (data) => {
          data.pipe(feedparser);
        });
      });
    },
  },
  mounted() {
    if (this.VALID_CACHE) {
      this.$emit('init', true);
      return;
    }
    this.init()
      .then(() => Promise.all(this.settings.feeds.map(f => this.fetch(f))))
      .then((res) => {
        this.items = Array.prototype.concat(...res).map((f) => {
          f.dateString = f.date.toDateString();
          return f;
        });
      })
      .then(() => this.$emit('init', this.$data))
      .catch(err => this.$emit('init', err));
  },
};
