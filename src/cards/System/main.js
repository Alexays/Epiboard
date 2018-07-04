// @vue/component
export default {
  name: 'System',
  data() {
    return {
      cpu: null,
      memory: null,
      connection: null,
      storage: [],
      developper: false,
    };
  },
  computed: {
    memoryLoad() {
      const total = this.memory.capacity;
      const progress = total - this.memory.availableCapacity;
      if (this.memory.prev) {
        const prev = this.memory.prev.capacity - this.memory.prev.availableCapacity;
        const prevTotal = this.memory.prev.capacity;
        return Math.floor(((progress - prev) / (total - prevTotal)) * 100);
      }
      return Math.floor((progress / total) * 100);
    },
    coresLoad() {
      const cores = (this.cpu.processors || []).map(f => ({
        progress: f.usage.kernel + f.usage.user,
        total: f.usage.total,
      }));
      if (this.cpu.prev) {
        const prev = this.cpu.prev.processors.map(f => ({
          progress: f.usage.kernel + f.usage.user,
          total: f.usage.total,
        }));
        const res = [];
        for (let i = 0; i < cores.length; i += 1) {
          const progress = cores[i].progress - prev[i].progress;
          res.push(Math.floor((progress / (cores[i].total - prev[i].total)) * 100));
        }
        return res;
      }
      return cores.map(f => Math.floor((f.progress / f.total) * 100));
    },
  },
  mounted() {
    return Promise.all([
      this.getCpu(),
      this.getMemory(),
      this.getStorage()
        .then(this.getDevelopper)
        .then((storage) => {
          this.storage = storage;
        }),
    ]).then(() => {
      if (navigator.connection) {
        this.getConnection();
        navigator.connection.onchange = this.getConnection;
      }
      browser.system.storage.onAttached.addListener(this.addStorage);
      browser.system.storage.onDetached.addListener(this.removeStorage);
      setInterval(this.getCpu, 3000);
      setInterval(this.getMemory, 10000);
    })
      .then(() => this.$emit('init'))
      .catch(err => this.$emit('init', err));
  },
  methods: {
    getConnection() {
      this.connection = navigator.connection;
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
          return resolve(storage.filter(f => f.capacity > 0)
            .map((f) => {
              f.name = f.name.replace(/[^ -~]+/g, '');
              return f;
            }));
        });
      });
    },
  },
};
