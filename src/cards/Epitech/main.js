import utils from '@/mixins/utils';
import API from './api';

// @vue/component
export default {
  name: 'Epitech',
  mixins: [utils],
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
    if (this.VALID_CACHE && !this.loading) {
      this.$emit('init', false);
      return;
    }
    Promise.all([this.getUser(), this.getProjects()])
      .then(() => API.getPlanning(this.user))
      .then((planning) => {
        this.getRoom(planning);
        this.getUpcoming(planning);
      })
      .then(() => this.$emit('init', true))
      .catch(err => this.$emit('init', err))
      .finally(() => {
        this.loading = false;
      });
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
