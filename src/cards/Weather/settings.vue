<template>
  <v-card-text>
    <h4 class="subheading">{{ $t('Weather.settings.location') }}</h4>
    <v-layout align-center>
      <v-checkbox label="Auto" v-model="settings.auto" class="mt-0" hide-details/>
      <v-text-field
        :disabled="settings.auto"
        v-model="settings.city" :label="$t('Weather.settings.city')" name="city"/>
    </v-layout>
    <v-select
      v-model="settings.units" :items="allUnits" :label="$t('Weather.settings.choose_units')"/>
    <h4 class="subheading">{{ $t('Weather.settings.forecast') }}</h4>
    <v-switch
      :label="$tc('settings.onOff', settings.forecast)"
      v-model="settings.forecast" class="mt-0" hide-details/>
    <v-text-field
      :label="$t('settings.apiKey', { name: 'OpenWeatherMap'})"
      v-model="settings.appId" name="api"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
