import GridList from '@/components/GridList';
import List from '@/components/List';

// @vue/component
export default {
  name: 'TopSites',
  components: {
    List,
  },
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
  computed: {
    cmp() {
      if (this.settings.grid) {
        return GridList;
      }
      return List;
    },
  },
  created() {
    Promise.all([this.getTopSites()])
      .then(() => this.$emit('init'))
      .catch(err => this.$emit('init', err));
  },
  methods: {
    getTopSites() {
      return browser.topSites.get().then((topSites) => {
        this.topSites = topSites.slice(0, this.settings.maxSites)
          .map((f) => {
            const icon = this.settings.grid
              ? this.$utils.getFavicon(new URL(f.url).hostname, 128)
              : this.$utils.getFavicon(f.url);
            return { ...f, icon };
          });
      });
    },
  },
};
