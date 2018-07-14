<template>
  <v-card-text>
    <v-text-field
      v-model.number="settings.maxRecentlyClosed"
      name="maxRecentlyClosed" mask="#" label="Max recently closed"/>
    <v-text-field
      v-model.number="settings.maxDeviceTabs" name="maxSessions" mask="#" label="Max sessions"/>
    <v-text-field
      v-model.number="settings.maxDevices" name="maxDevices" mask="#" label="Max devices"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
