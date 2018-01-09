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
    getDownloads() {
      return new Promise((resolve) => {
        chrome.downloads.search({ limit: 15, orderBy: ['-startTime'] }, (downloads) => {
          resolve(downloads);
        });
      });
    },
    parseDownloads(downloads) {
      return new Promise((resolve) => {
        downloads.map((download) => {
          if (download.filename) {
            try {
              return chrome.downloads.getFileIcon(download.id, (dataUrl) => {
                download.icon = dataUrl;
                return resolve(download);
              });
            } catch (err) {
              return resolve(download);
            }
          }
          return resolve(download);
        });
      });
    },
  },
  mounted() {
    this.getDownloads()
      .then(this.parseDownloads)
      .then((downloads) => {
        this.downloads = downloads;
      });
  },
};

