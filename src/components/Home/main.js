import Muuri from 'muuri';
import { ResizeSensor } from 'css-element-queries';
import Cards from '../cards';

export default {
  name: 'Home',
  props: ['settings'],
  components: {},
  data() {
    return {
      cards: Cards,
    };
  },
  methods: {
    handleSize(grid) {
      const resize = () => {
        grid.refreshItems();
        grid.layout();
      };
      const cards = document.querySelectorAll('.card');
      for (let i = 0; i < cards.length; i += 1) {
        new ResizeSensor(cards[i], resize); // eslint-disable-line no-new
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      chrome.storage.sync.get('dragPositions', (initPositions) => {
        if (chrome.runtime.lastError) return;
        const grid = new Muuri('#card-container', {
          items: '.card',
          dragEnabled: true,
          dragStartPredicate: {
            handle: '.card-header',
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
        const pos = initPositions.dragPositions ? JSON.parse(initPositions.dragPositions) : null;
        if (pos) {
          grid.sort(
            (a, b) => ((pos.indexOf(a._sortData.id) > pos.indexOf(b._sortData.id) ? 1 : -1)),
            { layout: 'instant' },
          );
        } else {
          grid.layout();
        }
        this.handleSize(grid);
        grid.on('dragEnd', () => {
          const order = grid.getItems().map(item => item.getElement().getAttribute('data-item-id'));
          chrome.storage.sync.set({ dragPositions: JSON.stringify(order) });
        });
      });
    });
  },
};

