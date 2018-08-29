<template>
  <v-tabs
    v-model="active"
    :dark="!$store.state.settings.theme.light"
    :light="$store.state.settings.theme.light"
    slider-color="foreground" color="primary" id="bookmarks" grow show-arrows>
    <v-tab><span v-t="'Bookmarks.recents'"/></v-tab>
    <v-tab><span v-t="'Bookmarks.all'"/></v-tab>
    <v-tab v-for="tab in folders" :key="tab.id">{{ tab.name }}</v-tab>
    <v-tabs-items>
      <v-tab-item v-for="tab in tabs" :key="`tab-${tab.id}`" :id="`tab-${tab.id}`" lazy>
        <v-card-text class="scroll-content">
          <div v-if="!tab.data.length" class="text-xs-center">
            <v-icon x-large>find_in_page</v-icon>
            <h2 v-t="'Bookmarks.empty'" class="subheading"/>
            <v-btn
              v-t="'Bookmarks.back_parent'"
              v-if="tab.parentNode" class="body-2" small @click="backParent(tab)"/>
          </div>
          <list v-else :data="tab.data" icon>
            <template slot="icon" slot-scope="{item}">
              <img
                v-if="item.url && $utils.getFavicon(item.url)"
                :src="$utils.getFavicon(item.url)">
              <v-icon v-else-if="item.url">insert_drive_file</v-icon>
              <v-icon v-else>folder</v-icon>
            </template>
            <template slot="action" slot-scope="{item}">
              <templace v-if="item.url">
                {{ new Date(item.dateAdded)
                .toLocaleDateString($i18n.locale, $options.dateOption) }}
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
        </v-card-text>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>
<script src="./main.js"></script>
