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
      foldersId: [],
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
    Promise.all([this.getRecent(), this.getAll(), this.getFolders()])
      .then(() => this.$emit('init'))
      .catch(err => this.$emit('init', err));
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
          this.tabs.unshift({ name: 'Bookmarks.recents', id: 'recents', data: recents });
        });
    },
    getAll() {
      return browser.bookmarks.getTree()
        .then((tree) => {
          this.rootId = tree[0].id;
          return browser.bookmarks.getChildren(tree[0].id);
        })
        .then((all) => {
          this.tabs = [
            ...this.tabs.slice(0, 1),
            { name: 'Bookmarks.all', id: 'all', data: all },
            ...this.tabs.slice(1),
          ];
        });
    },
    getFolders() {
      if (!this.foldersId.length) return Promise.resolve();
      return Promise.all(this.foldersId
        .map(f => browser.bookmarks.get(f)
          .then(folder => browser.bookmarks.getChildren(f)
            .then(children => ({ name: folder[0].title, id: f, data: children })))))
        .then((folders) => {
          this.tabs = [...this.tabs, ...folders];
        });
    },
  },
};
