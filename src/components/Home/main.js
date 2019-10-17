import ResizeObserver from 'resize-observer-polyfill';
import Muuri from 'muuri';
import Card from '@/components/Card';
import Toast from '@/components/Toast';
import Cards from '@/cards';

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
      return cards.map((f) => {
        const idx = f.indexOf('_');
        if (idx > 0) return { name: f.substring(0, idx), id: f };
        return { name: f, id: f };
      }).filter(f => Cards[f.name]);
    },
    availableCards() {
      let keys = this.cards.map(f => f.name);
      if (!this.$store.state.settings.debug) {
        keys = keys.concat(['Changelog']);
      }
      return Object.keys(Cards).filter(f => keys.indexOf(f) === -1
        || (Cards[f].manifest && Cards[f].manifest.allowMultiple));
    },
  },
  created() {
    if (!this.$options.isPreRender) {
      this.checkVersion();
    }
    this.$options.ro = new ResizeObserver(this.onResize);
  },
  mounted() {
    if (!this.$options.isPreRender) {
      this.initGrid();
      this.showDonateToast();
    } else {
      document.dispatchEvent(new Event('render-event'));
    }
  },
  beforeDetroy() {
    this.$options.ro.detach();
  },
  methods: {
    getTranslation(path) {
      if (this.$te(path)) {
        return this.$t(path);
      }
      return null;
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
    addCard(name) {
      let key = name;
      if (this.cards.find(f => f.name === name)) {
        key += `_${Math.floor(Math.random() * Math.floor(99))}`;
      }
      this.$store.commit(name === 'Changelog' ? 'ADD_CARD_FIRST' : 'ADD_CARD', key);
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
      if (this.$store.state.settings.whatsnew && lastVersion
        && lastVersion !== version && !this.cards.find(f => f.name === 'Changelog')) {
        this.$store.commit('ADD_CARD_FIRST', 'Changelog');
      }
      if (lastVersion !== version) {
        if (this.$store.state.settings.donate < 0) {
          this.$store.commit('RESET_DONATE');
        }
        this.$store.commit('SET_VERSION', version);
      }
    },
    initGrid() {
      this.$options.grid = new Muuri('#card-container', {
        items: '.card',
        dragEnabled: true,
        dragPlaceholder: {
          enabled: true,
        },
        dragStartPredicate: { handle: '.head-drag' },
        dragSortHeuristics: {
          sortInterval: 0,
        },
        layoutOnInit: false,
        sortData: {
          index: (item, el) => this.cards.findIndex(f => f.id === el.id),
        },
      }).on('move', this.onDrag);
      if (this.cards.length) {
        this.$options.grid.sort('index', { layout: 'instant' });
      } else {
        this.$options.grid.layout(true);
      }
    },
    showDonateToast() {
      const { donate } = this.$store.state.settings;
      if (donate > 0) {
        this.$store.commit('DECREASE_DONATE');
      } else if (donate === 0) {
        Toast.show({
          title: this.$t('settings.donate.title'),
          desc: this.$t('settings.donate.desc'),
          icon: 'card_giftcard',
          color: '#27ae60',
          timeout: 0,
          callback: () => {
            this.$store.commit('DECREASE_DONATE');
            window.location.href = 'https://paypal.me/ARouillard';
          },
          dismissCb: () => {
            this.$store.commit('DECREASE_DONATE');
          },
        });
      }
    },
  },
};
