<template>
  <div id="bookmarks">
    <v-tabs
      v-model="active"
      slider-color="foreground" color="primary" grow show-arrows>
      <v-tab
        v-for="tab in tabs"
        :key="tab.id" :class="{ 'white--text': !$store.state.settings.theme.light }">
        {{ $t(tab.name) }}
      </v-tab>
      <v-tabs-items>
        <v-tab-item v-for="tab in tabs" :key="`tab-${tab.id}`" :id="`tab-${tab.id}`" lazy>
          <v-card-text class="scroll-content">
            <div v-if="!tab.data.length" class="text-xs-center">
              <v-icon x-large>find_in_page</v-icon>
              <h2 class="subheading">{{ $t('Bookmarks.empty') }}</h2>
              <v-btn v-if="tab.parentNode" class="body-2" small @click="backParent(tab)">
                {{ $t('Bookmarks.back_parent') }}
              </v-btn>
            </div>
            <v-list v-else dense>
              <v-list-tile v-if="tab.parentNode" @click="backParent(tab)">
                <v-list-tile-avatar :size="16">
                  <v-icon>arrow_back</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content class="caption">
                  <v-list-tile-sub-title>{{ $t('Bookmarks.back_parent') }}</v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <!-- TODO: @click with empty callback is needed to have hover effect -->
              <v-list-tile
                v-for="item in tab.data" :key="item.id" :href="item.url" @click="() => {}">
                <v-list-tile-avatar :size="16">
                  <img
                    v-if="item.url && $utils.getFavicon(item.url)"
                    :src="$utils.getFavicon(item.url)">
                  <v-icon v-else-if="item.url">insert_drive_file</v-icon>
                  <v-icon v-else>folder</v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content
                  :title="item.url" class="caption" @click="getSubFolder(tab, item)">
                  <v-list-tile-sub-title v-if="item.title && item.title.length">
                    {{ item.title }}
                  </v-list-tile-sub-title>
                  <v-list-tile-sub-title v-else>{{ item.url }}</v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-list-tile-action-text v-if="item.url">
                    {{ new Date(item.dateAdded).toLocaleDateString($i18n.locale, dateOption) }}
                  </v-list-tile-action-text>
                  <v-icon
                    v-else-if="foldersId.indexOf(item.id) === -1"
                    :title="$t('Bookmarks.add_folder')" @click="addTab(item)">
                    add
                  </v-icon>
                  <v-icon v-else :title="$t('Bookmarks.remove_folder')" @click="removeTab(item)">
                    delete
                  </v-icon>
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
