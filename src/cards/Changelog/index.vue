<template>
  <div id="changelog" class="primary foreground--text">
    <!-- v-html is safe here, is just markdown without html parsing -->
    <div v-if="body" class="markdown" v-html="body"/>
    <v-card-text v-else class="text-xs-center">
      <v-progress-linear v-if="loading" color="foreground" indeterminate/>
      <template v-else>
        <v-icon x-large="">note_add</v-icon>
        <h2 v-t="'Changelog.empty'" class="subheading"/>
      </template>
    </v-card-text>
    <p class="previous caption">
      <span v-t="'Changelog.missed'"/>&nbsp;
      <a
        v-t="'Changelog.previous'"
        href="https://github.com/Alexays/Epiboard/releases"
        target="_blank" rel="noopener" class="foreground--text"/>
    </p>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
