import Muuri from 'muuri';
import { ResizeSensor } from 'css-element-queries';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import Toast from '@/components/Toast';
import Cards from '@/components/cards';

let grid = null;

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      fab: false,
      cardsKeys: {},
      cardsKeysSettings: {},
      cards: {},
      cards$: {},
      cardsSettings: {},
    };
  },
  computed: {
    emptyCards() {
      return isEmpty(this.cards);
    },
    availableCards() {
      return omit(this.cardsKeys, Object.keys(this.cards).concat(['Changelog']));
    },
    showFab() {
      if (isEmpty(this.cards) && grid == null) {
        return true;
      }
      return isEmpty(this.availableCards);
    },
  },
  methods: {
    setCards(key, data) {
      if (!key) return;
      if (this.cards[key]) {
        this.$set(this.cards[key], 'init', true);
        this.$ga.event('cards', 'used', key, 2);
      }
      if (data === false) {
        Toast.show({
          text: `${key} got a loading error, please try again later.`,
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
    resize(value) {
      if (value) {
        const keys = Object.keys(value);
        const oldCards = [...document.getElementsByClassName('card')].filter(f => keys.indexOf(f.getAttribute('data-id')) < 0);
        grid.remove(oldCards, {
          removeElements: true,
          layout: false,
        });
        this.$nextTick(() => {
          grid.refreshItems();
          grid.layout();
        });
        return;
      }
      grid.refreshItems();
      grid.layout(true);
    },
    deleteCard(key) {
      if (this.cards[key].permissions || this.cards[key].origins) {
        this.$utils.permissions.remove({
          permissions: this.cards[key].permissions || [],
          origins: this.cards[key].origins || [],
        });
      }
      this.$delete(this.cards, key);
      this.cards$[key].detach(this.resize);
      this.$delete(this.cards$, key);
      this.setCards(key);
      this.$ga.event('cards', 'delete', key, 0);
      this.$store.commit('DEL_CARD_SETTINGS', key);
      this.$store.commit('SET_CARDS', Object.keys(this.cards));
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
          grid.add(elem, {
            layout: false,
          });
          this.cards$[elem.getAttribute('data-id')] = new ResizeSensor(elem, this.resize); // eslint-disable-line no-new
        });
        this.$ga.event('cards', 'add', key, 1);
        this.$store.commit('SET_CARDS', Object.keys(this.cards));
      });
    },
    handleSize() {
      this.$watch('$data.cards', this.resize);
      const cards = document.getElementsByClassName('card');
      for (let i = 0; i < cards.length; i += 1) {
        this.cards$[cards[i].getAttribute('data-id')] = new ResizeSensor(cards[i], this.resize); // eslint-disable-line no-new
      }
    },
    showCardsSettings(key) {
      if (!this.cardsSettings[key]) {
        this.cardsSettings[key] = Cards(this.cardsKeysSettings[key]).default;
      }
      this.$set(this.cards[key], 'showSettings', true);
    },
    getCardsSettings(key) {
      if (this.cardsKeysSettings[key] && !this.cardsSettings[key]) {
        this.cardsSettings[key] = Cards(this.cardsKeysSettings[key]).default;
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
      this.cardsKeys = cards;
      this.cardsKeysSettings = settings;
    },
    getCards() {
      let cards = (this.$store.state || {}).cards || [];
      const lastVersion = this.$store.state.cache.version;
      const { version } = browser.runtime.getManifest();
      if (cards.indexOf('Changelog') === -1 && lastVersion && lastVersion !== version) {
        cards = ['Changelog'].concat(cards);
        this.$store.commit('SET_CARDS', cards);
      }
      this.$store.commit('SET_VERSION', version);
      const cardsMap = pick(this.cardsKeys, cards);
      const keys = Object.keys(cardsMap);
      const cards$ = [];
      for (let i = 0; i < keys.length; i += 1) {
        const tmp = Cards(cardsMap[keys[i]]).default;
        if (!tmp.permissions && !tmp.origins) {
          this.$set(this.cards, keys[i], tmp);
        } else {
          cards$.push(this.$utils.permissions.allowed({
            permissions: tmp.permissions || [],
            origins: tmp.origins || [],
          }).then(res => (res ? tmp : null)));
        }
      }
      return [cards, cards$];
    },
  },
  mounted() {
    this.getCardsKeys();
    const [cards, cards$] = this.getCards();
    Promise.all(cards$).then((data) => {
      for (let i = 0; i < data.length; i += 1) {
        if (data[i]) this.$set(this.cards, data[i].name, data[i]);
        else {
          Toast.show({
            text: `${data[i].name} needs new permissions please add it manually.`,
            color: 'error',
            timeout: 10000,
            dismissible: false,
          });
        }
      }
      this.$nextTick(() => {
        grid = new Muuri('#card-container', {
          items: '.card',
          dragEnabled: true,
          layout: {
            fillGaps: true,
          },
          dragStartPredicate: {
            handle: '.head-drag',
          },
          dragSortInterval: 0,
          layoutOnInit: false,
          sortData: {
            id: (item, element) => element.getAttribute('data-id'),
          },
        });
        if (cards.length) {
          grid.sort((a, b) => ((cards.indexOf(a._sortData.id) - cards.indexOf(b._sortData.id))), {
            layout: 'instant',
          });
        } else {
          grid.layout(true);
        }
        this.handleSize();
        grid.on('dragEnd', () => {
          const order = grid.getItems().map(item => item.getElement().getAttribute('data-id'));
          this.$store.commit('SET_CARDS', order);
        });
      });
    });
  },
};
