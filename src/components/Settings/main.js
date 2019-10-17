import colors from 'vuetify/es5/util/colors';
import { loadLang } from '@/i18n';
import Toast from '@/components/Toast';
import countries from './countries';
import artworks from './artworks';

// @vue/component
export default {
  name: 'Settings',
  version: browser.runtime.getManifest().version,
  countries,
  palette: Object.keys(colors).map(f => colors[f].base).filter(f => f),
  data() {
    return {
      settings: {},
      localLoading: false,
      backgroundLocal: {},
      tipShown: false,
      menu: {
        from: false,
        to: false,
      },
    };
  },
  computed: {
    artworks() {
      const { locale } = this.$i18n;
      if (!locale) return [];
      return artworks.map(f => ({ text: this.$t(f.text), value: f.value }));
    },
    langs() {
      return Langs.map(f => ({ value: f.locale, text: f.name }))
        .sort((a, b) => a.text.localeCompare(b.text), { text: '' });
    },
  },
  watch: {
    'settings.lang': function lang(val, old) {
      if (val === old || old === undefined) return;
      loadLang(this, val).then(() => {
        this.$store.commit('DEL_CARDS_CACHE');
      });
    },
    'settings.analytics': function analytics(val, old) {
      if (val === old || old === undefined) return;
      localStorage.setItem('analytics', JSON.stringify(val));
      if (!this.$ga) return;
      if (val) this.$ga.enable();
      else this.$ga.disable();
    },
    settings: {
      handler(val, old) {
        if (Object.keys(old).length && !this.tipShown) {
          Toast.show({ title: null, desc: this.$t('settings.apply_change') });
          this.tipShown = true;
        }
      },
      deep: true,
    },
  },
  beforeDestroy() {
    this.save(false);
  },
  beforeMount() {
    this.settings = this.$store.state.settings;
    this.backgroundLocal = this.$store.state.cache.backgroundLocal;
    const ga = this.$ga ? localStorage.getItem('analytics') !== 'false' : false;
    this.$set(this.settings, 'analytics', ga);
  },
  methods: {
    save(showToast = true) {
      this.$store.commit('SET_SETTINGS', this.settings);
      this.$store.commit('SET_BACKGROUND_LOCAL', this.backgroundLocal);
      if (!this.validateHex(this.settings.theme.primary)) {
        this.$store.commit('RESET_SETTING', 'theme');
      }
      if (showToast) {
        Toast.show({ title: this.$t('settings.saved') });
      }
    },
    fileChange(event) {
      if (!event.target.files || !event.target.files.length) return;
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      this.localLoading = true;
      reader.onload = (e) => {
        const { value } = event.target;
        const filename = value.substring(value.lastIndexOf(value.indexOf('/') > -1 ? '/' : '\\') + 1);
        this.$set(this.backgroundLocal, 'filename', filename);
        this.$set(this.backgroundLocal, 'dataUrl', e.target.result);
        this.localLoading = false;
      };
    },
    deleteBackgroundLocal() {
      this.$set(this.backgroundLocal, 'filename', null);
      this.$set(this.backgroundLocal, 'dataUrl', '');
      this.$refs.inputLocal.value = '';
    },
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
      this.tipShown = true;
      this.$store.commit('RESET_SETTINGS');
      this.$nextTick(() => {
        this.tipShown = false;
      });
    },
  },
};
