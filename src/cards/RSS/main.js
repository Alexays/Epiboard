import * as VList from 'vuetify/es5/components/VList';

const API = 'https://api.rss2json.com/v1/api.json?rss_url=';

// @vue/component
export default {
  name: 'RSS',
  components: {
    ...VList,
  },
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
      return { hour: '2-digit', minute: '2-digit' };
    },
  },
  mounted() {
    if (this.VALID_CACHE && !this.loading) {
      this.$emit('init', false);
      return;
    }
    Promise.all(this.settings.feeds.map(this.fetch))
      .then((feeds) => {
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
