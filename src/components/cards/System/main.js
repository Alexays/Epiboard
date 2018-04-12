export default {
  name: 'System',
  props: ['settings'],
  components: {},
  data() {
    return {
      cpu: {},
      memory: {},
      storage: {},
    };
  },
  methods: {
    getLoad(current, prev) {
      if (prev) {
        return Math.floor(((current.progress - prev.progress) /
          (current.total - prev.total)) * 100);
      }
      return Math.floor((current.progress / current.total) * 100);
    },
    getInfo() {
      return browser.runtime.getPlatformInfo().then((data) => {
        this.cpu = {
          modelName: data.os,
          archName: data.arch,
          numOfProcessors: window.navigator.hardwareConcurrency,
        };
        this.memory = null;
        this.storage = null;
      });
    },
    getCpu() {
      return new Promise((resolve, reject) => {
        browser.system.cpu.getInfo((cpu) => {
          if (browser.runtime.lastError) return reject(browser.runtime.lastError);
          this.cpu = Object.assign({}, cpu, {
            prev: this.cpu,
          });
          return resolve(browser.runtime.getPlatformInfo());
        });
      }).then((data) => {
        this.$set(this.cpu, 'modelName', `${data.os[0].toUpperCase()}${data.os.slice(1)} - ${this.cpu.modelName}`);
      });
    },
    getMemory() {
      return new Promise((resolve, reject) => {
        browser.system.memory.getInfo((memory) => {
          if (browser.runtime.lastError) return reject(browser.runtime.lastError);
          this.memory = Object.assign({}, memory, {
            prev: this.memory,
          });
          return resolve();
        });
      });
    },
    getStorage() {
      return new Promise((resolve, reject) => {
        browser.system.storage.getInfo((storage) => {
          if (browser.runtime.lastError) return reject(browser.runtime.lastError);
          if (!browser.system.storage.getAvailableCapacity) {
            this.storage = storage.filter(f => f.capacity > 0)
              .map((f) => {
                f.name = f.name.replace(/[^ -~]+/g, '');
                return f;
              });
            this.storage.dev = false;
            return resolve();
          }
          const disk = storage.slice(0);
          for (let i = 0; i < storage.length; i += 1) {
            browser.system.storage.getAvailableCapacity(storage[i].id, (res) => {
              if (browser.runtime.lastError) return;
              disk[i].available = res.availableCapacity;
              disk[i].percent = 100 - ((disk[i].available / disk[i].capacity) * 100);
              disk[i].used = disk[i].capacity - disk[i].available;
              if (i === (storage.length - 1)) {
                this.storage = disk.map((f) => {
                  f.name = f.name.replace(/[^ -~]+/g, '');
                  return f;
                });
                this.storage.dev = true;
              }
            });
          }
          return resolve();
        });
      });
    },
  },
  mounted() {
    // TODO: Firefox doesn't support system
    if (!browser.system) {
      return Promise.all([this.getInfo()])
        .finally(() => {
          this.$emit('init');
        });
    }
    return Promise.all([this.getCpu(), this.getMemory(), this.getStorage()])
      .then(() => {
        setInterval(this.getCpu, 3000);
        setInterval(this.getMemory, 10000);
      })
      .then(() => this.$emit('init'))
      .catch(() => this.$emit('init', false));
  },
};
