<template>
  <div id="lastfm">
    <v-card-text v-if="loading">
      <v-progress-linear indeterminate/>
    </v-card-text>
    <div v-else-if="itemsLength" class="top-grid">
      <div
        title="Previous"
        class="prev" @click.stop="active > 0 ? active -= 1 : active = itemsLength - 1"/>
      <v-tabs v-model="active" grow hide-slider>
        <v-tab v-for="(item, key) in items" :key="key"/>
        <v-tab-item v-for="(item, key) in items" :key="key">
          <v-layout wrap>
            <v-flex xs6>
              <div class="cover">
                <img :src="item.data[0].image.extralarge">
                <div class="overlay">
                  <h4 class="subheading">{{ item.data[0].name }}</h4>
                  <p v-if="item.data[0].artist">{{ item.data[0].artist.name }}</p>
                  <p>{{ item.data[0].playcount }}
                    play{{ item.data[0].playcount !== 1 ? 's' : '' }}</p>
                </div>
              </div>
            </v-flex>
            <v-flex v-for="i in 2" v-if="item.data[i]" :key="i" xs3>
              <v-layout row wrap>
                <div v-for="j in [i, i + 2]" v-if="item.data[j]" :key="j" class="cover">
                  <img :src="item.data[j].image.large">
                  <div class="overlay">
                    <h4 class="caption">{{ item.data[j].name }}</h4>
                    <p v-if="item.data[j].artist">{{ item.data[j].artist.name }}</p>
                    <p>{{ item.data[j].playcount }}
                      play{{ item.data[j].playcount !== 1 ? 's' : '' }}</p>
                  </div>
                </div>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-tab-item>
      </v-tabs>
      <div
        title="Next"
        class="next" @click.stop="active < itemsLength - 1 ? active += 1 : active = 0"/>
    </div>
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
