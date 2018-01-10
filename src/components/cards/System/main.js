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
    getCpuLoad(coreKey) {
      const core = this.cpu.processors[coreKey].usage;
      if (this.prevCpu && this.prevCpu.processors) {
        const prevCore = this.prevCpu.processors[coreKey].usage;
        return Math.floor((((core.kernel + core.user)
          - prevCore.kernel - prevCore.user) /
          (core.total - prevCore.total)) * 100);
      }
      return Math.floor(((core.kernel + core.user) / core.total) * 100);
    },
    getInfos() {
      chrome.system.cpu.getInfo((cpu) => {
        this.prevCpu = this.cpu;
        this.cpu = cpu;
      });
      chrome.system.memory.getInfo((memory) => {
        this.memory = memory;
      });
      chrome.system.storage.getInfo((storage) => {
        if (!chrome.system.storage.getAvailableCapacity) {
          this.storage = storage;
          this.storage.dev = false;
          return;
        }
        const disk = storage.slice(0);
        for (let i = 0; i < storage.length; i += 1) {
          chrome.system.storage.getAvailableCapacity(storage[i].id, (res) => {
            if (!res) return;
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
    this.getInfos();
    setInterval(() => {
      this.getInfos();
    }, 3000);
  },
};

