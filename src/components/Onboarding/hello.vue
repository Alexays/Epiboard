<template>
  <v-card :width="400" hover raised dark class="primary foreground--text mx-auto mt-4">
    <v-card-title class="secondary">
      <h3 v-t="'onboarding.hello.title'" class="headline"/>
    </v-card-title>
    <v-card-text class="text-center">
      <v-icon color="white" x-large>mdi-emoticon</v-icon>
      <h3 v-t="'onboarding.hello.content'" class="subtitle-1"/>
    </v-card-text>
    <v-card-actions class="secondary">
      <v-spacer/>
      <v-btn v-t="'onboarding.begin'" color="teal lighten-4" text @click.stop="$emit('next')"/>
    </v-card-actions>
  </v-card>
</template>
