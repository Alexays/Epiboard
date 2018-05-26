import Vue from 'vue';
import VToolbar from 'vuetify/es5/components/VToolbar';
import VueProgressiveImage from 'vue-progressive-image';
import VueTyper from '@/components/Typer';
import sample from 'lodash/sample';
import shuffle from 'lodash/shuffle';
import backgrounds from './backgrounds';
import welcomeMessages from './welcomeMessages';

Vue.use(VueProgressiveImage);

const API = 'https://trends.google.com/trends/hottrends/visualize/internal/data';
const EXPIRE_TRENDS = 3600000; // 1h

export default {
  name: 'Header',
  props: ['settings'],
  components: {
    VToolbar,
    VueTyper,
  },
  data() {
    return {
      messages: [],
      background: null,
      trends: [],
    };
  },
  computed: {
    backgroundSettings() {
      return this.$store.state.settings.header.background;
    },
    trendsSettings() {
      return this.$store.state.settings.trends;
    },
    dark() {
      return this.$utils.isDark(this.$store.state.settings.dark);
    },
    placeholder() {
      const url = this.background;
      if (url.indexOf('i.imgur.com') > -1) {
        const idx = url.lastIndexOf('.');
        return `${url.substr(0, idx)}t${url.substr(idx)}`;
      }
      return null;
    },
  },
  watch: {
    backgroundSettings(val, old) {
      if (val !== old) this.getBackground();
    },
    trendsSettings: {
      handler(val) {
        if (!val.enabled) {
          this.trends = [];
          this.messages = [sample(welcomeMessages)];
        } else this.getMessage(true);
      },
      deep: true,
    },
    dark(val, old) {
      if (val !== old) this.getBackground();
    },
  },
  methods: {
    getBackgroundTime(url) {
      if (this.dark) return url.night;
      const hour = new Date().getHours();
      if (hour > 5 && hour < 8) {
        return url.dawn;
      }
      if (hour > 8 && hour < 19) {
        return url.day;
      }
      if (hour > 19 && hour < 21) {
        return url.dusk;
      }
      return url.night;
    },
    getBackground() {
      const background = this.backgroundSettings;
      if (background === 'random') {
        const key = sample(Object.keys(backgrounds));
        const tmp = backgrounds[key];
        this.background = this.getBackgroundTime(tmp);
      } else {
        const key = background || 'default';
        const tmp = backgrounds[key] || backgrounds.default;
        this.background = this.getBackgroundTime(tmp);
      }
    },
    getTrends(force) {
      if (!force && Date.now() < this.$store.state.cache.trends.dt + EXPIRE_TRENDS) {
        this.trends = this.$store.state.cache.trends.data;
        this.messages = [...this.messages, ...shuffle(this.trends)];
      } else {
        this.axios.get(API)
          .then((res) => {
            this.trends = res.data[this.trendsSettings.country];
            this.messages = [...this.messages, ...shuffle(this.trends)];
            this.$store.commit('SET_TRENDS_CACHE', this.trends);
          });
      }
    },
    getMessage(force = false) {
      this.messages = [sample(welcomeMessages)];
      if (this.trendsSettings.enabled) {
        this.getTrends(force);
      }
    },
  },
  beforeMount() {
    this.getBackground();
    this.getMessage();
  },
};
