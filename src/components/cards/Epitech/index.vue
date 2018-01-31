<template>
  <div id="epitech">
    <div v-if="!user.loading && user.loaded" class="text-xs-center">
      <h3>
        {{user.title}}
        <br>
        <v-chip label>{{user.gpa[0].gpa}}
          <small>&nbsp;G.P.A.</small>
        </v-chip>
        <v-chip label>{{user.credits}}
          <small>&nbsp;Credits</small>
        </v-chip>
      </h3>
      <p>
        {{user.studentyear}}
        <sup>{{user.studentyear > 1 ? 'nd' : 'st'}}</sup> year, Promo {{user.promo}}
      </p>
    </div>
    <div v-if="!projects.loading && projects.loaded">
      <div class="p-timeline" v-for="(project, key) in projects" :key="key">
        <a target="_blank" v-bind:href="API + project.title_link">
          <h4>{{project.title}}</h4>
        </a>
        <small>{{project.timeline_start}}</small>
        <small class="end_date">{{project.timeline_end}}</small>
        <v-progress-linear height="6" :value="project.timeline_barre"></v-progress-linear>
      </div>
    </div>
    <div v-if="user.loading || projects.loading" class="white">
      <v-progress-linear v-bind:indeterminate="true"></v-progress-linear>
    </div>
    <div v-if="!user.loading && !projects.loading && !user.loaded && !projects.loaded" class="white text-xs-center">
      <i class="material-icons md-48">error_outline</i>
      <h2 class="subheading">You must be logged to epitech to use this card.</h2>
    </div>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
