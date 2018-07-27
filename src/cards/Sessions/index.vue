<template>
  <div id="sessions">
    <v-tabs
      :dark="!$store.state.settings.theme.light"
      slider-color="foreground" color="primary"
      grow show-arrows>
      <v-tab>{{ $t('Sessions.recents') }}</v-tab>
      <v-tab v-for="device in devices" :key="device.deviceName">
        {{ device.deviceName }}
      </v-tab>
      <v-tabs-items>
        <v-tab-item id="tab-recents" lazy>
          <v-card-text>
            <div v-if="!recentlyClosed.length" class="text-xs-center session-empty">
              <v-icon x-large>find_in_page</v-icon>
              <h2 class="subheading">{{ $t('Sessions.empty') }}</h2>
            </div>
            <li v-for="session in recentlyClosed" :key="`${session.title}${session.lastModified}`">
              <a :href="session.url" class="session text--primary">
                <i v-if="session.favIconUrl"
                   :style="{'background-image': `url(${session.favIconUrl})`}"/>
                <v-icon v-else>insert_drive_file</v-icon>
                <span :title="session.title" class="session-title">{{ session.title }}</span>
                <span class="time text--secondary">
                  {{ session.lastModified.toLocaleDateString($i18n.locale, dateOption) }}
                </span>
              </a>
            </li>
          </v-card-text>
        </v-tab-item>
        <v-tab-item
          v-for="device in devices"
          :key="device.deviceName" :id="`tab-${device.deviceName}`" lazy>
          <v-card-text>
            <li v-for="tab in device.tabs" :key="`${tab.title}${tab.lastModified}`">
              <a :href="tab.url" class="session text--primary">
                <i v-if="tab.favIconUrl" :style="{'background-image': `url(${tab.favIconUrl})`}"/>
                <v-icon v-else>insert_drive_file</v-icon>
                <span :title="tab.title" class="session-title">{{ tab.title }}</span>
                <span class="time text--secondary">
                  {{ tab.lastModified.toLocaleDateString($i18n.locale, dateOption) }}
                </span>
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
