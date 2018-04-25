import Muuri from 'muuri';
import { ResizeSensor } from 'css-element-queries';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import Toast from '@/components/Toast';
import Cards from '@/components/cards';

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      grid: null,
      fab: false,
      keys: {
        cards: {},
        settings: {},
      },
      cards: {},
      cardsSettings: {},
    };
  },
  computed: {
    emptyCards() {
      return isEmpty(this.cards);
    },
    availableCards() {
      return omit(this.keys.cards, Object.keys(this.cards).concat(['Changelog']));
    },
    showFab() {
      return !isEmpty(this.availableCards) && this.grid != null;
    },
  },
  methods: {
    setCards(key, data) {
      if (!key) return;
      if (this.cards[key]) {
        this.$set(this.cards[key], 'init', true);
        this.$ga.event('cards', 'used', key, ((this.$store.state || {}).cards || []).indexOf(key));
      }
      if (data instanceof Error) {
        Toast.show({
          text: `${key} got a loading error, please try again later.${this.$store.state.settings.debug ? `<br/>${data.message}` : ''}`,
          color: 'error',
          timeout: 10000,
          dismissible: false,
        });
        return;
      }
      if (data === undefined) {
        this.$store.commit('DEL_CARD_CACHE', key);
        return;
      }
      this.$store.commit('SET_CARD_CACHE', { key, data });
    },
    closeSettings(key, save) {
      this.cards[key].saveSettings = save;
      this.$set(this.cards[key], 'showSettings', false);
    },
    saveSettings(key, data) {
      if (this.cards[key] && this.cards[key].saveSettings) {
        this.$store.commit('SET_CARD_SETTINGS', { key, data });
        this.cards[key].saveSettings = false;
      }
    },
    deleteCard(key) {
      if (this.cards[key].permissions || this.cards[key].origins) {
        this.$utils.permissions.remove({
          permissions: this.cards[key].permissions || [],
          origins: this.cards[key].origins || [],
        });
      }
      this.$delete(this.cards, key);
      this.setCards(key);
      this.$nextTick(() => {
        const elem = document.querySelector(`[data-id='${key}']`);
        if (elem) this.grid.remove(elem, { removeElements: true });
      });
      this.$ga.event('cards', 'delete', key, 0);
      this.$store.commit('DEL_CARD_SETTINGS', key);
      this.$store.commit('SET_CARDS', Object.keys(this.cards));
    },
    resize(elem) {
      return () => {
        this.grid.refreshItems(elem);
        this.grid.layout(true);
      };
    },
    addCard(key, value) {
      const tmp = Cards(value).default;
      let card$ = Promise.resolve(true);
      if (tmp.permissions || tmp.origins) {
        card$ = this.$utils.permissions.allowed({
          permissions: tmp.permissions || [],
          origins: tmp.origins || [],
        });
      }
      card$.then((res) => {
        if (!res) {
          Toast.show({
            text: `${tmp.name} needs permissions to be added.`,
            color: 'error',
            timeout: 10000,
            dismissible: false,
          });
          return;
        }
        this.$set(this.cards, key, tmp);
        this.$nextTick(() => {
          const elem = document.querySelector(`[data-id='${key}']`);
          this.grid.add(elem);
          new ResizeSensor(elem, this.resize(elem)); // eslint-disable-line no-new
        });
        this.$ga.event('cards', 'add', key, 1);
        this.$store.commit('SET_CARDS', Object.keys(this.cards));
      });
    },
    handleSize() {
      const cards = document.getElementsByClassName('card');
      for (let i = 0; i < cards.length; i += 1) {
        new ResizeSensor(cards[i], this.resize(cards[i])); // eslint-disable-line no-new
      }
    },
    showCardsSettings(key) {
      if (!this.cardsSettings[key]) {
        this.cardsSettings[key] = Cards(this.keys.settings[key]).default;
      }
      this.$set(this.cards[key], 'showSettings', true);
    },
    getCardsSettings(key) {
      if (this.keys.settings[key] && !this.cardsSettings[key]) {
        this.cardsSettings[key] = Cards(this.keys.settings[key]).default;
      }
      if (this.cardsSettings[key]) {
        const data = this.cardsSettings[key].data();
        const tmp = this.$store.state.cardsSettings.cards[key];
        if (!tmp) return data;
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i += 1) {
          if (typeof data[keys[i]] === typeof tmp[keys[i]]) {
            data[keys[i]] = tmp[keys[i]];
          }
        }
        return data;
      }
      return {};
    },
    getCardsKeys() {
      const cards = {};
      const settings = {};
      const keys = Cards.keys();
      for (let i = 0; i < keys.length; i += 1) {
        if (keys[i].endsWith('index.vue')) {
          cards[keys[i].split('/')[1]] = keys[i];
        } else if (keys[i].endsWith('settings.vue')) {
          settings[keys[i].split('/')[1]] = keys[i];
        }
      }
      this.keys = { cards, settings };
    },
    getCards() {
      let cards = this.$store.state.cards || [];
      const lastVersion = this.$store.state.cache.version;
      const { version } = browser.runtime.getManifest();
      if (cards.indexOf('Changelog') === -1 && lastVersion && lastVersion !== version) {
        cards = ['Changelog'].concat(cards);
        this.$store.commit('SET_CARDS', cards);
      }
      this.$store.commit('SET_VERSION', version);
      const cardsMap = pick(this.keys.cards, cards);
      const keys = Object.keys(cardsMap);
      const permissions = { origins: [], permissions: [] };
      const cards$ = {};
      for (let i = 0; i < keys.length; i += 1) {
        const tmp = Cards(cardsMap[keys[i]]).default;
        if (!tmp.permissions && !tmp.origins) {
          this.$set(this.cards, keys[i], tmp);
        } else {
          permissions.permissions = [...permissions.permissions, ...(tmp.permissions || [])];
          permissions.origins = [...permissions.origins, ...(tmp.origins || [])];
          cards$[keys[i]] = tmp;
        }
      }
      return this.$utils.permissions.allowed(permissions)
        .then((res) => {
          if (!res) throw new Error(`${Object.keys(cards$).join(', ')} needs new permissions that it cannot have, retry later.`);
          this.cards = { ...this.cards, ...cards$ };
          return cards;
        });
    },
  },
  mounted() {
    this.getCardsKeys();
    this.getCards().then((cards) => {
      this.$nextTick(() => {
        this.grid = new Muuri('#card-container', {
          items: '.card',
          dragEnabled: true,
          layout: { fillGaps: true },
          dragStartPredicate: { handle: '.head-drag' },
          dragSortInterval: 0,
          layoutOnInit: false,
          sortData: { id: (item, element) => element.getAttribute('data-id') },
        });
        if (cards.length) {
          this.grid
            .sort((a, b) => ((cards.indexOf(a.getElement().getAttribute('data-id')) - cards.indexOf(b.getElement().getAttribute('data-id')))), {
              layout: 'instant',
            });
        }
        this.handleSize();
        this.grid.on('dragEnd', () => {
          const order = this.grid.getItems().map(item => item.getElement().getAttribute('data-id'));
          this.$store.commit('SET_CARDS', order);
        });
      });
    }).catch(err => Toast.show({
      text: err.message,
      color: 'error',
      timeout: 10000,
      dismissible: false,
    }));
  },
};
