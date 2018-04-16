export default {
  name: 'System',
  props: ['settings'],
  components: {},
  data() {
    return {
      cpu: {},
      memory: {},
      storage: [],
      developper: false,
    };
  },
  methods: {
    getLoad(cur, prev) {
      if (prev) {
        return Math.floor(((cur.progress - prev.progress) / (cur.total - prev.total)) * 100);
      }
      return Math.floor((cur.progress / cur.total) * 100);
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
          this.cpu = { ...cpu, ...{ prev: this.cpu } };
          return resolve();
        });
      });
    },
    getMemory() {
      return new Promise((resolve, reject) => {
        browser.system.memory.getInfo((memory) => {
          if (browser.runtime.lastError) return reject(browser.runtime.lastError);
          this.memory = { ...memory, ...{ prev: this.memory } };
          return resolve();
        });
      });
    },
    addStorage(storage) {
      this.storage.push(storage);
    },
    removeStorage(storageId) {
      this.storage = this.storage.filter(f => f.id !== storageId);
    },
    getAvailableCapacity(storage) {
      return new Promise((resolve, reject) => {
        browser.system.storage.getAvailableCapacity(storage.id, (res) => {
          if (browser.runtime.lastError) return reject(browser.runtime.lastError);
          return resolve({
            ...storage,
            ...{
              available: res.availableCapacity,
              percent: 100 - ((res.availableCapacity / storage.capacity) * 100),
              used: storage.capacity - res.availableCapacity,
            },
          });
        });
      });
    },
    getDevelopper(storage) {
      if (!browser.system.storage.getAvailableCapacity) return storage;
      this.developper = true;
      return Promise.all(storage.map(this.getAvailableCapacity));
    },
    getStorage() {
      return new Promise((resolve, reject) => {
        browser.system.storage.getInfo((storage) => {
          if (browser.runtime.lastError) return reject(browser.runtime.lastError);
          this.developper = false;
          return resolve(storage.filter(f => f.capacity > 0)
            .map((f) => {
              f.name = f.name.replace(/[^ -~]+/g, '');
              return f;
            }));
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
    return Promise.all([
      this.getCpu(),
      this.getMemory(),
      this.getStorage()
        .then(this.getDevelopper)
        .then((storage) => {
          this.storage = storage;
        }),
    ]).then(() => {
      browser.system.storage.onAttached.addListener(this.addStorage);
      browser.system.storage.onDetached.addListener(this.removeStorage);
      setInterval(this.getCpu, 3000);
      setInterval(this.getMemory, 10000);
    }).then(() => this.$emit('init'))
      .catch(err => this.$emit('init', err));
  },
};
