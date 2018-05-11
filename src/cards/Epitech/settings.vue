<template>
  <div id="epitech-settings" class="padding">
    <h4 class="headline">Hide user information</h4>
    <v-switch :label="hideInfo ? `On` : `Off`" hide-details v-model="hideInfo"></v-switch>
  </div>
</template>
<script src="./settings.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
