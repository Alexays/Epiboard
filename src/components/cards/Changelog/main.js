import Marked from 'marked';

const { version } = browser.runtime.getManifest();

export default {
  name: 'Changelog',
  title: `What's new in ${version} ?`,
  origins: ['https://api.github.com/'],
  components: {},
  data() {
    return {
      API: 'https://api.github.com/repos/alexays/epiboard/releases/tags/',
      body: '',
    };
  },
  methods: {},
  mounted() {
    this.axios.get(`${this.API}${version}`)
      .then((res) => {
        this.body = Marked(res.data.body, { gfm: true, breaks: true, silent: true });
      })
      .then(() => this.$emit('init'))
      .catch(() => this.$emit('init', false));
  },
};
