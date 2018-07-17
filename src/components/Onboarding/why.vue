<template>
  <v-card :width="500" hover raised class="primary foreground--text mx-auto mt-3">
    <v-card-title class="secondary">
      <h3 class="headline">Why Epiboard is Awesome</h3>
    </v-card-title>
    <v-card-text>
      <v-checkbox
        label="Preferences synced across your browsers (if signed in)"
        input-value="true" value readonly dark/>
      <v-checkbox label="One card for each need" input-value="true" value readonly dark/>
      <v-checkbox label="Material Design" input-value="true" value readonly dark/>
    </v-card-text>
    <v-card-actions class="secondary">
      <v-btn color="teal lighten-4" flat @click="$emit('prev')">Previous</v-btn>
      <v-spacer/>
      <v-btn color="teal lighten-4" flat @click="$emit('next')">Next</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
import { VCheckbox } from 'vuetify';

export default {
  name: 'Why',
  components: {
    VCheckbox,
  },
}
</script>
