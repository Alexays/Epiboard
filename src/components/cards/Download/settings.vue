<template>
  <div id="downloads-settings" class="padding">
    <h4 class="headline">Limit Downloads</h4>
    <v-text-field name="limitDownloads" mask="#" label="Max downloads number" v-model.number="limitDownloads"></v-text-field>
  </div>
</template>
<script src="./settings.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
