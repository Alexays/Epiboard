<template>
  <v-card-text>
    <h4 v-t="'TopSites.settings.grid'" class="subheading"/>
    <v-switch
      :label="$tc('settings.onOff', settings.grid)"
      v-model="settings.grid" class="mt-0" hide-details/>
    <v-text-field
      v-model.number="settings.maxSites" :label="$t('TopSites.settings.maxTopSites')" mask="#"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
