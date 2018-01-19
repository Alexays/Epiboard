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
          .filter(f => f.timeline_barre < 100)
          .slice(0, 5)
          .sort((a, b) => {
            const aDate = a.timeline_end.replace(', ', '/').replace('h', '/').split('/');
            const bDate = b.timeline_end.replace(', ', '/').replace('h', '/').split('/');
            const aParsed = new Date(aDate[2], aDate[1] - 1, aDate[0], aDate[3], aDate[4]);
            const bParsed = new Date(bDate[2], bDate[1] - 1, bDate[0], bDate[3], bDate[4]);
            return aParsed > bParsed;
          });
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
