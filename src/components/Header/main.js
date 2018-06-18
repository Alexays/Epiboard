import Vue from 'vue';
import VToolbar from 'vuetify/es5/components/VToolbar';
import VueProgressiveImage from 'vue-progressive-image';
import VueTyper from '@/components/Typer';
import backgrounds from './backgrounds';
import welcomeMessages from './welcomeMessages';

Vue.use(VueProgressiveImage);

const API = 'https://trends.google.com/trends/hottrends/visualize/internal/data';
const DOODLES_API = 'https://www.google.com/doodles/json/';
const EXPIRE_TRENDS = 3600000; // 1h
const EXPIRE_DOODLE = 57600000; // 16h

export default {
  name: 'Header',
  components: {
    VToolbar,
    VueTyper,
  },
  data() {
    return {
      messages: [],
      doodle: null,
      fallback: this.getBackgroundTime(backgrounds.default),
    };
  },
  computed: {
    trendsSettings() {
      return this.$store.state.settings.trends;
    },
    doodleSettings() {
      return this.$store.state.settings.doodle;
    },
    dark() {
      return this.$utils.isDark(this.$store.state.settings.dark);
    },
    background() {
      const { background, backgroundUrl } = this.$store.state.settings.header;
      let key = background || 'default';
      if (background === 'random') {
        const keys = Object.keys(backgrounds);
        if (backgroundUrl && backgroundUrl.length) {
          keys.push('url');
        }
        [key] = this.$utils.shuffle(keys);
      }
      if (key === 'url') {
        return backgroundUrl;
      }
      const tmp = backgrounds[key] || backgrounds.default;
      return this.getBackgroundTime(tmp);
    },
    placeholder() {
      const url = this.background;
      if (url && url.indexOf('i.imgur.com') > -1) {
        const idx = url.lastIndexOf('.');
        return `${url.substr(0, idx)}t${url.substr(idx)}`;
      }
      return null;
    },
  },
  watch: {
    trendsSettings: {
      handler(val) {
        if (!val.enabled) {
          this.messages = [this.$utils.shuffle(welcomeMessages)[0]];
          this.$store.commit('SET_TRENDS_CACHE', []);
        } else this.getMessage(true);
      },
      deep: true,
    },
    doodleSettings: {
      handler(val) {
        if (!val.enabled) {
          this.doodle = null;
          this.$store.commit('SET_DOODLE_CACHE', {});
        } else this.getDoodle(true);
      },
      deep: true,
    },
  },
  methods: {
    getBackgroundTime(background) {
      if (this.dark) return background.night;
      const hour = new Date().getHours();
      if (hour > 5 && hour < 8) {
        return background.dawn;
      }
      if (hour > 8 && hour < 19) {
        return background.day;
      }
      if (hour > 19 && hour < 21) {
        return background.dusk;
      }
      return background.night;
    },
    getTrends(refresh) {
      const trendsCache = this.$store.state.cache.trends;
      if (!refresh && trendsCache.data.length && Date.now() < trendsCache.dt + EXPIRE_TRENDS) {
        this.messages = [...this.messages, ...this.$utils.shuffle(trendsCache.data)];
      } else {
        this.axios.get(API).then((res) => {
          const trends = res.data[this.trendsSettings.country];
          this.messages = [...this.messages, ...this.$utils.shuffle(trends)];
          this.$store.commit('SET_TRENDS_CACHE', trends);
        });
      }
    },
    getMessage(refresh = false) {
      this.messages = [this.$utils.shuffle(welcomeMessages)[0]];
      if (this.trendsSettings.enabled) {
        this.getTrends(refresh);
      }
    },
    getDoodle(refresh = false) {
      const doodleCache = this.$store.state.cache.doodle;
      const date = new Date();
      if (!refresh && date.getTime() < doodleCache.dt + EXPIRE_DOODLE) {
        this.doodle = doodleCache.data;
      } else {
        this.axios.get(`${DOODLES_API}${date.getFullYear()}/${date.getMonth() + 1}`).then((res) => {
          const { title, url } = res.data[0];
          this.doodle = { title, url };
          this.$store.commit('SET_DOODLE_CACHE', this.doodle);
        });
      }
    },
  },
  beforeMount() {
    this.getMessage();
    if (this.doodleSettings.enabled) {
      this.getDoodle();
    }
  },
};
