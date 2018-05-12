<template>
  <v-card hover raised :data-id="id" :width="(options.size || 1) * 430 - 30">
    <v-card-title class="head-drag" :class="{'blue-grey': !options.custom || showSettings, custom: options.custom && !showSettings, 'white--text': !options.custom || showSettings}">
      <span v-if="!showSettings" class="headline">{{title || id}}</span>
      <span v-else class="headline">{{id}}</span>
      <div>
        <v-progress-circular :title="`${id} is fetching some data...`" v-show="!init" :size="25" :width="2" indeterminate color="white"></v-progress-circular>
        <v-menu v-if="!showSettings" lazy bottom offset-y>
          <v-btn flat icon slot="activator">
            <v-icon color="white">more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile v-if="settingsCmp" @click="openSettings()">
              <v-list-tile-title>Settings</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="deleteCard()">
              <v-list-tile-title>Remove</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <template v-else>
          <v-btn flat icon @click="closeSettings(false)" color="white">
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn flat icon @click="closeSettings(true)" color="white">
            <v-icon>done</v-icon>
          </v-btn>
        </template>
      </div>
    </v-card-title>
    <component v-if="!showSettings" @init="initCard($event)" :settings="settings" v-init="{key: id}" :is="cmp"></component>
    <component v-else-if="settingsCmp" v-init="{key: id, settings: true}" :is="settingsCmp"></component>
  </v-card>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
