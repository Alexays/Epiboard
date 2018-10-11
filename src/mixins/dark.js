export default {
  computed: {
    isDark() {
      const { dark } = this.$store.state.settings;
      if (window.__PRERENDER_INJECTED || !dark || !dark.enabled) return false;
      if (!dark.auto) return true;
      const from = (dark.from || '22:00').split(':').map(Number);
      const to = (dark.to || '9:00').split(':').map(Number);
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const fromDate = new Date(year, month, day, from[0], from[1]).getTime();
      const toDate = new Date(year, month, day, to[0], to[1]).getTime();
      const time = date.getTime();
      if (fromDate > toDate) {
        return (!(time > toDate && time < fromDate));
      }
      return (time > fromDate && time < toDate);
    },
  },
};
