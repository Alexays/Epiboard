import VTextField from 'vuetify/es5/components/VTextField';

// @vue/component
export default {
  name: 'Donwloads',
  components: {
    VTextField,
  },
  data() {
    return {
      limitDownloads: 5,
    };
  },
};
