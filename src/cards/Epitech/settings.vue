<template>
  <v-card-text id="epitech-settings">
    <h4 class="headline">Hide user information</h4>
    <v-switch :label="hideInfo ? `On` : `Off`" v-model="hideInfo" hide-details/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
