<template>
  <div id="isefac">
    <div v-if="!is_logged" class="white text-xs-center">
      <i class="material-icons md-48">error_outline</i>
      <h2 class="subheading">You must be logged to Isefac to use this card.</h2>
    </div>
    <div v-else-if="!loading">
      <div class="text-xs-center">
        <h3>{{user.name}}</h3>
      </div>
      <v-list class="dates" three-line dense>
        <template v-for="(date, index) of dates">
          <v-subheader v-if="index === 0 || (dates[index - 1].header !== date.header)" :key="index">{{ date.header }}</v-subheader>
          <v-list-tile :key="date">
            <v-list-tile-content>
              <v-list-tile-title>{{date.title}}</v-list-tile-title>
              <v-list-tile-sub-title v-if="date.salle" v-html="date.salle + ' - ' + date.intervenant"></v-list-tile-sub-title>
              <v-list-tile-sub-title v-else-if="date.intervenant" v-html="date.intervenant"></v-list-tile-sub-title>
              <v-list-tile-sub-title :title="date.start" v-html="date.startString + '&#8594;' + date.endString"></v-list-tile-sub-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
      <div v-if="!dates.length" class="white text-xs-center session-empty">
        <i class="material-icons md-48">room</i>
        <h2 class="subheading">No more activities today, go get some rest !</h2>
      </div>
    </div>
    <div v-else class="white">
        <v-progress-linear v-bind:indeterminate="true"></v-progress-linear>
    </div>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
