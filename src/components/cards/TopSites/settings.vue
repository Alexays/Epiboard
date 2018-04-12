<template>
  <div id="rss-settings" class="padding">
    <h4 class="headline">Max top sites</h4>
    <v-text-field name="maxSites" mask="#" label="Max top sites number" v-model.number="maxSites"></v-text-field>
  </div>
</template>
<script src="./settings.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
