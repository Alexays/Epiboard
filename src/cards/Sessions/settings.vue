<template>
  <v-card-text>
    <h4 class="headline">Max recently closed</h4>
    <v-text-field name="maxRecentlyClosed" mask="#" label="Max recently closed number" v-model.number="maxRecentlyClosed"></v-text-field>
    <h4 class="headline">Max sessions</h4>
    <v-text-field name="maxSessions" mask="#" label="Max sessions number" v-model.number="maxDeviceTabs"></v-text-field>
    <h4 class="headline">Max devices</h4>
    <v-text-field name="maxDevices" mask="#" label="Max devices number" v-model.number="maxDevices"></v-text-field>
  </v-card-text>
</template>
<script src="./settings.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
