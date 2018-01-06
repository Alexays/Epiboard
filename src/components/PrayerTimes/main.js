import PrayTime from 'prayer-times';
import moment from 'moment';
import Storage from '../../helpers/Storage';
import BoxInit from '../../helpers/BoxInit';

export default {

    name: 'prayer-times',
    props: ['settings'],

    data() {
        return {
            times: {},
            coords: {},
            current: ''
        };
    },

    methods: {

        /**
         * Gets the user's coordinates using geolocation
         * @return void
         */
        getCoords() {
            const self = this;
            const cachedCoords = Storage.get('prayer-times-coords');

            if ('geolocation' in navigator) {
                if (cachedCoords) {
                    this.coords = JSON.parse(cachedCoords);
                    this.setPrayerTimes();
                } else {
                    navigator.geolocation.getCurrentPosition((position) => {
                        self.coords = {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        };
                        Storage.set('prayer-times-coords', JSON.stringify(self.coords), 60 * 60);
                        self.setPrayerTimes();
                    });
                }
            }
        },

        /**
         * Gets and sets prayer times
         * @return void
         */
        setPrayerTimes() {
            const self = this;
            const pt = new PrayTime();
            const date = new Date();
            const timezone = date.getTimezoneOffset() / 60;
            let current = '';

            // Set options

            pt.setMethod('ISNA');
            pt.adjust({ highLats: 'AngleBased' });

            // Get times

            const times = pt.getTimes(date, [this.coords.latitude, this.coords.longitude], timezone, 'auto', '24h');

            // Convert times to seconds since epoch

            Object.keys(times).forEach((key) => {
                const timeSplit = times[key].split(':');

                times[key] = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate(),
                    parseInt(timeSplit[0], 10),
                    parseInt(timeSplit[1], 10), 0
                ).getTime();
            });

            // Create object with prayer times in the correct order

            const newTimes = {
                fajr: {
                    name: 'Fajr',
                    time: times.fajr
                },
                sunrise: {
                    name: 'Sunrise',
                    time: times.sunrise
                },
                dhuhr: {
                    name: 'Dhuhr',
                    time: times.dhuhr
                },
                asr: {
                    name: 'Asr',
                    time: times.asr
                },
                maghrib: {
                    name: 'Maghrib',
                    time: times.maghrib
                },
                isha: {
                    name: 'Isha',
                    time: times.isha
                }
            };

            // Find out the current prayer time

            Object.keys(newTimes).forEach((key) => {
                if (date.getTime() >= newTimes[key].time) {
                    current = key;
                }

                newTimes[key].time = self.formatTime(newTimes[key].time);
            });

            // Set times and current prayer

            this.current = current;
            this.times = newTimes;
        },

        /**
         * Format the prayer time
         * @param  {object} date The date object
         * @return {string}      The formatted time
         */
        formatTime(date) {
            const timeFormat = ('timeFormat' in this.settings) ? this.settings.timeFormat : '24h';
            const momentDate = moment(date, 'x');
            let time = '';

            if (timeFormat == '12h') {
                time = momentDate.format('h.mm a');
            } else if (timeFormat == '24h') {
                time = momentDate.format('HH:mm');
            }

            return time;
        }

    },

    mounted() {
        new BoxInit(this.$el);

        // Get coords and set prayer times

        this.getCoords();
    }

};
