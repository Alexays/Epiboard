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
    enabled: {
      handler(val) {
        this.dark = this.isDark(val);
      },
      deep: true,
    },
  },
  data() {
    return {
      dark: false,
    };
  },
};
</script>
<style lang="scss" rel="stylesheet/scss" src="./style.scss"></style>
