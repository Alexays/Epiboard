<template>
  <v-card-text>
    <h4 v-t="'RSS.settings.feeds'" class="subheading"/>
    <v-list dense>
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
      <v-text-field v-model="newFeed" :label="$t('RSS.settings.label')"/>
      <v-btn v-t="'add'" flat @click="addFeed(newFeed)"/>
    </v-layout>
    <v-text-field
      v-model="settings.apiKey" :label="$t('settings.apiKey', { name: 'RSS2Json'})"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
