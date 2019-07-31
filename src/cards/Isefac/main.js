import date from '@/mixins/date';

const API = 'https://nantes.campus-isefac.fr/bachelor/';

// @vue/component
export default {
  name: 'Isefac',
  mixins: [date],
  data() {
    return {
      is_logged: true,
      loading: true,
      dates: [],
      user: {
        name: '',
      },
    };
  },
  mounted() {
    if (this.VALID_CACHE && !this.loading) {
      this.$emit('init', false);
      return;
    }
    this.getCalendar()
      .then(() => this.$emit('init', true))
      .catch(err => this.$emit('init', err))
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    getCalendar() {
      return this.axios.get(`${API}index.php/apps/planning/`)
        .then((res) => {
          if (res.data.indexOf('name="login"') > -1) {
            this.is_logged = false;
            return Promise.reject(new Error('You must be logged to Isefac to use this card.'));
          }
          this.is_logged = true;
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
              f.header = `${f.start.toLocaleDateString('en-Us', this.timeOption)} ${f.start.getDate()}/${f.start.getMonth() + 1}`;
              return f;
            })
            .sort((a, b) => a.start - b.start);
        });
    },
  },
};
