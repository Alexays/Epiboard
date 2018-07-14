import VCheckbox from 'vuetify/es5/components/VCheckbox';
import VSwitch from 'vuetify/es5/components/VSwitch';
import VSelect from 'vuetify/es5/components/VSelect';
import VTextField from 'vuetify/es5/components/VTextField';

// @vue/component
export default {
  name: 'Weather',
  components: {
    VCheckbox,
    VSwitch,
    VSelect,
    VTextField,
  },
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      allUnits: [
        { text: 'Metric', value: 'metric' },
        { text: 'Imperial', value: 'imperial' },
        { text: 'Kelvin', value: 'kelvin' },
      ],
    };
  },
};
