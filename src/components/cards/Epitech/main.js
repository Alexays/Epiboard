const API = 'https://intra.epitech.eu';

export default {
  name: 'Epitech',
  props: ['settings'],
  components: {},
  data() {
    return {
      loading: true,
      logged: true,
      user: {},
    };
  },
  methods: {
    getCookie() {
      chrome.cookies.get({ url: API, name: 'user' }, (cookie) => {
        if (chrome.runtime.lastError) {
          this.logged = false;
          this.loading = false;
          return;
        }
        const date = new Date(cookie.expirationDate * 1000);
        if (date < new Date()) {
          this.logged = false;
          this.loading = false;
          return;
        }
      });
    },
    getUserInfo() {
      this.axios.get(API + '/user/?format=json').then((response) => {
        if (!response.data) {
          this.logged = false;
          this.loading = false;
          return;
        }
        this.loading = false;
        this.user = response.data;
      });
    },
  },
  mounted() {
    this.getCookie();
    this.getUserInfo();
  },
};
