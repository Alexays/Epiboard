export default {
  name: 'Epitech',
  props: ['settings'],
  components: {},
  data() {
    return {
      API: 'https://intra.epitech.eu',
      is_logged: true,
      location: null,
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
    };
  },
  methods: {
    parseCalendarDate(epiDate) {
      const date = epiDate.replace(' ', '-').replace(/:/g, '-').split('-');
      return new Date(date[0], date[1] - 1, date[2], date[3], date[4]);
    },
    parseDate(epiDate) {
      const date = epiDate.replace(', ', '/').replace(':', '/').replace('h', '/').split('/');
      return new Date(date[2], date[1] - 1, date[0], date[3], date[4]);
    },
    getUserInfo() {
      return this.axios.get(`${this.API}/user/?format=json`)
        .then((response) => {
          if (!response.data) return;
          Object.assign(this.user, response.data);
        }).catch(() => {
          this.is_logged = false;
        })
        .finally(() => {
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
          this.location = response.data.infos.location;
          const data = response.data.board.projets
            .filter(async f => f.timeline_barre < 100 &&
              !f.date_inscription && this.parseDate(f.timeline_start) <= new Date());
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
      return this.axios.get(`${this.API}/planning/load?format=json&start=${dString}&end=${dString}`)
        .then((res) => {
          this.rooms.data = res.data.filter(f => f.instance_location === this.location && f.room)
            .map((f) => {
              f.room.name = f.room.code.substring(f.room.code.lastIndexOf('/') + 1);
              f.start = this.parseCalendarDate(f.start);
              f.end = this.parseCalendarDate(f.end);
              f.dateString = `Taken from <b>${f.start.getHours()}h${(`0${f.start.getMinutes()}`).substr(-2)}</b>
              to <b>${f.end.getHours()}h${(`0${f.end.getMinutes()}`).substr(-2)}</b>`;
              return f;
            }).filter(f => f.end > new Date())
            .sort((a, b) => a.start - b.start);
        }).finally(() => {
          this.rooms.loading = false;
        });
    },
  },
  mounted() {
    Promise.all([this.getUserInfo(), this.getProjects()])
      .then(() => this.getRoom())
      .finally(() => this.$emit('init', this.$data));
  },
};
