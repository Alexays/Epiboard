<template>
  <v-card :width="(options.size || 1) * 430 - 30" hover raised>
    <v-card-title
      :class="{
        'primary': !options.custom || showSettings,
        custom: options.custom && !showSettings,
        'white--text': !options.custom || showSettings}" class="head-drag">
      <span v-if="!showSettings" class="headline">{{ title || id }}</span>
      <span v-else class="headline">{{ id }}</span>
      <div>
        <v-progress-circular
          v-show="!loaded"
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
              v-for="action in actions"
              :key="action.title"
              :class="{ 'primary--text': action.active }" @click="action.func()">
              <v-list-tile-title>{{ action.title }}</v-list-tile-title>
            </v-list-tile>
            <v-divider v-if="actions.length"/>
            <v-list-tile v-if="cmp.settings" @click.stop="showSettings=true">
              <v-list-tile-title>Settings</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="remove()">
              <v-list-tile-title>Remove</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
        <template v-else>
          <v-btn flat icon title="Reset Settings" color="white" @click="resetSettings()">
            <v-icon>settings_backup_restore</v-icon>
          </v-btn>
          <v-btn flat icon title="Cancel" color="white" @click="closeSettings(false)">
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn flat icon title="Save" color="white" @click="closeSettings(true)">
            <v-icon>done</v-icon>
          </v-btn>
        </template>
      </div>
    </v-card-title>
    <component
      v-init="id"
      v-show="!showSettings"
      :actions.sync="actions"
      :settings="settings"
      :is="cmp.card"
      :key="hash"
      @init="init"
    />
    <component
      v-init.settings="id"
      v-if="showSettings && cmp.settings"
      :is="cmp.settings"
      :key="hash"
    />
  </v-card>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
