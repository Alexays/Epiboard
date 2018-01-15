export default {
  name: 'Quick Settings',
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
        if (this.types[keys[i]] !== false)
            return false;
      }
      return true;
    },
    clear() {
      this.loading = true;
      chrome.browsingData.remove({ since: 0 }, this.types, () => {
        this.loading = false;
      });
    },
  },
  mounted() {
  },
};
