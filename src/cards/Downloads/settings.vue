<template>
  <v-card-text>
    <v-text-field
      v-model.number="settings.limitDownloads" :label="$t('Downloads.settings.max')" mask="#"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
