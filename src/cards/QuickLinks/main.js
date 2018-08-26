import * as VList from 'vuetify/es5/components/VList';

// @vue/component
export default {
  name: 'QuickSettings',
  components: {
    ...VList,
  },
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  created() {
    this.$emit('init');
  },
};
