<template>
  <div id="rss">
    <v-list two-line>
      <template v-for="item in items">
        <v-list-tile :key="item.title" :href="item.link">
          <v-list-tile-content :title="item.title">
            <v-list-tile-title v-html="item.title"></v-list-tile-title>
            <v-list-tile-sub-title>{{ item.date }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
    </v-list>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
