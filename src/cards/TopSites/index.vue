<template>
  <v-card-text id="top-sites">
    <div v-if="topSites.length">
      <li v-for="node in topSites" :key="node.url">
        <a :href="node.url" class="text--primary">
          <i v-if="node.icon" :style="{'background-image': 'url('+node.icon+')'}"/>
          <v-icon v-else x-large>insert_drive_file</v-icon>
          <span class="n-title">{{ node.title || node.url }}</span>
        </a>
      </li>
    </div>
    <div v-else class="text-xs-center">
      <v-icon x-large>find_in_page</v-icon>
      <h2 class="subheading">{{ $t('TopSites.empty') }}</h2>
    </div>
  </v-card-text>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
