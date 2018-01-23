// DEPRECATED: Chrome apps will be removed soon
export default {
  name: 'Apps',
  props: ['settings'],
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
      chrome.management.getAll((all) => {
        for (let i = 0; i < all.length; i += 1) {
          if (all[i].type === 'extension')
            this.extensions.push(all[i]);
          else if (all[i].type === 'theme')
            this.themes.push(all[i]);
          else {
            const app = all[i];
            if (app.icons)
              app.icon = app.icons[app.icons.length - 1].url;
            else
              app.icon = 'chrome://extension-icon/khopmbdjffemhegeeobelklnbglcdgfh/256/1';
            if (!app.enabled)
              app.icon += '?grayscale=true';
            this.apps.push(app);
          }
        }
      });
    },
  },
  mounted() {
    this.getAll();
  },
};
