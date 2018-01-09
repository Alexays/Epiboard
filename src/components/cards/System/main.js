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
    getInfos() {
      chrome.system.cpu.getInfo((cpu) => {
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

