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
      chrome.cookies.get({ url: API, name: 'user' }, (cookie) => {
        if (chrome.runtime.lastError) {
          this.logged = false;
          return;
        }
        const date = new Date(cookie.expirationDate * 1000);
        if (date < new Date()) {
          this.logged = false;
          return;
        }
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
        console.log(response);
        if (!response.data) {
          this.projects.loading = false;
          return;
        }
        this.projects = response.data.board.projets
          .filter(f => f.timeline_barre < 100)
          .sort((a, b) => {
            const [aDate, aTime] = a.timeline_start.split(', ');
          });
        this.projects.loading = false;
      });
    },
  },
  mounted() {
    this.getCookie();
    this.getUserInfo();
    this.getProjects();
  },
};
