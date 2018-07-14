import { VCheckbox } from 'vuetify';

// @vue/component
export default {
  name: 'Onboarding',
  components: {
    VCheckbox,
  },
  data() {
    return {
      index: 0,
    };
  },
  methods: {
    finish() {
      this.$store.commit('SET_TUTORIAL', true);
      this.$router.replace('/');
    },
  },
};
