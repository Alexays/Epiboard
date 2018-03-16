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
      position: null,
      today: null,
      API: 'https://api.openweathermap.org/data/2.5/weather',
      app_id: '0c9042777e3128fab0244da248184801',
    };
  },
  methods: {
    getImg(nb) {
      const available = ['200', '200-n', '201', '300', '500', '500-n', '501', '501-n', '502', '502-n', '503', '503-n', '511', '600', '600-n', '601', '602', '700', '800', '800-n', '801', '801-n', '803', '804', '952', '953'];
      const date = Date.now() / 1000 | 0;
      if (date > this.today.sys.sunrise && date < this.today.sys.sunset) {
        if (available.includes(nb)) {
          return nb;
        } else if (available.includes(`${nb.toString()[0]}00`)) {
          return `${nb.toString()[0]}00`;
        }
      }
      if (available.includes(`${nb}-n`)) {
        return `${nb}-n`;
      } else if (available.includes(`${nb.toString()[0]}00-n`)) {
        return `${nb.toString()[0]}00-n`;
      }
      return 'none';
    },
    getToday(position) {
      const {
        latitude,
        longitude,
      } = position.coords;
      this.$http.get(`${this.API}?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.app_id}`)
        .then((res) => {
          this.today = res.data;
          this.today.wind.speed |= 0;
          this.today.main.temp |= 0;
          console.log(this.today);
          this.$emit('init', this.$data);
        });
    },
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.getToday,
        (err) => {
          throw err;
        }, {
          timeout: 30000,
          enableHighAccuracy: true,
          maximumAge: 75000,
        },
      );
    }
  },
};
