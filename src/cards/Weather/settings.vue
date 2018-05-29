<template>
  <div id="weather-settings" class="padding">
    <h4 class="headline">Location</h4>
    <v-layout align-center>
      <v-checkbox :label="'Auto detect'" hide-details v-model="auto"></v-checkbox>
      <v-text-field :disabled="auto" name="city" label="City, e.g. Nantes" id="city" v-model="city"></v-text-field>
    </v-layout>
    <h4 class="headline">Forecast</h4>
    <v-switch :label="forecast ? `On` : `Off`" hide-details v-model="forecast"></v-switch>
    <h4 class="headline mt-4">OpenWeatherMap API Key</h4>
    <v-text-field name="api" label="API Key" id="api" v-model="appId"></v-text-field>
  </div>
</template>
<script src="./settings.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
