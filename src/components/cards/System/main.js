export default {
  name: 'System',
  props: ['settings'],
  components: {},
  data() {
    return {
      cpu: {},
      cpuInterval: {},
      memory: {},
      storage: {},
    };
  },
  methods: {
    getCpuLoad(coreUsage, key) {
      if (this.cpu.prev && this.cpu.prev.processors) {
        const prevCore = this.cpu.prev.processors[key].usage;
        return Math.floor((((coreUsage.kernel + coreUsage.user)
          - prevCore.kernel - prevCore.user) /
          (coreUsage.total - prevCore.total)) * 100);
      }
      return Math.floor(((coreUsage.kernel + coreUsage.user) / coreUsage.total) * 100);
    },
    getCpu() {
      chrome.system.cpu.getInfo((cpu) => {
        if (chrome.runtime.lastError) return;
        this.cpu = Object.assign({}, cpu, { prev: this.cpu });
      });
    },
    getMemory() {
      chrome.system.memory.getInfo((memory) => {
        if (chrome.runtime.lastError) return;
        this.memory = memory;
      });
    },
    getStorage() {
      chrome.system.storage.getInfo((storage) => {
        if (chrome.runtime.lastError) return;
        if (!chrome.system.storage.getAvailableCapacity) {
          this.storage = storage;
          this.storage.dev = false;
          return;
        }
        const disk = storage.slice(0);
        for (let i = 0; i < storage.length; i += 1) {
          chrome.system.storage.getAvailableCapacity(storage[i].id, (res) => {
            if (chrome.runtime.lastError) return;
            disk[i].available = res.availableCapacity;
            disk[i].percent = (disk[i].available / disk[i].capacity) * 100;
            disk[i].used = disk[i].capacity - disk[i].available;
            if (i === (storage.length - 1)) {
              this.storage = disk;
              this.storage.dev = true;
            }
          });
        }
      });
    },
  },
  beforeDestroy() {
    clearInterval(this.cpuInterval);
  },
  mounted() {
    this.getCpu();
    this.getMemory();
    this.getStorage();
    this.cpuInterval = setInterval(() => {
      this.getCpu();
    }, 3000);
    setInterval(() => {
      this.getMemory();
    }, 5000);
  },
};

