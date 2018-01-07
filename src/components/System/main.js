export default {
  name: 'System',
  props: ['settings'],
  components: {},
  data() {
    return {
      cpu: {},
    };
  },
  methods: {
    getCpu() {
      chrome.system.cpu.getInfo((cpu) => {
        this.cpu = cpu;
      });
    },
  },
  mounted() {
    this.getCpu();
  },
};

