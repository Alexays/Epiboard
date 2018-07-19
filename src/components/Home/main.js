import VSpeedDial from 'vuetify/es5/components/VSpeedDial';
import Card from '@/components/Card';
import Muuri from 'muuri';

// @vue/component
export default {
  name: 'Home',
  components: {
    VSpeedDial,
    Card,
  },
  data() {
    return {
      grid: null,
      fab: false,
    };
  },
  computed: {
    cardsCmp() {
      return Cards;
    },
    cards() {
      const { cards } = this.$store.state;
      return [...new Set(cards)].filter(f => this.cardsCmp[f]);
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
      }, this.cardsCmp);
    },
    showFab() {
      return Object.keys(this.availableCards).length;
    },
  },
  created() {
    this.checkVersion();
  },
  mounted() {
    this.initGrid();
  },
  methods: {
    onResize(el) {
      if (!this.grid) return;
      this.grid.refreshItems(el);
      this.grid.layout(true);
    },
    onDrag() {
      const cards = this.grid.getItems()
        .filter(f => f.isActive())
        .map(item => item.getElement().dataset.id);
      this.$store.commit('SET_CARDS', cards);
      this.$ga.event('cards', 'order', cards.join(', '), cards.length);
    },
    delCard(key) {
      const elem = document.querySelector(`[data-id='${key}']`);
      this.grid.hide(elem, {
        onFinish: () => {
          this.$ga.event('cards', 'delete', key, 0);
          this.$store.commit('DEL_CARD_SETTINGS', key);
          this.$store.commit('DEL_CARD_CACHE', key);
          this.$store.commit('DEL_VALID_CARD', key);
          this.$store.commit('DEL_CARD', key);
        },
      });
    },
    addCard(key) {
      this.$store.commit(key === 'Changelog' ? 'ADD_CARD_FIRST' : 'ADD_CARD', key);
      this.$nextTick(() => {
        const elem = document.querySelector(`[data-id='${key}']`);
        if (key === 'Changelog') this.grid.add(elem, { index: 0 });
        else this.grid.add(elem);
      });
      this.$ga.event('cards', 'add', key, 1);
    },
    checkVersion() {
      const lastVersion = this.$store.state.cache.version;
      const { version } = browser.runtime.getManifest();
      if (lastVersion && lastVersion !== version && this.cards.indexOf('Changelog') === -1) {
        this.$store.commit('ADD_CARD_FIRST', 'Changelog');
      }
      if (lastVersion !== version) {
        this.$store.commit('SET_VERSION', version);
      }
    },
    initGrid() {
      this.grid = new Muuri('#card-container', {
        dragEnabled: true,
        layout: { fillGaps: true },
        dragStartPredicate: { handle: '.head-drag' },
        dragSortInterval: 0,
        layoutOnInit: false,
        sortData: {
          index: (item, el) => this.cards.indexOf(el.dataset.id),
        },
      });
      if (this.cards.length) {
        this.grid.sort('index', { layout: 'instant' });
      }
      this.grid.on('dragEnd', this.onDrag);
    },
  },
};
