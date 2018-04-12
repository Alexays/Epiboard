export default {
  name: 'Top Sites',
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
          this.topSites = topSites.slice(0, this.settings.maxSites);
          this.topSites = this.topSites.map(f => Object.assign(f, {
            icon: this.$utils.getFavicon(f.url),
          }));
          return resolve();
        });
      });
    },
  },
  mounted() {
    Promise.all([this.getTopSites()])
      .then(() => this.$emit('init', this.$data))
      .catch(() => this.$emit('init', false));
  },
};
