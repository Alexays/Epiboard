import Toast from '@/components/Toast';

// @vue/component
export default {
  name: 'QuickSettings',
  data() {
    return {
      loading: false,
      types: {
        cache: false,
        cookies: false,
        history: false,
        localStorage: false,
      },
    };
  },
  computed: {
    isFalse() {
      const keys = Object.keys(this.types);
      for (let i = 0; i < keys.length; i += 1) {
        if (this.types[keys[i]] !== false) return false;
      }
      return true;
    },
  },
  methods: {
    clear() {
      this.loading = true;
      browser.browsingData.remove({}, Object.assign({}, this.types)).then(() => {
        Toast.show({ title: 'Cleared !' });
        this.types = {
          cache: false,
          cookies: false,
          history: false,
          localStorage: false,
        };
        this.loading = false;
      });
    },
  },
};
