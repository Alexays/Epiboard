import VCheckbox from 'vuetify/es5/components/VCheckbox';

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
