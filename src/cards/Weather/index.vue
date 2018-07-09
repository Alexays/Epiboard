<template>
  <div id="weather">
    <v-layout v-if="today" row wrap>
      <v-flex xs8 class="left">
        <v-layout column align-content-space-between fill-height>
          <v-flex class="city" align-end>
            <v-icon>location_on</v-icon> {{ today.name }}
          </v-flex>
          <v-flex>
            <v-layout row wrap class="main">
              <v-flex>
                <img :title="today.weather[0].description" :src="getImg(today.weather[0]['id'])">
              </v-flex>
              <v-flex>
                <p class="temp">
                  {{ today.main.temp }}
                  <span v-if="settings.units === 'metric'" class="unit">°C</span>
                  <span v-if="settings.units === 'imperial'" class="unit">°F</span>
                  <span v-if="settings.units === 'kelvin'" class="unit">K</span>
                </p>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex v-if="settings.forecast" class="forecast">
            <v-layout row wrap>
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
        <v-layout column>
          <v-flex class="detail">
            <v-icon medium color="foreground">opacity</v-icon>
            <span title="Humidity"><b>{{ today.main.humidity }}</b>%</span>
          </v-flex>
          <v-flex class="detail">
            <v-icon medium color="foreground">wrap_text</v-icon>
            <span title="Wind speed">
              <b>{{ today.wind.speed }}</b> <span class="unit">km/h</span>
            </span>
          </v-flex>
          <v-flex class="detail">
            <v-icon medium color="foreground">brightness_4</v-icon>
            <v-layout column class="sun">
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
