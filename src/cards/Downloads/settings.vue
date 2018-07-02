<template>
  <v-card-text>
    <h4 class="headline">Limit Downloads</h4>
    <v-text-field
      v-model.number="limitDownloads" name="limitDownloads" mask="#" label="Max downloads number"/>
  </v-card-text>
</template>
<script src="./settings.js"></script>
