import Muuri from 'muuri';
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
  },
  mounted() {
    this.$nextTick(() => {
      chrome.storage.sync.get('dragPositions', (initPositions) => {
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
        const pos = JSON.parse(initPositions.dragPositions || '{}');
        grid.sort((a, b) => (pos.indexOf(a._sortData.id) > pos.indexOf(b._sortData.id) ? 1 : -1),
          { layout: 'instant' });
        grid.on('dragEnd', () => {
          const order = grid.getItems().map(item => item.getElement().getAttribute('data-item-id'));
          chrome.storage.sync.set({ dragPositions: JSON.stringify(order) });
        });
      });
    });
  },
};

