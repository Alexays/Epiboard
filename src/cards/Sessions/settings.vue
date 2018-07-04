<template>
  <v-card-text>
    <v-text-field
      v-model.number="maxRecentlyClosed"
      name="maxRecentlyClosed" mask="#" label="Max recently closed"/>
    <v-text-field
      v-model.number="maxDeviceTabs" name="maxSessions" mask="#" label="Max sessions"/>
    <v-text-field
      v-model.number="maxDevices" name="maxDevices" mask="#" label="Max devices"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
