import * as VTabs from 'vuetify/es5/components/VTabs';
import API from './api';

const periods = [{
  title: 'All times',
  value: 'overall',
}, {
  title: '1 year',
  value: '12month',
}, {
  title: '6 months',
  value: '6month',
}, {
  title: '3 months',
  value: '3month',
}, {
  title: '1 month',
  value: '1month',
}, {
  title: '7 days',
  value: '7day',
}];

// @vue/component
export default {
  name: 'LastFm',
  components: {
    ...VTabs,
  },
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      active: null,
      period: 'overall',
      items: {},
    };
  },
  computed: {
    user() {
      return this.settings.user;
    },
    itemsLength() {
      return Object.keys(this.items).length;
    },
  },
  watch: {
    active(val, old) {
      if (val !== old) {
        const keys = Object.keys(this.items);
        this.$emit('update:cardtitle', this.items[keys[val]].title);
      }
    },
  },
  mounted() {
    this.updateActions();
    this.getNowPlaying();
    if (this.VALID_CACHE && !this.loading) return this.$emit('init', true);
    return this.getAll()
      .finally(() => {
        this.loading = false;
      })
      .then(() => {
        const keys = Object.keys(this.items);
        if (keys.length) {
          this.$emit('update:cardtitle', this.items[keys[0]].title);
        }
        this.$emit('init', this.$data);
      })
      .catch(err => this.$emit('init', err));
  },
  methods: {
    updateActions() {
      this.$emit('update:actions', periods.map(f => ({
        title: f.title,
        active: f.value === this.period,
        func: () => this.changePeriod(f.value),
      })));
    },
    changePeriod(period) {
      this.period = period;
      this.getAll().then(() => {
        this.updateActions();
      });
    },
    getAll() {
      return Promise.all([
        this.getTopArtists(),
        this.getTopAlbums(),
        this.getTopTracks(),
      ]);
    },
    getTopArtists() {
      return API.getTopArtists(this.settings.apiKey, this.user, 5, this.period)
        .then((artists) => {
          if (!artists || !artists.length) return;
          this.items.artists = {
            title: 'Top Artists',
            data: artists,
          };
        });
    },
    getTopAlbums() {
      return API.getTopAlbums(this.settings.apiKey, this.user, 5, this.period)
        .then((albums) => {
          if (!albums || !albums.length) return;
          this.items.albums = {
            title: 'Top Albums',
            data: albums,
          };
        });
    },
    getTopTracks() {
      return API.getTopTracks(this.settings.apiKey, this.user, 5, this.period)
        .then((tracks) => {
          if (!tracks || !tracks.length) return;
          this.items.tracks = {
            title: 'Top Tracks',
            data: tracks,
          };
        });
    },
    getNowPlaying() {
      return API.getRecentTracks(this.settings.apiKey, this.user, 1)
        .then((tracks) => {
          if (tracks.length && tracks[0]['@attr'] && tracks[0]['@attr'].nowplaying) {
            this.$emit('update:subtitle', `Now playing: ${tracks[0].name} / ${tracks[0].artist['#text']}`);
          }
        });
    },
  },
};
