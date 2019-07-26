<template>
  <v-card-text id="apps">
    <grid-list v-if="apps.length" :data="apps" :size="size - 7" @clicked="launch($event)"/>
    <div v-else class="text-center">
      <v-icon x-large>mdi-apps</v-icon>
      <h2 v-t="'Apps.empty'" class="subtitle-1"/>
    </div>
  </v-card-text>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
