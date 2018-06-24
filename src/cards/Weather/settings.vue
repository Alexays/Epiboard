<template>
  <v-card-text id="weather-settings">
    <h4 class="headline">Location</h4>
    <v-layout align-center>
      <v-checkbox :label="'Auto detect'" v-model="auto" hide-details/>
      <v-text-field :disabled="auto" v-model="city" name="city" label="City, e.g. Nantes"/>
    </v-layout>
    <h4 class="headline">Units</h4>
    <v-select :items="allUnits" v-model="units" label="Choose your prefered units" autocomplete/>
    <h4 class="headline">Forecast</h4>
    <v-switch :label="forecast ? `On` : `Off`" v-model="forecast" hide-details/>
    <h4 class="headline mt-4">OpenWeatherMap API Key</h4>
    <v-text-field v-model="appId" name="api" label="API Key"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
