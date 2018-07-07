import VChip from 'vuetify/es5/components/VChip';
import * as VTabs from 'vuetify/es5/components/VTabs';
import * as VList from 'vuetify/es5/components/VList';
import API from './api';

// @vue/component
export default {
  name: 'Epitech',
  components: {
    VChip,
    ...VTabs,
    ...VList,
    Timeline: () => import(/* webpackMode: "lazy" */'./timeline').then(_ => _.default),
  },
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      is_logged: false,
      loading: true,
      user: null,
      projects: [],
      rooms: [],
      upcoming: [],
    };
  },
  computed: {
    ordinal() {
      const n = this.user.studentyear;
      return ['st', 'nd', 'rd'][(n % (100 >> 3) ^ 1 && n % 10) - 1] || 'th';
    },
  },
  mounted() {
    if (this.VALID_CACHE && !this.loading) return this.$emit('init', true);
    return Promise.all([this.getUser(), this.getProjects()])
      .then(() => API.getPlanning(this.user))
      .then((planning) => {
        this.getRoom(planning);
        this.getUpcoming(planning);
      })
      .finally(() => {
        this.loading = false;
      })
      .then(() => this.$emit('init', ['gpa_precision'].reduce((obj, key) => {
        const { [key]: _, ...tmp } = obj;
        return tmp;
      }, this.$data)))
      .catch(err => this.$emit('init', err));
  },
  methods: {
    getUser() {
      return API.getUser().then((user) => {
        this.is_logged = true;
        this.user = user;
      }).catch((err) => {
        if (err.response && err.response.status === 401) {
          this.is_logged = false;
        }
        throw err;
      });
    },
    getProjects() {
      return API.getCurrentProjects()
        .then((projects) => {
          this.projects = projects;
        });
    },
    getRoom(planning) {
      this.rooms = API.getRoom(planning);
    },
    getUpcoming(planning) {
      this.upcoming = planning
        .filter(f => f.event_registered && f.start > new Date())
        .sort((a, b) => a.start - b.start);
    },
  },
};
