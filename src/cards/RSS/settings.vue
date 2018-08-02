<template>
  <v-card-text>
    <h4 class="subheading">{{ $t('RSS.settings.feeds') }}</h4>
    <v-list>
      <v-list-tile v-for="(feed, idx) in settings.feeds" :key="feed">
        <v-list-tile-content>
          <v-list-tile-title>{{ feed }}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon @click="removeFeed(idx)">close</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <v-layout align-center>
      <v-text-field v-model="newFeed" label="e.g. https://exemple.com/rss"/>
      <v-btn flat @click="addFeed(newFeed)">{{ $t('RSS.settings.add') }}</v-btn>
    </v-layout>
  </v-card-text>
</template>
<script src="./settings.js"></script>
