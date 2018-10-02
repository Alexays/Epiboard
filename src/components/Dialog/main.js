// @vue/component
export default {
  data() {
    return {
      active: false,
      title: '',
      text: '',
      ok: 'Ok',
      cancel: 'Cancel',
      resolve: null,
    };
  },
  methods: {
    show(options = {}) {
      return new Promise((resolve) => {
        if (this.active) {
          this.close();
          this.$nextTick(() => this.show(options));
          return;
        }
        this.resolve = resolve;
        const keys = Object.keys(options);
        for (let i = 0; i < keys.length; i += 1) {
          this[keys[i]] = options[keys[i]];
        }
        this.active = true;
      });
    },
    valid() {
      this.active = false;
      this.resolve(true);
    },
    close() {
      this.active = false;
      this.resolve(false);
    },
    dismiss() {
      if (this.dismissible) {
        this.active = false;
      }
    },
  },
};
