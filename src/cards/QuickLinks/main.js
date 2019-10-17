import GridList from '@/components/GridList';
import List from '@/components/List';
import utils from '@/mixins/utils';

// @vue/component
export default {
  name: 'QuickLinks',
  mixins: [utils],
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  computed: {
    size() {
      return [32, 64, 96, 128][this.settings.size];
    },
    cmp() {
      if (this.settings.grid) {
        return GridList;
      }
      return List;
    },
    links() {
      return this.settings.links
        .map((f) => {
          const Url = new URL(f);
          const icon = this.settings.grid ? this.getFavicon(Url.hostname, this.size)
            : this.getFavicon(f);
          return { name: Url.hostname, url: f, icon };
        });
    },
  },
};
