<template>
  <v-app :dark="dark">
    <router-view name="header" keep-alive/>
    <transition name="fade-transition">
      <router-view keep-alive/>
    </transition>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  computed: {
    dark() {
      return this.$utils.isDark(this.$store.state.settings.dark);
    },
    primary() {
      return this.$store.state.settings.theme.primary;
    },
    secondary() {
      return this.$store.state.settings.theme.secondary;
    },
  },
  watch: {
    primary(val, old) {
      if (val !== old) {
        this.$vuetify.theme.primary = val;
        this.$vuetify.theme.secondary = this.secondary;
      }
    },
  },
  mounted() {
    if (this.primary !== '#607D8B') {
      this.$vuetify.theme.primary = this.primary;
      this.$vuetify.theme.secondary = this.secondary;
    }
  },
};
</script>
