export default {
  name: 'Sessions',
  props: ['settings'],
  components: {},
  data() {
    return {
      maxDevices: 10,
      maxDeviceTabs: 7,
      devices: [],
      recentlyClosed: [],
    };
  },
  methods: {
    mergeTabsAndWindows(sessionItem) {
      const tabs = [];
      const keys = Object.keys(sessionItem);
      for (let i = 0; i < keys.length; i += 1) {
        const item = sessionItem[keys[i]];
        // If it's a tab we push it with lastModified value
        if (item.tab) {
          const {
            tab,
          } = item;
          tab.lastModified = new Date(item.lastModified * 1e3).toLocaleString();
          tab.favIconUrl = this.getFavicon(tab.favIconUrl || tab.url);
          tabs.push(tab);
          // If it's a window we gather each tab and add them to the others
          // e.g: we don't care about the difference between tabs and windows
        } else if (item.window) {
          const subKeys = Object.keys(item.window.tabs);
          for (let j = 0; j < subKeys.length; j += 1) {
            const tab = item.window.tabs[subKeys[j]];
            tab.lastModified = new Date(item.lastModified * 1e3).toLocaleString();
            if (!tab.favIconUrl) {
              tab.favIconUrl = this.getFavicon(tab.favIconUrl || tab.url);
            }
            tabs.push(tab);
          }
        }
      }
      if (tabs.length > this.maxDeviceTabs) {
        tabs.length = this.maxDeviceTabs;
      }
      return tabs;
    },
    getDevices() {
      return new Promise((resolve, reject) => {
        browser.sessions.getDevices({
          maxResults: this.maxDevices,
        }, (devices) => {
          if (browser.runtime.lastError) return reject(browser.runtime.lastError);
          this.devices = devices;
          for (let i = 0; i < devices.length; i += 1) {
            this.devices[i].tabs = this.mergeTabsAndWindows(devices[i].sessions);
            if (!devices[i].tabs.length) {
              this.devices.splice(i, 1);
            }
          }
          return resolve();
        });
      });
    },
    getRecentlyClosed() {
      return new Promise((resolve, reject) => {
        browser.sessions.getRecentlyClosed({
          maxResults: this.maxRecentlyClosed,
        }, (recentlyClosed) => {
          if (browser.runtime.lastError) return reject(browser.runtime.lastError);
          this.recentlyClosed = this.mergeTabsAndWindows(recentlyClosed);
          return resolve();
        });
      });
    },
  },
  mounted() {
    Promise.all([this.getDevices(), this.getRecentlyClosed()])
      .finally(() => {
        this.$emit('init', this.$data);
      });
  },
};
