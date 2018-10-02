<template>
  <div id="changelog" class="primary foreground--text">
    <!-- v-html is safe here, is just markdown without html parsing -->
    <div v-if="body" class="markdown" v-html="body"/>
    <v-progress-linear v-else-if="loading" indeterminate/>
    <v-card-text v-else class="text-xs-center">
      <v-icon x-large="">note_add</v-icon>
      <h2 class="subheading" v-t="Changelog.empty"/>
    </v-card-text>
    <p class="previous caption">
      <span v-t="Changelog.missed">
      <a
        v-t="Changelog.previous"
        href="https://github.com/Alexays/Epiboard/releases"
        target="_blank" class="foreground--text/">
    </p>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
