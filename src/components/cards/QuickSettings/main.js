export default {
  name: 'Quick Settings',
  props: ['settings'],
  components: {},
  data() {
    return {
      loading: false,
      type: {
        cache: false,
        cookies: false,
        history: false,
        localStorage: false,
      },
    };
  },
  methods: {
    isFalse() {
      for (var key in this.type)
        if (object.hasOwnProperty(key))
          if (this.type[key] !== false)
            return false;
      return true;
    },
    clear() {
      chrome.browsingData.remove({ since: 0 }, this.type, () => {
        this.loading = false;
      });
    },
  },
  mounted() {
  },
};
