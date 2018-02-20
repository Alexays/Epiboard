export default {
  name: 'Download',
  props: ['settings'],
  components: {},
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
    open(download) {
      if (download.state === 'interrupted') {
        // Materialize.toast(this.humanize(download.error), 4000);
      }
      if (download.state === 'complete') {
        if (download.exists) {
          chrome.downloads.open(download.id);
        } else {
          // Materialize.toast('File moved or deleted', 4000);
        }
      }
    },
    getDownloads() {
      return chrome.downloads.search({
        limit: 5,
        orderBy: ['-startTime'],
      }).then((downloads) => {
        this.downloads = downloads;
        for (let i = 0; i < downloads.length; i += 1) {
          if (downloads[i].filename) {
            chrome.downloads.getFileIcon(downloads[i].id).then((data) => {
              this.downloads[i].icon = data;
              this.downloads = this.downloads.slice(0);
            });
          }
        }
      });
    },
    listenChange() {
      chrome.downloads.onChanged.addListener((downloadDelta) => {
        if (chrome.runtime.lastError) return;
        for (let i = 0; i < this.downloads.length; i += 1) {
          if (this.downloads[i].id === downloadDelta.id) {
            const keys = Object.keys(downloadDelta);
            for (let j = 0; j < keys.length; j += 1) {
              if (keys[j] === 'id') {
                this.downloads[i][j] = downloadDelta[j].current;
                this.downloads = this.downloads.slice(0);
              }
            }
          }
        }
      });
    },
    listenCreate() {
      chrome.downloads.onCreated.addListener((download) => {
        if (chrome.runtime.lastError) return;
        this.downloads.pop();
        this.downloads.unshift(download);
        // wait 500ms after download starts to get the icon
        Promise.delay(500).then(() => {
          if (!download.filename) return;
          chrome.downloads.getFileIcon(download.id, (dataUrl) => {
            if (chrome.runtime.lastError) return;
            for (let i = 0; i < this.downloads.length; i += 1) {
              if (this.downloads[i].id === download.id) {
                this.downloads[i].icon = dataUrl;
                this.downloads = this.downloads.slice(0);
                break;
              }
            }
          });
        });
      });
    },
  },
  mounted() {
    Promise.all([this.getDownloads()])
      .finally(() => {
        this.listenChange();
        this.listenCreate();
        this.$emit('init', this.$data);
      });
  },
};
