<template>
  <v-card-text id="quick-links">
    <component v-if="settings.links.length" :is="cmp" :data="links" :size="size - 7"/>
    <div v-else class="text-center">
      <v-icon x-large>mdi-link</v-icon>
      <h2 v-t="'QuickLinks.empty'" class="subtitle-1"/>
    </div>
  </v-card-text>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
