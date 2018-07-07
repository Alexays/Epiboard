import VTextField from 'vuetify/es5/components/VTextField';

// @vue/component
export default {
  name: 'LastFm',
  components: {
    VTextField,
  },
  data() {
    return {
      apiKey: '10ca053a6585f6de17bde3736500de8b',
      user: '',
    };
  },
};
