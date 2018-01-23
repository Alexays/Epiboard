<template>
  <div id="apps">
    <ul class="app-list">
      <li class="app" v-for="app in apps" :key="app">
        <a href="#" v-on:click="launch(app)">
          <i v-bind:style="{ 'background-image': 'url('+app.icon+')' }"></i>
        </a>
      </li>
    </ul>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
