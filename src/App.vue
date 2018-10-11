<template>
  <v-app :dark="isDark" :style="{ 'font-family': customFont }">
    <router-view name="header" keep-alive/>
    <transition name="fade-transition" mode="out-in">
      <router-view keep-alive/>
    </transition>
  </v-app>
</template>

<script>
import dark from '@/mixins/dark';

export default {
  name: 'App',
  mixins: [dark],
  computed: {
    customFont() {
      if (this.$store.state.settings.theme.customFont) {
        return this.$store.state.settings.theme.font;
      }
      return null;
    },
    primary() {
      return this.$store.state.settings.theme.primary;
    },
    customCssUrl() {
      return this.$store.state.settings.theme.customCssUrl;
    },
    debug() {
      return this.$store.state.settings.debug;
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
    customCssUrl(val, old) {
      if (val === old) return;
      if (!this.customCssUrl.length) {
        this.unloadCustomCss();
      } else this.loadCustomCss();
    },
    debug(val, old) {
      if (val === old) return;
      if (val && this.customCssUrl.length) this.loadCustomCss();
      else this.unloadCustomCss();
    },
  },
  methods: {
    unloadCustomCss() {
      const el = document.getElementById('custom-css');
      if (el) {
        el.remove();
      }
    },
    loadCustomCss() {
      let el = document.getElementById('custom-css');
      if (!el) {
        el = document.createElement('style');
        el.setAttribute('type', 'text/css');
        el.setAttribute('id', 'custom-css');
        document.head.appendChild(el);
      }
      this.axios.get(this.customCssUrl).then((res) => {
        el.textContent = res.data;
      });
    },
  },
};
</script>
