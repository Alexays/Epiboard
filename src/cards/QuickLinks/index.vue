<template>
  <v-card-text id="quick-links">
    <v-list v-if="settings.links.length" dense>
      <v-list-tile v-for="link in settings.links" :key="link" :href="link">
        <v-list-tile-avatar :size="16">
          <img :src="$utils.getFavicon(link)">
        </v-list-tile-avatar>
        <v-list-tile-content :title="link" class="caption">
          <v-list-tile-sub-title>{{ link }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <div v-else class="text-xs-center">
      <v-icon x-large>find_in_page</v-icon>
      <h2 v-t="'QuickLinks.empty'" class="subheading"/>
    </div>
  </v-card-text>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
