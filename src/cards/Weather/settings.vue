<template>
  <v-card-text>
    <h4 class="subheading">Location</h4>
    <v-layout align-center>
      <v-checkbox :label="'Auto detect'" v-model="settings.auto" class="mt-0" hide-details/>
      <v-text-field
        :disabled="settings.auto" v-model="settings.city" name="city" label="City, e.g. Nantes"/>
    </v-layout>
    <v-select :items="allUnits" v-model="settings.units" label="Choose your prefered units"/>
    <h4 class="subheading">Forecast</h4>
    <v-switch
      :label="settings.forecast ? `On` : `Off`"
      v-model="settings.forecast" class="mt-0" hide-details/>
    <v-text-field v-model="settings.appId" name="api" label="OpenWeatherMap API Key"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
