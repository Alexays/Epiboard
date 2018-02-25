import Marked from 'marked';

const { version } = chrome.runtime.getManifest();

export default {
  name: 'Changelog',
  title: `What's new in ${version} ?`,
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
        this.body = Marked(res.data.body, { sanitize: true });
      })
      .finally(() => this.$emit('init'));
  },
};
