// DEPRECATED: Chrome apps will be removed soon
export default {
  name: 'Apps',
  components: {},
  data() {
    return {
      apps: [],
      extensions: [],
      themes: [],
    };
  },
  methods: {
    getAll() {
      return browser.management.getAll().then((all) => {
        for (let i = 0; i < all.length; i += 1) {
          if (all[i].type === 'extension') {
            this.extensions.push(all[i]);
          } else if (all[i].type === 'theme') {
            this.themes.push(all[i]);
          } else {
            const app = all[i];
            app.icon = app.icons
              ? app.icons[app.icons.length - 1].url
              : 'chrome://extension-icon/khopmbdjffemhegeeobelklnbglcdgfh/256/1';
            if (!app.enabled) {
              app.icon += '?grayscale=true';
            }
            this.apps.push(app);
          }
        }
      });
    },
    launch(app) {
      if (app.launchType === 'OPEN_AS_REGULAR_TAB' || app.launchType === 'OPEN_AS_WINDOW') {
        browser.management.launchApp(app.id);
      }
    },
  },
  mounted() {
    Promise.all([this.getAll()])
      .then(() => this.$emit('init'))
      .catch(err => this.$emit('init', err));
  },
};
