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
  dateOption: { hour: '2-digit', minute: '2-digit' },
  data() {
    return {
      recents: [],
      all: [],
      folders: [],
      foldersId: [],
      rootId: '0',
      active: 0,
    };
  },
  computed: {
    tabs() {
      return [
        { id: 'recents', data: this.recents },
        { id: 'all', data: this.all },
        ...this.folders,
      ];
    },
  },
  created() {
    Promise.all([this.getRecent(), this.getAll()])
      .then(() => this.$emit('init', ['foldersId', 'active']))
      .catch(err => this.$emit('init', err));
  },
  mounted() {
    // getFolders is run in 'mounted' because it needs cache.
    this.getFolders();
  },
  methods: {
    addTab(item) {
      this.foldersId.push(item.id);
      this.getFolders();
    },
    removeTab(item) {
      this.foldersId = this.foldersId.filter(f => f !== item.id);
      this.tabs = this.tabs.filter(f => f.id !== item.id);
    },
    backParent(tab) {
      if (tab.parentNode && tab.parentNode[0].parentId === this.rootId) {
        this.$set(tab, 'data', tab.parentNode);
        this.$set(tab, 'parentNode', null);
        return;
      }
      browser.bookmarks.get(tab.data[0].parentId)
        .then((parent) => {
          this.$set(tab, 'data', tab.parentNode);
          this.$set(tab, 'parentNode', parent);
        });
    },
    getSubFolder(tab, item) {
      if (item.url) return;
      browser.bookmarks.getChildren(item.id)
        .then((children) => {
          this.$set(tab, 'parentNode', tab.data);
          this.$set(tab, 'data', children);
        });
    },
    getRecent() {
      return browser.bookmarks.getRecent(this.settings.maxRecents)
        .then((recents) => {
          this.recents = recents;
        });
    },
    getAll() {
      return browser.bookmarks.getTree()
        .then((tree) => {
          this.rootId = tree[0].id;
          return browser.bookmarks.getChildren(tree[0].id);
        })
        .then((all) => {
          this.all = all;
        });
    },
    getFolders() {
      if (!this.foldersId.length) return Promise.resolve();
      return Promise.all(this.foldersId
        .map(f => browser.bookmarks.get(f)
          .then(folder => browser.bookmarks.getChildren(f)
            .then(children => ({
              name: folder[0].title, folder: true, id: f, data: children,
            })))))
        .then((folders) => {
          this.folders = folders;
        });
    },
  },
};
