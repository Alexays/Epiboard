export default {
  name: 'Weather',
  props: ['settings'],
  size: 2,
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
    getToday(position) {
      const {
        latitude, longitude,
      } = position.coords;
      this.$http.get(`${this.API}?lat=${latitude}&lon=${longitude}&units=metric&appid=${this.app_id}`)
        .then((response) => {
          this.today = response.data;
          this.$emit('init');
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
