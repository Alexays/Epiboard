<template>
  <div id="apps" class="padding">
    <ul class="app-list">
      <li class="app" v-for="app in apps" :key="app">
        <div v-on:click="launch(app)">
          <i v-bind:style="{ 'background-image': 'url('+app.icon+')' }"></i>
        </div>
      </li>
    </ul>
    <div v-if="!apps.length" class="text-xs-center">
      <i class="material-icons md-48">apps</i>
      <h2 class="subheading">You have no apps.</h2>
    </div>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
