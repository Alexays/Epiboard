import VDialog from 'vuetify/es5/components/VDialog';
import { CanvasGantt } from 'gantt';
import Api from '../api';

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
                const from = Api.parseCalendarDate(activity.begin);
                const to = Api.parseCalendarDate(activity.end);
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
