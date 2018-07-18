<template>
  <div id="weather">
    <v-layout v-if="today" row wrap>
      <v-flex xs8 class="left">
        <v-layout column align-content-space-between fill-height>
          <v-flex xs1 class="text-xs-right">
            <v-icon small>location_on</v-icon> {{ today.name }}
          </v-flex>
          <v-flex :xs9="settings.forecast" :xs11="!settings.forecast">
            <v-layout row wrap fill-height align-center class="today">
              <v-flex>
                <img :title="today.weather[0].description" :src="getImg(today.weather[0]['id'])">
              </v-flex>
              <v-flex class="display-3">
                {{ today.main.temp }}
                <span v-if="settings.units === 'metric'" class="subheading">°C</span>
                <span v-else-if="settings.units === 'imperial'" class="subheading">°F</span>
                <span v-else-if="settings.units === 'kelvin'" class="subheading">K</span>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex v-if="settings.forecast" xs2>
            <v-layout class="forecast" row wrap>
              <v-flex v-for="day in forecast" :key="day.dayName">
                <v-layout column align-center>
                  <v-flex>
                    <img :title="day.title" :src="getImg(day.weather[0]['id'], false)">
                  </v-flex>
                  <v-flex>
                    {{ day.dayName }}
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
      <v-flex xs4 class="weather-info primary foreground--text head-drag">
        <v-layout column class="title">
          <v-flex class="detail my-2">
            <v-icon medium color="foreground">opacity</v-icon>
            <span title="Humidity">
              <b>{{ today.main.humidity }}</b> <span class="caption">%</span>
            </span>
          </v-flex>
          <v-flex class="detail my-2">
            <v-icon medium color="foreground">wrap_text</v-icon>
            <span title="Wind speed">
              <b>{{ today.wind.speed }}</b> <span class="caption">km/h</span>
            </span>
          </v-flex>
          <v-flex class="detail my-2">
            <v-icon medium color="foreground">brightness_4</v-icon>
            <v-layout column align-end>
              <v-flex>
                <span title="Sunrise">{{ sunrise }}</span>
              </v-flex>
              <v-flex>
                <span title="Sunset">{{ sunset }}</span>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
    <div v-else class="weather-loader">
      <v-progress-linear indeterminate/>
    </div>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
