<template>
  <div class="no-margins" id="sessions">
    <v-tabs dark grow show-arrows color="blue-grey">
      <v-tabs-slider color="white"></v-tabs-slider>
      <v-tab>Recently Closed</v-tab>
      <v-tab v-for="(device, key) in devices" :key="key">
        {{ device.deviceName }}
      </v-tab>
      <v-tabs-items>
        <v-tab-item>
          <div v-if="!recentlyClosed.length" class="white text-xs-center session-empty">
            <i class="material-icons md-48">find_in_page</i>
            <h2 class="subheading">You have no recently closed page.</h2>
          </div>
          <li v-for="(session, key) in recentlyClosed" :key="key">
            <a :href="session.url" class="session">
              <i v-if="session.favIconUrl" :style="{'background-image': 'url(' + session.favIconUrl +')'}"></i>
              <i v-else class="material-icons">insert_drive_file</i>
              <span class="session-title">{{session.title}}</span>
              <span class="more time">{{session.lastModified}}</span>
            </a>
          </li>
        </v-tab-item>
        <v-tab-item lazy v-for="(device, key) in devices" :key="key">
          <li v-for="(tab, subKey) in device.tabs" :key="subKey">
            <a :href="tab.url" class="session">
              <i v-if="tab.favIconUrl" :style="{'background-image': 'url('+ tab.favIconUrl +')'}"></i>
              <i v-else class="material-icons">insert_drive_file</i>
              <span class="session-title">{{tab.title}}</span>
              <span class="more time">{{tab.lastModified}}</span>
            </a>
          </li>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
