<template>
  <div :style="{ width: `${size}px` }" class="card">
    <v-card :width="size" hover>
      <v-toolbar
        :color="theme ? 'elevation-0' : 'primary'"
        :absolute="!!theme"
        :dense="!!theme"
        class="head-drag"
        flat
      >
        <v-layout :style="{ color: titleColor }" column wrap>
          <v-toolbar-title v-if="!showSettings && title" :title="$vnode.key">{{ title }}</v-toolbar-title>
          <v-toolbar-title v-else>{{ defaultTitle }}</v-toolbar-title>
          <span v-t="'settings.title'" v-if="showSettings" class="subtitle-1" />
          <span v-else-if="subTitle" :title="subTitle" class="subtitle-1">{{ subTitle }}</span>
        </v-layout>
        <v-spacer />
        <v-progress-circular
          v-show="!loaded && !showSettings"
          :title="$t('card.loading', { id: $vnode.key })"
          :style="{ color: actionsColor }"
          :size="25"
          :width="2"
          indeterminate
        />
        <v-btn
          v-if="loaded === 2 && !showSettings"
          :style="{ color: actionsColor }"
          :title="$t('card.error_reload', { id: $vnode.key })"
          text
          icon
          @click="reload()"
        >
          <v-icon>mdi-alert</v-icon>
        </v-btn>
        <v-menu v-if="!showSettings" absolute offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" :style="{ color: actionsColor }" text icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="action in actions"
              :key="action.title"
              :class="{ 'primary--text': action.active }"
              @click="action.func()"
            >
              <v-list-item-title>{{ action.title }}</v-list-item-title>
            </v-list-item>
            <v-divider v-if="actions.length" />
            <v-list-item v-if="$options.manifest.more" @click="gotTo($options.manifest.more)">
              <v-list-item-title v-t="'card.more'" />
            </v-list-item>
            <v-list-item v-if="$options.settings" @click.stop="showSettings=true">
              <v-list-item-title v-t="'settings.title'" />
            </v-list-item>
            <v-list-item v-if="debug" @click="reload()">
              <v-list-item-title v-t="'card.reload'" />
            </v-list-item>
            <v-list-item @click="remove()">
              <v-list-item-title v-t="'card.remove'" />
            </v-list-item>
          </v-list>
        </v-menu>
        <template v-else>
          <v-btn
            :title="$t('settings.reset')"
            color="foreground"
            text
            icon
            @click="resetSettings()"
          >
            <v-icon>mdi-backup-restore</v-icon>
          </v-btn>
          <v-btn
            :title="$t('settings.cancel')"
            color="foreground"
            text
            icon
            @click="closeSettings(false)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-btn
            :title="$t('settings.save')"
            color="foreground"
            text
            icon
            @click="closeSettings(true)"
          >
            <v-icon>mdi-check</v-icon>
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
