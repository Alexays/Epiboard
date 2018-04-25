export default {
  name: 'TopSites',
  title: 'Top Sites',
  props: ['settings'],
  components: {},
  data() {
    return {
      topSites: [],
    };
  },
  methods: {
    getTopSites() {
      return new Promise((resolve, reject) => {
        browser.topSites.get((topSites) => {
          if (browser.runtime.lastError) return reject(browser.runtime.lastError);
          this.topSites = topSites.slice(0, this.settings.maxSites)
            .map(f => ({ ...f, ...{ icon: this.$utils.getFavicon(f.url) } }));
          return resolve();
        });
      });
    },
  },
  mounted() {
    Promise.all([this.getTopSites()])
      .then(() => this.$emit('init'))
      .catch(err => this.$emit('init', false, err));
  },
};
