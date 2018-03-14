<template>
  <div id="weather">
    <div class="no-margins" v-if="today">
      <v-layout row wrap>
        <v-flex xs8 class="left">
          <v-layout column>
            <v-flex>
              <v-layout row wrap class="main">
                <v-flex>
                  <i :class="'owf owf-' + today.weather[0]['id'] + getSuffix()"></i>
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
              <v-icon medium color="white">opacity</v-icon> {{today.main.humidity}}%
            </v-flex>
            <v-flex class="detail">
              <i class="owf owf-905 white--text"></i> {{today.wind.speed}}km/h
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
