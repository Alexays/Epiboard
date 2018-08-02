import * as VList from 'vuetify/es5/components/VList';
import * as VTabs from 'vuetify/es5/components/VTabs';

// @vue/component
export default {
  name: 'Sessions',
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
      recents: [],
      devices: [],
      active: 0,
    };
  },
  computed: {
    tabs() {
      return [
        { name: 'Sessions.recents', id: 'recents', data: this.recents },
        ...this.devices.map(f => ({ name: f.deviceName, id: f.deviceName, data: f.data })),
      ];
    },
    dateOption() {
      return { hour: '2-digit', minute: '2-digit' };
    },
  },
  created() {
    Promise.all([this.getRecentlyClosed(), this.getDevices()])
      .then(() => {
        browser.sessions.onChanged.addListener(() => {
          Promise.all([this.getRecentlyClosed(), this.getDevices()]);
        });
      })
      .then(() => this.$emit('init'))
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
          tab.lastModified = new Date(item.lastModified * 1e3);
          tab.favIconUrl = tab.favIconUrl || this.$utils.getFavicon(tab.url);
          tabs.push(tab);
          // If it's a window we gather each tab and add them to the others
          // e.g: we don't care about the difference between tabs and windows
        } else if (item.window) {
          const subKeys = Object.keys(item.window.tabs);
          for (let j = 0; j < subKeys.length; j += 1) {
            const tab = item.window.tabs[subKeys[j]];
            tab.lastModified = new Date(item.lastModified * 1e3);
            tab.favIconUrl = tab.favIconUrl || this.$utils.getFavicon(tab.url);
            tabs.push(tab);
          }
        }
      }
      return tabs;
    },
    getDevices() {
      // TODO: Firefox doesn't support getDevices
      if (!browser.sessions.getDevices) return Promise.resolve([]);
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
