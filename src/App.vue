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
    dark() {
      return this.$utils.isDark(this.$store.state.settings.dark);
    },
  },
};
</script>
