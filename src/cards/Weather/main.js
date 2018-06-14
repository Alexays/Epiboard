const API = 'https://api.openweathermap.org/data/2.5/';

export default {
  name: 'Weather',
  title: new Date().toLocaleDateString('en-Us', {
    weekday: 'long',
  }),
  props: ['settings'],
  components: {},
  data() {
    return {
      today: null,
      forecast: null,
    };
  },
  computed: {
    sunrise() {
      return this.getTime(this.today.sys.sunrise);
    },
    sunset() {
      return this.getTime(this.today.sys.sunset);
    },
  },
  methods: {
    getImg(nb, night = true) {
      const available = ['200', '200-n', '201', '300', '500', '500-n', '501', '501-n', '502', '502-n', '503', '503-n', '511', '600', '600-n', '601', '602', '700', '800', '800-n', '801', '801-n', '803', '804', '952', '953'];
      const date = Date.now() / 1000;
      if (night && !(date > this.today.sys.sunrise && date < this.today.sys.sunset)) {
        if (available.includes(`${nb}-n`)) {
          return `${nb}-n`;
        } else if (available.includes(`${nb.toString()[0]}00-n`)) {
          return `${nb.toString()[0]}00-n`;
        }
      }
      if (available.includes(`${nb}`)) {
        return nb;
      } else if (available.includes(`${nb.toString()[0]}00`)) {
        return `${nb.toString()[0]}00`;
      }
      return 'none';
    },
    getTime(timestamp) {
      const date = new Date(timestamp * 1000);
      return `${(`0${date.getHours()}`).slice(-2)}:${(`0${date.getMinutes()}`).slice(-2)}`;
    },
    fetch(mode, query) {
      let endpoint = `${API}${mode}?${query}&appid=${this.settings.appId}`;
      if (this.settings.units !== 'kelvin') {
        endpoint += `&units=${this.settings.units}`;
      }
      return this.$http.get(endpoint);
    },
    getToday(query) {
      return this.fetch('weather', query)
        .then((res) => {
          this.today = res.data;
          this.today.wind.speed = this.today.wind.speed * 3.6 | 0;
          this.today.main.temp |= 0;
          if (this.today.weather[0] && this.today.weather[0].description) {
            this.today.weather[0].description = this.today.weather[0].description.split(' ').map(w => w[0].toUpperCase() + w.substr(1)).join(' ');
          }
        });
    },
    getForecast(query) {
      if (!this.settings.forecast) return Promise.resolve();
      return this.fetch('forecast', query)
        .then((res) => {
          this.forecast = res.data.list.map((f) => {
            f.dt = new Date(f.dt_txt);
            f.dayName = f.dt.toLocaleString('en-US', { weekday: 'short' });
            f.main.temp |= 0;
            if (f.weather[0] && f.weather[0].description) {
              f.weather[0].description = f.weather[0].description.split(' ').map(w => w[0].toUpperCase() + w.substr(1)).join(' ');
            }
            if (this.settings.units === 'metric') f.title = `${f.main.temp}°C ${f.weather[0].description}`;
            if (this.settings.units === 'imperial') f.title = `${f.main.temp}°F ${f.weather[0].description}`;
            if (this.settings.units === 'kelvin') f.title = `${f.main.temp}K ${f.weather[0].description}`;
            return f;
          }).filter(f => f.dt.getDate() !== new Date().getDate() && f.dt.getHours() === 12);
        });
    },
    getQuery(pos) {
      if (pos.coords) {
        const { latitude, longitude } = pos.coords;
        return Promise.resolve(`lat=${latitude}&lon=${longitude}`);
      } else if (pos.city) {
        return Promise.resolve(`q=${pos.city}`);
      }
      return Promise.reject(new Error('Enter valid city name'));
    },
    getLocalisation() {
      if (!this.settings.auto) return Promise.resolve({ city: this.settings.city });
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
    if (this.VALID_CACHE) {
      this.$emit('init', true);
      return;
    }
    this.getLocalisation()
      .then(this.getQuery)
      .then(query => Promise.all([this.getToday(query), this.getForecast(query)]))
      .then(() => this.$emit('init', this.$data))
      .catch(err => this.$emit('init', err));
  },
};
