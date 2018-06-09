<template>
  <div class="blue-grey" id="changelog">
    <!-- v-html is safe here, is just markdown with no html parsing -->
    <div v-html="body" class="markdown" v-if="body"></div>
    <div v-else class="text-xs-center padding">
      <i class="material-icons md-48">note_add</i>
      <h2 class="subheading">No changelog, that's weird.
        <br/>Maybe it's just loading</h2>
    </div>
    <p class="previous">
      Missed an update?
      <a href="https://github.com/Alexays/Epiboard/releases" target="_blank">Look at the previous changelogs</a>
    </p>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
