<template>
  <v-card-text id="quick-links">
    <h4 v-t="'QuickLinks.settings.links'" class="subheading"/>
    <v-list dense>
      <v-list-tile v-for="(link, idx) in settings.links" :key="link">
        <v-list-tile-content>
          <v-list-tile-title>{{ link }}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon @click="removeLink(idx)">close</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <v-layout align-center>
      <v-text-field v-model="newLink" label="e.g. https://exemple.com"/>
      <v-btn v-t="'add'" flat @click="addLink(newLink)"/>
    </v-layout>
  </v-card-text>
</template>
<script src="./settings.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
