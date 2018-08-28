<template>
  <v-card-text id="apps">
    <div class="app-list">
      <li v-for="app in apps" :key="app.name" class="app">
        <div :title="app.name" @click="launch(app)">
          <i :style="{ 'background-image': `url(${app.icon})` }"/>
        </div>
      </li>
    </div>
    <div v-if="!apps.length" class="text-xs-center">
      <v-icon x-large="">apps</v-icon>
      <h2 v-t="'Apps.empty'" class="subheading"/>
    </div>
  </v-card-text>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
