import VTextField from 'vuetify/es5/components/VTextField';

// @vue/component
export default {
  name: 'Sessions',
  components: {
    VTextField,
  },
  data() {
    return {
      maxRecentlyClosed: 7,
      maxDevices: 9,
      maxDeviceTabs: 7,
    };
  },
};
