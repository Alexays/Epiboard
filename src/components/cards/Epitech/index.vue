<template>
<div class="blue-grey">
    <v-card-title class="white--text">
      <span class="headline">Epitech</span>
    </v-card-title>
    <v-card-text v-if="loading" class="white">
      <v-progress-linear v-bind:indeterminate="true"></v-progress-linear>
    </v-card-text>
    <v-card-text v-if="!loading && !logged" class="white">
      <h4>You're not logged !</h4>
    </v-card-text>
    <v-card-text v-if="!loading && logged" class="white">
      <h3 class="subheading">
        {{user.title}} 
        <v-chip label>{{user.gpa[0].gpa}}</v-chip>
      </h3>
      <p class="body-2">
        {{user.studentyear}}<sup>{{user.studentyear > 1 ? 'nd' : 'st'}}</sup> year,
         Promo {{user.promo}}
      </p>
    </v-card-text>
</div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
