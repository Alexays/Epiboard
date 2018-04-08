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
      fab: false,
      grid: null,
      cards: {},
      cards$: {},
    };
  },
  computed: {
    cardsKeys() {
      const cards = {};
      const keys = Cards.keys();
      for (let i = 0; i < keys.length; i += 1) {
        cards[keys[i].split('/')[1]] = keys[i];
      }
      return cards;
    },
    emptyCards() {
      return isEmpty(this.cards);
    },
    availableCards() {
      return omit(this.cardsKeys, Object.keys(this.cards).concat(['Changelog']));
    },
    showFab() {
      if (isEmpty(this.cards) && this.grid == null) {
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
      if (!data) {
        if (localStorage.getItem(`cache_${key}`)) {
          localStorage.removeItem(`cache_${key}`);
        }
        return;
      }
      localStorage.setItem(`cache_${key}`, JSON.stringify(data));
    },
    resize(value) {
      if (value) {
        const keys = Object.keys(value);
        const oldCards = [...document.getElementsByClassName('card')].filter(f => keys.indexOf(f.getAttribute('data-id')) < 0);
        this.grid.remove(oldCards, {
          removeElements: true,
          layout: false,
        });
        this.$nextTick(() => {
          this.grid.refreshItems();
          this.grid.layout();
        });
        return;
      }
      this.grid.refreshItems();
      this.grid.layout(true);
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
          this.grid.add(elem, {
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
          cards$.push(this.$utils.permissions.contains({
            permissions: tmp.permissions || [],
            origins: tmp.origins || [],
          }).then(res => (res ? tmp : null)));
        }
      }
      return [cards, cards$];
    },
  },
  mounted() {
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
        this.grid = new Muuri('#card-container', {
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
          this.grid
            .sort((a, b) => ((cards.indexOf(a._sortData.id) - cards.indexOf(b._sortData.id))), {
              layout: 'instant',
            });
        } else {
          this.grid.layout(true);
        }
        this.handleSize();
        this.grid.on('dragEnd', () => {
          const order = this.grid.getItems().map(item => item.getElement().getAttribute('data-id'));
          this.$store.commit('SET_CARDS', order);
        });
      });
    });
  },
};
