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
      this.$store.commit('SET_SETTINGS', {
        key: this.id,
        settings: this.settings.map(f => pick(f, ['value', 'name'])).map(f => ({
          [f.name]: f.value,
        })).reduce((a, x) => Object.assign(a, x)),
      });
    },
  },
  mounted() {},
};
