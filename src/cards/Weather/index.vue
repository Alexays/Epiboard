<template>
  <div id="weather">
    <v-layout wrap>
      <v-flex xs8 class="left">
        <v-layout v-if="today" column align-content-space-between fill-height>
          <div class="text-right">
            <v-icon small>mdi-map-marker</v-icon> {{ today.name }}
          </div>
          <v-flex :xs9="settings.forecast" :xs11="!settings.forecast">
            <v-layout row wrap fill-height align-center class="today">
              <v-flex class="text-center">
                <v-img :title="today.weather[0].description" :src="getImg(today.weather[0]['id'])"/>
              </v-flex>
              <v-flex class="display-3 text-center">
                {{ today.main.temp }}
                <span v-if="settings.units === 'metric'" class="subtitle-1">°C</span>
                <span v-else-if="settings.units === 'imperial'" class="subtitle-1">°F</span>
                <span v-else-if="settings.units === 'kelvin'" class="subtitle-1">K</span>
                <div class="body-2">{{ today.weather[0].description }}</div>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-layout v-if="settings.forecast" class="forecast" justify-space-evenly wrap>
            <v-flex v-for="day in forecast" :key="day.dt_txt">
              <v-layout column align-center>
                <v-flex>
                  <v-img :title="day.title" :src="getImg(day.weather[0]['id'], false)"/>
                </v-flex>
                <v-flex>
                  {{ new Date(day.dt_txt).toLocaleString($t('locale'), { weekday: 'short' }) }}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-layout>
        <div v-else class="mt-12">
          <p v-if="geoError" class="subtitle-1 ml-2">
            {{ geoError }}
          </p>
          <v-progress-linear v-else indeterminate/>
        </div>
      </v-flex>
      <v-flex class="weather-info primary foreground--text head-drag">
        <v-layout v-if="today" class="title" column fill-height>
          <v-flex class="detail">
            <v-icon medium color="foreground">mdi-opacity</v-icon>
            <span :title="$t('Weather.humidity')">
              <b>{{ today.main.humidity }}</b> <span class="caption">%</span>
            </span>
          </v-flex>
          <v-flex class="detail">
            <v-icon medium color="foreground">mdi-cloud</v-icon>
            <span :title="$t('Weather.cloudiness')">
              <b>{{ today.clouds.all }}</b> <span class="caption">%</span>
            </span>
          </v-flex>
          <v-flex class="detail">
            <v-icon medium color="foreground">mdi-weather-windy</v-icon>
            <span :title="$t('Weather.wind_speed')">
              <b>{{ today.wind.speed }}</b>
              <span v-if="settings.units === 'imperial'" class="caption">mph</span>
              <span v-else class="caption">km/h</span>
            </span>
          </v-flex>
          <v-flex class="detail mt-1">
            <v-icon medium color="foreground">mdi-brightness-4</v-icon>
            <v-layout
              :class="{ 'small-font': sunrise.length > 5 || sunset.length > 5 }" column align-end>
              <span :title="$t('Weather.sunrise')">{{ sunrise }}</span>
              <span :title="$t('Weather.sunset')">{{ sunset }}</span>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout v-else-if="geoError" justify-space-around fill-height>
          <v-icon color="foreground" x-large>mdi-crosshairs-gps</v-icon>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
