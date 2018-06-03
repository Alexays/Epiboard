<template>
  <div id="home">
    <transition name="fab-transition" mode="out-in">
      <v-speed-dial v-show="showFab" v-model="fab" top right direction="bottom" transition="slide-y-transition">
        <v-btn v-model="fab" slot="activator" dark fab color="blue">
          <v-icon>add</v-icon>
          <v-icon>close</v-icon>
        </v-btn>
        <v-btn :title="key" v-for="(value, key) in availableCards" :key="key" v-on:click="addCard(key)" dark small color="green">
          {{key}}
        </v-btn>
      </v-speed-dial>
    </transition>
    <transition-group name="fade" appear tag="div" id="card-container" :class="{ 'design-toolbar': $store.state.settings.header.design === 'toolbar' }">
      <cards v-for="card in cards" v-if="cmp[card]" :key="card" :id="card" @deleted="delCard(card)"></cards>
    </transition-group>
    <div v-show="emptyCards" class="text-xs-center">
      <i class="material-icons md-48">grid_off</i>
      <h2 class="subheading">You have no cards.</h2>
    </div>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
