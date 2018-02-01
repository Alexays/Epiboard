import pick from 'lodash/pick';

export default {
  name: 'Config',
  props: {
    id: {
      type: String,
      required: true,
    },
    settings: {
      type: Array,
      required: true,
    },
  },
  methods: {
    save() {
      if (this.id === 'global') {
        this.$store.commit('update', this.settings.map(f => pick(f, ['value', 'name'])).map(f => ({
          [f.name]: f.value,
        })).reduce((a, x) => Object.assign(a, x)));
      }
      chrome.storage.sync.set({
        [`settings_${this.id}`]: this.settings.map(f => pick(f, ['value', 'name'])),
      });
    },
  },
  mounted() {},
};
