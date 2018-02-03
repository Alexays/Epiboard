import Config from '@/components/Config';
import Settings from '@/settings';

export default {
  name: 'Settings',
  components: {
    Config,
  },
  data() {
    return {
      settings: Settings,
    };
  },
  methods: {},
  mounted() {
    setTimeout(() => {
      console.log(this.$store.state.settings);
    }, 100);
    // this.settings = this.settings.map((f) => {
    //   if (this.$store.state.settings.global[f.name]) {
    //     /* eslint-disable no-param-reassign */
    //     f.value = this.$store.state.settings.global[f.name];
    //   }
    //   return f;
    // });
  },
};
