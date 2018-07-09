<template>
  <div id="lastfm">
    <v-card-text v-if="loading">
      <v-progress-linear indeterminate/>
    </v-card-text>
    <v-layout v-else-if="artists.length" class="top-grid" wrap>
      <v-flex xs6>
        <div class="cover">
          <img :src="artists[0].image[3]['#text']">
          <div class="overlay">
            <span>
              <h4 class="subheading">{{ artists[0].name }}</h4>
              <p>{{ artists[0].playcount }} play{{ artists[0].playcount !== 1 ? 's' : '' }}</p>
            </span>
          </div>
        </div>
      </v-flex>
      <v-flex v-for="i in 2" :key="i" xs3>
        <v-layout row wrap>
          <div class="cover">
            <img :src="artists[i].image[2]['#text']">
            <div class="overlay">
              <span>
                <h4 class="caption">{{ artists[i].name }}</h4>
                <p>{{ artists[i].playcount }} play{{ artists[i].playcount !== 1 ? 's' : '' }}</p>
              </span>
            </div>
          </div>
          <div class="cover">
            <img :src="artists[i + 2].image[2]['#text']">
            <div class="overlay">
              <span>
                <h4 class="caption">{{ artists[i + 2].name }}</h4>
                <p>
                  {{ artists[i + 2].playcount }}
                  play{{ artists[i + 2].playcount !== 1 ? 's' : '' }}
                </p>
              </span>
            </div>
          </div>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-card-text v-else-if="!user || !user.length" class="text-xs-center">
      <v-icon x-large="">library_music</v-icon>
      <h2 class="subheading">Please enter your username in the card settings.</h2>
    </v-card-text>
    <v-card-text v-else class="text-xs-center">
      <v-icon x-large="">library_music</v-icon>
      <h2 class="subheading">Obviously you don't have any top</h2>
    </v-card-text>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
