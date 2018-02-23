<template>
  <div id="epitech">
    <div v-if="!is_logged" class="white text-xs-center">
      <i class="material-icons md-48">error_outline</i>
      <h2 class="subheading">You must be logged to epitech to use this card.</h2>
    </div>
    <v-tabs v-else dark grow show-arrows color="blue-grey" class="no-margins">
      <v-tabs-slider color="white"></v-tabs-slider>
      <v-tab>Infos</v-tab>
      <v-tab>Upcoming</v-tab>
      <v-tab>Ocupped Rooms</v-tab>
      <v-tabs-items>
        <v-tab-item>
          <div v-if="!user.loading" class="text-xs-center">
            <h3>
              {{user.title}}
              <br>
              <v-chip label disabled>{{user.gpa[0].gpa}}
                <small>&nbsp;G.P.A.</small>
              </v-chip>
              <v-chip label disabled>{{user.credits}}
                <small>&nbsp;Credits</small>
              </v-chip>
              <v-chip v-if="user.spice && user.spice.available_spice" label disabled>
                {{user.spice.available_spice - (user.spice.consumed_spice || 0)}}
                <small>&nbsp;Spices</small>
              </v-chip>
            </h3>
            <p>
              {{user.studentyear}}
              <sup>{{user.studentyear > 1 ? 'nd' : 'st'}}</sup> year, Promo {{user.promo}}
            </p>
          </div>
          <div v-if="!projects.loading" class="project">
            <div class="p-timeline" v-for="(project, key) in projects.data" :key="key">
              <a target="_blank" v-bind:href="API + project.title_link">
                <h4>{{project.title}}</h4>
              </a>
              <small>{{project.timeline_start}}</small>
              <small class="end_date">{{project.timeline_end}}</small>
              <div v-if="project.timeline_barre < 60">
                <v-progress-linear height="6" :value="project.timeline_barre"></v-progress-linear>
              </div>
              <div v-if="project.timeline_barre >= 60 && project.timeline_barre < 80">
                <v-progress-linear color="orange" background-color="orange lighten-2" height="6" :value="project.timeline_barre"></v-progress-linear>
              </div>
              <div v-if="project.timeline_barre >= 80">
                <v-progress-linear color="red" background-color="red lighten-2" height="6" :value="project.timeline_barre"></v-progress-linear>
              </div>
            </div>
          </div>
          <div v-if="projects.loading || user.loading" class="white">
            <v-progress-linear v-bind:indeterminate="true"></v-progress-linear>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div class="upcommings">
            <v-list v-if="!upcommings.loading" three-line dense>
              <template v-for="upcomming of upcommings.data">
                <v-list-tile :key="upcomming">
                  <v-list-tile-content>
                    <v-list-tile-title>{{upcomming.room.code | filename}}</v-list-tile-title>
                    <v-list-tile-sub-title v-html="upcomming.acti_title  + '<br/> From ' + upcomming.startString + ' to ' + upcomming.endString"></v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action :title="upcomming.total_students_registered + ' student(s) for ' + upcomming.room.seats + ' seats'">
                    <v-chip label disabled>
                      {{upcomming.total_students_registered}}/{{upcomming.room.seats}}
                    </v-chip>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
              <div v-if="!upcommings.data.length" class="white text-xs-center session-empty">
                <i class="material-icons md-48">room</i>
                <h2 class="subheading">No upcomming activities, go get some rest !</h2>
              </div>
            </v-list>
            <div v-else class="white">
              <v-progress-linear v-bind:indeterminate="true"></v-progress-linear>
            </div>
          </div>
        </v-tab-item>
        <v-tab-item>
          <div class="rooms">
            <v-list v-if="!rooms.loading" three-line dense>
              <template v-for="room of rooms.data">
                <v-list-tile :key="room">
                  <v-list-tile-content>
                    <v-list-tile-title>{{room.room.code | filename}}</v-list-tile-title>
                    <v-list-tile-sub-title v-html="room.acti_title + '<br/> Taken from ' + room.startString + ' to ' + room.endString"></v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action :title="room.total_students_registered + ' student(s) for ' + room.room.seats + ' seats'">
                    <v-chip label disabled>
                      {{room.total_students_registered}}/{{room.room.seats}}
                    </v-chip>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
              <div v-if="!rooms.data.length" class="white text-xs-center session-empty">
                <i class="material-icons md-48">room</i>
                <h2 class="subheading">No occuped rooms, have fun !</h2>
              </div>
            </v-list>
            <div v-else class="white">
              <v-progress-linear v-bind:indeterminate="true"></v-progress-linear>
            </div>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
