<template>
  <div id="weather-settings" class="padding">
    <v-layout row>
      <v-flex xs4>
        <v-checkbox :label="'Auto'" v-model="auto"></v-checkbox>
      </v-flex>
      <v-flex xs8>
        <v-text-field single-line name="city" label="City" id="city" v-model="city"></v-text-field>
      </v-flex>
    </v-layout>
  </div>
</template>
<script src="./settings.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
