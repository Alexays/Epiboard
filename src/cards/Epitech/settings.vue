<template>
  <v-card-text>
    <h4 class="headline">Hide user information</h4>
    <v-switch :label="settings.hideInfo ? `On` : `Off`" v-model="settings.hideInfo" hide-details/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
