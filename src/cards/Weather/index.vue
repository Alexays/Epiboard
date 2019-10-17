<template>
  <div id="weather">
    <v-layout row wrap>
      <v-flex xs8 class="left">
        <v-layout v-if="today" column align-content-space-between fill-height>
          <v-flex xs1 class="text-xs-right">
            <v-icon small>location_on</v-icon> {{ today.name }}
          </v-flex>
          <v-flex :xs9="settings.forecast" :xs11="!settings.forecast">
            <v-layout row fill-height align-center class="today">
              <v-flex class="text-xs-center">
                <v-img :title="today.weather[0].description" :src="getImg(today.weather[0]['id'])"/>
              </v-flex>
              <v-flex class="display-3 text-xs-center" fill-height>
                {{ today.main.temp }}
                <span v-if="settings.units === 'metric'" class="subheading">°C</span>
                <span v-else-if="settings.units === 'imperial'" class="subheading">°F</span>
                <span v-else-if="settings.units === 'kelvin'" class="subheading">K</span>
                <p class="body-1">{{ today.weather[0].description }}</p>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex v-if="settings.forecast" xs2>
            <v-layout class="forecast" row wrap>
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
          </v-flex>
        </v-layout>
        <div v-else class="mt-5">
          <p v-if="geoError" class="subheading ml-2">
            {{ geoError }}
          </p>
          <v-progress-linear v-else indeterminate/>
        </div>
      </v-flex>
      <v-flex xs4 class="weather-info primary foreground--text head-drag">
        <v-layout v-if="today" class="title" column fill-height>
          <v-flex class="detail mb-1">
            <v-icon medium color="foreground">opacity</v-icon>
            <span :title="$t('Weather.humidity')">
              <b>{{ today.main.humidity }}</b> <span class="caption">%</span>
            </span>
          </v-flex>
          <v-flex class="detail mb-1">
            <v-icon medium color="foreground">cloud</v-icon>
            <span :title="$t('Weather.cloudiness')">
              <b>{{ today.clouds.all }}</b> <span class="caption">%</span>
            </span>
          </v-flex>
          <v-flex class="detail mb-1">
            <v-icon medium color="foreground">wrap_text</v-icon>
            <span :title="$t('Weather.wind_speed')">
              <b>{{ today.wind.speed }}</b>
              <span v-if="settings.units === 'imperial'" class="caption">mph</span>
              <span v-else class="caption">km/h</span>
            </span>
          </v-flex>
          <v-flex class="detail mt-1">
            <v-icon medium color="foreground">brightness_4</v-icon>
            <v-layout
              :class="{ 'small-font': sunrise.length > 5 || sunset.length > 5 }" column align-end>
              <v-flex>
                <span :title="$t('Weather.sunrise')">{{ sunrise }}</span>
              </v-flex>
              <v-flex>
                <span :title="$t('Weather.sunset')">{{ sunset }}</span>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
        <v-layout v-else-if="geoError" justify-space-around fill-height>
          <v-icon color="foreground" x-large>gps_off</v-icon>
        </v-layout>
      </v-flex>
    </v-layout>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
