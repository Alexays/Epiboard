<template>
  <v-card-text id="top-sites">
    <v-list v-if="topSites.length" dense>
      <v-list-tile v-for="item in topSites" :key="item.url" :href="item.url">
        <v-list-tile-avatar :size="16">
          <img v-if="item.icon" :src="item.icon">
          <v-icon v-else>insert_drive_file</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-content :title="item.url" class="caption">
          <v-list-tile-sub-title v-if="item.title && item.title.length">
            {{ item.title }}
          </v-list-tile-sub-title>
          <v-list-tile-sub-title v-else>{{ item.url }}</v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <div v-else class="text-xs-center">
      <v-icon x-large>find_in_page</v-icon>
      <h2 class="subheading">{{ $t('TopSites.empty') }}</h2>
    </div>
  </v-card-text>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
