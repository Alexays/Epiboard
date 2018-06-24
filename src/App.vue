<template>
  <div id="app">
    <v-app :dark="dark">
      <router-view name="header" keep-alive/>
      <transition name="fade-transition">
        <router-view keep-alive/>
      </transition>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    dark() {
      return this.$utils.isDark(this.$store.state.settings.dark);
    },
  },
};
</script>
