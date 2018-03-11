export default {
  name: 'Isefac',
  props: ['settings'],
  components: {},
  data() {
    return {
      API: 'https://nantes.campus-isefac.fr/bachelor/',
      is_logged: true,
      loaded: false,
      dates: [],
      user: {
        name: '',
      },
    };
  },
  methods: {
    getCalendar() {
      this.axios.get(`${this.API}index.php/apps/planning/`)
        .then((res) => {
          if (res.data.indexOf('name="login"') > -1) {
            this.is_logged = false;
            return Promise.reject(new Error('You must be logged to Isefac to use this card.'));
          }
          const name = res.data.substring(res.data.indexOf('expandDisplayName">') + 19);
          this.user.name = name.substring(0, name.indexOf('<'));
          const part = res.data.substring(res.data.indexOf('events:') + 7);
          const dates = part.substring(0, part.indexOf('],') + 1);
          return Promise.resolve(JSON.parse(dates));
        })
        .then((dates) => {
          this.dates = dates
            .map((f) => {
              f.start = new Date(f.start);
              f.end = new Date(f.end);
              return f;
            })
            .filter(f => f.end > new Date())
            .map((f) => {
              f.startString = `${f.start.getHours()}h${(`0${f.start.getMinutes()}`).substr(-2)}`;
              f.endString = `${f.end.getHours()}h${(`0${f.end.getMinutes()}`).substr(-2)}`;
              return f;
            })
            .sort((a, b) => a.start - b.start);
        });
    },
  },
  mounted() {
    Promise.all([this.getCalendar()])
      .finally(() => {
        this.loaded = true;
        this.$emit('init', this.$data);
      });
  },
};
