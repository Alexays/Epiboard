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
    // Get recent Downloads
    getDownloads() {
      chrome.downloads.search({ limit: 5, orderBy: ['-startTime'] }, (downloads) => {
        this.downloads = downloads;
        for (let i = 0; i < downloads.length; i += 1) {
          if (downloads[i].filename) {
            chrome.downloads.getFileIcon(downloads[i].id, (data) => {
              this.downloads[i].icon = data;
              this.downloads = this.downloads.slice(0);
            });
          }
        }
      });
    },
    listenChange() {
      // Watch changes in download states and apply them to the model
      chrome.downloads.onChanged.addListener((downloadDelta) => {
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
      // Watch if a download is created and add it to the card
      chrome.downloads.onCreated.addListener((download) => {
        this.downloads.pop();
        this.downloads.unshift(download);

        // wait 500ms after download starts to get the icon
        Promise.delay(500).then(() => {
          // Avoid a case where fetching icons with no filename throws an error
          if (download.filename) {
            return chrome.downloads.getFileIconAsync(download.id, (dataUrl) => {
              for (let i = 0; i < this.downloads.length; i += 1) {
                if (this.downloads[i].id === download.id) {
                  this.downloads[i].icon = dataUrl;
                  this.downloads = this.downloads.slice(0);
                  break;
                }
              }
            });
          }
          throw new Error('No filename');
        });
      });
    },
  },
  mounted() {
    this.getDownloads();
  },
};
