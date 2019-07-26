<template>
  <v-tabs
    id="sessions"
    :dark="!$store.state.settings.theme.light"
    :light="$store.state.settings.theme.light"
    background-color="primary"
    grow
    show-arrows
  >
    <v-tab :href="'#tab-recents'">
      <span v-t="'Sessions.recents'" />
    </v-tab>
    <v-tab v-for="device in devices" :key="device.deviceName">{{ device.deviceName }}</v-tab>
    <v-tabs-items>
      <v-tab-item v-for="(tab, i) in tabs" :key="i">
        <list v-if="tab.length" :data="tab" icon padding />
        <v-card-text v-else class="text-center">
          <v-icon x-large>mdi-book-open-page-variant</v-icon>
          <h2 v-t="'Sessions.empty'" class="subtitle-1" />
        </v-card-text>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
