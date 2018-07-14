<template>
  <v-card-text>
    <v-text-field
      v-model.number="settings.limitDownloads"
      name="limitDownloads" mask="#" label="Max downloads"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
