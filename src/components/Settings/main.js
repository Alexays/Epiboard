import { VTimePicker, VCheckbox, VSwitch, VAutocomplete, VMenu, VTextField } from 'vuetify';
import * as VRadioGroup from 'vuetify/es5/components/VRadioGroup';
import colors from 'vuetify/es5/util/colors';
import Countries from './countries';

// @vue/component
export default {
  name: 'Settings',
  components: {
    ...VRadioGroup,
    VTimePicker,
    VCheckbox,
    VSwitch,
    VAutocomplete,
    VMenu,
    VTextField,
  },
  data() {
    return {
      version: browser.runtime.getManifest().version,
      settings: {},
      palette: Object.keys(colors).map(f => colors[f].base).filter(f => f),
      artworks: [
        { text: 'Random', value: 'random' },
        { text: 'Unsplash provider', value: 'unsplash' },
        { text: 'From URL', value: 'url' },
        { text: 'Default', value: 'default' },
        { text: 'Austin', value: 'austin' },
        { text: 'Beach', value: 'beach' },
        { text: 'Berlin', value: 'berlin' },
        { text: 'Chicago', value: 'chicago' },
        { text: 'Great Plains', value: 'greatPlains' },
        { text: 'London', value: 'london' },
        { text: 'New York', value: 'newYork' },
        { text: 'Paris', value: 'paris' },
        { text: 'San Francisco', value: 'sanFrancisco' },
        { text: 'Seattle', value: 'seattle' },
        { text: 'Tahoe', value: 'tahoe' },
      ],
      country: Countries,
      menu: {
        from: false,
        to: false,
      },
    };
  },
  watch: {
    'settings.analytics': function analytics(val, old) {
      if (val === old) return;
      localStorage.setItem('analytics', JSON.stringify(val));
      if (val) this.$ga.enable();
      else this.$ga.disable();
    },
  },
  beforeDestroy() {
    this.$store.commit('SET_SETTINGS', this.settings);
    if (!this.validateHex(this.settings.theme.primary)) {
      this.$store.commit('RESET_SETTING', 'theme');
    }
  },
  beforeMount() {
    this.settings = this.$store.state.settings;
    this.$set(this.settings, 'analytics', localStorage.getItem('analytics') !== 'false');
  },
  methods: {
    validateHex(hex) {
      return hex && hex[0] === '#' && hex.length === 7;
    },
    themeChange(val) {
      this.settings.theme.primary = val;
      if (!this.validateHex(val)) return;
      const hex = parseInt(val.slice(1), 16);
      let r = (hex >> 16) & 255;
      let g = (hex >> 8) & 255;
      let b = hex & 255;
      const p = 20;
      r = r > p ? r - p : 0;
      g = g > p ? g - p : 0;
      b = b > p ? b - p : 0;
      this.settings.theme.light = (r + g + b) / 3 >= 128;
      this.settings.theme.secondary = `#${[r, g, b].map((x) => {
        const tmp = x.toString(16);
        return tmp.length === 1 ? `0${tmp}` : tmp;
      }).join('')}`;
    },
    reset() {
      this.$store.commit('RESET_SETTINGS');
    },
  },
};
