<template>
	<v-layout row wrap id="weather">
    <v-flex xs6>
      <div v-if="today">
        <div class="w-head">
          <span class="subheading">Today</span>
          <span class="subheading">{{today.name}}</span>
        </div>
        <img v-bind:src="'https://openweathermap.org/img/w/' + today.weather[0].icon + '.png'">
        <v-layout row wrap class="info-center">
          <v-flex xs6 class="text-xs-center">
            <p class="temp">{{today.main.temp}}°C</p>
            <p class="temp-cond">{{today.weather[0].main}}</p>
          </v-flex>
          <v-flex xs6>
            <p class="detail">{{today.weather[0].description}}</p>
            <p class="detail">Humidity: {{today.main.humidity}}%</p>
            <p class="detail">Min: {{today.main.temp_min}}°C&emsp;Max: {{today.main.temp_max}}°C</p>
          </v-flex>
        </v-layout>
      </div>
    </v-flex>
    <v-flex xs6>
    </v-flex>
	</v-layout>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
