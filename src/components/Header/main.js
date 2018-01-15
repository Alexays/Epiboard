import _ from 'lodash';
import { VueTyper } from 'vue-typer';

const data = {
  trendsApi: 'https://trends.google.com/trends/hottrends/visualize/internal/data',
  //trendsApi: 'https://hawttrends.appspot.com/api/terms/',
  // imgur album: https://imgur.com/a/NAaUE
  backgrounds: [
    {
      id: 0,
      name: 'Austin',
      type: 'Google Now',
      url: {
        dawn: 'https://i.imgur.com/7ndeJog.png',
        day: 'https://i.imgur.com/FsJ8mCW.png',
        dusk: 'https://i.imgur.com/Mmwv5GQ.png',
        night: 'https://i.imgur.com/brJBKA3.png',
      },
    },
    {
      id: 1,
      name: 'Beach',
      type: 'Google Now',
      url: {
        dawn: 'https://i.imgur.com/Q5Tn8u9.png',
        day: 'https://i.imgur.com/dTFXUxt.png',
        dusk: 'https://i.imgur.com/vdO9Ote.png',
        night: 'https://i.imgur.com/YaoPX9P.png',
      },
    },
    {
      id: 2,
      name: 'Berlin',
      type: 'Google Now',
      url: {
        dawn: 'https://i.imgur.com/jG1OdPc.png',
        day: 'https://i.imgur.com/lnILrRU.png',
        dusk: 'https://i.imgur.com/ZCJVfSn.png',
        night: 'https://i.imgur.com/5mN7Iau.png',
      },
    },
    {
      id: 3,
      name: 'Chicago',
      type: 'Google Now',
      url: {
        dawn: 'https://i.imgur.com/f4HUPlZ.png',
        day: 'https://i.imgur.com/t5wzT8j.png',
        dusk: 'https://i.imgur.com/XrJi3O1.png',
        night: 'https://i.imgur.com/xDWHJ45.png',
      },
    },
    {
      id: 4,
      name: 'Default',
      type: 'Google Now',
      url: {
        dawn: 'https://i.imgur.com/kJFNQLr.png',
        day: 'https://i.imgur.com/foVYQ6T.png',
        dusk: 'https://i.imgur.com/dW217U5.png',
        night: 'https://i.imgur.com/87UObPk.png',
      },
    },
    {
      id: 5,
      name: 'Great Plains',
      type: 'Google Now',
      url: {
        dawn: 'https://i.imgur.com/dWzcGbr.png',
        day: 'https://i.imgur.com/huGlyp2.png',
        dusk: 'https://i.imgur.com/XNUMKAT.png',
        night: 'https://i.imgur.com/d7KaqQ1.png',
      },
    },
    {
      id: 6,
      name: 'London',
      type: 'Google Now',
      url: {
        dawn: 'https://i.imgur.com/ZD0XBoz.jpg',
        day: 'https://i.imgur.com/C2Sg6JG.jpg',
        dusk: 'https://i.imgur.com/Qb8PHnA.jpg',
        night: 'https://i.imgur.com/k0idCJG.jpg',
      },
    },
    {
      id: 7,
      name: 'New York',
      type: 'Google Now',
      url: {
        dawn: 'https://i.imgur.com/JVK8ID7.png',
        day: 'https://i.imgur.com/yB93g10.png',
        dusk: 'https://i.imgur.com/z4elpiG.png',
        night: 'https://i.imgur.com/lh0LV5L.png',
      },
    },
    {
      id: 8,
      name: 'Paris',
      type: 'Google Now',
      url: {
        dawn: 'https://i.imgur.com/c3wAjp2.png',
        day: 'https://i.imgur.com/c3wAjp2.png',
        dusk: 'https://i.imgur.com/vmfdH9T.png',
        night: 'https://i.imgur.com/vmfdH9T.png',
      },
    },
    {
      id: 9,
      name: 'San Francisco',
      type: 'Google Now',
      url: {
        dawn: 'https://i.imgur.com/fqewVsW.png',
        day: 'https://i.imgur.com/lUZp177.png',
        dusk: 'https://i.imgur.com/XP6Omxa.png',
        night: 'https://i.imgur.com/NATsgio.png',
      },
    },
    {
      id: 10,
      name: 'Seattle',
      type: 'Google Now',
      url: {
        dawn: 'https://i.imgur.com/7nsrzRK.jpg',
        day: 'https://i.imgur.com/0E2xXb0.jpg',
        dusk: 'https://i.imgur.com/wYytDhF.jpg',
        night: 'https://i.imgur.com/ddI0eBh.jpg',
      },
    },
    {
      id: 11,
      name: 'Tahoe',
      type: 'Google Now',
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
    'You can be whoever you want !'
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
      messages: '',
      background: '',
      trends: [],
      welcomeMessage: false,
    };
  },
  methods: {
    addTrends() {
      if (this.welcomeMessage || _.isEmpty(this.trends))
        return;
      this.messages = this.trends;
      this.welcomeMessage = true;
    },
    getBackground() {
      const getBackgroundTime = (url) => {
        const date = new Date();
        date.setTime(date);
        const hour = date.getHours();
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
      };
      this.background = getBackgroundTime(_.sample(data.backgrounds).url);
    },
    getMessage() {
      this.messages = [_.sample(data.welcomeMessages)];
      this.axios.get(data.trendsApi).then((res) => {
        this.trends = res.data['france']; // TODO: select country
      });
    },
  },
  mounted() {
    this.getBackground();
    this.getMessage();
  },
};

