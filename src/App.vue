<template>
  <div id="app">
    <v-app>
      <router-view name="header" />
      <transition name="fade">
        <router-view/>
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
