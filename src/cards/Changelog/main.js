import Marked from 'marked';

const { version } = browser.runtime.getManifest();
const API = 'https://api.github.com/repos/alexays/epiboard/releases/tags/';

// @vue/component
export default {
  name: 'Changelog',
  title: `What's new in ${version} ?`,
  data() {
    return {
      version: null,
      body: null,
    };
  },
  created() {
    if (this.version === version && this.VALID_CACHE) {
      this.$emit('init', true);
      return;
    }
    this.axios.get(`${API}${version}`)
      .then((res) => {
        this.version = version;
        this.body = Marked(res.data.body);
      })
      .then(() => this.$emit('init', this.$data))
      .catch(err => this.$emit('init', err));
  },
};
