import VCheckbox from 'vuetify/es5/components/VCheckbox';
import VSwitch from 'vuetify/es5/components/VSwitch';
import VSelect from 'vuetify/es5/components/VSelect';

// @vue/component
export default {
  name: 'Weather',
  components: {
    VCheckbox,
    VSwitch,
    VSelect,
  },
  data() {
    return {
      auto: true,
      city: '',
      forecast: true,
      appId: '0c9042777e3128fab0244da248184801',
      units: 'metric',
    };
  },
  computed: {
    allUnits() {
      return [
        { text: 'Metric', value: 'metric' },
        { text: 'Imperial', value: 'imperial' },
        { text: 'Kelvin', value: 'kelvin' },
      ];
    },
  },
};
