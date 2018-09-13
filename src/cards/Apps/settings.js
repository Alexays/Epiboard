import { VSlider } from 'vuetify';

// @vue/component
export default {
  name: 'Apps',
  components: {
    VSlider,
  },
  tickLabels: [32, 64, 96, 128],
  data() {
    return {
      settings: {},
    };
  },
};
