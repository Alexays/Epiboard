import _ from 'lodash';
import Packery from 'packery';
import Draggabilly from 'draggabilly';
// Cards
import System from '@/components/System';

const cards = [
  System,
];

// get JSON-friendly data for items positions
Packery.prototype.getShiftPositions = function getShiftPositions(attrName) {
  const self = this;
  return this.items.map(item => ({
    attr: item.element.getAttribute(attrName || 'id'),
    x: item.rect.x / self.packer.width,
    y: item.rect.y,
  }));
};

/*eslint-disable */
Packery.prototype.initShiftLayout = function initShiftLayout(positions, attr) {
  if (!positions) {
    // Unhide cards
    this.items
      .filter(f => f)
      .forEach((item) => {
        item.element.style.display = 'block';
      });
    // if no initial positions, run packery layout
    this.layout();
    return;
  }
  // parse string to JSON
  if (typeof positions === 'string') {
    try {
      positions = JSON.parse(positions);
    } catch (err) {
      throw err;
    }
  }
  this._resetLayout();
  // set item order and horizontal position from saved positions
  this.items = positions.map(function map(itemPosition) {
    const selector = '[' + (attr || 'id') + '="' + itemPosition.attr + '"]';
    const itemElem = this.element.querySelector(selector);
    if (itemElem) {
      itemElem.style.display = 'block';
      const item = this.getItem(itemElem);
      if (!item) {
        return false;
      }
      item.rect.x = Math.round(itemPosition.x * this.packer.width);
      return item;
    }
    return false;
  }, this)
    .filter(value => value !== false);
  this.shiftLayout();
};
/*eslint-enable */

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
    const container = document.querySelector('#card-container');
    this.$nextTick(() => {
      const pckry = new Packery(container, {
        itemSelector: '.card',
        columnWidth: 400,
        gutter: 10,
        percentPosition: false,
        initLayout: false,
      });
      chrome.storage.sync.get('dragPositions', (initPositions) => {
        let pos;
        if (Object.keys(initPositions).length !== 0) {
          pos = JSON.parse(initPositions.dragPositions);
        }
        // init layout with saved positions
        pckry.initShiftLayout(pos, 'data-item-id');
        const itemElems = pckry.getItemElements();
        // make items draggable
        for (let i = 0, len = itemElems.length; i < len; i += 1) {
          const elem = itemElems[i];
          elem.style.visibility = 'visible';
          const draggie = new Draggabilly(elem, { handle: '.card-header' });
          pckry.bindDraggabillyEvents(draggie);
        }
      });

      // save drag positions
      pckry.on('dragItemPositioned', () => {
        chrome.storage.sync.set({ dragPositions: JSON.stringify(pckry.getShiftPositions('data-item-id')) });
      });
    });
  },
};

