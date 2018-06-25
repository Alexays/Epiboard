<template>
  <div id="changelog" class="blue-grey">
    <!-- v-html is safe here, is just markdown without html parsing -->
    <div v-if="body" class="markdown" v-html="body"/>
    <v-card-text v-else class="text-xs-center">
      <v-icon x-large="">note_add</v-icon>
      <h2 class="subheading">
        No changelog, that's weird.
        <p>Maybe it's just loading</p>
      </h2>
    </v-card-text>
    <p class="previous">
      Missed an update?
      <a href="https://github.com/Alexays/Epiboard/releases" target="_blank">Look at the previous changelogs</a>
    </p>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
