<template>
  <div id="app">
    <v-app :dark="dark">
      <router-view name="header" keep-alive></router-view>
      <transition name="fade">
        <router-view keep-alive></router-view>
      </transition>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'app',
  computed: {
    enabled() {
      return this.$store.state.settings.dark;
    },
  },
  watch: {
    enabled() {
      this.dark = this.getDark();
    },
  },
  data() {
    return {
      dark: false,
    };
  },
  methods: {
    getDark() {
      const tmp = JSON.parse(localStorage.getItem('dark') || '{}');
      if (tmp.enabled) {
        if (tmp.auto) {
          const from = (tmp.from || '22:00').split(':').map(Number);
          const to = (tmp.to || '9:00').split(':').map(Number);
          const date = new Date();
          const fromDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            from[0],
            from[1],
            0,
          );
          const toDate = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            to[0],
            to[1],
            0,
          );
          return (fromDate > toDate && date > toDate && fromDate < date) || (date > fromDate && date < toDate);
        }
        return true;
      }
      return false;
    },
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" src="./style.scss"></style>
