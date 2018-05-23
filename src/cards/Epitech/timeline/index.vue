<template>
  <v-dialog v-model="enabled" scrollable max-width="80%" v-resize.quiet="draw">
    <v-card>
      <v-card-text>
        <div id="timeline">
          <v-progress-linear v-show="loading" indeterminate></v-progress-linear>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import VDialog from 'vuetify/es5/components/VDialog';
import timeline from './main';

/* global d3 */
export default {
  name: 'EpitechTimeline',
  props: ['timelineData', 'loading'],
  components: {
    VDialog,
  },
  data() {
    return {
      enabled: true,
    };
  },
  watch: {
    loading(val, old) {
      if (val !== old && !val) this.draw();
    },
  },
  methods: {
    draw() {
      const chart = timeline();
      chart.today(true);
      d3
        .select('#timeline')
        .datum(this.timelineData)
        .call(chart);
    },
  },
  mounted() {
    if (!this.loading) this.draw();
  },
};
</script>
