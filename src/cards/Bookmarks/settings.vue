<template>
  <v-card-text>
    <v-text-field
      v-model.number="settings.maxRecents"
      :label="$t('Bookmarks.settings.maxRecents')" name="maxRecents" mask="#"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
