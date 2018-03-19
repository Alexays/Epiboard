import Muuri from 'muuri';
import { ResizeSensor } from 'css-element-queries';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
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
    emptyCards() {
      return isEmpty(this.cards);
    },
    nCards() {
      return omit(Cards, Object.keys(this.cards).concat(['Changelog']));
    },
    showFab() {
      if (isEmpty(this.cards) && this.grid == null) {
        return true;
      }
      return isEmpty(this.nCards);
    },
  },
  methods: {
    setCards(key, data) {
      if (!key) return;
      if (this.cards[key]) this.$set(this.cards[key], 'init', true);
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
        const oldCards = [...document.getElementsByClassName('card')].filter(f => keys.indexOf(f.getAttribute('data-item-id')) < 0);
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
      this.$delete(this.cards, key);
      this.cards$[key].detach(this.resize);
      this.$delete(this.cards$, key);
      this.setCards(key);
      this.$store.commit('updateCards', Object.keys(this.cards));
    },
    addCard(card, key) {
      this.$set(this.cards, key, card);
      this.$nextTick(() => {
        const elem = document.querySelector(`[data-item-id='${key}']`);
        this.grid.add(elem, {
          layout: false,
        });
        this.cards$[elem.getAttribute('data-item-id')] = new ResizeSensor(elem, this.resize); // eslint-disable-line no-new
      });
      this.$store.commit('updateCards', Object.keys(this.cards));
    },
    handleSize() {
      this.$watch('$data.cards', this.resize);
      const cards = document.getElementsByClassName('card');
      for (let i = 0; i < cards.length; i += 1) {
        this.cards$[cards[i].getAttribute('data-item-id')] = new ResizeSensor(cards[i], this.resize); // eslint-disable-line no-new
      }
    },
  },
  mounted() {
    let { cards } = (this.$store.state || {});
    const lastVersion = localStorage.getItem('version');
    const { version } = chrome.runtime.getManifest();
    if (lastVersion && lastVersion !== version) {
      cards = ['Changelog'].concat(cards || []);
      this.$store.commit('updateCards', cards);
    }
    this.cards = pick(Cards, cards);
    localStorage.setItem('version', version);
    this.$nextTick(() => {
      this.grid = new Muuri('#card-container', {
        items: '.card',
        dragEnabled: true,
        layout: {
          fillGaps: true,
        },
        dragStartPredicate: {
          handle: '.card__title',
        },
        dragSortInterval: 0,
        layoutOnInit: false,
        sortData: {
          id: (item, element) => element.getAttribute('data-item-id'),
        },
      });
      if (cards) {
        this.grid
          .sort((a, b) => ((cards.indexOf(a._sortData.id) - cards.indexOf(b._sortData.id))), {
            layout: 'instant',
          });
      } else {
        this.grid.layout(true);
      }
      this.handleSize();
      this.grid.on('dragEnd', () => {
        const order = this.grid.getItems().map(item => item.getElement().getAttribute('data-item-id'));
        this.$store.commit('updateCards', order);
      });
    });
  },
};
