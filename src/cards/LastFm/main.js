import API from './api';

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
      artists: [],
    };
  },
  computed: {
    user() {
      return this.settings.user;
    },
  },
  mounted() {
    if (this.VALID_CACHE) {
      this.$emit('init', true);
      return;
    }
    Promise.all([this.getTopArtists()])
      .then(() => this.$emit('init', this.$data))
      .catch(err => this.$emit('init', err))
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    getTopArtists() {
      API.getTopArtists(this.settings.apiKey, this.user, 5)
        .then((data) => {
          this.artists = data.artist;
        });
    },
  },
};
