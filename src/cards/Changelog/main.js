import Marked from 'marked';

const { version } = browser.runtime.getManifest();
const API = 'https://api.github.com/repos/alexays/epiboard/releases/tags/';

export default {
  name: 'Changelog',
  title: `What's new in ${version} ?`,
  components: {},
  data() {
    return {
      body: '',
    };
  },
  methods: {},
  mounted() {
    if (this.VALID_CACHE) {
      this.$emit('init', true);
      return;
    }
    this.axios.get(`${API}${version}`)
      .then((res) => {
        this.body = Marked(res.data.body, { gfm: true, breaks: true, silent: true });
      })
      .then(() => this.$emit('init', this.$data))
      .catch(err => this.$emit('init', err));
  },
};
