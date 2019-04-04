<template>
  <v-tabs
    id="bookmarks"
    v-model="active"
    :dark="!$store.state.settings.theme.light"
    :light="$store.state.settings.theme.light"
    slider-color="foreground" color="primary" grow show-arrows>
    <v-tab v-for="tab in tabs" :key="tab.id">
      <span v-t="`Bookmarks.${tab.id}`" v-if="!tab.folder"/>
      <span v-else>{{ tab.name }}</span>
    </v-tab>
    <v-tabs-items>
      <v-tab-item v-for="tab in tabs" :key="tab.id" lazy>
        <v-card-text v-if="!tab.data.length" class="text-xs-center">
          <v-icon x-large>find_in_page</v-icon>
          <h2 v-t="'Bookmarks.empty'" class="subheading"/>
          <v-btn
            v-t="'Bookmarks.back_parent'"
            v-if="tab.parentNode" class="body-2" small @click="backParent(tab)"/>
        </v-card-text>
        <template v-else>
          <v-btn v-if="tab.parentNode" small flat block @click="backParent(tab)">
            <v-icon>arrow_back</v-icon>
            <span v-t="'Bookmarks.back_parent'"/>
          </v-btn>
          <list :data="tab.data" icon padding>
            <template slot="icon" slot-scope="{item}">
              <v-img
                v-if="item.url && getFavicon(item.url)" :src="getFavicon(item.url)"/>
              <v-icon v-else-if="item.url">insert_drive_file</v-icon>
              <v-icon v-else>folder</v-icon>
            </template>
            <template slot="content" slot-scope="{item}">
              <div @click="getSubFolder(tab, item)">
                {{ item.title && item.title.length ? item.title : item.url }}
              </div>
            </template>
            <template slot="action" slot-scope="{item}">
              <templace v-if="item.url">
                {{ new Date(item.dateAdded)
                .toLocaleDateString($t('locale'), timeOptions) }}
              </templace>
              <v-icon
                v-else-if="foldersId.indexOf(item.id) === -1"
                :title="$t('Bookmarks.add_folder')" @click="addTab(item)">
                add
              </v-icon>
              <v-icon v-else :title="$t('Bookmarks.remove_folder')" @click="removeTab(item)">
                delete
              </v-icon>
            </template>
          </list>
        </template>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
