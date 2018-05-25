import VChip from 'vuetify/es5/components/VChip';
import * as VTabs from 'vuetify/es5/components/VTabs';
import * as VList from 'vuetify/es5/components/VList';
import omit from 'lodash/omit';

const API = 'https://intra.epitech.eu';

export default {
  name: 'Epitech',
  props: ['settings'],
  components: {
    VChip,
    ...VTabs,
    ...VList,
    Timeline: () => import(/* webpackMode: "lazy" */'./timeline'),
  },
  data() {
    return {
      is_logged: true,
      planningData: [],
      gpa_precision: {
        loading: false,
        val: null,
      },
      user: {
        loading: true,
      },
      projects: {
        data: [],
        loading: true,
      },
      rooms: {
        data: [],
        loading: true,
      },
      upcomings: {
        data: [],
        loading: true,
      },
    };
  },
  methods: {
    getLink(href) {
      return `${API}${href}`;
    },
    parseCalendarDate(epiDate) {
      const date = epiDate.replace(' ', '-').replace(/:/g, '-').split('-');
      return new Date(date[0], date[1] - 1, date[2], date[3], date[4]);
    },
    parseDate(epiDate) {
      const date = epiDate.replace(', ', '/').replace(':', '/').replace('h', '/').split('/');
      return new Date(date[2], date[1] - 1, date[0], date[3], date[4]);
    },
    getUserInfo() {
      return this.axios.get(`${API}/user/?format=json`)
        .then((res) => {
          if (!res.data) return;
          this.is_logged = true;
          this.user = res.data;
        }).catch(() => {
          this.is_logged = false;
        })
        .finally(() => {
          this.user.loading = false;
        });
    },
    isRegistered(project) {
      return this.axios.get(`${API}${project.title_link}project?format=json`)
        .then(res => !!res.data.user_project_code);
    },
    getProjects() {
      return this.axios.get(`${API}/?format=json`)
        .then((res) => {
          if (!res.data) return Promise.resolve();
          const data = res.data.board.projets
            .filter(f => f.timeline_barre < 100 &&
              !f.date_inscription && this.parseDate(f.timeline_start) <= new Date() &&
              this.parseDate(f.timeline_end) > new Date());
          return Promise.all(data
            .map(f => this.isRegistered(f).then((isRegistered) => {
              f.isRegistered = isRegistered;
              return f;
            })));
        }).then((res) => {
          this.projects.data = res.filter(f => f.isRegistered)
            .sort((a, b) =>
              this.parseDate(a.timeline_end) - this.parseDate(b.timeline_end));
        }).catch(() => {
          this.is_logged = false;
        })
        .finally(() => {
          this.projects.loading = false;
        });
    },
    getRoom() {
      const d = new Date();
      const dString = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      return this.axios.get(`${API}/planning/load?format=json&start=${dString}&end=${dString}`)
        .then((res) => {
          this.planningData = (Array.isArray(res.data) ? res.data : [])
            .filter(f => f.instance_location === this.user.location);
          this.rooms.data = this.planningData.filter(f => f.room && f.room.code)
            .map((f) => {
              f.start = this.parseCalendarDate(f.start);
              f.end = this.parseCalendarDate(f.end);
              f.startString = `${f.start.getHours()}h${(`0${f.start.getMinutes()}`).substr(-2)}`;
              f.endString = `${f.end.getHours()}h${(`0${f.end.getMinutes()}`).substr(-2)}`;
              return f;
            }).filter(f => f.end > d)
            .sort((a, b) => a.start - b.start);
        }).finally(() => {
          this.rooms.loading = false;
        });
    },
    getUpcoming() {
      this.upcomings.data = this.planningData
        .filter(f => f.event_registered && f.start > new Date())
        .sort((a, b) => a.start - b.start);
      this.upcomings.loading = false;
    },
    getGpa() {
      this.gpa_precision.loading = true;
      this.axios.get(`${API}/course/filter?format=json&course[]=${this.user.course_code}`)
        .then(res => res.data
          .map(f => this.axios.get(`${API}/module/${f.scolaryear}/${f.code}/${f.codeinstance}/?format=json`)))
        .then(res => Promise.all(res))
        .then((res) => {
          let GPA = 0;
          let sum = 0;
          const grade = {
            A: 4, B: 3, C: 2, D: 1, Echec: 0,
          };
          for (let i = 0; i < res.length; i += 1) {
            const credits = parseInt(res[i].data.user_credits, 10);
            if (credits >= 0) {
              if (grade[res[i].data.student_grade] >= 0) {
                GPA += credits * grade[res[i].data.student_grade];
                sum += credits;
              }
            }
          }
          GPA /= sum;
          this.gpa_precision.val = GPA.toFixed(5);
        })
        .finally(() => {
          this.gpa_precision.loading = false;
        });
    },
  },
  mounted() {
    if (this.VALID_CACHE) {
      this.$emit('init', true);
      return;
    }
    Promise.all([this.getUserInfo(), this.getProjects()])
      .then(() => this.getRoom())
      .then(() => this.getUpcoming())
      .then(() => this.$emit('init', omit(this.$data, ['gpa_precision'])))
      .catch(err => this.$emit('init', err));
  },
};
