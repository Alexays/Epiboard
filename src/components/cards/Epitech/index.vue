<template>
<div class="blue-grey">
    <v-card-title class="white--text">
      <span class="headline">Epitech</span>
    </v-card-title>
    <v-card-text v-if="loading">
      <v-progress-linear v-bind:indeterminate="true"></v-progress-linear>
    </v-card-text>
    <v-card-text v-if="!loading && !logged" class="white">
      <h4>You're not logged !</h4>
    </v-card-text>
    <v-card-text v-if="!loading && logged" class="white">
      <h3>{{title}}</h3>
      <p>{{gpa}}</p>
    </v-card-text>
</div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
