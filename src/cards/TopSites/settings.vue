<template>
  <v-card-text>
    <v-text-field
      v-model.number="settings.maxSites" :label="$t('TopSites.settings.maxTopSites')" mask="#"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
