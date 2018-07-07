<template>
  <v-card-text>
    <h4 class="headline">Location</h4>
    <v-layout align-center>
      <v-checkbox :label="'Auto detect'" v-model="auto" hide-details/>
      <v-text-field :disabled="auto" v-model="city" name="city" label="City, e.g. Nantes"/>
    </v-layout>
    <v-select :items="allUnits" v-model="units" label="Choose your prefered units"/>
    <h4 class="headline">Forecast</h4>
    <v-switch :label="forecast ? `On` : `Off`" v-model="forecast" hide-details/>
    <v-text-field v-model="appId" name="api" label="OpenWeatherMap API Key"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
