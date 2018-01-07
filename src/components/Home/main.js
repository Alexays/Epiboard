import _ from 'lodash';
import Packery from 'packery';
import Draggabilly from 'draggabilly';
// Cards
import System from '@/components/System';

const cards = [
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
    fetchEvents() {
      this.cards = cards;
    },
  },
  mounted() {
    this.fetchEvents();
    const container = document.querySelector('#card-container');
    this.$nextTick(() => {
      const pckry = new Packery(container, {
        itemSelector: '.card',
        columnWidth: 400,
        gutter: 10,
        percentPosition: false,
      });

      const itemElems = pckry.getItemElements();
      // make items draggable
      for (let i = 0, len = itemElems.length; i < len; i += 1) {
        const elem = itemElems[i];
        const draggie = new Draggabilly(elem, { handle: '.card-header' });
        pckry.bindDraggabillyEvents(draggie);
      }
    });
  }
};

