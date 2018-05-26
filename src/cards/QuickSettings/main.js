import VCheckbox from 'vuetify/es5/components/VCheckbox';
import Toast from '@/components/Toast';

export default {
  name: 'QuickSettings',
  title: 'Quick Settings',
  components: {
    VCheckbox,
  },
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
