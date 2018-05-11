import Muuri from 'muuri';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import omit from 'lodash/omit';
import CardsCmp from '@/components/Cards';

export default {
  name: 'Home',
  components: {
    Cards: CardsCmp,
  },
  data() {
    return {
      grid: null,
      fab: false,
      keys: Cards,
      cardsSettings: {},
    };
  },
  computed: {
    cards() {
      return this.$store.state.cards;
    },
    emptyCards() {
      return Object.keys(this.cards).length === 0;
    },
    availableCards() {
      let keys = this.cards;
      if (!this.$store.state.settings.debug) {
        keys = keys.concat(['Changelog']);
      }
      return omit(this.keys.cards, keys);
    },
    showFab() {
      return Object.keys(this.availableCards).length && this.grid != null;
    },
  },
  methods: {
    resize(elem) {
      return () => {
        this.grid.refreshItems(elem);
        this.grid.layout(true);
      };
    },
    addCard(key) {
      this.$store.commit('ADD_CARD', key);
      this.$nextTick(() => {
        const elem = document.querySelector(`[data-id='${key}']`);
        this.grid.add(elem);
        new ResizeSensor(elem, this.resize(elem)); // eslint-disable-line no-new
      });
      this.$ga.event('cards', 'add', key, 1);
    },
    handleSize() {
      const cards = document.getElementsByClassName('card');
      for (let i = 0; i < cards.length; i += 1) {
        new ResizeSensor(cards[i], this.resize(cards[i])); // eslint-disable-line no-new
      }
    },
    checkVersion() {
      const lastVersion = this.$store.state.cache.version;
      const { version } = browser.runtime.getManifest();
      if (this.cards.indexOf('Changelog') === -1 && lastVersion && lastVersion !== version) {
        this.$store.commit('ADD_CARD', 'Changelog');
      }
      if (lastVersion !== version) {
        this.$store.commit('SET_VERSION', version);
      }
    },
  },
  mounted() {
    this.checkVersion();
    this.$nextTick(() => {
      this.grid = new Muuri('#card-container', {
        items: '.card',
        dragEnabled: true,
        layout: { fillGaps: true },
        dragStartPredicate: { handle: '.head-drag' },
        dragSortInterval: 0,
        layoutOnInit: false,
      });
      if (this.cards.length) {
        this.grid
          .sort((a, b) => ((this.cards.indexOf(a.getElement().getAttribute('data-id')) - this.cards.indexOf(b.getElement().getAttribute('data-id')))), {
            layout: 'instant',
          });
      }
      this.handleSize();
      this.grid.on('dragEnd', () => {
        const order = this.grid.getItems().map(item => item.getElement().getAttribute('data-id'));
        this.$store.commit('SET_CARDS', order);
      });
    });
  },
};
