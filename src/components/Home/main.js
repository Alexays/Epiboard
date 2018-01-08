import _ from 'lodash';
import Muuri from 'muuri';
// Cards
import System from '@/components/System';

const cards = [
  System,
  System,
];

export default {
  name: 'Home',
  props: ['settings'],
  components: {},
  data() {
    return {
      cards: [],
    };
  },
  methods: {
    fetchCards() {
      this.cards = cards;
    },
  },
  mounted() {
    this.fetchCards();
    this.$nextTick(() => {
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
      });
      // chrome.storage.sync.get('dragPositions', (initPositions) => {
      //   let pos;
      //   if (Object.keys(initPositions).length !== 0) {
      //     pos = JSON.parse(initPositions.dragPositions);
      //   }
      //   // init layout with saved positions
      //   pckry.initShiftLayout(pos, 'data-item-id');
      //   const itemElems = pckry.getItemElements();
      //   // make items draggable
      //   for (let i = 0, len = itemElems.length; i < len; i += 1) {
      //     const elem = itemElems[i];
      //     const draggie = new Draggabilly(elem, { handle: '.card-header' });
      //     pckry.bindDraggabillyEvents(draggie);
      //     elem.style.visibility = 'visible';
      //   }
      // });

      // save drag positions
      // pckry.on('dragItemPositioned', () => {
      //   chrome.storage.sync.set({ dragPositions: JSON.stringify(pckry.getShiftPositions('data-item-id')) });
      // });
    });
  },
};

