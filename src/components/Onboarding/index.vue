<template>
  <div id="#onboarding">
    <v-layout align-center>
      <transition name="slide-y-transition">
        <v-card v-show="index === 0" hover raised :width="400" class="blue-grey white--text mx-auto mt-3">
          <v-card-title>
            <h3 class="headline">Hello there :)</h3>
          </v-card-title>
          <v-card-text>
            <h3 class="subheading">This is your shiny new tab page !</h3>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="teal lighten-4" flat @click.stop="index += 1">Next</v-btn>
          </v-card-actions>
        </v-card>
      </transition>
      <transition name="slide-y-transition">
        <v-card v-show="index === 1" hover raised :width="500" class="blue-grey white--text mx-auto mt-3">
          <v-card-title>
            <h3 class="headline">Why Epiboard is Awesome</h3>
          </v-card-title>
          <v-card-text>
            <v-checkbox label="Preferences synced across your browsers (if signed in)" input-value="true" value readonly></v-checkbox>
            <v-checkbox label="Material Design" input-value="true" value readonly></v-checkbox>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="teal lighten-4" flat @click="finish()">Next</v-btn>
          </v-card-actions>
        </v-card>
      </transition>
    </v-layout>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
