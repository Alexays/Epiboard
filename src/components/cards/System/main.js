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
        return Math.floor(((current.progress - prev.progress)
          / (current.total - prev.total)) * 100);
      }
      return Math.floor((current.progress / current.total) * 100)
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
        this.memory = Object.assign({}, memory, { prev: this.memory });
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
    }, 10000);
  },
};

