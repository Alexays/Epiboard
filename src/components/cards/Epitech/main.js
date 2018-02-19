export default {
  name: 'Epitech',
  props: ['settings'],
  components: {},
  data() {
    return {
      API: 'https://intra.epitech.eu',
      user: {
        loaded: false,
        loading: true,
      },
      projects: {
        data: [],
        loaded: false,
        loading: true,
      },
    };
  },
  methods: {
    parseDate(epiDate) {
      const date = epiDate.replace(', ', '/').replace(':', '/').replace('h', '/').split('/');
      return new Date(date[2], date[1] - 1, date[0], date[3], date[4]);
    },
    getUserInfo() {
      return this.axios.get(`${this.API}/user/?format=json`)
        .then((response) => {
          if (!response.data) return;
          Object.assign(this.user, response.data);
          this.user.loaded = true;
        }).finally(() => {
          this.user.loading = false;
        });
    },
    isRegistered(project) {
      return this.axios.get(`${this.API}${project.title_link}project?format=json`)
        .then(res => !!res.data.user_project_code);
    },
    getProjects() {
      return this.axios.get(`${this.API}/?format=json`)
        .then((response) => {
          if (!response.data) return Promise.resolve();
          this.projects.data = response.data.board.projets
            .filter(async f => f.timeline_barre < 100 &&
              !f.date_inscription && this.parseDate(f.timeline_start) <= new Date());
          return Promise.all(this.projects.data.map(f => this.isRegistered(f).then((isRegistered) => {
            f.isRegistered = isRegistered;
            return f;
          })));
        }).then((res) => {
          this.projects.data = res.filter(f => f.isRegistered)
            .sort((a, b) =>
              this.parseDate(a.timeline_end) - this.parseDate(b.timeline_end));
          this.projects.loaded = true;
        })
        .finally(() => {
          this.projects.loading = false;
        });
    },
  },
  mounted() {
    Promise.all([this.getUserInfo(), this.getProjects()])
      .finally(() => this.$emit('init'));
  },
};
