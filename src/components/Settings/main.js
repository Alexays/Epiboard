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
        settings: `${this.dark}${this.dark_auto}${this.from}${this.to}`,
      });
    },
  },
  mounted() {
    const dark = localStorage.getItem('dark');
    if (dark) {
      const p = JSON.parse(dark);
      this.dark = p.enabled;
      this.dark_auto = p.auto;
      this.from = p.from;
      this.to = p.to;
    }
    this.settings = this.settings.map((f) => {
      if (this.$store.state.settings.global[f.name] !== undefined) {
        f.value = this.$store.state.settings.global[f.name];
      }
      return f;
    });
  },
};
