<template>
  <v-card-text id="apps">
    <ul class="app-list">
      <li v-for="app in apps" :key="app.name" class="app">
        <div :title="app.name" @click="launch(app)">
          <i :style="{ 'background-image': `url(${app.icon})` }"/>
        </div>
      </li>
    </ul>
    <div v-if="!apps.length" class="text-xs-center">
      <i class="material-icons md-48">apps</i>
      <h2 class="subheading">You have no apps.</h2>
    </div>
  </v-card-text>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
