import Vue from 'vue';
import VToolbar from 'vuetify/es5/components/VToolbar';
import VueProgressiveImage from 'vue-progressive-image';
import VueTyper from '@/components/Typer';
import backgrounds from './backgrounds';
import welcomeMessages from './welcomeMessages';

Vue.use(VueProgressiveImage);

const API = 'https://trends.google.com/trends/hottrends/visualize/internal/data';
const EXPIRE_TRENDS = 3600000; // 1h

export default {
  name: 'Header',
  components: {
    VToolbar,
    VueTyper,
  },
  data() {
    return {
      messages: [],
      fallback: backgrounds.default,
    };
  },
  computed: {
    trendsSettings() {
      return this.$store.state.settings.trends;
    },
    dark() {
      return this.$utils.isDark(this.$store.state.settings.dark);
    },
    background() {
      const { background } = this.$store.state.settings.header;
      let key = background || 'default';
      if (background === 'random') {
        [key] = this.$utils.shuffle(Object.keys(backgrounds));
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
        } else this.getMessage(true);
      },
      deep: true,
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
  },
  beforeMount() {
    this.getMessage();
  },
};
