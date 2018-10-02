// @vue/component
export default {
  data() {
    return {
      active: false,
      title: '',
      desc: null,
      icon: '',
      color: 'info',
      timeout: 3000,
      dismissible: true,
    };
  },
  methods: {
    show(options = {}) {
      if (this.active) {
        this.close();
        this.$nextTick(() => this.show(options));
        return;
      }
      const keys = Object.keys(options);
      for (let i = 0; i < keys.length; i += 1) {
        this[keys[i]] = options[keys[i]];
      }
      this.active = true;
    },
    close() {
      this.active = false;
    },
    dismiss() {
      if (this.dismissible) {
        this.active = false;
      }
    },
  },
};
