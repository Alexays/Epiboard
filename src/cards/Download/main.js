import Toast from '@/components/Toast';
import * as VList from 'vuetify/es5/components/VList';
import VMenu from 'vuetify/es5/components/VMenu';

export default {
  name: 'Download',
  props: ['settings'],
  components: {
    ...VList,
    VMenu,
  },
  data() {
    return {
      downloads: {},
    };
  },
  methods: {
    humanize(error) {
      const isUpper = s => !/[^a-z\xC0-\xFF]/.test(s.toLowerCase()) && s.toUpperCase() === s;
      let input = error.replace(/(^\s*|\s*$)/g, '').replace(/([a-z\d])([A-Z]+)/g, '$1_$2').replace(/[-\s]+/g, '_').toLowerCase();
      if (isUpper(input.charAt(0))) {
        input = `_${input}`;
      }
      input = input.replace(/_id$/, '').replace(/_/g, ' ').replace(/(^\s*|\s*$)/g, '');
      return input.substr(0, 1).toUpperCase() + input.substring(1).toLowerCase();
    },
    onDrag(download) {
      browser.downloads.drag(download);
    },
    open(download) {
      if (download.state === 'interrupted') {
        Toast.show({
          title: this.humanize(download.error),
          timeout: 4000,
        });
      }
      if (download.state === 'complete') {
        if (download.exists) {
          browser.downloads.open(download.id);
        } else {
          Toast.show({
            title: 'File moved or deleted',
            timeout: 4000,
          });
        }
      }
    },
    erase(download) {
      browser.downloads.erase({ id: download.id }).catch((err) => {
        Toast.show({
          title: 'Unable to remove.',
          desc: err.message,
          timeout: 4000,
        });
      });
      this.getDownloads();
    },
    remove(download) {
      browser.downloads.removeFile(download.id).catch((err) => {
        Toast.show({
          title: 'Unable to remove.',
          desc: err.message,
          timeout: 4000,
        });
      });
      this.erase(download);
    },
    getDownloads() {
      return browser.downloads.search({
        limit: this.settings.limitDownloads,
        orderBy: ['-startTime'],
      }).then((downloads) => {
        this.downloads = downloads;
        for (let i = 0; i < downloads.length; i += 1) {
          if (downloads[i].filename) {
            browser.downloads.getFileIcon(downloads[i].id).then((data) => {
              this.$set(this.downloads[i], 'icon', data);
            });
          }
        }
      });
    },
    listenChange() {
      browser.downloads.onChanged.addListener((downloadDelta) => {
        if (browser.runtime.lastError) return;
        const id = this.downloads.findIndex(f => f.id === downloadDelta.id || f.id === undefined);
        if (id === -1) return;
        this.$set(this.downloads[id], 'id', downloadDelta.id);
        if (!this.downloads[id].icon) {
          browser.downloads.getFileIcon(this.downloads[id].id).then((data) => {
            this.$set(this.downloads[id], 'icon', data);
          });
        }
        const keys = Object.keys(downloadDelta);
        for (let i = 0; i < keys.length; i += 1) {
          if (keys[i] !== 'id') {
            this.$set(this.downloads[id], keys[i], downloadDelta[keys[i]].current);
          }
        }
      });
    },
    listenCreate() {
      browser.downloads.onCreated.addListener((download) => {
        if (browser.runtime.lastError) return;
        this.downloads.pop();
        this.downloads.unshift(download);
      });
    },
    listenErased() {
      browser.downloads.onErased.addListener((downloadId) => {
        if (browser.runtime.lastError) return;
        const id = this.downloads.findIndex(f => f.id === downloadId);
        if (id === -1) return;
        this.downloads.splice(id, 1);
        this.getDownloads();
      });
    },
  },
  mounted() {
    Promise.all([this.getDownloads()])
      .then(() => {
        this.listenChange();
        this.listenCreate();
        this.listenErased();
      })
      .then(() => this.$emit('init'))
      .catch(err => this.$emit('init', err));
  },
};
