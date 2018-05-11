<template>
  <div id="rss">
    <v-list two-line class="rss-feeds">
      <template v-for="item in sortedFeeds">
        <v-list-tile :key="item.title" :href="item.link">
          <v-list-tile-content :title="item.title">
            <v-list-tile-title v-html="item.title"></v-list-tile-title>
            <v-list-tile-sub-title>{{ item.dateString }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
      <div class="padding" v-if="!items.length">
        <v-progress-linear v-bind:indeterminate="true"></v-progress-linear>
      </div>
    </v-list>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
