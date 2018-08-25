<template>
  <v-app :dark="dark" :style="{ 'font-family': systemFont }">
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
      if (this.$store.state.settings.theme.customFont) {
        return this.$store.state.settings.theme.font;
      }
      return null;
    },
    dark() {
      return this.$utils.isDark(this.$store.state.settings.dark);
    },
    primary() {
      return this.$store.state.settings.theme.primary;
    },
    custom_css_url(){
      console.log(this.$store.state.settings.custom_css_url)
      return this.$store.state.settings.custom_css_url;
    }
  },
  watch: {
    custom_css_url(newVal, oldVal){
      if (newVal === oldVal || oldVal === undefined) return;
      const url = newVal;
      console.log(url);
      const tag = document.createElement('link');
      tag.setAttribute('rel', 'stylesheet');
      tag.setAttribute('type', 'text/css');
      tag.setAttribute('href', url);
      tag.setAttribute('id', 'custom_css');
      document.head.appendChild(tag);
    }
  },
};
</script>
