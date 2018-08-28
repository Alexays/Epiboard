<template>
  <v-layout id="quick-settings">
    <v-flex>
      <v-checkbox
        v-model="types.cache" :label="$t('QuickSettings.cache')" color="primary" hide-details/>
      <v-checkbox
        v-model="types.cookies" :label="$t('QuickSettings.cookies')" color="primary" hide-details/>
      <v-checkbox
        v-model="types.history" :label="$t('QuickSettings.history')" color="primary" hide-details/>
      <v-checkbox
        v-model="types.localStorage"
        :label="$t('QuickSettings.local_storage')" color="primary" hide-details/>
    </v-flex>
    <v-layout align-end justify-end>
      <v-btn
        v-t="'QuickSettings.clear'"
        :disabled="isFalse || loading" :loading="loading" flat @click="clear()"/>
    </v-layout>
  </v-layout>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
