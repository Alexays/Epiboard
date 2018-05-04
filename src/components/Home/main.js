import Muuri from 'muuri';
import ResizeSensor from 'css-element-queries/src/ResizeSensor';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import Toast from '@/components/Toast';

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      grid: null,
      fab: false,
      keys: Cards,
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
    addCard(key) {
      this.$set(this.cards, key, {
        init: false,
        showSettings: false,
        cmp: this.getCardCmp(key),
      });
      this.$nextTick(() => {
        const elem = document.querySelector(`[data-id='${key}']`);
        this.grid.add(elem);
        new ResizeSensor(elem, this.resize(elem)); // eslint-disable-line no-new
      });
      this.$ga.event('cards', 'add', key, 1);
      this.$store.commit('SET_CARDS', Object.keys(this.cards));
    },
    handleSize() {
      const cards = document.getElementsByClassName('card');
      for (let i = 0; i < cards.length; i += 1) {
        new ResizeSensor(cards[i], this.resize(cards[i])); // eslint-disable-line no-new
      }
    },
    showCardsSettings(key) {
      this.$set(this.cards[key], 'showSettings', true);
    },
    getCardsSettings(key) {
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
    getCardCmp(key) {
      return () => import(/* webpackMode: "eager" */ `@/components/cards/${this.keys.cards[key]}`)
        .then((tmp) => {
          const cmp = tmp.default;
          const settings = ['size', 'title', 'custom'];
          for (let i = 0; i < settings.length; i += 1) {
            this.$set(this.cards[key], settings[i], cmp[settings[i]]);
          }
          if (!cmp.permissions && !cmp.origins) return tmp;
          return this.$utils.permissions.allowed({
            permissions: cmp.permissions || [],
            origins: cmp.origins || [],
          }).then((res) => {
            if (!res) {
              Toast.show({
                text: `${key} needs new permissions that it cannot have, retry later.`,
                color: 'error',
                timeout: 10000,
                dismissible: false,
              });
              return null;
            }
            return tmp;
          });
        })
        .then((tmp) => {
          if (this.keys.settings[key]) {
            return import(/* webpackMode: "lazy-once" */ `@/components/cards/${this.keys.settings[key]}`)
              .then((data) => {
                this.$set(this.cardsSettings, key, data.default);
                return tmp;
              });
          }
          return tmp;
        });
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
      for (let i = 0; i < keys.length; i += 1) {
        this.$set(this.cards, keys[i], {
          init: false,
          showSettings: false,
          cmp: this.getCardCmp(keys[i]),
        });
      }
      return cards;
    },
  },
  mounted() {
    const cards = this.getCards();
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
  },
};
