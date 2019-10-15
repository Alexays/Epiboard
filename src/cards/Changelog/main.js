import Marked from 'marked';

const { version } = browser.runtime.getManifest();
const API = 'https://api.github.com/repos/alexays/epiboard/releases/tags/';

// @vue/component
export default {
  name: 'Changelog',
  data() {
    return {
      version: null,
      body: null,
      loading: true,
    };
  },
  beforeCreate() {
    this.$emit('update:cardtitle', this.$t('Changelog.whatsnew', { version }));
  },
  mounted() {
    if (this.version === version && this.VALID_CACHE) {
      this.$emit('init', false);
      return;
    }
    this.axios.get(`${API}${version}`)
      .then((res) => {
        this.version = version;
        this.body = Marked(res.data.body);
      })
      .then(() => this.$emit('init', true))
      .catch(err => this.$emit('init', err))
      .finally(() => {
        this.loading = false;
      });
  },
};
