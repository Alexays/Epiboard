import List from '@/components/List';
import utils from '@/mixins/utils';

// @vue/component
export default {
  name: 'Sessions',
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
      recents: [],
      devices: [],
    };
  },
  computed: {
    tabs() {
      return [
        { id: 'recents', data: this.recents },
        ...this.devices.map(f => ({
          id: `${f.deviceName}${f.sessions.length}${f.data.length}`, data: f.data,
        })),
      ];
    },
  },
  created() {
    Promise.all([this.getRecentlyClosed(), this.getDevices()])
      .then(() => {
        browser.sessions.onChanged.addListener(() => {
          Promise.all([this.getRecentlyClosed(), this.getDevices()]);
        });
      })
      .catch(err => this.$emit('init', err));
  },
  methods: {
    mergeTabsAndWindows(sessionItem) {
      const tabs = [];
      const keys = Object.keys(sessionItem);
      for (let i = 0; i < keys.length && tabs.length < this.settings.maxDeviceTabs; i += 1) {
        const item = sessionItem[keys[i]];
        // If it's a tab we push it with lastModified value
        if (item.tab) {
          const { tab } = item;
          tab.date = new Date(item.lastModified * 1e3);
          tab.icon = tab.favIconUrl || this.getFavicon(tab.url);
          tabs.push(tab);
          // If it's a window we gather each tab and add them to the others
          // e.g: we don't care about the difference between tabs and windows
        } else if (item.window) {
          const subKeys = Object.keys(item.window.tabs);
          for (let j = 0; j < subKeys.length; j += 1) {
            const tab = item.window.tabs[subKeys[j]];
            tab.date = new Date(item.lastModified * 1e3);
            tab.icon = tab.favIconUrl || this.getFavicon(tab.url);
            tabs.push(tab);
          }
        }
      }
      return tabs;
    },
    getDevices() {
      // Firefox doesn't support getDevices
      if (browserName !== 'chrome') {
        return Promise.resolve([]);
      }
      return browser.sessions.getDevices({ maxResults: this.settings.maxDevices })
        .then((devices) => {
          this.devices = devices.map((f) => {
            f.data = this.mergeTabsAndWindows(f.sessions);
            return f;
          });
        });
    },
    getRecentlyClosed() {
      return browser.sessions.getRecentlyClosed({ maxResults: this.settings.maxRecentlyClosed })
        .then((recentlyClosed) => {
          this.recents = this.mergeTabsAndWindows(recentlyClosed);
        });
    },
  },
};
