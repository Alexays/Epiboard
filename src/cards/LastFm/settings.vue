<template>
  <v-card-text>
    <h4 class="headline mt-4">Username</h4>
    <v-text-field v-model="user" name="api" label="Your Username"/>
    <h4 class="headline mt-4">API Key</h4>
    <v-text-field v-model="apiKey" name="api" label="API Key"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
