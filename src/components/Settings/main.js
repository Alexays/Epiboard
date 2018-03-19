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
      dark: false,
      dark_auto: false,
      from: '22:00',
      to: '9:00',
      from_menu: false,
      to_menu: false,
    };
  },
  methods: {
    save() {
      localStorage.setItem('dark', JSON.stringify({
        enabled: this.dark,
        auto: this.dark_auto,
        from: this.from,
        to: this.to,
      }));
      this.$store.commit('SET_SETTINGS', {
        key: 'dark',
        settings: `${this.dark}${this.auto}${this.from}${this.to}`,
      });
    },
  },
  mounted() {
    const dark = JSON.parse(localStorage.getItem('dark') || '{}');
    this.dark = dark.enabled;
    this.dark_auto = dark.auto;
    this.from = dark.from;
    this.to = dark.to;
    this.settings = this.settings.map((f) => {
      if (this.$store.state.settings.global[f.name] !== undefined) {
        f.value = this.$store.state.settings.global[f.name];
      }
      return f;
    });
  },
};
