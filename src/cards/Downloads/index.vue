<template>
  <div id="downloads" class="overflow-y-auto pa-4">
    <v-menu v-for="download of downloads" :key="download.filename" absolute offset-y>
      <template v-slot:activator="{ on }">
        <div
          v-drag="download.exists && download.state === 'complete'"
          :id="download.id"
          draggable
          v-on="on"
          class="download"
        >
          <div class="icon">
            <v-progress-circular
              v-if="download.state === 'in_progress'"
              :value="(download.bytesReceived / download.totalBytes) * 100 | 0"
              :alt="`${(download.bytesReceived / download.totalBytes) * 100}%`"
            />
            <template v-else>
              <div
                v-if="download.filename && download.icon"
                :style="{'background-image': `url(${download.icon})`}"
                class="fileicon"
              />
              <v-icon v-if="!download.filename || !download.icon" large>mdi-file</v-icon>
            </template>
          </div>
          <div class="d-info">
            <div class="name">
              <strike
                v-if="download.state === 'interrupted' || !download.exists"
              >{{ download.filename | filename }}</strike>
              <span v-else>{{ download.filename | filename }}</span>
            </div>
            <span class="text--secondary">
              <span v-if="download.state === 'in_progress'">{{ download.bytesReceived | bytes }} /</span>
              {{ download.totalBytes | bytes }}
            </span> -
            <a :href="download.url" class="text--secondary">{{ download.url }}</a>
          </div>
        </div>
      </template>
      <v-list>
        <v-list-item
          v-if="download.state === 'complete' && download.exists"
          @click="open(download)"
        >
          <v-list-item-title v-t="'Downloads.open'" />
        </v-list-item>
        <v-list-item
          v-if="download.state === 'complete' && download.exists"
          @click="remove(download)"
        >
          <v-list-item-title v-t="'Downloads.delete'" />
        </v-list-item>
        <v-list-item @click="erase(download)">
          <v-list-item-title v-t="'Downloads.remove_list'" />
        </v-list-item>
      </v-list>
    </v-menu>
    <v-card-text v-if="!downloads.length" class="text-center">
      <v-icon x-large>mdi-file-download</v-icon>
      <h2 v-t="'Downloads.no_downloads'" class="subtitle-1" />
    </v-card-text>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
