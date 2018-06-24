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
  mounted() {
    if (this.VALID_CACHE) {
      this.$emit('init', true);
      return;
    }
    Promise.all(this.settings.feeds.map(this.fetch))
      .then((items) => {
        this.items = [].concat(...items).sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
      })
      .finally(() => {
        this.loading = false;
      })
      .then(() => this.$emit('init', this.$data))
      .catch(err => this.$emit('init', err));
  },
  methods: {
    fetch(url) {
      return this.axios.get(`${API}${encodeURIComponent(url)}`).then(res => res.data.items);
    },
  },
};
