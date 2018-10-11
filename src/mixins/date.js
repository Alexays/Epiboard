export default {
  computed: {
    timeOptions() {
      const options = { hour: '2-digit', minute: '2-digit' };
      if (this.$store.state.settings.hour24) {
        options.hour12 = false;
      }
      return options;
    },
  },
};
