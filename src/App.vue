<template>
  <div id="app">
    <v-app>
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
  };

</script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss"></style>
