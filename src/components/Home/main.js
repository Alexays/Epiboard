import VSpeedDial from 'vuetify/es5/components/VSpeedDial';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import CardsCmp from '@/components/Cards';
import Muuri from 'muuri';

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
    };
  },
  computed: {
    cardsKey() {
      return Cards.cards;
    },
    cards() {
      return [...new Set(this.$store.state.cards)].filter(f => this.cardsKey[f]);
    },
    emptyCards() {
      return Object.keys(this.cards).length === 0;
    },
    availableCards() {
      let keys = this.cards;
      if (!this.$store.state.settings.debug) {
        keys = keys.concat(['Changelog']);
      }
      return keys.reduce((obj, key) => {
        const { [key]: _, ...tmp } = obj;
        return tmp;
      }, this.cardsKey);
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
      this.$store.commit(key === 'Changelog' ? 'ADD_CARD_FIRST' : 'ADD_CARD', key);
      this.$nextTick(() => {
        const elem = document.querySelector(`[data-id='${key}']`);
        if (key === 'Changelog') this.grid.add(elem, { index: 0 });
        else this.grid.add(elem);
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
      if (lastVersion && lastVersion !== version && this.cards.indexOf('Changelog') === -1) {
        this.addCard('Changelog');
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
        this.grid.sort('index', { layout: 'instant' });
      }
      this.grid.on('dragEnd', () => {
        const order = this.grid.getItems('active').map(item => item.getElement().getAttribute('data-id'));
        this.$store.commit('SET_CARDS', order);
        this.$ga.event('cards', 'order', order, 1);
      });
    },
  },
  beforeMount() {
    this.checkVersion();
  },
  mounted() {
    this.initGrid();
    this.watchSize();
  },
};
