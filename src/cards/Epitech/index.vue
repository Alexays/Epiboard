<template>
  <div id="epitech">
    <div v-if="loading" class="padding">
      <v-progress-linear indeterminate></v-progress-linear>
    </div>
    <div v-else-if="!is_logged" class="text-xs-center padding">
      <i class="material-icons md-48">error_outline</i>
      <h2 class="subheading">You must be logged to Epitech to use this card.</h2>
    </div>
    <v-tabs v-else dark grow slider-color="white" color="blue-grey">
      <v-tab>Infos</v-tab>
      <v-tab>Upcoming</v-tab>
      <v-tab>Ocupped Rooms</v-tab>
      <v-tabs-items>
        <v-tab-item lazy id="tab-infos">
          <div v-if="!settings.hideInfo && user" class="padding p-no-bottom text-xs-center">
            <h3>{{user.title}}</h3>
            <v-chip label v-on:click="getGpa()" title="Click to get a precision gpa">
              <v-progress-circular v-if="gpa_precision.loading" title="Calculating GPA" indeterminate :size="16" :width="2"></v-progress-circular>
              <span v-else>
                <span>{{gpa_precision.val || user.gpa[0].gpa}} <small>G.P.A.</small></span>
              </span>
            </v-chip>
            <v-chip label disabled>
              <span>{{user.credits}} <small>Credits</small></span>
            </v-chip>
            <v-chip v-if="user.spice && user.spice.available_spice" label disabled>
              <span>
                {{user.spice.available_spice}} <small>Spices</small>
              </span>
            </v-chip>
            <p>
              {{user.studentyear}}
              <sup>{{user.studentyear > 1 ? 'nd' : 'st'}}</sup> year, Promo {{user.promo}}
            </p>
          </div>
          <div v-if="projects.length" class="projects padding">
            <div class="project" v-for="project in projects" :key="project.title">
              <a target="_blank" :href="project.link">
                <h4>{{project.title}}</h4>
              </a>
              <small>{{project.timeline_start}}</small>
              <small class="end_date">{{project.timeline_end}}</small>
              <div v-if="project.timeline_barre < 60">
                <v-progress-linear :height="6" :value="project.timeline_barre"></v-progress-linear>
              </div>
              <div v-if="project.timeline_barre >= 60 && project.timeline_barre < 80">
                <v-progress-linear color="orange" background-color="orange lighten-2" :height="6" :value="project.timeline_barre"></v-progress-linear>
              </div>
              <div v-if="project.timeline_barre >= 80">
                <v-progress-linear color="red" background-color="red lighten-2" :height="6" :value="project.timeline_barre"></v-progress-linear>
              </div>
            </div>
          </div>
          <div v-else-if="!projects.length" class="text-xs-center padding">
            <i class="material-icons md-48">work</i>
            <h2 class="subheading">No on going projects, well done !</h2>
          </div>
          <timeline :user="user"></timeline>
        </v-tab-item>
        <v-tab-item lazy id="tab-upcoming" class="padding">
          <v-list three-line dense>
            <v-list-tile v-for="activity of upcoming" :key="activity.acti_title">
              <v-list-tile-content>
                <v-list-tile-title>{{activity.room.code | filename}}</v-list-tile-title>
                <v-list-tile-sub-title>
                  {{activity.acti_title}}<br/>
                  {{activity.startString}}&#8594;{{activity.endString}}
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action :title="activity.total_students_registered + ' student(s) for ' + activity.room.seats + ' seats'">
                <v-chip v-if="!activity.is_rdv" label disabled>
                  {{activity.total_students_registered}}/{{activity.room.seats}}
                </v-chip>
              </v-list-tile-action>
            </v-list-tile>
            <div v-if="!upcoming.length" class="text-xs-center">
              <i class="material-icons md-48">assignment_turned_in</i>
              <h2 class="subheading">No upcoming activities, go get some rest !</h2>
            </div>
          </v-list>
        </v-tab-item>
        <v-tab-item lazy id="tab-rooms" class="padding">
          <v-list three-line dense>
            <v-list-tile v-for="room of rooms" :key="room.acti_title">
              <v-list-tile-content>
                <v-list-tile-title>{{room.room.code | filename}}</v-list-tile-title>
                <v-list-tile-sub-title>
                  {{room.acti_title}}<br/>
                  {{room.startString}}&#8594;{{room.endString}}
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action :title="room.total_students_registered + ' student(s) for ' + room.room.seats + ' seats'">
                <v-chip v-if="!room.is_rdv" label disabled>
                  {{room.total_students_registered}}/{{room.room.seats}}
                </v-chip>
              </v-list-tile-action>
            </v-list-tile>
            <div v-if="!rooms.length" class="text-xs-center">
              <i class="material-icons md-48">room</i>
              <h2 class="subheading">No occuped rooms, have fun !</h2>
            </div>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
