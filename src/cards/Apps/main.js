// DEPRECATED: Chrome apps will be removed soon
import Toast from '@/components/Toast';
import GridList from '@/components/GridList';

// @vue/component
export default {
  name: 'Apps',
  components: {
    GridList,
  },
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      apps: [],
      extensions: [],
      themes: [],
    };
  },
  computed: {
    size() {
      return [32, 64, 96, 128][this.settings.size];
    },
  },
  created() {
    this.getAll()
      .catch(err => this.$emit('init', err));
  },
  methods: {
    getType(info) {
      if (info.type === 'extension') {
        const idx = this.extensions.findIndex(f => f.id === info.id);
        if (idx === -1) this.extensions.push(info);
        else this.$set(this.extensions, idx, info);
      } else if (info.type === 'theme') {
        const idx = this.themes.findIndex(f => f.id === info.id);
        if (idx === -1) this.themes.push(info);
        else this.$set(this.themes, idx, info);
      } else {
        const app = info;
        // TODO: get closest size
        app.icon = app.icons
          ? app.icons[app.icons.length - 1].url
          : 'chrome://extension-icon/khopmbdjffemhegeeobelklnbglcdgfh/256/1';
        if (!app.enabled) {
          app.icon += '?grayscale=true';
        }
        const idx = this.apps.findIndex(f => f.id === info.id);
        if (idx === -1) this.apps.push(app);
        else this.$set(this.apps, idx, app);
      }
    },
    getAll() {
      return browser.management.getAll().then((all) => {
        for (let i = 0; i < all.length; i += 1) {
          this.getType(all[i]);
        }
      });
    },
    get(id) {
      return browser.management.get(id)
        .then(this.getType);
    },
    launch(app) {
      if (app.launchType && app.enabled) {
        browser.management.launchApp(app.id);
      } else if (!app.enabled) {
        browser.management.setEnabled(app.id, true)
          .then(() => this.get(app.id))
          .then(() => Toast.show({ title: `${app.name} is now enabled.` }))
          .catch(() => Toast.show({ title: `${app.name} is disabled.`, color: 'warning' }))
          .finally(() => browser.management.launchApp(app.id));
      }
    },
  },
};
