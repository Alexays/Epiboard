<template>
  <v-card-text>
    <h4 v-t="'Apps.settings.size'" class="subtitle-1"/>
    <v-slider
      v-model="settings.size"
      :tick-labels="$options.tickLabels"
      :max="$options.tickLabels.length - 1" tick-size="2" ticks="always"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
