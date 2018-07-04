import VTextField from 'vuetify/es5/components/VTextField';

// @vue/component
export default {
  name: 'TopSites',
  components: {
    VTextField,
  },
  data() {
    return {
      maxSites: 5,
    };
  },
};
