const API = 'https://intra.epitech.eu';

export default {
  name: 'Epitech',
  props: ['settings'],
  components: {},
  data() {
    return {
      logged: true,
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
      const date = epiDate.replace(', ', '/').replace('h', '/').split('/');
      const parsed = new Date(date[2], date[1] - 1, date[0], date[3], date[4]);
      return parsed;
    },
    getCookie() {
      return new Promise((resolve, reject) => {
        chrome.cookies.get({ url: API, name: 'user' }, (cookie) => {
          if (chrome.runtime.lastError) {
            this.logged = false;
            return reject(true);
          }
          const date = new Date(cookie.expirationDate * 1000);
          if (date < new Date()) {
            this.logged = false;
            return reject(true);
          }
          return resolve(true);
        });
      });
    },
    getUserInfo() {
      this.axios.get(API + '/user/?format=json').then((response) => {
        if (!response.data) {
          this.user.loading = false;
          return;
        }
        this.user = response.data;
        this.user.loading = false;
      });
    },
    getProjects() {
      this.axios.get(API + '/?format=json').then((response) => {
        if (!response.data) {
          this.projects.loading = false;
          return;
        }
        this.projects = response.data.board.projets
          .filter(f => f.timeline_barre < 100 && !f.date_inscription && this.parseDate(f.timeline_start) <= new Date())
          .slice(0, 5)
          .sort((a, b) => this.parseDate(a.timeline_end) > this.parseDate(b.timeline_end));
        this.projects.loading = false;
      });
    },
  },
  mounted() {
    this.getCookie().then(() => {
      this.getUserInfo();
      this.getProjects();
    });
  },
};
