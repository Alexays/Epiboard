import * as VList from 'vuetify/es5/components/VList';

const API = 'https://api.rss2json.com/v1/api.json?rss_url=';

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
      return this.items.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    },
  },
  methods: {
    init() {
      return this.$utils.permissions.allowed({
        origins: this.settings.feeds || [],
      }).then((res) => {
        if (res) return this.settings.feeds;
        throw new Error('Insufficient permissions');
      });
    },
    fetch(url) {
      return this.axios.get(`${API}${encodeURIComponent(url)}`).then(res => res.data.items);
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
        this.items = Array.prototype.concat(...res);
        this.loading = false;
      })
      .then(() => this.$emit('init', this.$data))
      .catch(err => this.$emit('init', err));
  },
};
