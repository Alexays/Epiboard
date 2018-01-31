export default {
  name: 'Epitech',
  props: ['settings'],
  components: {},
  data() {
    return {
      API: 'https://intra.epitech.eu',
      user: {
        loading: true,
      },
      projects: {
        loading: true,
      },
    };
  },
  methods: {
    parseDate(epiDate) {
      const date = epiDate.replace(', ', '/').replace(':', '/').replace('h', '/').split('/');
      const parsed = new Date(date[2], date[1] - 1, date[0], date[3], date[4]);
      return parsed;
    },
    getUserInfo() {
      this.axios.get(`${this.API}/user/?format=json`)
        .then((response) => {
          if (!response.data) return;
          this.user = response.data;
          this.user.loaded = true;
        }).finally(() => {
          this.user.loading = false;
        });
    },
    getProjects() {
      this.axios.get(`${this.API}/?format=json`)
        .then((response) => {
          if (!response.data) return;
          this.projects = response.data.board.projets
            .filter(f => f.timeline_barre < 100
              && !f.date_inscription && this.parseDate(f.timeline_start) <= new Date())
            .slice(0, 10)
            .sort((a, b) => this.parseDate(a.timeline_end) > this.parseDate(b.timeline_end));
          this.projects.loaded = true;
        }).finally(() => {
          this.projects.loading = false;
        });
    },
  },
  mounted() {
    this.getUserInfo();
    this.getProjects();
  },
};
