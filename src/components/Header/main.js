import isEmpty from 'lodash/isEmpty';
import sample from 'lodash/sample';
import shuffle from 'lodash/shuffle';
import { VueTyper } from 'vue-typer';

const data = {
  // imgur album: https://imgur.com/a/NAaUE
  backgrounds: [
    {
      name: 'Austin',
      url: {
        dawn: 'https://i.imgur.com/7ndeJog.jpg',
        day: 'https://i.imgur.com/FsJ8mCW.jpg',
        dusk: 'https://i.imgur.com/Mmwv5GQ.jpg',
        night: 'https://i.imgur.com/brJBKA3.jpg',
      },
    },
    {
      name: 'Beach',
      url: {
        dawn: 'https://i.imgur.com/Q5Tn8u9.jpg',
        day: 'https://i.imgur.com/dTFXUxt.jpg',
        dusk: 'https://i.imgur.com/vdO9Ote.jpg',
        night: 'https://i.imgur.com/YaoPX9P.jpg',
      },
    },
    {
      name: 'Berlin',
      url: {
        dawn: 'https://i.imgur.com/jG1OdPc.jpg',
        day: 'https://i.imgur.com/lnILrRU.jpg',
        dusk: 'https://i.imgur.com/ZCJVfSn.jpg',
        night: 'https://i.imgur.com/5mN7Iau.jpg',
      },
    },
    {
      name: 'Chicago',
      url: {
        dawn: 'https://i.imgur.com/f4HUPlZ.jpg',
        day: 'https://i.imgur.com/t5wzT8j.jpg',
        dusk: 'https://i.imgur.com/XrJi3O1.jpg',
        night: 'https://i.imgur.com/xDWHJ45.jpg',
      },
    },
    {
      name: 'Default',
      url: {
        dawn: 'https://i.imgur.com/kJFNQLr.jpg',
        day: 'https://i.imgur.com/foVYQ6T.jpg',
        dusk: 'https://i.imgur.com/dW217U5.jpg',
        night: 'https://i.imgur.com/87UObPk.jpg',
      },
    },
    {
      name: 'Great Plains',
      url: {
        dawn: 'https://i.imgur.com/dWzcGbr.jpg',
        day: 'https://i.imgur.com/huGlyp2.jpg',
        dusk: 'https://i.imgur.com/XNUMKAT.jpg',
        night: 'https://i.imgur.com/d7KaqQ1.jpg',
      },
    },
    {
      name: 'London',
      url: {
        dawn: 'https://i.imgur.com/ZD0XBoz.jpg',
        day: 'https://i.imgur.com/C2Sg6JG.jpg',
        dusk: 'https://i.imgur.com/Qb8PHnA.jpg',
        night: 'https://i.imgur.com/k0idCJG.jpg',
      },
    },
    {
      name: 'New York',
      url: {
        dawn: 'https://i.imgur.com/JVK8ID7.jpg',
        day: 'https://i.imgur.com/yB93g10.jpg',
        dusk: 'https://i.imgur.com/z4elpiG.jpg',
        night: 'https://i.imgur.com/lh0LV5L.jpg',
      },
    },
    {
      name: 'Paris',
      url: {
        dawn: 'https://i.imgur.com/c3wAjp2.jpg',
        day: 'https://i.imgur.com/c3wAjp2.jpg',
        dusk: 'https://i.imgur.com/vmfdH9T.jpg',
        night: 'https://i.imgur.com/vmfdH9T.jpg',
      },
    },
    {
      name: 'San Francisco',
      url: {
        dawn: 'https://i.imgur.com/fqewVsW.jpg',
        day: 'https://i.imgur.com/lUZp177.jpg',
        dusk: 'https://i.imgur.com/XP6Omxa.jpg',
        night: 'https://i.imgur.com/NATsgio.jpg',
      },
    },
    {
      name: 'Seattle',
      url: {
        dawn: 'https://i.imgur.com/7nsrzRK.jpg',
        day: 'https://i.imgur.com/0E2xXb0.jpg',
        dusk: 'https://i.imgur.com/wYytDhF.jpg',
        night: 'https://i.imgur.com/ddI0eBh.jpg',
      },
    },
    {
      name: 'Tahoe',
      url: {
        dawn: 'https://i.imgur.com/ZSXPIkL.jpg',
        day: 'https://i.imgur.com/xeVYGPU.jpg',
        dusk: 'https://i.imgur.com/Buxx2Cs.jpg',
        night: 'https://i.imgur.com/g761v2t.jpg',
      },
    },
  ],
  welcomeMessages: [
    "Hey, how's your day?",
    "Hope you're doing well",
    'Someone think of you ;)',
    'Hello !',
    'Try smiling, it works !',
    'Did you know you rock ?',
    "Let's get motivated shall we ?",
    'Come on buddy !',
    'You can be whoever you want !',
  ],
};

