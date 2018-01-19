<template>
<div class="blue-grey">
    <v-card-title class="white--text">
      <span class="headline">Epitech</span>
    </v-card-title>
    <v-card-text v-if="logged" class="white">
      <div v-if="!user.loading">
      <h3 class="subheading">
        {{user.title}} 
        <v-chip label>{{user.gpa[0].gpa}}</v-chip>
      </h3>
      <p class="body-2">
        {{user.studentyear}}<sup>{{user.studentyear > 1 ? 'nd' : 'st'}}</sup> year,
         Promo {{user.promo}}
      </p>
      </div>
      <div v-if="!projects.loading">
        <div class="p-timeline" v-for="(project, key) in projects" :key="key">
          <h4>{{project.title}}</h4><small class="end_date">{{project.timeline_end}}</small>
          <v-progress-linear height="6" :value="project.timeline_barre"></v-progress-linear>
        </div>
      </div>
    </v-card-text>
    <v-card-text v-if="user.loading || projects.loading" class="white">
      <v-progress-linear v-bind:indeterminate="true"></v-progress-linear>
    </v-card-text>
    <v-card-text v-if="!user.loading && !logged" class="white">
      <h4>You're not logged !</h4>
    </v-card-text>
</div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
