import ResizeObserver from 'resize-observer-polyfill';
import Card from '@/components/Card';
import Cards from '@/cards';
import Muuri from 'muuri';

// @vue/component
export default {
  name: 'Home',
  components: {
    Card,
  },
  directives: {
    resize: {
      inserted(el, binding, { context }) {
        context.$options.ro.observe(el);
      },
      unbind(el, binding, { context }) {
        context.$options.ro.unobserve(el);
      },
    },
  },
  grid: null,
  ro: null,
  isPreRender: !!window.__PRERENDER_INJECTED,
  data() {
    return {
      fab: false,
    };
  },
  computed: {
    cards() {
      const { cards } = this.$store.state;
      return [...new Set(cards)].filter(f => Cards[f]);
    },
    availableCards() {
      let keys = this.cards;
      if (!this.$store.state.settings.debug) {
        keys = keys.concat(['Changelog']);
      }
      return Object.keys(Cards).filter(f => keys.indexOf(f) === -1);
    },
  },
  created() {
    this.checkVersion();
    this.$options.ro = new ResizeObserver(this.onResize);
  },
  mounted() {
    if (!this.$options.isPreRender) {
      this.initGrid();
    } else {
      document.dispatchEvent(new Event('render-event'));
    }
  },
  beforeDetroy() {
    this.$options.ro.detach();
  },
  methods: {
    getTranslation(path) {
      const tmp = this.$t(path);
      if (tmp === path) {
        return null;
      }
      return tmp;
    },
    onResize(entries) {
      if (!this.$options.grid) return;
      for (let i = 0; i < entries.length; i += 1) {
        this.$options.grid.refreshItems(entries[i].target);
      }
      this.$options.grid.layout(true);
    },
    onDrag() {
      const cards = this.$options.grid.getItems()
        .filter(f => f.isActive())
        .map(f => f.getElement().id);
      this.$store.commit('SET_CARDS', cards);
      if (this.$ga) {
        this.$ga.event('cards', 'order', cards.join(', '), cards.length);
      }
    },
    delCard(key) {
      const elem = document.getElementById(key);
      this.$options.grid.hide(elem, {
        onFinish: () => {
          if (this.$ga) {
            this.$ga.event('cards', 'delete', key, 0);
          }
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
        const elem = document.getElementById(key);
        if (key === 'Changelog') this.$options.grid.add(elem, { index: 0 });
        else this.$options.grid.add(elem);
      });
      if (this.$ga) {
        this.$ga.event('cards', 'add', key, 1);
      }
    },
    checkVersion() {
      const lastVersion = this.$store.state.cache.version;
      const { version } = browser.runtime.getManifest();
      if (lastVersion && lastVersion !== version && this.cards.indexOf('Changelog') === -1
        && this.$store.state.settings.whatsnew) {
        this.$store.commit('ADD_CARD_FIRST', 'Changelog');
      }
      if (lastVersion !== version) {
        this.$store.commit('SET_VERSION', version);
      }
    },
    initGrid() {
      this.$options.grid = new Muuri('#card-container', {
        items: '.card',
        dragEnabled: true,
        dragPlaceholder: true,
        layout: { fillGaps: true },
        dragStartPredicate: { handle: '.head-drag' },
        dragSortInterval: 0,
        layoutOnInit: false,
        sortData: {
          index: (item, el) => this.cards.indexOf(el.id),
        },
      });
      if (this.cards.length) {
        this.$options.grid.sort('index', { layout: 'instant' });
      }
      this.$options.grid.on('dragEnd', this.onDrag);
    },
  },
};
