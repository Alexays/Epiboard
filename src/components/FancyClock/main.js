import _ from 'lodash';
import moment from 'moment';
import Axios from 'axios';
import BoxInit from '../../helpers/BoxInit';
import Cache from '../../helpers/Cache';
import Storage from '../../helpers/Storage';

export default {

    name: 'fancy-clock',
    props: ['settings'],

    data() {
        return {
            time: this.getTime(),
            date: this.getDate(),
            isActive: false,
            coords: {},
            temp: 0,
            cond: null,
            imgs: [],
        };
    },

    methods: {

        /**
         * Gets the current time
         * @return {str} The time
         */
        getTime() {
            return moment().format('HH:mm');
        },

        /**
         * Gets the current date
         * @return {str} The date
         */
        getDate() {
            return moment().format('DD MMMM YYYY');
        },

        /**
         * Sets a random background image of the clock
         * @return void
         */
        setImg() {
            const self = this;
            const rand = _.random(1000000, 9000000000);
            const imgUrl = `https://source.unsplash.com/${this.settings.slideshowPhotoset}/800x600?sig=${rand}`;
            const img = new Image();

            img.src = imgUrl;
            img.onload = () => {
                self.isActive = true;
                self.imgs.push(`url(${imgUrl})`);

                setTimeout(() => {
                    self.isActive = false;
                }, 1000);

                if (self.imgs.length > 3) {
                    setTimeout(() => {
                        self.imgs.shift();
                    }, self.settings.slideshowSpeed / 2);
                }

                setTimeout(() => {
                    self.setImg();
                }, self.settings.slideshowSpeed);
            };
        },

        /**
         * Gets the user's coordinates using geolocation
         * @return void
         */
        getCoords() {
            const self = this;
            const cachedCoords = Storage.get('fancy-clock-coords');

            if ('geolocation' in navigator && 'owmApiKey' in this.settings) {
                if (cachedCoords) {
                    this.coords = JSON.parse(cachedCoords);
                    this.setWeather();
                } else {
                    navigator.geolocation.getCurrentPosition((position) => {
                        self.coords = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        };
                        Storage.set('fancy-clock-coords', JSON.stringify(self.coords), 60 * 60);
                        self.setWeather();
                    });
                }
            }
        },

        /**
         * Sets the weather by retrieving data from open weather map
         * @return void
         */
        setWeather() {
            const self = this;
            const cachedTemp = Storage.get('fancy-clock-temp');
            const cachedCond = Storage.get('fancy-clock-cond');
            const endpoint = `http://api.openweathermap.org/data/2.5/weather?lat=${this.coords.latitude}&lon=${this.coords.longitude}&units=metric&APPID=${this.settings.owmApiKey}&cacheBust=${Cache.bust('hourly')}`;

            // Retrieve weather details from cache

            if (cachedTemp) {
                this.temp = cachedTemp;
                this.cond = cachedCond;
            } else {
                Axios.get(endpoint)
                    .then((res) => {
                        const data = res.data;
                        const weather = data;
                        const cnd = weather.weather[0].id;
                        const time = new Date().getTime() / 1000;

                        // Choose correct letter for current weather condition

                        let cond = '/';

                        if ([200, 201, 202, 210, 211,
                            212, 221, 230, 231, 232].includes(cnd)) { // Thunderstorm
                            cond = 'Y';
                        } else if ([300, 301, 302, 310, 311, 312, 321].includes(cnd)) { // Drizzle
                            cond = 'M';
                        } else if ([500, 501, 502, 503, 504].includes(cnd)) { // Rain with sun
                            cond = 'J';
                        } else if ([511].includes(cnd)) { // Freezing rain
                            cond = 'O';
                        } else if ([520, 521, 522].includes(cnd)) { // Rain
                            cond = 'K';
                        } else if ([600, 601, 602, 611, 621].includes(cnd)) { // Snow
                            cond = 'I';
                        } else if ([701, 711, 721, 731, 741].includes(cnd)) { // Atmosphere
                            cond = '…';
                        } else if ([800].includes(cnd)) { // Clear
                            if (time > weather.sys.sunset) {
                                cond = '6';
                            } else {
                                cond = '1';
                            }
                        } else if ([801].includes(cnd)) { // Few clouds
                            if (time > weather.sys.sunset) {
                                cond = 'A';
                            } else {
                                cond = 'a';
                            }
                        } else if ([802, 803, 804].includes(cnd)) { // Clouds
                            cond = '3';
                        }

                        // Save to cache and set states

                        const temp = Math.round(weather.main.temp);

                        Storage.set('fancy-clock-temp', temp, 60 * 60);
                        Storage.set('fancy-clock-cond', cond, 60 * 60);

                        self.temp = temp;
                        self.cond = cond;
                    });
            }
        }

    },

    mounted() {
        new BoxInit(this.$el);

        // Set the first background image and get weather

        this.setImg();
        this.getCoords();

        // Remove message after a short while

        setInterval(() => {
            this.$el.querySelector('.message').classList.add('message--fade-out');
        }, 3000);

        // Update the time every second

        setInterval(() => {
            this.time = this.getTime();
        }, 1000);
    }

};
