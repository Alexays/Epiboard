<template>
  <v-content id="#onboarding">
    <v-container fluid>
      <v-layout align-center>
        <v-card
          v-show="index === 0"
          :width="400" hover raised class="primary foreground--text mx-auto mt-3">
          <v-card-title class="secondary">
            <h3 class="headline">Hello there</h3>
          </v-card-title>
          <v-card-text class="text-xs-center">
            <v-icon color="white" x-large>insert_emoticon</v-icon>
            <h3 class="subheading">This is your shiny new tab page !</h3>
          </v-card-text>
          <v-card-actions class="secondary">
            <v-spacer/>
            <v-btn color="teal lighten-4" flat @click.stop="index += 1">Begin</v-btn>
          </v-card-actions>
        </v-card>
        <v-card
          v-show="index === 1"
          :width="500" hover raised class="primary foreground--text mx-auto mt-3">
          <v-card-title class="secondary">
            <h3 class="headline">Why Epiboard is Awesome</h3>
          </v-card-title>
          <v-card-text>
            <v-checkbox
              label="Preferences synced across your browsers (if signed in)"
              input-value="true" value readonly dark/>
            <v-checkbox label="One card for each need" input-value="true" value readonly dark/>
            <v-checkbox label="Material Design" input-value="true" value readonly dark/>
          </v-card-text>
          <v-card-actions class="secondary">
            <v-spacer/>
            <v-btn color="teal lighten-4" flat @click="finish()">Next</v-btn>
          </v-card-actions>
        </v-card>
      </v-layout>
    </v-container>
  </v-content>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
