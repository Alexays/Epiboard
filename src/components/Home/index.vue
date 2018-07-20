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
          :title="(cardsCmp[key].manifest || {}).description || key"
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
        v-resize="onResize"
        v-for="card in cards" :key="card" :id="card" :data-id="card" @deleted="delCard(card)"/>
    </transition-group>
    <v-layout v-if="emptyCards" align-center justify-space-around fill-height column>
      <v-card class="text-xs-center" color="transparent" flat>
        <v-icon x-large>grid_off</v-icon>
        <h2 class="subheading">No cards.</h2>
        <h2 class="caption">You can add cards by click on fab button in top right.</h2>
      </v-card>
      <div/>
    </v-layout>
  </v-container>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
