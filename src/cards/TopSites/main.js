// @vue/component
export default {
  name: 'TopSites',
  title: 'Top Sites',
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      topSites: [],
    };
  },
  mounted() {
    Promise.all([this.getTopSites()])
      .then(() => this.$emit('init'))
      .catch(err => this.$emit('init', err));
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
};
