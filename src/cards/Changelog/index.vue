<template>
  <div id="changelog" class="primary foreground--text">
    <!-- v-html is safe here, is just markdown without html parsing -->
    <div v-if="body" class="markdown" v-html="body"/>
    <v-card-text v-else class="text-center">
      <v-progress-linear v-if="loading" color="foreground" indeterminate/>
      <template v-else>
        <v-icon x-large="">mdi-note-plus</v-icon>
        <h2 v-t="'Changelog.empty'" class="subtitle-1"/>
      </template>
    </v-card-text>
    <span class="previous caption">
      <span v-t="'Changelog.missed'"/>&nbsp;
      <a
        v-t="'Changelog.previous'"
        href="https://github.com/Alexays/Epiboard/releases"
        target="_blank" rel="noopener" class="foreground--text"/>
    </span>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
