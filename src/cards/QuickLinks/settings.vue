<template>
  <v-card-text>
    <h4 class="subheading">{{ $t('QuickLinks.settings.links') }}</h4>
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
      <v-btn flat @click="addLink(newLink)">{{ $t('add') }}</v-btn>
    </v-layout>
  </v-card-text>
</template>
<script src="./settings.js"></script>
