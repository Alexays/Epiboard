import VSpeedDial from 'vuetify/es5/components/VSpeedDial';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import CardsCmp from '@/components/Cards';
import Muuri from 'muuri';
import omit from 'lodash/omit';

export default {
  name: 'Home',
  components: {
    VSpeedDial,
    Cards: CardsCmp,
  },
  data() {
    return {
      grid: null,
      fab: false,
      cmp: Cards.cards,
    };
  },
  computed: {
    cards() {
      return [...new Set(this.$store.state.cards)];
    },
    emptyCards() {
      return Object.keys(this.cards).length === 0;
    },
    availableCards() {
      let keys = this.cards;
      if (!this.$store.state.settings.debug) {
        keys = keys.concat(['Changelog']);
      }
      return omit(this.cmp, keys);
    },
    showFab() {
      return Object.keys(this.availableCards).length;
    },
  },
  methods: {
    resize(elem) {
      return () => {
        this.grid.refreshItems(elem);
        this.grid.layout(true);
      };
    },
    delCard(key) {
      const elem = document.querySelector(`[data-id='${key}']`);
      this.grid.hide(elem);
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
    watchSize() {
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
    initGrid() {
      this.grid = new Muuri('#card-container', {
        items: '.card',
        dragEnabled: true,
        layout: { fillGaps: true },
        dragStartPredicate: { handle: '.head-drag' },
        dragSortInterval: 0,
        layoutOnInit: false,
        sortData: {
          index: (item, element) => this.cards.indexOf(element.getAttribute('data-id')),
        },
      });
      if (this.cards.length) {
        this.grid.sort('index', {
          layout: 'instant',
        });
      }
      this.grid.on('dragEnd', () => {
        const order = this.grid.getItems().map(item => item.getElement().getAttribute('data-id'));
        this.$store.commit('SET_CARDS', order);
      });
    },
  },
  mounted() {
    this.checkVersion();
    this.initGrid();
    this.watchSize();
  },
};
