import Hello from './hello';
import Why from './why';
import Settings from './settings';

// @vue/component
export default {
  name: 'Onboarding',
  components: {
    Hello,
    Why,
    Settings,
  },
  board: ['hello', 'why', 'settings'],
  data() {
    return {
      index: 0,
    };
  },
  methods: {
    prev() {
      this.index -= this.index > 0;
    },
    next() {
      if (this.index + 1 < this.$options.board.length) {
        this.index += 1;
      } else this.finish();
    },
    finish() {
      this.$store.commit('SET_TUTORIAL', true);
      this.$router.replace('/');
    },
  },
};
