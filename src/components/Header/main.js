import Vue from 'vue';
import VueLazyload from 'vue-lazyload';
import sample from 'lodash/sample';
import shuffle from 'lodash/shuffle';
import backgrounds from './backgrounds';
import welcomeMessages from './welcomeMessages';

Vue.use(VueLazyload, {
  filter: {
    progressive(listener) {
      if (listener.src.indexOf('i.imgur.com') > -1) {
        /* eslint-disable no-param-reassign */
        listener.el.setAttribute('lazy-progressive', 'true');
        const idx = listener.src.lastIndexOf('.');
        listener.loading = `${listener.src.substr(0, idx)}t${listener.src.substr(idx)}`;
        /* eslint-enable no-param-reassign */
      }
    },
  },
});

const API = 'https://trends.google.com/trends/hottrends/visualize/internal/data';

export default {
  name: 'Header',
  props: ['settings'],
  components: {
    VueTyper: () => import('@/components/Typer'),
  },
  data() {
    return {
      messages: [],
      background: '',
      trends: [],
    };
  },
  computed: {
    headerSettings() {
      return this.$store.state.settings.header;
    },
    trendsSettings() {
      return this.$store.state.settings.trends;
    },
    dark() {
      return this.$utils.isDark(this.$store.state.settings.dark);
    },
  },
  watch: {
    'headerSettings.background': function bg(val, old) {
      if (val !== old) this.getBackground();
    },
    'headerSettings.design': function design(val, old) {
      if (val !== old) this.getMessage();
    },
    trendsSettings: {
      handler(val) {
        if (!val.enabled) {
          this.trends = [];
          this.messages = [sample(welcomeMessages)];
        } else this.getMessage();
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
      const { background } = this.headerSettings;
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
    getTrends() {
      this.axios.get(API)
        .then((res) => {
          this.trends = res.data[this.trendsSettings.country];
          this.messages = [...this.messages, ...shuffle(this.trends)];
        });
    },
    getMessage() {
      this.messages = [sample(welcomeMessages)];
      if (this.trendsSettings.enabled) {
        this.getTrends();
      }
    },
  },
  mounted() {
    this.getBackground();
    this.getMessage();
  },
};
