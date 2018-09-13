import { VTextField, VSwitch, VSlider } from 'vuetify';

// @vue/component
export default {
  name: 'TopSites',
  components: {
    VTextField,
    VSwitch,
    VSlider,
  },
  tickLabels: [32, 64, 96, 128],
  data() {
    return {
      settings: {},
    };
  },
};
