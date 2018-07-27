<template>
  <v-card :width="500" hover raised dark class="primary foreground--text mx-auto mt-3">
    <v-card-title class="secondary">
      <h3 class="headline">{{ $t('onboarding.why.title') }}</h3>
    </v-card-title>
    <v-card-text>
      <v-checkbox :label="$t('onboarding.why.prefs')" input-value="true" value readonly/>
      <v-checkbox :label="$t('onboarding.why.needs')" input-value="true" value readonly/>
      <v-checkbox label="Material Design" input-value="true" value readonly/>
    </v-card-text>
    <v-card-actions class="secondary">
      <v-btn color="teal lighten-4" flat @click="$emit('prev')">
        {{ $t('onboarding.previous') }}
      </v-btn>
      <v-spacer/>
      <v-btn color="teal lighten-4" flat @click="$emit('next')">{{ $t('onboarding.next') }}</v-btn>
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
};
</script>
