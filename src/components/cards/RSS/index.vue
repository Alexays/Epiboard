<template>
  <div id="rss">
    <v-btn class="no-margins" block dark depressed small color="blue-grey" @click.stop="dialog=true">{{ feeds.length }} Feed{{feeds.length === 1 ? '' : 's'}}, You want to add more ?</v-btn>
    <v-list two-line class="rss-feeds">
      <template v-for="item in sortedFeeds">
        <v-list-tile :key="item.title" :href="item.link">
          <v-list-tile-content :title="item.title">
            <v-list-tile-title v-html="item.title"></v-list-tile-title>
            <v-list-tile-sub-title>{{ item.date.toDateString() }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </template>
      <div class="padding" v-if="!items.length">
        <v-progress-linear v-bind:indeterminate="true"></v-progress-linear>
      </div>
    </v-list>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span>Add feed</span>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-tile v-for="(feed, idx) in feeds" :key="feed">
              <v-list-tile-content>
                <v-list-tile-title v-html="feed"></v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-icon @click="removeFeed(idx)">close</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-text-field v-model="newFeed" name="feed" label="https://exemple.com/rss" id="feed"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" flat @click.stop="dialog=false">Close</v-btn>
          <v-btn flat @click="addFeed(newFeed)">Add</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
