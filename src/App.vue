<template>
  <v-app :dark="dark" :class="{ 'system-font': systemFont }">
    <router-view name="header" keep-alive/>
    <transition name="fade-transition" mode="out-in">
      <router-view keep-alive/>
    </transition>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  computed: {
    systemFont() {
      return this.$store.state.settings.theme.systemFont;
    },
    dark() {
      return this.$utils.isDark(this.$store.state.settings.dark);
    },
    primary() {
      return this.$store.state.settings.theme.primary;
    },
  },
  watch: {
    primary(hex) {
      if (hex && hex.toUpperCase() !== this.$vuetify.theme.primary) {
        const { light, secondary } = this.$store.state.settings.theme;
        this.$vuetify.theme.primary = hex;
        this.$vuetify.theme.secondary = secondary;
        this.$vuetify.theme.foreground = light ? '#000000' : '#ffffff';
      }
    },
  },
};
</script>
