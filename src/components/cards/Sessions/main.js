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
    getFavicon(url) {
      const regex = /(chrome:\/\/|view-source:)/ig;
      if (!regex.test(url)) {
        return `https://www.google.com/s2/favicons?domain_url=${encodeURI(url)}`;
      }
      return null;
    },
    mergeTabsAndWindows(sessionItem) {
      const tabs = [];
      const keys = Object.keys(sessionItem);
      for (let i = 0; i < keys.length; i += 1) {
        const item = sessionItem[keys[i]];
        // If it's a tab we push it with lastModified value
        if (item.tab) {
          const { tab } = item;
          tab.lastModified = new Date(item.lastModified * 1e3).toISOString();
          tab.favIconUrl = tab.favIconUrl || this.getFavicon(tab.url);
          tabs.push(tab);
          // If it's a window we gather each tab and add them to the others
          // e.g: we don't care about the difference between tabs and windows
        } else if (item.window) {
          const subKeys = Object.keys(item.window.tabs);
          for (let j = 0; j < subKeys.length; j += 1) {
            const tab = item.window.tabs[subKeys[j]];
            tab.lastModified = new Date(item.lastModified * 1e3).toISOString();
            tab.favIconUrl = tab.favIconUrl || this.getFavicon(tab.url);
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
      chrome.sessions.getDevices({
        maxResults: this.maxDevices,
      }, (devices) => {
        this.devices = devices;
        for (let i = 0; i < devices.length; i += 1) {
          this.devices[i].tabs = this.mergeTabsAndWindows(devices[i].sessions);
          if (!devices[i].tabs.length) {
            this.devices.splice(i, 1);
          }
        }
      });
    },
    getRecentlyClosed() {
      chrome.sessions.getRecentlyClosed({
        maxResults: this.maxRecentlyClosed,
      }, (recentlyClosed) => {
        this.recentlyClosed = this.mergeTabsAndWindows(recentlyClosed);
      });
    },
  },
  mounted() {
    this.getDevices();
    this.getRecentlyClosed();
  },
};
