<template>
  <div class="card">
    <v-card :width="((this.$options.manifest.size || 1) * 430) - 30" hover>
      <v-toolbar
        :color="theme ? 'elevation-0' : 'primary'"
        :absolute="!!theme"
        :prominent="showSettings || !!subTitle"
        :dense="!!theme" class="head-drag" card>
        <v-layout :style="{ color: titleColor }" column wrap>
          <v-toolbar-title v-if="!showSettings && title" :title="$vnode.key">
            {{ title }}
          </v-toolbar-title>
          <v-toolbar-title v-else>{{ defaultTitle }}</v-toolbar-title>
          <span v-t="'settings.title'" v-if="showSettings" class="subheading"/>
          <span v-else-if="subTitle" :title="subTitle" class="subheading">{{ subTitle }}</span>
        </v-layout>
        <v-spacer/>
        <v-progress-circular
          v-if="$options.manifest.externalsRequests"
          v-show="!loaded && !showSettings"
          :title="$t('card.loading', { id: $vnode.key })"
          :style="{ color: actionsColor }"
          :size="25" :width="2" indeterminate/>
        <v-btn
          v-if="loaded === 2 && !showSettings"
          :style="{ color: actionsColor }"
          :title="$t('card.error_reload', { id: $vnode.key })" flat icon @click="reload()">
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
            <v-list-tile
              v-if="$options.manifest.more" @click="gotTo($options.manifest.more)">
              <v-list-tile-title v-t="'card.more'"/>
            </v-list-tile>
            <v-list-tile v-if="$options.settings" @click.stop="showSettings=true">
              <v-list-tile-title v-t="'settings.title'"/>
            </v-list-tile>
            <v-list-tile v-if="$store.state.settings.debug" @click="reload()">
              <v-list-tile-title v-t="'card.reload'"/>
            </v-list-tile>
            <v-list-tile @click="remove()">
              <v-list-tile-title v-t="'card.remove'"/>
            </v-list-tile>
          </v-list>
        </v-menu>
        <template v-else>
          <v-btn
            :title="$t('settings.reset')" color="foreground" flat icon @click="resetSettings()">
            <v-icon>settings_backup_restore</v-icon>
          </v-btn>
          <v-btn
            :title="$t('settings.cancel')"
            color="foreground" flat icon @click="closeSettings(false)">
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn
            :title="$t('settings.save')"
            color="foreground" flat icon @click="closeSettings(true)">
            <v-icon>done</v-icon>
          </v-btn>
        </template>
      </v-toolbar>
      <keep-alive>
        <component
          v-init="{ id: name, key: $vnode.key }"
          v-show="!showSettings"
          ref="card"
          :actions.sync="actions"
          :cardtitle.sync="title"
          :subtitle.sync="subTitle"
          :settings="settings"
          :is="$options.card"
          :key="hash"
          @init="init"
        />
      </keep-alive>
      <component
        v-initSettings="settings"
        v-if="showSettings && $options.settings"
        :is="$options.settings"
        :key="`${hash}-settings`"
      />
    </v-card>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