export default {
  name: 'Header',
  props: ['settings'],
  components: {
    VueTyper,
  },
  data() {
    return {
      API: 'https://trends.google.com/trends/hottrends/visualize/internal/data',
      messages: '',
      background: '',
      dark: false,
      typer: {
        typed: '',
        current: '',
        index: 0,
        nb: 0,
        part: '',
      },
      $trends: null,
      trends: [],
    };
  },
  computed: {
    country() {
      return this.$store.state.settings.global.country;
    },
    google_now() {
      return this.$store.state.settings.global.google_now;
    },
    header_design() {
      return this.$store.state.settings.global.header_design;
    },
    trends_settings() {
      return this.$store.state.settings.global.trends;
    },
    dark_mode() {
      return this.$store.state.settings.dark;
    },
  },
  watch: {
    country(val, old) {
      if (val !== old) this.getMessage();
    },
    google_now(val, old) {
      if (val !== old) this.getBackground();
    },
    header_design(val, old) {
      if (val !== old) this.getMessage();
    },
    trends_settings(val, old) {
      if (val !== old) {
        if (!val) {
          this.trends = [];
          this.messages = [sample(data.welcomeMessages)];
        } else this.getMessage();
      }
    },
    dark_mode: {
      handler(val) {
        const tmp = this.$utils.isDark(val);
        if (tmp !== this.dark) {
          this.dark = tmp;
          this.getBackground();
        }
      },
      deep: true,
    },
  },
  methods: {
    onTyped(typed) {
      if (data.welcomeMessages.indexOf(typed) > -1) {
        this.typer.current = '';
        return;
      }
      this.typer.current = typed;
    },
    search(ev) {
      if (ev.keyCode === 13) {
        window.open(`https://www.google.com/#q=${this.typer.typed.length > 0 ? this.typer.typed : this.typer.current}`, '_self');
      }
    },
    Type() {
      if (this.typer.typed.length > 0) return;
      if (this.typer.part.length < this.typer.current.length) {
        this.typer.part += this.typer.current[this.typer.index];
        this.typer.index += 1;
        setTimeout(this.Type, 70);
      } else if (this.trends.length > 0) {
        setTimeout(() => {
          if (this.typer.typed.length > 0) return;
          if (this.typer.nb >= this.messages.length) {
            this.typer.nb = 0;
          }
          this.typer.current = this.messages[this.typer.nb];
          this.typer.index = 0;
          this.typer.part = '';
          this.typer.nb += 1;
          setTimeout(this.Type, 70);
        }, 5000);
      }
    },
    addTrends() {
      this.current = '';
      if (this.welcomeMessage || isEmpty(this.trends)) return;
      this.messages = this.trends;
    },
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
      if (this.$store.state.settings.global.google_now === 'Random') {
        this.background = this.getBackgroundTime(sample(data.backgrounds).url);
      } else {
        this.background = this.getBackgroundTime(data.backgrounds
          .find(f => f.name === this.$store.state.settings.global.google_now).url);
      }
    },
    getMessage() {
      this.messages = [sample(data.welcomeMessages)];
      if (this.$store.state.settings.global.header_design === 'toolbar') {
        this.typer = {
          typed: '',
          current: '',
          index: 0,
          nb: 0,
          part: '',
        };
        [this.typer.current] = this.messages;
        this.Type();
      }
      if (this.$store.state.settings.global.trends) {
        this.$trends = this.axios.get(this.API)
          .then(res => res.data)
          .then((res) => {
            this.trends = res[this.$store.state.settings.global.country];
            this.messages = shuffle(this.trends);
          });
      }
    },
  },
  mounted() {
    this.dark = this.$utils.isDark(this.dark_mode);
    this.getBackground();
    this.getMessage();
  },
};
