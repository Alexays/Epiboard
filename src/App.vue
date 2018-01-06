<template>
  <div id="app">
    <router-view name="header"/>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="scss" rel='stylesheet/scss' src="./style.scss"></style>
