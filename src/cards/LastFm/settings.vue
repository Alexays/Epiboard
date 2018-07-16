<template>
  <v-card-text>
    <v-text-field v-model="settings.user" name="api" label="LastFm Username"/>
    <v-text-field v-model="settings.apiKey" name="api" label="API Key"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
