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
    light() {
      return this.$store.state.settings.theme.light;
    },
    primary() {
      return this.$store.state.settings.theme.primary;
    },
    secondary() {
      return this.$store.state.settings.theme.secondary;
    },
  },
  watch: {
    primary(hex) {
      if (hex && hex.toUpperCase() !== this.$vuetify.theme.primary) {
        this.$vuetify.theme.primary = hex;
        this.$vuetify.theme.secondary = this.secondary;
        this.$vuetify.theme.foreground = this.light ? '#000000' : '#ffffff';
      }
    },
  },
};
</script>
