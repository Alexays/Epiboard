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
    getCpu() {
      return new Promise((resolve, reject) => {
        chrome.system.cpu.getInfo((cpu) => {
          if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
          this.cpu = Object.assign({}, cpu, {
            prev: this.cpu,
          });
          return resolve();
        });
      });
    },
    getMemory() {
      return new Promise((resolve, reject) => {
        chrome.system.memory.getInfo((memory) => {
          if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
          this.memory = Object.assign({}, memory, {
            prev: this.memory,
          });
          return resolve();
        });
      });
    },
    getStorage() {
      return new Promise((resolve, reject) => {
        chrome.system.storage.getInfo((storage) => {
          if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
          if (!chrome.system.storage.getAvailableCapacity) {
            this.storage = storage;
            this.storage.dev = false;
            return resolve();
          }
          const disk = storage.slice(0);
          for (let i = 0; i < storage.length; i += 1) {
            chrome.system.storage.getAvailableCapacity(storage[i].id, (res) => {
              if (chrome.runtime.lastError) return;
              disk[i].available = res.availableCapacity;
              disk[i].percent = 100 - ((disk[i].available / disk[i].capacity) * 100);
              disk[i].used = disk[i].capacity - disk[i].available;
              if (i === (storage.length - 1)) {
                this.storage = disk;
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
    Promise.all([this.getCpu(), this.getMemory(), this.getStorage()])
      .finally(() => {
        setInterval(this.getCpu, 3000);
        setInterval(this.getMemory, 10000);
        this.$emit('init');
      });
  },
};
