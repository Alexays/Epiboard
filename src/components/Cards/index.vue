<template>
  <v-card :data-id="id" :width="(options.size || 1) * 430 - 30" hover raised>
    <v-card-title
      :class="{
        'blue-grey': !options.custom || showSettings,
        custom: options.custom && !showSettings,
        'white--text': !options.custom || showSettings}" class="head-drag">
      <span v-if="!showSettings" class="headline">{{ title || id }}</span>
      <span v-else class="headline">{{ id }}</span>
      <div>
        <v-progress-circular
          v-show="!init"
          :title="`${id} is fetching some data...`"
          :size="25" :width="2" indeterminate color="white"/>
        <v-btn
          v-if="error"
          :title="`${error} click to reload`" flat icon color="white" @click="reload()">
          <v-icon>warning</v-icon>
        </v-btn>
        <v-menu v-if="!showSettings" lazy bottom offset-y>
          <v-btn slot="activator" flat icon>
            <v-icon color="white">more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile
              v-for="menu in menus"
              :key="menu.title" :class="{ 'primary--text': menu.active }" @click="menu.func()">
              <v-list-tile-title>{{ menu.title }}</v-list-tile-title>
            </v-list-tile>
            <v-divider v-if="menus.length"/>
            <v-list-tile v-if="settingsCmp" @click.stop="showSettings=true">
              <v-list-tile-title>Settings</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="deleteCard()">
              <v-list-tile-title>Remove</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <template v-else>
          <v-btn flat icon color="white" @click="closeSettings(false)">
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn flat icon color="white" @click="closeSettings(true)">
            <v-icon>done</v-icon>
          </v-btn>
        </template>
      </div>
    </v-card-title>
    <component
      v-init="{key: id}"
      v-show="!showSettings"
      :menus.sync="menus"
      :settings="settings"
      :is="cmp"
      :key="hash"
      @init="initCard($event)"
    />
    <component
      v-init="{key: id, settings: true}"
      v-if="showSettings && settingsCmp"
      :is="settingsCmp"
    />
  </v-card>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
