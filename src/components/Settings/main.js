import * as VRadioGroup from 'vuetify/es5/components/VRadioGroup';
import VTimePicker from 'vuetify/es5/components/VTimePicker';
import VCheckbox from 'vuetify/es5/components/VCheckbox';
import VSwitch from 'vuetify/es5/components/VSwitch';
import VSelect from 'vuetify/es5/components/VSelect';
import VMenu from 'vuetify/es5/components/VMenu';
import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'Settings',
  components: {
    ...VRadioGroup,
    VTimePicker,
    VCheckbox,
    VSwitch,
    VSelect,
    VMenu,
  },
  data() {
    return {
      version: browser.runtime.getManifest().version,
      settings: {},
      artworks: [
        { text: 'Random', value: 'random' },
        { text: 'Default', value: 'default' },
        { text: 'Unsplash provider', value: 'unsplash' },
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
  methods: {
    save() {
      this.$store.commit('SET_SETTINGS', cloneDeep(this.settings));
      localStorage.setItem('analytics', JSON.stringify(this.settings.analytics));
      if (this.settings.analytics !== (localStorage.getItem('analytics') !== 'false')) {
        if (this.settings.analytics) this.$ga.enable();
        else this.$ga.disable();
      }
    },
  },
  beforeMount() {
    this.settings = {
      ...cloneDeep(this.$store.state.settings),
      ...{ analytics: localStorage.getItem('analytics') !== 'false' },
    };
  },
};
