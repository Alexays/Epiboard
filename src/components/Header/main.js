import isEmpty from 'lodash/isEmpty';
import sample from 'lodash/sample';
import {
  VueTyper,
} from 'vue-typer';

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
      current: '',
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
  },
  watch: {
    country(val, old) {
      if (val !== old) this.getMessage();
    },
    google_now(val, old) {
      if (val !== old) this.getBackground();
    },
  },
  methods: {
    onTyped(typed) {
      if (data.welcomeMessages.indexOf(typed) > -1) {
        this.current = '';
        return;
      }
      this.current = typed;
    },
    addTrends() {
      this.current = '';
      if (this.welcomeMessage || isEmpty(this.trends)) return;
      this.messages = this.trends;
    },
    getBackgroundTime(url) {
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
      this.messages = data.welcomeMessages;
      this.$trends.then((res) => {
        this.trends = res[this.$store.state.settings.global.country];
      });
    },
  },
  mounted() {
    this.$trends = this.axios.get(this.API).then(res => res.data);
    this.getBackground();
    this.getMessage();
  },
};
