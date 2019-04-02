<template>
  <div id="downloads" class="pa-3">
    <template v-if="downloads.length">
      <v-menu v-for="download of downloads" :key="download.filename" lazy bottom offset-y>
        <li
          v-drag="download.exists && download.state === 'complete'"
          slot="activator" :id="download.id" class="download" draggable>
          <div class="icon">
            <v-progress-circular
              v-if="download.state === 'in_progress'"
              :value="(download.bytesReceived / download.totalBytes) * 100 | 0"
              :alt="`${(download.bytesReceived / download.totalBytes) * 100}%`"/>
            <template v-else>
              <div
                v-if="download.filename && download.icon"
                :style="{'background-image': `url(${download.icon})`}" class="fileicon"/>
              <v-icon v-if="!download.filename || !download.icon" large>insert_drive_file</v-icon>
            </template>
          </div>
          <div class="d-info">
            <div class="name">
              <strike v-if="download.state === 'interrupted' || !download.exists">
                {{ download.filename | filename }}
              </strike>
              <span v-else>
                {{ download.filename | filename }}
              </span>
            </div>
            <span class="text--secondary">
              <span v-if="download.state === 'in_progress'">
                {{ download.bytesReceived | bytes }} /
              </span>
              {{ download.totalBytes | bytes }}
            </span> -
            <a :href="download.url" class="text--secondary">{{ download.url }}</a>
          </div>
        </li>
        <v-list>
          <v-list-tile
            v-if="download.state === 'complete' && download.exists" @click="open(download)">
            <v-list-tile-title v-t="'Downloads.open'"/>
          </v-list-tile>
          <v-list-tile
            v-if="download.state === 'complete' && download.exists" @click="remove(download)">
            <v-list-tile-title v-t="'Downloads.delete'"/>
          </v-list-tile>
          <v-list-tile @click="erase(download)">
            <v-list-tile-title v-t="'Downloads.remove_list'"/>
          </v-list-tile>
        </v-list>
      </v-menu>
    </template>
    <v-card-text v-else class="text-xs-center">
      <v-icon x-large>file_download</v-icon>
      <h2 v-t="'Downloads.no_downloads'" class="subheading"/>
    </v-card-text>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
