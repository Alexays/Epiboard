import utils from '@/mixins/utils';

// @vue/component
export default {
  name: 'System',
  mixins: [utils],
  data() {
    return {
      cpu: null,
      memory: null,
      connection: null,
      storage: [],
    };
  },
  created() {
    return Promise.all([
      this.getCpu(),
      this.getMemory(),
      this.getStorage(),
    ]).then(() => {
      if (navigator.connection) {
        this.getConnection();
        navigator.connection.onchange = this.getConnection;
      }
      browser.system.storage.onAttached.addListener(this.addStorage);
      browser.system.storage.onDetached.addListener(this.removeStorage);
      setInterval(this.getCpu, 3000);
      setInterval(this.getMemory, 20000);
    })
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
          const { loads } = this.cpu || {};
          this.cpu = cpu;
          this.$set(this.cpu, 'loads', this.cpu.processors.map((core, idx) => {
            const { total, kernel, user } = core.usage;
            const progress = kernel + user;
            const newLoad = loads && loads[idx]
              ? (progress - loads[idx].progress) / (total - loads[idx].total) : progress / total;
            return { value: Math.floor(newLoad * 100), progress, total };
          }));
          return resolve();
        });
      });
    },
    getMemory() {
      return new Promise((resolve, reject) => {
        browser.system.memory.getInfo((memory) => {
          if (browser.runtime.lastError) return reject(browser.runtime.lastError);
          this.memory = memory;
          const { capacity } = memory;
          const progress = capacity - memory.availableCapacity;
          this.$set(this.memory, 'load', { value: Math.floor((progress / capacity) * 100), progress });
          return resolve();
        });
      });
    },
    addStorage(f) {
      if (f.capacity <= 0) return;
      f.name = f.name.replace(/[^ -~]+/g, '');
      this.storage.push(f);
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
    getStorage() {
      return new Promise((resolve, reject) => {
        browser.system.storage.getInfo((storage) => {
          if (browser.runtime.lastError) return reject(browser.runtime.lastError);
          return resolve(Promise.all(storage
            .filter(f => f.capacity > 0)
            .map((f) => {
              f.name = f.name.replace(/[^ -~]+/g, '');
              if (!browser.system.storage.getAvailableCapacity) return f;
              return this.getAvailableCapacity(f);
            })));
        });
      }).then((storage) => {
        this.storage = storage;
      });
    },
  },
};
