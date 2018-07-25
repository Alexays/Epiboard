<template>
  <v-card :width="400" hover raised dark class="primary foreground--text mx-auto mt-3">
    <v-card-title class="secondary">
      <h3 class="headline">{{ $t('onboarding.hello.title') }}</h3>
    </v-card-title>
    <v-card-text class="text-xs-center">
      <v-icon color="white" x-large>insert_emoticon</v-icon>
      <h3 class="subheading">{{ $t('onboarding.hello.content') }}</h3>
    </v-card-text>
    <v-card-actions class="secondary">
      <v-spacer/>
      <v-btn color="teal lighten-4" flat @click.stop="$emit('next')">
        {{ $t('onboarding.begin') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
