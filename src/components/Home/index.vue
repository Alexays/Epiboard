<template>
  <div id="home">
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
          :title="key" :key="key" color="green" dark small @click="addCard(key)">
          {{ key }}
        </v-btn>
      </v-speed-dial>
    </transition>
    <transition-group
      id="card-container"
      :class="{ 'design-toolbar': $store.state.settings.header.design === 'toolbar' }"
      name="scale-transition"
      tag="div" appear>
      <card
        v-resize="onResize"
        v-for="card in cards" :key="card" :id="card" :data-id="card" @deleted="delCard(card)"/>
    </transition-group>
    <div v-if="emptyCards" class="text-xs-center">
      <v-icon x-large>grid_off</v-icon>
      <h2 class="subheading">You have no cards.</h2>
    </div>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
