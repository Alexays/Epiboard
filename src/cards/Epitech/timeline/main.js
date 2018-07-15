import VDialog from 'vuetify/es5/components/VDialog';
import { CanvasGantt } from 'gantt';

const API = 'https://intra.epitech.eu';

// @vue/component
export default {
  name: 'EpitechTimeline',
  components: {
    VDialog,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      enabled: false,
      loading: true,
      canvas: null,
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
          const today = new Date();
          this.timeline = res.map(f => ({
            name: f.data.title,
            children: f.data.activites
              .filter(activity => activity.type_code === 'proj')
              .map((activity) => {
                const from = this.parseCalendarDate(activity.begin);
                const to = this.parseCalendarDate(activity.end);
                return {
                  name: activity.title,
                  from,
                  to,
                  percent: ((today - from) / (to - from)) * 100,
                };
              }),
          })).filter(f => f.children.length);
          this.loading = false;
          this.draw();
        });
    },
    draw() {
      if (!this.enabled || this.loading) return;
      this.canvas = new CanvasGantt('#canvas', this.timeline, {
        viewMode: 'week',
      });
    },
  },
};
