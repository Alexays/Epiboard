import VueTyper from '@/components/Typer';
import dark from '@/mixins/dark';
import utils from '@/mixins/utils';
import Permissions from '@/mixins/permissions';
import backgrounds from './backgrounds';

const API = 'https://trends.google.com/trends/hottrends/visualize/internal/data';
const DOODLES_API = 'https://www.google.com/doodles/json/';
const EXPIRE_TRENDS = 3600000; // 1h
const EXPIRE_DOODLE = 57600000; // 16h

// @vue/component
export default {
  name: 'Header',
  components: {
    VueTyper,
  },
  mixins: [dark, utils, Permissions],
  fallback: backgrounds.mountains.day,
  isPreRender: !!window.__PRERENDER_INJECTED,
  data() {
    return {
      messages: [],
      doodle: null,
    };
  },
  computed: {
    texts() {
      if (this.$route.path === '/onboarding') {
        return [this.$t('onboarding.welcome')];
      }
      if (this.$route.path === '/') {
        const { message } = this.$store.state.settings.header;
        if (!this.trendsSettings.enabled
          && this.$store.state.settings.header.customMessage && message.length) {
          return [message];
        }
        return this.messages;
      }
      const route = this.$route.name;
      const translation = this.$t(`${route}.title`);
      if (translation === `${route}.title`) {
        return [route];
      }
      return [translation];
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
    design() {
      return this.$store.state.settings.header.design;
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
        [key] = this.shuffle(keys);
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
    lazyBackground() {
      if (!this.background.indexOf('data:image/') === 0) return null;
      if (this.background.indexOf('i.imgur.com') > -1) {
        const idx = this.background.lastIndexOf('.');
        return `${this.background.substr(0, idx)}t${this.background.substr(idx)}`;
      }
      if (this.background.indexOf('ggpht.com') > -1) {
        const idx = this.background.lastIndexOf('=w');
        return `${this.background.substr(0, idx)}=w${window.innerWidth}-h150`;
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
    if (!this.$options.isPreRender) {
      this.getMessage();
      if (this.doodleSettings.enabled) {
        this.getDoodle();
      }
    }
  },
  methods: {
    getBackgroundTime(background) {
      if (this.isDark) return background[3];
      const hour = new Date().getHours();
      if (hour > 5 && hour < 8) {
        return background[0];
      }
      if (hour > 8 && hour < 19) {
        return background[1];
      }
      if (hour > 19 && hour < 21) {
        return background[2];
      }
      return background[3];
    },
    getTrends() {
      const { data, dt } = this.$store.state.cache.trends;
      if (dt && data.length && Date.now() < dt + EXPIRE_TRENDS) {
        this.messages = [...this.messages, ...this.shuffle(data)];
      } else {
        this.axios.get(API).then((res) => {
          const trends = res.data[this.trendsSettings.country];
          this.$store.commit('SET_TRENDS_CACHE', trends);
          this.messages = [...this.messages, ...this.shuffle(trends)];
        });
      }
    },
    getMessage() {
      this.messages = [this.shuffle(this.$t('greetMessages'))[0]];
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
        const payload = { origins: [DOODLES_API] };
        this.checkPermissions(payload, 'Google doodle')
          .then(() => this.axios.get(`${DOODLES_API}${date.getFullYear()}/${date.getMonth() + 1}`))
          .then((res) => {
            const { title, url } = res.data[0];
            this.doodle = { title, url };
            this.$store.commit('SET_DOODLE_CACHE', this.doodle);
          });
      }
    },
  },
};
