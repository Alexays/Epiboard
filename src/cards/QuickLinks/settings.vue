<template>
  <v-card-text id="quick-links">
    <h4 v-t="'QuickLinks.settings.grid'" class="subtitle-1"/>
    <v-switch
      :label="$tc('settings.onOff', settings.grid)"
      v-model="settings.grid" class="mt-0" hide-details/>
    <template v-if="settings.grid">
      <h4 v-t="'TopSites.settings.grid_size'" class="subtitle-1"/>
      <v-slider
        v-model="settings.size"
        :tick-labels="$options.tickLabels"
        :max="$options.tickLabels.length - 1" tick-size="2" ticks="always"/>
    </template>
    <h4 v-t="'QuickLinks.settings.links'" class="subtitle-1"/>
    <v-list dense>
      <v-list-tile v-for="(link, idx) in settings.links" :key="link">
        <v-list-tile-content>
          <v-list-tile-title>{{ link }}</v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon @click="removeLink(idx)">mdi-close</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
    <v-layout align-center>
      <v-text-field v-model="newLink" label="e.g. https://exemple.com"/>
      <v-btn v-t="'add'" text @click="addLink(newLink)"/>
    </v-layout>
  </v-card-text>
</template>
<script src="./settings.js"></script>
