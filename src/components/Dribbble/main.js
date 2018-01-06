import _ from 'lodash';
import Axios from 'axios';
import BoxInit from '../../helpers/BoxInit';
import Storage from '../../helpers/Storage';

export default {

    name: 'dribbble',
    props: ['settings'],

    data() {
        return {
            shots: []
        };
    },

    methods: {

        /**
         * Gets the popular Dribbble shots
         * @return {array} The dribble shots
         */
        getShots() {
            const self = this;
            const cachedShots = Storage.get('dribbble-shots');
            const endpoint = `https://api.dribbble.com/v1/shots/?access_token=${this.settings.apiKey}`;

            if (cachedShots) {
                this.shots = _.shuffle(JSON.parse(cachedShots));
            } else {
                Axios.get(endpoint)
                    .then((res) => {
                        Storage.set('dribbble-shots', JSON.stringify(res.data), 60 * 60 * 24);

                        self.shots = res.data;
                    });
            }
        }

    },

    mounted() {
        new BoxInit(this.$el);
        this.getShots();
    }

};
