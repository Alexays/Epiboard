<template>
  <div :style="{ width: `${(options.size || 1) * 430 - 30}px` }" class="card">
    <v-card hover raised>
      <v-toolbar
        :color="theme ? 'elevation-0' : 'primary'"
        :absolute="!!theme" class="head-drag" card prominent>
        <v-layout :style="{ color: titleColor }" column wrap>
          <v-toolbar-title v-if="!showSettings && title" :title="id">
            {{ title }}
          </v-toolbar-title>
          <v-toolbar-title v-else>{{ id }}</v-toolbar-title>
          <span v-if="showSettings" class="subheading">Settings</span>
          <span v-else-if="subTitle" :title="subTitle" class="subheading">{{ subTitle }}</span>
        </v-layout>
        <v-spacer/>
        <v-progress-circular
          v-show="!loaded"
          :title="`${id} is fetching some data...`"
          :style="{ color: actionsColor }"
          :size="25" :width="2" indeterminate/>
        <v-btn
          v-if="error && !showSettings"
          :style="{ color: actionsColor }"
          :title="`${error} click to reload`" flat icon @click="reload()">
          <v-icon>warning</v-icon>
        </v-btn>
        <v-menu v-if="!showSettings" lazy bottom offset-y>
          <v-btn slot="activator" :style="{ color: actionsColor }" flat icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile
              v-for="action in actions"
              :key="action.title"
              :class="{ 'primary--text': action.active }" @click="action.func()">
              <v-list-tile-title>{{ action.title }}</v-list-tile-title>
            </v-list-tile>
            <v-divider v-if="actions.length"/>
            <v-list-tile v-if="cmp.settings" @click.stop="showSettings=true">
              <v-list-tile-title>Settings</v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-if="debug" @click="reload()">
              <v-list-tile-title>Reload</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="remove()">
              <v-list-tile-title>Remove</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <template v-else>
          <v-btn flat icon color="foreground" title="Reset Settings" @click="resetSettings()">
            <v-icon>settings_backup_restore</v-icon>
          </v-btn>
          <v-btn flat icon color="foreground" title="Cancel" @click="closeSettings(false)">
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn flat icon color="foreground" title="Save" @click="closeSettings(true)">
            <v-icon>done</v-icon>
          </v-btn>
        </template>
      </v-toolbar>
      <component
        v-init="id"
        v-show="!showSettings"
        ref="card"
        :actions.sync="actions"
        :cardtitle.sync="title"
        :subtitle.sync="subTitle"
        :settings="settings"
        :is="cmp.card"
        :key="hash"
        @init="init"
      />
      <component
        v-initSettings="settings"
        v-if="showSettings && cmp.settings"
        :is="cmp.settings"
        :key="hash"
      />
    </v-card>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
