<template>
  <v-card-text id="top-sites">
    <list v-if="topSites.length" :data="topSites" icon/>
    <div v-else class="text-xs-center">
      <v-icon x-large>find_in_page</v-icon>
      <h2 v-t="'TopSites.empty'" class="subheading"/>
    </div>
  </v-card-text>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
