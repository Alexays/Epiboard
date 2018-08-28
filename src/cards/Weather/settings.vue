<template>
  <v-card-text>
    <h4 v-t="'Weather.settings.location'" class="subheading"/>
    <v-layout align-center>
      <v-checkbox v-model="settings.auto" label="Auto" class="mt-0" hide-details/>
      <v-text-field
        :disabled="settings.auto" v-model="settings.city" :label="$t('Weather.settings.city')"/>
    </v-layout>
    <v-select
      v-model="settings.units" :items="allUnits" :label="$t('Weather.settings.choose_units')"/>
    <h4 v-t="'Weather.settings.forecast'" class="subheading"/>
    <v-switch
      :label="$tc('settings.onOff', settings.forecast)"
      v-model="settings.forecast" class="mt-0" hide-details/>
    <v-text-field
      v-model="settings.appId" :label="$t('settings.apiKey', { name: 'OpenWeatherMap'})"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
