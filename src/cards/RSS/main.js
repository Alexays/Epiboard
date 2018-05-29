import * as VList from 'vuetify/es5/components/VList';
import FeedParser from 'feedparser';
import http from 'http';

export default {
  name: 'RSS',
  props: ['settings'],
  components: {
    ...VList,
  },
  data() {
    return {
      items: [],
      loading: true,
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
        if (res) return this.settings.feeds;
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
              if (item.description) {
                const res = item.description.match(/<img [^>]*src="([^"]+)"/);
                if (res)[item.image, item.imageUrl] = res;
              }
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
      .then(data => Promise.all(data.map(this.fetch)))
      .then((res) => {
        this.items = Array.prototype.concat(...res).map((f) => {
          f.dateString = f.date.toLocaleString();
          return f;
        });
        this.loading = false;
      })
      .then(() => this.$emit('init', this.$data))
      .catch(err => this.$emit('init', err));
  },
};
