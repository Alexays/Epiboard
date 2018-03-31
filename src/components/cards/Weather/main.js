const API = 'https://api.openweathermap.org/data/2.5/weather';
const APP_ID = '0c9042777e3128fab0244da248184801';

export default {
  name: 'Weather',
  props: ['settings'],
  title: new Date().toLocaleDateString('en-Us', {
    weekday: 'long',
  }),
  custom: true,
  size: 1,
  components: {},
  data() {
    return {
      today: null,
    };
  },
  methods: {
    getImg(nb) {
      const available = ['200', '200-n', '201', '300', '500', '500-n', '501', '501-n', '502', '502-n', '503', '503-n', '511', '600', '600-n', '601', '602', '700', '800', '800-n', '801', '801-n', '803', '804', '952', '953'];
      const date = Date.now() / 1000;
      if (!(date > this.today.sys.sunrise && date < this.today.sys.sunset)) {
        if (available.includes(`${nb}-n`)) {
          return `${nb}-n`;
        } else if (available.includes(`${nb.toString()[0]}00-n`)) {
          return `${nb.toString()[0]}00-n`;
        }
      }
      if (available.includes(nb)) {
        return nb;
      } else if (available.includes(`${nb.toString()[0]}00`)) {
        return `${nb.toString()[0]}00`;
      }
      return 'none';
    },
    getTime(nb) {
      const date = new Date(nb * 1000);
      return `${(`0${date.getHours()}`).slice(-2)}:${(`0${date.getMinutes()}`).slice(-2)}`;
    },
    getToday(position) {
      const { latitude, longitude } = position.coords;
      return this.$http.get(`${API}?lat=${latitude}&lon=${longitude}&units=metric&appid=${APP_ID}`)
        .then((res) => {
          this.today = res.data;
          this.today.wind.speed = this.today.wind.speed * 3.6 | 0;
          this.today.main.temp |= 0;
        });
    },
    getLocalisation() {
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 30000,
          enableHighAccuracy: true,
          maximumAge: 75000,
        });
      });
    },
  },
  mounted() {
    this.getLocalisation()
      .then(this.getToday)
      .then(() => this.$emit('init', this.$data))
      .catch(() => this.$emit('init', false));
  },
};
