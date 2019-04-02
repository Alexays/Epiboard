<template>
  <div id="epitech">
    <v-card-text v-if="loading">
      <v-progress-linear indeterminate/>
    </v-card-text>
    <v-card-text v-else-if="!is_logged" class="text-xs-center">
      <v-icon x-large="">error_outline</v-icon>
      <h2 class="subheading">You must be logged to Epitech to use this card.</h2>
    </v-card-text>
    <v-tabs
      v-else
      :dark="!$store.state.settings.theme.light"
      :light="$store.state.settings.theme.light"
      slider-color="foreground" color="primary" grow>
      <v-tab
        v-for="tab in ['Infos', 'Upcoming', 'Occupied Rooms']"
        :key="tab">{{ tab }}</v-tab>
      <v-tabs-items>
        <v-tab-item lazy>
          <v-card-text v-if="!settings.hideInfo && user" class="pb-0 text-xs-center">
            <h3>{{ user.title }}</h3>
            <v-chip label>
              <span>
                {{ user.gpa[0].gpa }} <small>G.P.A.</small>
              </span>
            </v-chip>
            <v-chip label>
              <span>
                {{ user.credits }} <small>Credits</small>
              </span>
            </v-chip>
            <v-chip v-if="user.spice && user.spice.available_spice" label>
              <span>
                {{ user.spice.available_spice }} <small>Spices</small>
              </span>
            </v-chip>
            <p>
              {{ user.studentyear }}
              <sup>{{ ordinal }}</sup> year, Promo {{ user.promo }}
            </p>
          </v-card-text>
          <v-card-text v-if="projects.length" class="projects">
            <div v-for="project in projects" :key="project.title" class="project">
              <a :href="project.link" target="_blank">
                <h4>{{ project.title }}</h4>
              </a>
              <small>{{ project.timeline_start }}</small>
              <small class="end_date">{{ project.timeline_end }}</small>
              <v-progress-linear
                v-if="project.timeline_barre < 60"
                :value="project.timeline_barre" :height="6" color="accent"/>
              <v-progress-linear
                v-if="project.timeline_barre >= 60 && project.timeline_barre < 80"
                :value="project.timeline_barre"
                :height="6" color="orange" background-color="orange lighten-2"/>
              <v-progress-linear
                v-if="project.timeline_barre >= 80"
                :value="project.timeline_barre"
                :height="6" color="red" background-color="red lighten-2"/>
            </div>
          </v-card-text>
          <v-card-text v-else-if="!projects.length" class="text-xs-center">
            <v-icon v-if="settings.hideInfo" x-large>work</v-icon>
            <h2 class="subheading">No on going projects, well done !</h2>
          </v-card-text>
        </v-tab-item>
        <v-tab-item lazy>
          <v-list v-if="upcoming.length" class="upcoming" three-line dense>
            <v-list-tile v-for="activity of upcoming" :key="activity.acti_title">
              <v-list-tile-content>
                <v-list-tile-title>{{ activity.room.code | filename }}</v-list-tile-title>
                <v-list-tile-sub-title>
                  {{ activity.acti_title }}
                </v-list-tile-sub-title>
                <v-list-tile-sub-title>
                  {{ activity.startString }}&#8594;{{ activity.endString }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action
                :title="`${activity.total_students_registered} student(s)`
                + ` for ${activity.room.seats} seats`">
                <v-chip v-if="!activity.is_rdv" label>
                  {{ activity.total_students_registered }}/{{ activity.room.seats }}
                </v-chip>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-card-text v-else class="text-xs-center">
            <v-icon x-large>assignment_turned_in</v-icon>
            <h2 class="subheading">No upcoming activities, go get some rest !</h2>
          </v-card-text>
        </v-tab-item>
        <v-tab-item lazy>
          <v-list v-if="rooms.length" three-line dense>
            <v-list-tile v-for="room of rooms" :key="room.acti_title">
              <v-list-tile-content>
                <v-list-tile-title>{{ room.room.code | filename }}</v-list-tile-title>
                <v-list-tile-sub-title>
                  {{ room.acti_title }}
                </v-list-tile-sub-title>
                <v-list-tile-sub-title>
                  {{ room.startString }}&#8594;{{ room.endString }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action
                :title="`${room.total_students_registered} student(s)`
                + ` for ${room.room.seats} seats`">
                <v-chip v-if="!room.is_rdv" label>
                  {{ room.total_students_registered }}/{{ room.room.seats }}
                </v-chip>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
          <v-card-text v-else class="text-xs-center">
            <v-icon x-large>room</v-icon>
            <h2 class="subheading">No occuped rooms, have fun !</h2>
          </v-card-text>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
