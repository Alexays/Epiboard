// @vue/component
export default {
  name: 'Weather',
  data() {
    return {
      settings: {},
      allUnits: [
        { text: 'Metric', value: 'metric' },
        { text: 'Imperial', value: 'imperial' },
        { text: 'Kelvin', value: 'kelvin' },
      ],
    };
  },
};
