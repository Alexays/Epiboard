import date from '@/mixins/date';

const API = 'https://api.rss2json.com/v1/api.json?rss_url=';

// @vue/component
export default {
  name: 'RSS',
  mixins: [date],
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      items: [],
      loading: true,
    };
  },
  mounted() {
    if (this.VALID_CACHE && !this.loading) {
      this.$emit('init', false);
      return;
    }
    Promise.all(this.settings.feeds.map(this.fetch))
      .then((feeds) => {
        if (!feeds) throw new Error('Unexpected response from API');
        const items = feeds.map(f => f.items.map((d) => {
          d.feed = f.feed; // eslint-disable-line
          return d;
        }));
        this.items = [].concat(...items).sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
      })
      .then(() => this.$emit('init', true))
      .catch(err => this.$emit('init', err))
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    fetch(url) {
      let endpoint = `${API}${encodeURIComponent(url)}`;
      if (this.settings.apiKey.length) {
        endpoint += `&api_key=${this.settings.apiKey}`;
      }
      return this.axios.get(endpoint).then(res => res.data);
    },
  },
};
