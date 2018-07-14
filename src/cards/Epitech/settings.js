import VSwitch from 'vuetify/es5/components/VSwitch';

// @vue/component
export default {
  name: 'Epitech',
  components: {
    VSwitch,
  },
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
};
