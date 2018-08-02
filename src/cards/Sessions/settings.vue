<template>
  <v-card-text>
    <v-text-field
      v-model.number="settings.maxRecentlyClosed"
      :label="$t('Sessions.settings.maxRecents')" mask="#"/>
    <v-text-field
      v-model.number="settings.maxDeviceTabs"
      :label="$t('Sessions.settings.maxSessions')" mask="#"/>
    <v-text-field
      v-model.number="settings.maxDevices"
      :label="$t('Sessions.settings.maxDevices')" mask="#"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
