<template>
  <div id="downloads" class="padding">
    <!-- TODO: drag event -->
    <v-menu lazy bottom offset-y v-for="download in downloads" :key="download.id">
      <li draggable="true" v-drag :id="download.id" slot="activator" class="download">
        <div class="icon">
          <v-progress-circular v-if="download.state === 'in_progress'" :value="(download.bytesReceived / download.totalBytes) * 100 | 0"></v-progress-circular>
          <template v-else>
            <div class="fileicon" v-if="download.filename && download.icon" :style="{'background-image': 'url(' + download.icon + ')'}"></div>
            <i v-if="!download.filename || !download.icon" class="material-icons">insert_drive_file</i>
          </template>
        </div>
        <div class="d-info">
          <div class="name">
            <strike v-if="download.state === 'interrupted'">
              {{download.filename | filename}}
            </strike>
            <span v-else>
              {{download.filename | filename}}
            </span>
          </div>
          <span class="text--secondary">
            <span v-if="download.state === 'in_progress'">
              {{download.bytesReceived | bytes}} /
            </span>
            {{download.totalBytes | bytes}}
          </span> -
          <a :href="download.url" class="text--secondary">{{download.url}}</a>
        </div>
      </li>
      <v-list>
        <v-list-tile v-if="download.state === 'complete' && download.exists" @click="open(download)">
          <v-list-tile-title>Open</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="erase(download)">
          <v-list-tile-title>Remove</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-if="download.state === 'complete' && download.exists" @click="remove(download)">
          <v-list-tile-title>Remove with data</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
    <div v-if="!downloads.length" class="text-xs-center">
      <i class="material-icons md-48">file_download</i>
      <h2 class="subheading">You have no downloads.</h2>
    </div>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
