<template>
  <v-card-text>
    <v-text-field v-model="settings.user" :label="$t('LastFm.settings.username')"/>
    <v-text-field v-model="settings.apiKey" :label="$t('settings.apiKey', { name: 'LastFm'})"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
