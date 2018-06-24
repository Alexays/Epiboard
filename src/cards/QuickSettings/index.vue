<template>
  <v-layout id="quick-settings">
    <v-flex>
      <v-checkbox v-model="types.cache" label="Cache" color="primary" hide-details/>
      <v-checkbox v-model="types.cookies" label="Cookies" color="primary" hide-details/>
      <v-checkbox v-model="types.history" label="History" color="primary" hide-details/>
      <v-checkbox v-model="types.localStorage" label="Local Storage" color="primary" hide-details/>
    </v-flex>
    <v-layout align-end justify-end>
      <v-btn :disabled="isFalse || loading" :loading="loading" flat @click="clear()">Clear</v-btn>
    </v-layout>
  </v-layout>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
