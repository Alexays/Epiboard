<template>
  <v-card-text id="isefac">
    <div v-if="!is_logged" class="text-center">
      <v-icon x-large>mdi-alert-circle</v-icon>
      <h2 class="subtitle-1">You must be logged to Isefac to use this card.</h2>
    </div>
    <div v-else-if="!loading">
      <div class="text-center">
        <h3>{{ user.name }}</h3>
      </div>
      <v-list class="dates" three-line dense>
        <template v-for="(date, index) of dates">
          <v-subheader
            v-if="index === 0 || (dates[index - 1].header !== date.header)" :key="index">
            {{ date.header }}
          </v-subheader>
          <v-list-tile :key="date">
            <v-list-tile-content>
              <v-list-tile-title>{{ date.title }}</v-list-tile-title>
              <v-list-tile-sub-title v-if="date.salle">
                {{ date.salle }} - {{ date.intervenant }}
              </v-list-tile-sub-title>
              <v-list-tile-sub-title v-else-if="date.intervenant">
                {{ date.intervenant }}
              </v-list-tile-sub-title>
              <v-list-tile-sub-title :title="date.start">
                {{ date.startString }}&#8594;{{ date.endString }}
              </v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
      <div v-if="!dates.length" class="text-center">
        <v-icon x-large>mdi-briefcase</v-icon>
        <h2 class="subtitle-1">No more activities today, go get some rest !</h2>
      </div>
    </div>
    <v-progress-linear v-else indeterminate/>
  </v-card-text>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
