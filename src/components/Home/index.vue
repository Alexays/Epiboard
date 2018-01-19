<template>
    <div id="container">
        <transition-group name="slide-fade" appear tag="div" id="card-container">
          <v-card v-for="(card, key) in cards" :data-item-id="key" :key="key">
            <div class="blue-grey">
              <v-card-title class="white--text">
                <span class="headline">{{card.name}}</span>
                <v-menu bottom offset-y>
                  <v-btn flat icon slot="activator">
                    <i class="material-icons small white--text">more_vert</i>
                  </v-btn>
                  <v-list>
                    <v-list-tile>
                      <v-list-tile-title v-on:click="deleteCard(key)">Remove</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </v-card-title>
              <v-card-text class="white">
                <component :is="card"></component>
              </v-card-text>
            </div>
          </v-card>
        </transition-group>
    </div>
</template>
<script src="../../../node_modules/web-animations-js/web-animations.min.js"></script>
<script src="../../../node_modules/hammerjs/hammer.min.js"></script>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
