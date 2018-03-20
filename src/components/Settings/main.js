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
      dark: {
        enabled: false,
        auto: false,
        from: '22:00',
        to: '9:00',
      },
      from_menu: false,
      to_menu: false,
    };
  },
  methods: {
    save() {
      this.$store.commit('SET_SETTINGS', {
        key: 'dark',
        settings: Object.assign({}, this.dark),
      });
    },
  },
  mounted() {
    this.dark = Object.assign({}, this.$store.state.settings.dark);
    this.settings = this.settings.map((f) => {
      if (this.$store.state.settings.global[f.name] !== undefined) {
        f.value = this.$store.state.settings.global[f.name];
      }
      return f;
    });
  },
};
