<template>
  <div id="rss">
    <v-list three-line>
      <template v-for="item in sortedFeeds">
        <v-list-tile :key="item.title" :href="item.link">
          <v-list-tile-content :title="item.title">
            <v-list-tile-sub-title class="text--primary">{{ item.title }}</v-list-tile-sub-title>
            <v-list-tile-title class="date text--secondary">{{item.pubDate}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
      <div class="padding" v-if="!items.length">
        <v-progress-linear v-if="loading" indeterminate></v-progress-linear>
        <div v-else class="text-xs-center">
          <i class="material-icons md-48">rss_feed</i>
          <h2 class="subheading">Empty feeds</h2>
        </div>
      </div>
    </v-list>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
