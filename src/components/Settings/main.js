import pick from 'lodash/pick';
import cloneDeep from 'lodash/cloneDeep';

export default {
  name: 'Settings',
  data() {
    return {
      settings: {
        dark: {
          enabled: true,
          auto: true,
          from: '22:00',
          to: '9:00',
        },
        trends: {
          enabled: true,
          country: 'france',
        },
        header: {
          design: 'full',
          background: 'random',
        },
        debug: false,
        analytics: true,
      },
      artworks: [
        { text: 'Random', value: 'random' },
        { text: 'Austin', value: 'austin' },
        { text: 'Beach', value: 'beach' },
        { text: 'Berlin', value: 'berlin' },
        { text: 'Chicago', value: 'chicago' },
        { text: 'Default', value: 'default' },
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
    },
  },
  mounted() {
    const keys = Object.keys(this.settings);
    this.settings = { ...this.settings, ...cloneDeep(pick(this.$store.state.settings, keys)) };
    this.settings.analytics = localStorage.getItem('analytics') !== 'false';
  },
};
