<template>
  <v-tabs
    id="sessions"
    :dark="!$store.state.settings.theme.light"
    :light="$store.state.settings.theme.light"
    slider-color="foreground" color="primary" grow show-arrows>
    <v-tab><span v-t="'Sessions.recents'"/></v-tab>
    <v-tab v-for="device in devices" :key="device.deviceName">{{ device.deviceName }}</v-tab>
    <v-tabs-items>
      <v-tab-item v-for="tab in tabs" :key="`tab-${tab.id}`" lazy>
        <list v-if="tab.data.length" :data="tab.data" icon padding/>
        <v-card-text v-else class="text-xs-center">
          <v-icon x-large>find_in_page</v-icon>
          <h2 v-t="'Sessions.empty'" class="subheading"/>
        </v-card-text>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
