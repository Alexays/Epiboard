<template>
  <div id="epitech">
    <div v-if="!is_logged" class="text-xs-center">
      <i class="material-icons md-48">error_outline</i>
      <h2 class="subheading">You must be logged to Epitech to use this card.</h2>
    </div>
    <v-tabs v-else dark grow show-arrows slider-color="white" color="blue-grey" class="no-margins">
      <v-tab>Infos</v-tab>
      <v-tab>Upcoming</v-tab>
      <v-tab>Ocupped Rooms</v-tab>
      <v-tabs-items>
        <v-tab-item>
          <div v-if="!user.loading" class="text-xs-center">
            <h3>
              {{user.title}}
              <br>
              <v-chip label v-on:click="getGpa()" title="Click to get a precision gpa">
                <span v-if="gpa_precision.loading" title="Calculating GPA">
                  <v-progress-circular indeterminate :size="16" :width="2"></v-progress-circular>
                </span>
                <span v-else>
                  {{gpa_precision.val || user.gpa[0].gpa}}
                  <small>&nbsp;G.P.A.</small>
                </span>
              </v-chip>
              <v-chip label disabled>{{user.credits}}
                <small>&nbsp;Credits</small>
              </v-chip>
              <v-chip v-if="user.spice && user.spice.available_spice" label disabled>
                {{user.spice.available_spice}}
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
          <div v-if="projects.loading || user.loading">
            <v-progress-linear v-bind:indeterminate="true"></v-progress-linear>
          </div>
          <a @click="getTimeline()">Open timeline</a>
        </v-tab-item>
        <v-tab-item>
          <div class="upcomings">
            <v-list v-if="!upcomings.loading" three-line dense>
              <template v-for="upcoming of upcomings.data">
                <v-list-tile :key="upcoming">
                  <v-list-tile-content>
                    <v-list-tile-title>{{upcoming.room.code | filename}}</v-list-tile-title>
                    <v-list-tile-sub-title v-html="upcoming.acti_title  + '<br/> From ' + upcoming.startString + ' to ' + upcoming.endString"></v-list-tile-sub-title>
                  </v-list-tile-content>
                  <v-list-tile-action :title="upcoming.total_students_registered + ' student(s) for ' + upcoming.room.seats + ' seats'">
                    <v-chip v-if="!upcoming.is_rdv" label disabled>
                      {{upcoming.total_students_registered}}/{{upcoming.room.seats}}
                    </v-chip>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
              <div v-if="!upcomings.data.length" class="text-xs-center session-empty">
                <i class="material-icons md-48">room</i>
                <h2 class="subheading">No upcoming activities, go get some rest !</h2>
              </div>
            </v-list>
            <div v-else>
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
                    <v-chip v-if="!room.is_rdv" label disabled>
                      {{room.total_students_registered}}/{{room.room.seats}}
                    </v-chip>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
              <div v-if="!rooms.data.length" class="text-xs-center session-empty">
                <i class="material-icons md-48">room</i>
                <h2 class="subheading">No occuped rooms, have fun !</h2>
              </div>
            </v-list>
            <div v-else>
              <v-progress-linear v-bind:indeterminate="true"></v-progress-linear>
            </div>
          </div>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
    <v-dialog v-model="timeline.enabled" :scrollable="true" :lazy="true" max-width="80%">
        <v-card>
          <v-card-text>
            <vue-chart v-if="timeline.enabled && timeline.data" chart-type="Timeline" :packages="['timeline']" :columns="[{ type: 'string', label: 'Module' }, { type: 'string', label: 'Project' }, { type: 'date', label: 'Start' }, { type: 'date', label: 'End' }]" :rows="timeline.data" :options="options"></vue-chart>
            <v-progress-linear v-else v-bind:indeterminate="true"></v-progress-linear>
          </v-card-text>
        </v-card>
    </v-dialog>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
