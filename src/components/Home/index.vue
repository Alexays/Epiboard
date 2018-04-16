<template>
  <div id="home">
    <v-fab-transition>
      <v-speed-dial v-show="showFab" v-model="fab" :top="true" :right="true" direction="bottom" transition="slide-y-transition">
        <v-btn v-model="fab" slot="activator" dark fab color="blue">
          <v-icon>add</v-icon>
          <v-icon>close</v-icon>
        </v-btn>
        <v-btn :title="key" v-for="(value, key) in availableCards" :key="key" v-on:click="addCard(key, value)" dark
          small color="green">
          <span>{{key}}</span>
        </v-btn>
      </v-speed-dial>
    </v-fab-transition>
    <transition-group name="fade" appear tag="div" id="card-container" :class="{ dtoolbar: $store.state.settings.header.design === 'toolbar' }">
      <v-card hover raised v-for="(card, key) in cards" :key="key" :data-id="key" v-bind:width="card.size * 430 - 30 + 'px'">
        <v-card-title class="head-drag" :class="{'blue-grey': !card.custom || card.showSettings, custom: card.custom && !card.showSettings, 'white--text': !card.custom || card.showSettings}">
          <span v-show="!card.showSettings" class="headline">{{card.title || card.name || key}}</span>
          <span v-show="card.showSettings" class="headline">{{card.name || key}}</span>
          <div>
            <v-progress-circular :title="`${card.name || key} is fetching some data...`" v-show="!card.init" size="25" width="2" indeterminate color="white"></v-progress-circular>
            <v-menu v-show="!card.showSettings" bottom offset-y>
              <v-btn flat icon slot="activator">
                <v-icon color="white">more_vert</v-icon>
              </v-btn>
              <v-list>
                <v-list-tile v-if="keys.settings[key]" @click="showCardsSettings(key)">
                  <v-list-tile-title>Settings</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="deleteCard(key)">
                  <v-list-tile-title>Remove</v-list-tile-title>
                </v-list-tile>
              </v-list>
            </v-menu>
            <v-btn v-show="card.showSettings" flat icon @click="closeSettings(key, false)" color="white">
              <v-icon>close</v-icon>
            </v-btn>
            <v-btn v-show="card.showSettings" flat icon @click="closeSettings(key, true)" color="white">
              <v-icon>done</v-icon>
            </v-btn>
          </div>
        </v-card-title>
          <keep-alive>
            <component v-show="!card.showSettings" @init="setCards(key, $event)" :settings="getCardsSettings(key)" v-init="{key}" :is="card"></component>
          </keep-alive>
          <component v-if="card.showSettings && cardsSettings[key]" v-init="{key, settings: true}" :is="cardsSettings[key]"></component>
      </v-card>
    </transition-group>
    <div v-show="emptyCards" class="text-xs-center">
      <i class="material-icons md-48">grid_off</i>
      <h2 class="subheading">You have no cards.</h2>
    </div>
  </div>
</template>
<script src="../../../node_modules/hammerjs/hammer.min.js"></script>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
