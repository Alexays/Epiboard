<template>
  <div id="lastfm">
    <v-card-text v-if="loading">
      <v-progress-linear indeterminate/>
    </v-card-text>
    <v-tabs v-else-if="itemsLength" v-model="active">
      <v-tab-item v-for="(item, key) in items" :key="item.title" :id="`tab_${key}`">
        <v-layout class="top-grid" wrap>
          <v-flex xs6>
            <div class="cover">
              <img :src="item.data[0].image[3]['#text']">
              <div class="overlay">
                <span>
                  <h4 class="subheading">{{ item.data[0].name }}</h4>
                  <p>{{ item.data[0].playcount }}
                    play{{ item.data[0].playcount !== 1 ? 's' : '' }}</p>
                </span>
              </div>
            </div>
          </v-flex>
          <v-flex v-for="i in 2" :key="i" xs3>
            <v-layout row wrap>
              <div class="cover">
                <img :src="item.data[i].image[2]['#text']">
                <div class="overlay">
                  <span>
                    <h4 class="caption">{{ item.data[i].name }}</h4>
                    <p>{{ item.data[i].playcount }}
                      play{{ item.data[i].playcount !== 1 ? 's' : '' }}</p>
                  </span>
                </div>
              </div>
              <div class="cover">
                <img :src="item.data[i + 2].image[2]['#text']">
                <div class="overlay">
                  <span>
                    <h4 class="caption">{{ item.data[i + 2].name }}</h4>
                    <p>
                      {{ item.data[i + 2].playcount }}
                      play{{ item.data[i + 2].playcount !== 1 ? 's' : '' }}
                    </p>
                  </span>
                </div>
              </div>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-tab-item>
    </v-tabs>
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
