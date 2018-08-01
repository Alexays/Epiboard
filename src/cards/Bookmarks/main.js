import * as VList from 'vuetify/es5/components/VList';
import * as VTabs from 'vuetify/es5/components/VTabs';

// @vue/component
export default {
  name: 'Boomarks',
  components: {
    ...VList,
    ...VTabs,
  },
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tabs: [],
      rootId: '0',
      active: 0,
    };
  },
  computed: {
    dateOption() {
      return { hour: '2-digit', minute: '2-digit' };
    },
  },
  created() {
    Promise.all([this.getRecent(), this.getAll()])
      .then((tabs) => {
        this.tabs = tabs;
      })
      .then(() => this.$emit('init'))
      .catch(err => this.$emit('init', err));
  },
  methods: {
    backParent(tab) {
      if (tab.parentNode && tab.parentNode[0].parentId === this.rootId) {
        this.$set(this.tabs[1], 'data', tab.parentNode);
        this.$set(this.tabs[1], 'parentNode', null);
        return;
      }
      browser.bookmarks.get(tab.data[0].parentId)
        .then((parent) => {
          this.$set(this.tabs[1], 'data', tab.parentNode);
          this.$set(this.tabs[1], 'parentNode', parent);
        });
    },
    getSubFolder(item) {
      if (item.url) return;
      browser.bookmarks.getChildren(item.id)
        .then((children) => {
          this.$set(this.tabs[1], 'parentNode', this.tabs[1].data);
          this.$set(this.tabs[1], 'data', children);
        });
    },
    getRecent() {
      return browser.bookmarks.getRecent(this.settings.maxRecents)
        .then(recents => ({
          name: 'Bookmarks.recents',
          id: 'recents',
          data: recents,
        }));
    },
    getAll() {
      return browser.bookmarks.getTree()
        .then((tree) => {
          this.rootId = tree[0].id;
          return browser.bookmarks.getChildren(tree[0].id);
        })
        .then(all => ({
          name: 'Bookmarks.all',
          id: 'all',
          data: all,
        }));
    },
  },
};
