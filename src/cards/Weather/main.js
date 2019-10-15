import DateMixin from '@/mixins/date';

const API = 'https://api.openweathermap.org/data/2.5/';

const imgs = {
  path: '/imgs/weather/weather-',
  day: [
    200, 201, 300, 500, 501, 502, 503, 511,
    600, 601, 602, 700, 800, 801, 803, 804, 952, 953,
  ],
  night: [200, 500, 501, 502, 503, 600, 800, 801],
};

// @vue/component
export default {
  name: 'Weather',
  mixins: [DateMixin],
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      today: null,
      forecast: null,
      geoError: null,
    };
  },
  computed: {
    sunrise() {
      return new Date(this.today.sys.sunrise * 1000)
        .toLocaleTimeString(this.$t('locale'), this.timeOptions);
    },
    sunset() {
      return new Date(this.today.sys.sunset * 1000)
        .toLocaleTimeString(this.$t('locale'), this.timeOptions);
    },
  },
  created() {
    this.$emit('update:cardtitle', new Date().toLocaleDateString(this.$t('locale'), {
      weekday: 'long',
    }));
  },
  mounted() {
    if (this.VALID_CACHE && this.today && !this.geoError) {
      this.$emit('init', false);
      return;
    }
    this.getLocalisation()
      .then(this.getQuery)
      .then(query => Promise.all([this.getToday(query), this.getForecast(query)]))
      .then(() => this.$emit('init', true))
      .catch(err => this.$emit('init', err));
  },
  methods: {
    getImg(nb, night = true) {
      const date = Date.now() / 1000;
      if (night && !(date > this.today.sys.sunrise && date < this.today.sys.sunset)) {
        const closest = imgs.night.reduce((a, b) => (Math.abs(b - nb) < Math.abs(a - nb) ? b : a));
        if (imgs.night.includes(nb)) {
          return `${imgs.path}${nb}-n.png`;
        }
        if (`${closest}`[0] === `${nb}`[0]) {
          return `${imgs.path}${closest}-n.png`;
        }
      }
      const closest = imgs.day.reduce((a, b) => (Math.abs(b - nb) < Math.abs(a - nb) ? b : a));
      if (imgs.day.includes(nb)) {
        return `${imgs.path}${nb}.png`;
      }
      if (`${closest}`[0] === `${nb}`[0]) {
        return `${imgs.path}${closest}.png`;
      }
      return `${imgs.path}none.png`;
    },
    fetch(mode, query) {
      let endpoint = `${API}${mode}?${query}&appid=${this.settings.appId}&lang=${this.$i18n.locale}`;
      if (this.settings.units !== 'kelvin') {
        endpoint += `&units=${this.settings.units}`;
      }
      return this.$http.get(endpoint).then(res => res.data);
    },
    getToday(query) {
      return this.fetch('weather', query)
        .then((f) => {
          f.main.temp = Math.round(f.main.temp);
          f.wind.speed = Math.round(f.wind.speed * (this.settings.units !== 'imperial' ? 3.6 : 1));
          f.weather[0].description = f.weather[0].description
            .split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
          this.today = f;
        });
    },
    getForecast(query) {
      if (!this.settings.forecast) return Promise.resolve();
      return this.fetch('forecast', query)
        .then((data) => {
          this.forecast = data.list.map((f) => {
            f.main.temp = Math.round(f.main.temp);
            f.weather[0].description = f.weather[0].description.split(' ')
              .map(w => `${w[0].toUpperCase()}${w.slice(1)}`).join(' ');
            if (this.settings.units === 'metric') f.title = `${f.main.temp}°C ${f.weather[0].description}`;
            if (this.settings.units === 'imperial') f.title = `${f.main.temp}°F ${f.weather[0].description}`;
            if (this.settings.units === 'kelvin') f.title = `${f.main.temp}K ${f.weather[0].description}`;
            return f;
          }).filter((f) => {
            const date = new Date(f.dt_txt);
            return date.getDate() !== new Date().getDate() && date.getHours() === 12;
          });
        });
    },
    getQuery(pos) {
      if (pos.coords) {
        const { latitude, longitude } = pos.coords;
        return `lat=${latitude}&lon=${longitude}`;
      }
      if (pos.city) {
        if (!Number.isNaN(parseFloat(pos.city))) {
          return `id=${pos.city}`;
        }
        return `q=${pos.city}`;
      }
      throw new Error('Enter valid city name');
    },
    getLocalisation() {
      this.geoError = null;
      if (!this.settings.auto) return Promise.resolve({ city: this.settings.city });
      if (!navigator.geolocation) {
        if (!this.today) this.$emit('update:subtitle', this.$t('Weather.error.title'));
        const error = this.$t('Weather.error.unsupported');
        this.geoError = error;
        return Promise.reject(new Error(error));
      }
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, (err) => {
          if (!this.today) this.$emit('update:subtitle', this.$t('Weather.error.title'));
          this.geoError = this.$t('Weather.error.sample');
          reject(new Error(err.message));
        }, {
          timeout: 15000,
          maximumAge: 0,
        });
      });
    },
  },
};
