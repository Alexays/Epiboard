import * as VRadioGroup from 'vuetify/es5/components/VRadioGroup';
import VTimePicker from 'vuetify/es5/components/VTimePicker';
import VCheckbox from 'vuetify/es5/components/VCheckbox';
import VSwitch from 'vuetify/es5/components/VSwitch';
import VAutocomplete from 'vuetify/es5/components/VAutocomplete';
import VMenu from 'vuetify/es5/components/VMenu';
import VTextField from 'vuetify/es5/components/VTextField';
import colors from 'vuetify/es5/util/colors';

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
      country: [
        { value: 'romania', text: 'Romania' },
        { value: 'finland', text: 'Finland' },
        { value: 'portugal', text: 'Portugal' },
        { value: 'mexico', text: 'Mexico' },
        { value: 'egypt', text: 'Egypt' },
        { value: 'brazil', text: 'Brazil' },
        { value: 'united_states', text: 'United States' },
        { value: 'india', text: 'India' },
        { value: 'malaysia', text: 'Malaysia' },
        { value: 'austria', text: 'Austria' },
        { value: 'colombia', text: 'Colombia' },
        { value: 'japan', text: 'Japan' },
        { value: 'hungary', text: 'Hungary' },
        { value: 'new zealand', text: 'New Zealand' },
        { value: 'greece', text: 'Greece' },
        { value: 'taiwan', text: 'Taiwan' },
        { value: 'canada', text: 'Canada' },
        { value: 'italy', text: 'Italy' },
        { value: 'france', text: 'France' },
        { value: 'kenya', text: 'Kenya' },
        { value: 'ireland', text: 'Ireland' },
        { value: 'nigeria', text: 'Nigeria' },
        { value: 'norway', text: 'Norway' },
        { value: 'turkey', text: 'Turkey' },
        { value: 'israel', text: 'Israel' },
        { value: 'australia', text: 'Australia' },
        { value: 'singapore', text: 'Singapore' },
        { value: 'netherlands', text: 'Netherlands' },
        { value: 'germany', text: 'Germany' },
        { value: 'chile', text: 'Chile' },
        { value: 'belgium', text: 'Belgium' },
        { value: 'thailand', text: 'Thailand' },
        { value: 'argentina', text: 'Argentina' },
        { value: 'spain', text: 'Spain' },
        { value: 'south_korea', text: 'South Korea' },
        { value: 'ukraine', text: 'Ukraine' },
        { value: 'hong_kong', text: 'Hong Kong' },
        { value: 'south_africa', text: 'South Africa' },
        { value: 'denmark', text: 'Denmark' },
        { value: 'poland', text: 'Poland' },
        { value: 'indonesia', text: 'Indonesia' },
        { value: 'czech_republic', text: 'Czech Republic' },
        { value: 'russia', text: 'Russia' },
        { value: 'sweden', text: 'Sweden' },
        { value: 'vietnam', text: 'Vietnam' },
        { value: 'saudi_arabia', text: 'Saudi Arabia' },
        { value: 'switzerland', text: 'Switzerland' },
        { value: 'philippines', text: 'Philippines' },
        { value: 'united_kingdom', text: 'United Kingdom' },
      ],
      menu: {
        from: false,
        to: false,
      },
    };
  },
  watch: {
    'settings.analytics': function analytics(val, old) {
      if (val !== old) {
        localStorage.setItem('analytics', JSON.stringify(this.settings.analytics));
        if (this.settings.analytics !== (localStorage.getItem('analytics') !== 'false')) {
          if (this.settings.analytics) this.$ga.enable();
          else this.$ga.disable();
        }
      }
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
