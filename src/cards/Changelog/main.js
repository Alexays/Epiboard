import VueMarkdown from 'vue-markdown';

const { version } = browser.runtime.getManifest();
const API = 'https://api.github.com/repos/alexays/epiboard/releases/tags/';

export default {
  name: 'Changelog',
  title: `What's new in ${version} ?`,
  components: {
    VueMarkdown,
  },
  data() {
    return {
      version: null,
      body: '',
    };
  },
  methods: {},
  mounted() {
    if (this.version === version && this.VALID_CACHE) {
      this.$emit('init', true);
      return;
    }
    this.axios.get(`${API}${version}`)
      .then((res) => {
        this.version = version;
        this.body = res.data.body;
      })
      .then(() => this.$emit('init', this.$data))
      .catch(err => this.$emit('init', err));
  },
};
