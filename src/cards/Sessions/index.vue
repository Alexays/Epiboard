<template>
  <div id="sessions">
    <v-tabs dark grow show-arrows slider-color="white" color="blue-grey">
      <v-tab>Recently Closed</v-tab>
      <v-tab v-for="device in devices" :key="device.deviceName">
        {{ device.deviceName }}
      </v-tab>
      <v-tabs-items>
        <v-tab-item id="tab-recents" lazy>
          <v-card-text>
            <div v-if="!recentlyClosed.length" class="text-xs-center session-empty">
              <v-icon x-large>find_in_page</v-icon>
              <h2 class="subheading">You have no recently closed page.</h2>
            </div>
            <li v-for="session in recentlyClosed" :key="session.title">
              <a :href="session.url" class="session text--primary">
                <i v-if="session.favIconUrl"
                   :style="{'background-image': `url(${session.favIconUrl})`}"/>
                <v-icon>insert_drive_file</v-icon>
                <span :title="session.title" class="session-title">{{ session.title }}</span>
                <span class="time text--secondary">{{ session.lastModified }}</span>
              </a>
            </li>
          </v-card-text>
        </v-tab-item>
        <v-tab-item
          v-for="device in devices"
          :key="device.deviceName" :id="`tab-${device.deviceName}`" lazy>
          <v-card-text>
            <li v-for="tab in device.tabs" :key="tab.url">
              <a :href="tab.url" class="session text--primary">
                <i v-if="tab.favIconUrl" :style="{'background-image': `url(${tab.favIconUrl})`}"/>
                <i v-else class="material-icons">insert_drive_file</i>
                <span :title="tab.title" class="session-title">{{ tab.title }}</span>
                <span class="time text--secondary">{{ tab.lastModified }}</span>
              </a>
            </li>
          </v-card-text>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
