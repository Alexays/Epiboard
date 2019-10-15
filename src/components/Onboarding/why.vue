<template>
  <v-card :width="500" hover raised dark class="primary foreground--text mx-auto mt-3">
    <v-card-title class="secondary">
      <h3 v-t.preserve="'onboarding.why.title'" class="headline"/>
    </v-card-title>
    <v-card-text>
      <v-checkbox :label="$t('onboarding.why.prefs')" input-value="true" value readonly/>
      <v-checkbox :label="$t('onboarding.why.needs')" input-value="true" value readonly/>
      <v-checkbox :label="$t('onboarding.why.privacy')" input-value="true" value readonly/>
      <v-checkbox label="Material Design" input-value="true" value readonly/>
    </v-card-text>
    <v-card-actions class="secondary">
      <v-btn
        v-t.preserve="'onboarding.previous'" color="teal lighten-4" flat @click="$emit('prev')"/>
      <v-spacer/>
      <v-btn v-t.preserve="'onboarding.next'" color="teal lighten-4" flat @click="$emit('next')"/>
    </v-card-actions>
  </v-card>
</template>
