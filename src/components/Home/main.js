import Muuri from 'muuri';
import {
  ResizeSensor
} from 'css-element-queries';
import Cards from '../cards';

export default {
  name: 'Home',
  props: ['settings'],
  components: {},
  data() {
    return {
      settings: false,
      cards: {},
    };
  },
  methods: {
    deleteCard(id) {
      this.$delete(this.cards, id);
      chrome.storage.sync.set({
        cards: Object.keys(this.cards)
      });
    },
    handleSize(grid) {
      const resize = (value) => {
        if (value) {
          const keys = Object.keys(value);
          const oldCards = [].filter.call(document.querySelectorAll('.card'),
            f => keys.indexOf(f.getAttribute('data-item-id')) < 0);
          grid.remove(oldCards, {
            removeElements: true
          });
          return;
        }
        grid.refreshItems();
        grid.layout(true);
      };
      this.$watch('$data.cards', resize);
      const cards = document.querySelectorAll('.card');
      for (let i = 0; i < cards.length; i += 1) {
        new ResizeSensor(cards[i], resize); // eslint-disable-line no-new
      }
    },
  },
  mounted() {
    chrome.storage.sync.get('cards', (saved) => {
      if (chrome.runtime.lastError) return;
      const cards = (saved || {}).cards;
      this.cards = _.pick(Cards, saved.cards);
      this.$nextTick(() => {
        const grid = new Muuri('#card-container', {
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
          grid.sort(
            (a, b) => ((cards.indexOf(a._sortData.id) > cards.indexOf(b._sortData.id) ? 1 : -1)), {
              layout: 'instant'
            },
          );
        } else {
          grid.layout(true);
        }
        this.handleSize(grid);
        grid.on('dragEnd', () => {
          const order = grid.getItems().map(item => item.getElement().getAttribute('data-item-id'));
          chrome.storage.sync.set({
            cards: order
          });
        });
      });
    });  
  },
};
