<template>
  <div id="epitech">
    <v-card-text v-if="loading">
      <v-progress-linear indeterminate />
    </v-card-text>
    <v-card-text v-else-if="!is_logged" class="text-center">
      <v-icon x-large>mdi-alert-circle-outline</v-icon>
      <h2 class="subtitle-1">You must be logged to Epitech to use this card.</h2>
    </v-card-text>
    <v-tabs
      v-else
      v-model="tab"
      :dark="!$store.state.settings.theme.light"
      :light="$store.state.settings.theme.light"
      slider-color="foreground"
      background-color="primary"
      grow
    >
      <v-tab v-for="tab in ['Infos', 'Upcoming', 'Occupied Rooms']" :key="tab">{{ tab }}</v-tab>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <v-card-text v-if="!settings.hideInfo && user" class="pb-0 text-center">
            <h3>{{ user.title }}</h3>
            <v-chip label class="ma-1">
              <span>
                {{ user.gpa[0].gpa }}
                <small>G.P.A.</small>
              </span>
            </v-chip>
            <v-chip label class="ma-1">
              <span>
                {{ user.credits }}
                <small>Credits</small>
              </span>
            </v-chip>
            <v-chip v-if="user.spice && user.spice.available_spice" label class="ma-1">
              <span>
                {{ user.spice.available_spice }}
                <small>Spices</small>
              </span>
            </v-chip>
            <p>
              {{ user.studentyear }}
              <sup>{{ ordinal }}</sup>
              year, Promo {{ user.promo }}
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
                :value="project.timeline_barre"
                :height="6"
                color="accent"
              />
              <v-progress-linear
                v-if="project.timeline_barre >= 60 && project.timeline_barre < 80"
                :value="project.timeline_barre"
                :height="6"
                color="orange"
                background-color="orange lighten-2"
              />
              <v-progress-linear
                v-if="project.timeline_barre >= 80"
                :value="project.timeline_barre"
                :height="6"
                color="red"
                background-color="red lighten-2"
              />
            </div>
          </v-card-text>
          <v-card-text v-else-if="!projects.length" class="text-center">
            <v-icon v-if="settings.hideInfo" x-large>mdi-briefcase</v-icon>
            <h2 class="subtitle-1">No on going projects, well done !</h2>
          </v-card-text>
        </v-tab-item>
        <v-tab-item>
          <v-list v-if="upcoming.length" class="upcoming" three-line dense>
            <v-list-item v-for="activity of upcoming" :key="activity.acti_title">
              <v-list-item-content>
                <v-list-item-title>{{ activity.room.code | filename }}</v-list-item-title>
                <v-list-item-subtitle>{{ activity.acti_title }}</v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ activity.startString }}&#8594;{{ activity.endString }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action
                :title="`${activity.total_students_registered} student(s)`
                + ` for ${activity.room.seats} seats`"
              >
                <v-chip
                  v-if="!activity.is_rdv"
                  label
                >{{ activity.total_students_registered }}/{{ activity.room.seats }}</v-chip>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-card-text v-else class="text-center">
            <v-icon x-large>mdi-clipboard-text</v-icon>
            <h2 class="subtitle-1">No upcoming activities, go get some rest !</h2>
          </v-card-text>
        </v-tab-item>
        <v-tab-item>
          <v-list v-if="rooms.length" three-line dense>
            <v-list-item v-for="room of rooms" :key="room.acti_title">
              <v-list-item-content>
                <v-list-item-title>{{ room.room.code | filename }}</v-list-item-title>
                <v-list-item-subtitle>{{ room.acti_title }}</v-list-item-subtitle>
                <v-list-item-subtitle>
                  {{ room.startString }}&#8594;{{ room.endString }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action
                :title="`${room.total_students_registered} student(s)`
                + ` for ${room.room.seats} seats`"
              >
                <v-chip
                  v-if="!room.is_rdv"
                  label
                >{{ room.total_students_registered }}/{{ room.room.seats }}</v-chip>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-card-text v-else class="text-center">
            <v-icon x-large>mdi-map-marker</v-icon>
            <h2 class="subtitle-1">No occuped rooms, have fun !</h2>
          </v-card-text>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>
<script src="./main.js"></script>
<style lang="scss" rel='stylesheet/scss' src="./style.scss" scoped></style>
