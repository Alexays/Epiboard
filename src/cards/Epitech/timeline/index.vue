<template>
  <div>
    <v-btn class="no-margins" block dark depressed small color="blue-grey" @click="getTimeline()">timeline</v-btn>
    <v-dialog v-model="enabled" lazy scrollable max-width="80%" v-resize.quiet="draw">
      <v-card>
        <v-card-text>
          <div id="timeline">
            <v-progress-linear v-show="loading" indeterminate></v-progress-linear>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import VDialog from 'vuetify/es5/components/VDialog';
import timeline from './main';

const API = 'https://intra.epitech.eu';

/* global d3 */
export default {
  name: 'EpitechTimeline',
  props: ['user'],
  components: {
    VDialog,
  },
  data() {
    return {
      enabled: false,
      loading: true,
      timeline: [],
    };
  },
  methods: {
    parseCalendarDate(epiDate) {
      const date = epiDate.replace(' ', '-').replace(/:/g, '-').split('-');
      return new Date(date[0], date[1] - 1, date[2], date[3], date[4]);
    },
    getTimeline() {
      this.enabled = true;
      this.loading = true;
      this.axios.get(`${API}/course/filter?format=json&location[]=${this.user.location}&course[]=${this.user.course_code}&scolaryear[]=${this.user.scolaryear}`)
        .then(res => res.data.filter((f) => {
          const end = f.end.split('-');
          const credits = parseInt(f.credits, 10);
          return f.status !== 'notregistered' && credits > 0 && new Date() < new Date(end[0], end[1] - 1, end[2]);
        }).map(f => this.axios.get(`${API}/module/${this.user.scolaryear}/${f.code}/${f.codeinstance}/?format=json`)))
        .then(data => Promise.all(data))
        .then((res) => {
          const chart = [];
          const data = res.map(f => f.data);
          for (let i = 0; i < data.length; i += 1) {
            for (let j = 0; j < data[i].activites.length; j += 1) {
              if (data[i].activites[j].type_code === 'proj') {
                const begin = this.parseCalendarDate(data[i].activites[j].begin);
                const end = this.parseCalendarDate(data[i].activites[j].end);
                chart.push([data[i].title, data[i].activites[j].title, begin, end]);
              }
            }
          }
          this.timeline = chart;
          this.loading = false;
          this.draw();
        });
    },
    draw() {
      if (!this.enabled || this.loading) return;
      const chart = timeline();
      chart.today(true);
      chart.dark(this.$utils.isDark(this.$store.state.settings.dark));
      d3.select('#timeline')
        .datum(this.timeline)
        .call(chart);
    },
  },
};
</script>
