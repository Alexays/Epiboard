import VTextField from 'vuetify/es5/components/VTextField';

// @vue/component
export default {
  name: 'TopSites',
  components: {
    VTextField,
  },
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
};
