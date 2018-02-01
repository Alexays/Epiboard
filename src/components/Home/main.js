import Muuri from 'muuri';
import {
  ResizeSensor,
} from 'css-element-queries';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import pick from 'lodash/pick';
import Cards from '@/components/cards';

export default {
  name: 'Home',
  components: {},
  data() {
    return {
      grid: null,
      cards: {},
    };
  },
  computed: {
    emptyCards() {
      if (isEmpty(this.cards) && this.grid == null) {
        return true;
      }
      return isEmpty(omit(Cards, Object.keys(this.cards)));
    },
    nCards() {
      return omit(Cards, Object.keys(this.cards));
    },
  },
  methods: {
    resize(value) {
      if (value) {
        const keys = Object.keys(value);
        const oldCards = [].filter.call(
          document.querySelectorAll('.card'),
          f => keys.indexOf(f.getAttribute('data-item-id')) < 0,
        );
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
    deleteCard(id) {
      this.$delete(this.cards, id);
      chrome.storage.sync.set({
        cards: Object.keys(this.cards),
      });
    },
    addCard(card, key) {
      this.$set(this.cards, key, card);
      this.$nextTick(() => {
        const elem = document.querySelector(`[data-item-id=${key}]`);
        this.grid.add(elem, {
          layout: false,
        });
        new ResizeSensor(elem, this.resize); // eslint-disable-line no-new
      });
      chrome.storage.sync.set({
        cards: Object.keys(this.cards),
      });
    },
    handleSize() {
      this.$watch('$data.cards', this.resize);
      const cards = document.querySelectorAll('.card');
      for (let i = 0; i < cards.length; i += 1) {
        new ResizeSensor(cards[i], this.resize); // eslint-disable-line no-new
      }
    },
  },
  mounted() {
    chrome.storage.sync.get('cards', (saved) => {
      if (chrome.runtime.lastError) return;
      const {
        cards,
      } = (saved || {});
      this.cards = pick(Cards, saved.cards);
      this.$nextTick(() => {
        this.grid = new Muuri('#card-container', {
          items: '.card',
          dragEnabled: true,
          dragStartPredicate: {
            handle: '.card__title',
          },
          layout: {
            fillGaps: true,
          },
          dragSortInterval: 0,
          layoutOnInit: false,
          sortData: {
            id: (item, element) => element.getAttribute('data-item-id'),
          },
        });
        if (cards) {
          this.grid
            .sort((a, b) => ((cards.indexOf(a._sortData.id) >
              cards.indexOf(b._sortData.id) ? 1 : -1)), {
              layout: 'instant',
            });
        } else {
          this.grid.layout(true);
        }
        this.handleSize();
        this.grid.on('dragEnd', () => {
          const order = this.grid.getItems().map(item => item.getElement().getAttribute('data-item-id'));
          chrome.storage.sync.set({
            cards: order,
          });
        });
      });
    });
  },
};
