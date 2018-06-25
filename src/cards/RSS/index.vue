<template>
  <div id="rss">
    <v-list v-if="items.length" three-line>
      <v-list-tile v-for="item in items" :key="item.title" :href="item.link">
        <v-list-tile-content :title="item.title">
          <v-list-tile-sub-title class="text--primary">{{ item.title }}</v-list-tile-sub-title>
          <v-list-tile-title class="date text--secondary">{{ item.pubDate }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-card-text v-else>
      <v-progress-linear v-if="loading" indeterminate/>
      <div v-else class="text-xs-center">
        <v-icon x-large>rss_feed</v-icon>
        <h2 class="subheading">Empty feeds</h2>
      </div>
    </v-card-text>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
