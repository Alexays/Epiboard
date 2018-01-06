import _ from 'lodash';
import Axios from 'axios';
import BoxInit from '../../helpers/BoxInit';
import Storage from '../../helpers/Storage';

export default {

    name: 'rss',
    props: ['settings'],

    data() {
        return {
            feed: null,
            headerBgColor: null
        };
    },

    methods: {

        /**
         * Gets the popular Dribbble shots
         * @return {array} The dribble shots
         */
        getFeed() {
            const self = this;
            const urlSlug = this.settings.url.replace(/[^0-9a-z]/, '');
            const cacheKey = `rss-feed-${urlSlug}`;
            const cachedFeed = Storage.get(cacheKey);

            if (cachedFeed) {
                const feed = JSON.parse(cachedFeed);

                feed.items = _.shuffle(feed.items);
                this.feed = feed;
            } else {
                Axios.get(this.settings.url)
                .then((res) => {
                    const feedItems = [];
                    const xml = (new window.DOMParser()).parseFromString(res.data, 'text/xml');
                    const items = [].slice.call(xml.querySelectorAll('item'));

                    // Get all the items from the xml document and put into an object

                    items.forEach((item) => {
                        let linkTag = 'link';

                        // Check if we need to get the url from a different tag
                        // other than the link tag

                        if (
                            'href' in self.settings &&
                            item.querySelector(self.settings.href).textContent.match(/^https?:\/\//)
                        ) {
                            linkTag = self.settings.href;
                        }

                        // Add formatted news item to feed array

                        feedItems.push({
                            title: item.querySelector('title').textContent,
                            link: _.trim(item.querySelector(linkTag).textContent)
                        });
                    });

                    // Create feed object with title and items and set to feed
                    // prop then cache results

                    const rssFeed = {
                        title: xml.querySelector('channel > title').textContent,
                        items: feedItems
                    };

                    Storage.set(cacheKey, JSON.stringify(rssFeed), 60 * 60);
                    self.feed = rssFeed;
                });
            }
        }

    },

    mounted() {
        new BoxInit(this.$el);

        // Change the background colour of the header

        if ('headerBgColor' in this.settings) {
            this.headerBgColor = this.settings.headerBgColor;
        }

        // Get the feed

        this.getFeed();
    }

};
