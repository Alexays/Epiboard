import GridList from '@/components/GridList';
import List from '@/components/List';
import utils from '@/mixins/utils';

// @vue/component
export default {
  name: 'TopSites',
  components: {
    List,
  },
  mixins: [utils],
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
    size() {
      return [32, 64, 96, 128][this.settings.size];
    },
  },
  created() {
    this.getTopSites()
      .catch(err => this.$emit('init', err));
  },
  methods: {
    getTopSites() {
      return browser.topSites.get().then((topSites) => {
        this.topSites = topSites.slice(0, this.settings.maxSites)
          .map((f) => {
            f.icon = this.settings.grid
              ? this.getFavicon(new URL(f.url).hostname, this.size)
              : this.getFavicon(f.url);
            return f;
          });
      });
    },
  },
};
