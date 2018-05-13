import VCheckbox from 'vuetify/es5/components/VCheckbox';
import VSwitch from 'vuetify/es5/components/VSwitch';

export default {
  name: 'Weather',
  components: {
    VCheckbox,
    VSwitch,
  },
  data() {
    return {
      auto: true,
      city: '',
      forecast: true,
      appId: '0c9042777e3128fab0244da248184801',
    };
  },
  methods: {
  },
  mounted() {
  },
};
