<template>
  <v-card-text>
    <h4 v-t="'TopSites.settings.grid'" class="subtitle-1"/>
    <v-switch
      :label="$tc('settings.onOff', settings.grid)"
      v-model="settings.grid" class="mt-0" hide-details/>
    <template v-if="settings.grid">
      <h4 v-t="'TopSites.settings.grid_size'" class="subtitle-1"/>
      <v-slider
        v-model="settings.size"
        :tick-labels="$options.tickLabels"
        :max="$options.tickLabels.length - 1" tick-size="2" ticks="always"/>
    </template>
    <v-text-field
      v-model.number="settings.maxSites" :label="$t('TopSites.settings.maxTopSites')" mask="#"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
