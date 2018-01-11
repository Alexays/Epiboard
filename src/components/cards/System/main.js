export default {
  name: 'System',
  props: ['settings'],
  components: {},
  data() {
    return {
      cpu: {},
      prevCpu: {},
      memory: {},
      storage: {},
    };
  },
  methods: {
    getCpuLoad(coreUsage, key) {
      if (this.prevCpu && this.prevCpu.processors) {
        const prevCore = this.prevCpu.processors[key].usage;
        return Math.floor((((coreUsage.kernel + coreUsage.user)
          - prevCore.kernel - prevCore.user) /
          (coreUsage.total - prevCore.total)) * 100);
      }
      return Math.floor(((coreUsage.kernel + coreUsage.user) / coreUsage.total) * 100);
    },
    getCpu() {
      chrome.system.cpu.getInfo((cpu) => {
        if (chrome.runtime.lastError) return;
        this.prevCpu = this.cpu;
        this.cpu = cpu;
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
  mounted() {
    this.getCpu();
    this.getMemory();
    this.getStorage();
    setInterval(() => {
      this.getCpu();
    }, 3000);
    setInterval(() => {
      this.getMemory();
    }, 5000);
  },
};

