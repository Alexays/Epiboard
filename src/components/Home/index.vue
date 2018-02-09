<template>
  <div id="home">
    <v-fab-transition>
      <v-speed-dial v-show="!emptyCards" v-model="fab" :top="true" :right="true" direction="bottom" transition="slide-y-transition">
        <v-btn v-model="fab" slot="activator" dark fab color="blue">
          <v-icon>add</v-icon>
          <v-icon>close</v-icon>
        </v-btn>
        <v-btn v-for="(card, key) in nCards" :key="key" v-on:click="addCard(card, key)" :fab="!!card.icon" dark small color="green">
          <v-icon v-if="card.icon">{{card.icon}}</v-icon>
          <span v-if="!card.icon">{{card.name}}</span>
        </v-btn>
      </v-speed-dial>
    </v-fab-transition>
    <transition-group name="slide-fade" appear tag="div" id="card-container">
      <v-card v-for="(card, key) in cards" :key="key" :data-item-id="key" v-bind:width="card.size * 430 - 30 + 'px'">
        <div class="blue-grey">
          <v-card-title class="white--text">
            <span class="headline">{{card.name}}</span>
            <v-menu bottom offset-y>
              <v-btn flat icon slot="activator">
                <i class="material-icons small white--text">more_vert</i>
              </v-btn>
              <v-list>
                <v-list-tile @click="deleteCard(key)">
                  <v-list-tile-title>Remove</v-list-tile-title>
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
