<template>
  <v-card-text>
    <h4 class="headline">Hide user information</h4>
    <v-switch :label="hideInfo ? `On` : `Off`" v-model="hideInfo" hide-details/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
