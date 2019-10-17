<template>
  <v-container id="home" fluid>
    <transition name="fab-transition" mode="out-in">
      <v-speed-dial
        v-if="!$options.isPreRender"
        v-show="availableCards.length"
        v-model="fab" direction="bottom" transition="slide-y-transition" right>
        <v-btn slot="activator" v-model="fab" color="accent" fab>
          <v-icon>add</v-icon>
          <v-icon>close</v-icon>
        </v-btn>
        <template v-if="fab">
          <v-btn
            v-for="card in availableCards"
            :key="card"
            :title="getTranslation(`${card}.description`)"
            color="green" dark small @click="addCard(card)">
            {{ getTranslation(`${card}.title`) || card }}
          </v-btn>
        </template>
      </v-speed-dial>
    </transition>
    <transition-group
      v-if="!$options.isPreRender"
      id="card-container"
      :class="{ 'has-toolbar': $store.state.settings.header.design === 'toolbar' }"
      name="fade" tag="div">
      <card
        v-resize
        v-for="card in cards"
        :key="card.name" :name="card.id" :id="card.id" @deleted="delCard(card.id)"/>
    </transition-group>
    <div v-else id="card-container" class="placeholder">
      <div
        v-for="i in 5"
        :key="i"
        :style="{ height: `${[, 350, 250, 200, 300, 200][i]}px` }" class="card placeholder-item"/>
    </div>
    <v-layout
      v-if="!$options.isPreRender && !cards.length"
      align-center justify-space-around fill-height column>
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
