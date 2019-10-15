<template>
  <v-card :width="400" hover raised dark class="primary foreground--text mx-auto mt-3">
    <v-card-title class="secondary">
      <h3 v-t.preserve="'onboarding.hello.title'" class="headline"/>
    </v-card-title>
    <v-card-text class="text-xs-center">
      <v-icon color="white" x-large>insert_emoticon</v-icon>
      <h3 v-t.preserve="'onboarding.hello.content'" class="subheading"/>
    </v-card-text>
    <v-card-actions class="secondary">
      <v-spacer/>
      <v-btn
        v-t.preserve="'onboarding.begin'" color="teal lighten-4" flat @click.stop="$emit('next')"/>
    </v-card-actions>
  </v-card>
</template>
