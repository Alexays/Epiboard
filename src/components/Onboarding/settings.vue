<template>
  <v-card :width="500" hover raised dark class="primary foreground--text mx-auto mt-3">
    <v-card-title class="secondary">
      <h3 class="headline">Some settings before starting</h3>
    </v-card-title>
    <v-card-text>
      <h4 class="subheading">Google Trends</h4>
      <v-layout align-center>
        <v-switch
          v-model="settings.trends.enabled"
          :label="settings.trends.enabled ? `On` : `Off`" class="mt-0" hide-details/>
        <v-autocomplete
          :items="countries"
          :disabled="!settings.trends.enabled"
          v-model="settings.trends.country" label="Choose your Google Trends Country"/>
      </v-layout>
    </v-card-text>
    <v-card-actions class="secondary">
      <v-btn color="teal lighten-4" flat @click="$emit('prev')">Previous</v-btn>
      <v-spacer/>
      <v-btn color="teal lighten-4" flat @click="$emit('next')">Next</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { VSwitch, VAutocomplete } from 'vuetify';
import countries from '../Settings/countries';

export default {
  name: 'Why',
  components: {
    VSwitch,
    VAutocomplete,
  },
  data() {
    return {
      countries,
      settings: this.$store.state.settings,
    }
  },
  beforeDestroy() {
    this.$store.commit('SET_SETTINGS', this.settings);
  },
};
</script>
