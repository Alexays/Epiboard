<template>
  <div id="weather">
    <div class="no-margins" v-if="today">
      <v-layout row wrap>
        <v-flex xs8 class="left">
          <v-layout column>
            <v-flex>
              <v-layout row wrap class="main">
                <v-flex>
                  <img :title="today.weather[0].description" :src="'/static/img/weather-'+ getImg(today.weather[0]['id']) +'.png'"/>
                </v-flex>
                <v-flex>
                  <p class="temp">{{today.main.temp}}
                    <span class="unit">°C</span>
                  </p>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex class="city">
              <v-icon>location_on</v-icon> {{today.name}}
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs4 class="weather-info blue-grey">
          <v-layout column>
            <v-flex class="detail">
              <v-icon medium color="white">opacity</v-icon> <span><b>{{today.main.humidity}}</b>%</span>
            </v-flex>
            <v-flex class="detail">
              <v-icon medium color="white">wrap_text</v-icon> <span><b>{{today.wind.speed}}</b> <small>m/s</small></span>
            </v-flex>
            <v-flex class="detail">
              <v-icon medium color="white">brightness_4</v-icon>
              <v-layout column class="sun">
                <v-flex>
                  {{getTime(today.sys.sunrise)}}
                </v-flex>
                <v-flex>
                  {{getTime(today.sys.sunset)}}
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
    <div v-else class="weather-loader">
        <v-progress-linear v-bind:indeterminate="true"></v-progress-linear>
    </div>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
