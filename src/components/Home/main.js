import _ from 'lodash';
import Packery from 'packery';
import Draggabilly from 'draggabilly';

const cards = [{
  id: 1,
  width: 2,
  height: 2,
  foo: 'block',
}, {
  id: 2,
  width: 1,
  height: 1,
}, {
  id: 3,
  width: 2,
  height: 1,
}, {
  id: 4,
  width: 2,
  height: 2,
}, {
  id: 5,
  width: 1,
  height: 1,
}, {
  id: 6,
  width: 1,
  height: 2,
}, {
  id: 7,
  width: 1,
  height: 1,
}, {
  id: 8,
  width: 1,
  height: 1,
}, {
  id: 9,
  width: 2,
  height: 1,
}, {
  id: 10,
  width: 1,
  height: 1,
}, {
  id: 11,
  width: 1,
  height: 1,
}, {
  id: 12,
  width: 1,
  height: 1,
}, {
  id: 13,
  width: 1,
  height: 1,
}, {
  id: 14,
  width: 1,
  height: 1,
}];

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
        const draggie = new Draggabilly(elem);
        pckry.bindDraggabillyEvents(draggie);
      }
    });
  }
};

