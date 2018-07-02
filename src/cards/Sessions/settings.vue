<template>
  <v-card-text>
    <h4 class="headline">Max recently closed</h4>
    <v-text-field
      v-model.number="maxRecentlyClosed"
      name="maxRecentlyClosed" mask="#" label="Max recently closed number"/>
    <h4 class="headline">Max sessions</h4>
    <v-text-field
      v-model.number="maxDeviceTabs" name="maxSessions" mask="#" label="Max sessions number"/>
    <h4 class="headline">Max devices</h4>
    <v-text-field
      v-model.number="maxDevices" name="maxDevices" mask="#" label="Max devices number"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
