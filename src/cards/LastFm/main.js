import API from './api';

const Period = ['overall', '7day', '1month', '3month', '6month', '12month'];

// @vue/component
export default {
  name: 'LastFm',
  title: 'Top Artists',
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      period: 'overall',
      artists: [],
    };
  },
  computed: {
    user() {
      return this.settings.user;
    },
  },
  mounted() {
    this.updateActions();
    if (this.VALID_CACHE && !this.loading) return this.$emit('init', true);
    return Promise.all([this.getTopArtists()])
      .then(() => this.$emit('init', this.$data))
      .catch(err => this.$emit('init', err))
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    updateActions() {
      this.$emit('update:actions', Period.map(f => ({
        title: f,
        active: f === this.period,
        func: () => this.changePeriod(f),
      })));
    },
    changePeriod(period) {
      this.period = period;
      this.updateActions();
      this.getTopArtists();
    },
    getTopArtists() {
      API.getTopArtists(this.settings.apiKey, this.user, 5, this.period)
        .then((data) => {
          this.artists = data.artist;
        });
    },
  },
};
