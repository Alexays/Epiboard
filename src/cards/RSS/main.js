const API = 'https://api.rss2json.com/v1/api.json?rss_url=';

// @vue/component
export default {
  name: 'RSS',
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
  computed: {
    dateOption() {
      const options = { hour: '2-digit', minute: '2-digit' };
      if (this.$store.state.settings.hour24) {
        options.hour12 = false;
      }
      return options;
    },
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
      .finally(() => {
        this.loading = false;
      })
      .then(() => this.$emit('init', true))
      .catch(err => this.$emit('init', err));
  },
  methods: {
    fetch(url) {
      return this.axios.get(`${API}${encodeURIComponent(url)}`).then(res => res.data);
    },
  },
};
