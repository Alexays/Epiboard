import Toast from '@/components/Toast';

export default {
  name: 'QuickSettings',
  title: 'Quick Settings',
  props: ['settings'],
  components: {},
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
  methods: {
    isFalse() {
      const keys = Object.keys(this.types);
      for (let i = 0; i < keys.length; i += 1) {
        if (this.types[keys[i]] !== false) return false;
      }
      return true;
    },
    clear() {
      this.loading = true;
      browser.browsingData.remove({}, Object.assign({}, this.types), () => {
        Toast.show({ text: 'Cleared !' });
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
  mounted() {
    this.$emit('init');
  },
};
