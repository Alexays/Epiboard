<template>
  <div id="sessions">
    <v-tabs
      v-model="active"
      :dark="!$store.state.settings.theme.light"
      :light="$store.state.settings.theme.light"
      slider-color="foreground" color="primary" grow show-arrows>
      <v-tab v-for="tab in tabs" :key="tab.id">
        {{ tab.id === 'recents' ? $t(tab.name) : tab.name }}
      </v-tab>
      <v-tabs-items>
        <v-tab-item v-for="tab in tabs" :key="`tab-${tab.id}`" :id="`tab-${tab.id}`" lazy>
          <v-card-text class="scroll-content">
            <div v-if="!tab.data.length" class="text-xs-center">
              <v-icon x-large>find_in_page</v-icon>
              <h2 class="subheading">{{ $t('Sessions.empty') }}</h2>
            </div>
            <v-list v-else dense>
              <v-list-tile
                v-for="item in tab.data"
                :key="item.sessionId" :href="item.url">
                <v-list-tile-avatar :size="16">
                  <img v-if="item.favIconUrl" :src="item.favIconUrl">
                  <v-icon v-else>insert_drive_file</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content :title="item.url" class="caption">
                  <v-list-tile-sub-title v-if="item.title && item.title.length">
                    {{ item.title }}
                  </v-list-tile-sub-title>
                  <v-list-tile-sub-title v-else>{{ item.url }}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text>
                    {{ item.lastModified.toLocaleDateString($i18n.locale, dateOption) }}
                  </v-list-tile-action-text>
                </v-list-tile-action>
              </v-list-tile>
            </v-list>
          </v-card-text>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
