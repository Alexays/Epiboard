import Vue from 'vue';
import { VToolbar } from 'vuetify';
import VueProgressiveImage from 'vue-progressive-image';
import VueTyper from '@/components/Typer';
import backgrounds from './backgrounds';

Vue.use(VueProgressiveImage);

const API = 'https://trends.google.com/trends/hottrends/visualize/internal/data';
const DOODLES_API = 'https://www.google.com/doodles/json/';
const EXPIRE_TRENDS = 3600000; // 1h
const EXPIRE_DOODLE = 57600000; // 16h

// @vue/component
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
      fallback: this.getBackgroundTime(backgrounds.mountains),
    };
  },
  computed: {
    texts() {
      if (this.$route.path === '/onboarding') {
        return [this.$t('onboarding.welcome')];
      }
      return this.$route.path === '/' ? this.messages : [this.$route.name];
    },
    messagesRepeat() {
      return this.messages.length === 1 || this.$route.path !== '/' ? 0 : Infinity;
    },
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
      const { dataUrl } = this.$store.state.cache.backgroundLocal;
      let key = background || 'mountains';
      if (background === 'random') {
        const keys = Object.keys(backgrounds);
        if (backgroundUrl && backgroundUrl.length) {
          keys.push('url');
        }
        if (dataUrl && dataUrl.length) {
          keys.push('local');
        }
        [key] = this.$utils.shuffle(keys);
      }
      if (key === 'url') {
        return backgroundUrl;
      }
      if (key === 'local') {
        return dataUrl;
      }
      const tmp = backgrounds[key] || backgrounds.mountains;
      return this.getBackgroundTime(tmp);
    },
    placeholder() {
      const url = this.background;
      if (url && url.indexOf('data:image/') !== 0 && url.indexOf('i.imgur.com') > -1) {
        const idx = url.lastIndexOf('.');
        return `${url.substr(0, idx)}t${url.substr(idx)}`;
      }
      return null;
    },
  },
  watch: {
    trendsSettings: {
      handler() {
        this.$store.commit('SET_TRENDS_CACHE', []);
        this.getMessage();
      },
      deep: true,
    },
    doodleSettings: {
      handler(val) {
        this.$store.commit('SET_DOODLE_CACHE', {});
        if (!val.enabled) this.doodle = null;
        else this.getDoodle();
      },
      deep: true,
    },
  },
  created() {
    this.getMessage();
    if (this.doodleSettings.enabled) {
      this.getDoodle();
    }
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
    getTrends() {
      const { data, dt } = this.$store.state.cache.trends;
      if (dt && data.length && Date.now() < dt + EXPIRE_TRENDS) {
        this.messages = [...this.messages, ...this.$utils.shuffle(data)];
      } else {
        this.axios.get(API).then((res) => {
          const trends = res.data[this.trendsSettings.country];
          this.$store.commit('SET_TRENDS_CACHE', trends);
          this.messages = [...this.messages, ...this.$utils.shuffle(trends)];
        });
      }
    },
    getMessage() {
      this.messages = [this.$utils.shuffle(this.$t('greetMessages'))[0]];
      if (this.trendsSettings.enabled) {
        this.getTrends();
      }
    },
    getDoodle() {
      const { data, dt } = this.$store.state.cache.doodle;
      const date = new Date();
      if (dt && date.getTime() < dt + EXPIRE_DOODLE) {
        this.doodle = data;
      } else {
        this.axios.get(`${DOODLES_API}${date.getFullYear()}/${date.getMonth() + 1}`).then((res) => {
          const { title, url } = res.data[0];
          this.doodle = { title, url };
          this.$store.commit('SET_DOODLE_CACHE', this.doodle);
        });
      }
    },
  },
};
