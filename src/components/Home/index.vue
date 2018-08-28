<template>
  <v-container id="home" fluid>
    <transition name="fab-transition" mode="out-in">
      <v-speed-dial
        v-show="showFab"
        v-model="fab" direction="bottom" transition="slide-y-transition" right>
        <v-btn slot="activator" v-model="fab" color="accent" fab>
          <v-icon>add</v-icon>
          <v-icon>close</v-icon>
        </v-btn>
        <v-btn
          v-for="(value, key) in availableCards"
          :key="key" color="green" dark small @click="addCard(key)">
          {{ key }}
        </v-btn>
      </v-speed-dial>
    </transition>
    <transition-group
      id="card-container"
      :class="{ 'has-toolbar': $store.state.settings.header.design === 'toolbar' }"
      name="fade" tag="div" appear>
      <card
        v-resize
        v-for="card in cards" :key="card" :id="card" @deleted="delCard(card)"/>
    </transition-group>
    <v-layout v-if="emptyCards" align-center justify-space-around fill-height column>
      <v-card class="text-xs-center" color="transparent" flat>
        <v-icon x-large>grid_off</v-icon>
        <h2 v-t="'home.no_cards'" class="subheading"/>
        <h2 v-t="'home.add_cards'" class="caption"/>
      </v-card>
    </v-layout>
  </v-container>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
