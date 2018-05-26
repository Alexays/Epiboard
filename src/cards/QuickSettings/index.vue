<template>
  <v-layout id="quick-settings">
    <v-flex>
      <v-checkbox label="Cache" v-model="types.cache" color="primary" hide-details></v-checkbox>
      <v-checkbox label="Cookies" v-model="types.cookies" color="primary" hide-details></v-checkbox>
      <v-checkbox label="History" v-model="types.history" color="primary" hide-details></v-checkbox>
      <v-checkbox label="Local Storage" v-model="types.localStorage" color="primary" hide-details></v-checkbox>
    </v-flex>
    <v-layout align-end justify-end>
      <v-btn :disabled="isFalse() || loading" v-on:click="clear()" flat>{{ loading ? 'Clearing' : 'Clear' }}</v-btn>
    </v-layout>
  </v-layout>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
