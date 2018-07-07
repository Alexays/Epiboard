<template>
  <div id="lastfm">
    <v-card-text v-if="loading">
      <v-progress-linear indeterminate/>
    </v-card-text>
    <v-layout v-else-if="user && user.length" class="topGrid" wrap>
      <v-flex xs6>
        <img :src="artists[0].image[3]['#text']" class="cover">
      </v-flex>
      <v-flex v-for="i in 2" :key="i" xs3>
        <v-layout row wrap>
          <img :src="artists[i].image[2]['#text']" class="cover">
          <img :src="artists[i + 2].image[2]['#text']" class="cover">
        </v-layout>
      </v-flex>
    </v-layout>
    <v-card-text v-else class="text-xs-center">
      <v-icon x-large="">apps</v-icon>
      <h2 class="subheading">Please enter your username in the card settings.</h2>
    </v-card-text>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
