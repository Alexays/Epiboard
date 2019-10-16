import Toast from '@/components/Toast';
import languages from './languages';

// @vue/component
export default {
  name: 'Translate',
  props: {
    settings: {
      type: Object,
      required: true,
    },
  },
  languages,
  data() {
    return {
      from: 'auto',
      detectedLang: null,
      to: 'en',
      text: '',
      loading: false,
      menu: null,
      cachedText: '',
    };
  },
  computed: {
    fromLang() {
      if (this.from !== 'auto') {
        return this.$options.languages[this.from];
      }
      if (this.detectedLang) {
        return this.$options.languages[this.detectedLang];
      }
      return this.$t('Translate.auto');
    },
  },
  mounted() {
    this.$emit('init', ['from', 'to']);
  },
  methods: {
    copyTranslation() {
      if (!this.text || !this.text.length) return;
      this.$refs.translated.$refs.input.select();
      document.execCommand('copy');
      Toast.show({ title: this.$t('Translate.copied') });
    },
    showLangs(side) {
      if (this.menu) {
        this.menu = null;
      } else {
        this.menu = side;
      }
    },
    switchLangs(switchText = true) {
      const tmp = this.to;
      if (this.from === 'auto') {
        this.to = this.detectedLang || this.detectLang() || 'en';
      } else {
        this.to = this.from;
      }
      this.from = tmp;
      if (switchText) {
        const tmpText = this.text;
        this.text = this.cachedText;
        this.cachedText = tmpText;
      }
    },
    setLang(lang) {
      if (this.menu === 'from') {
        this.detectedLang = null;
        if (this.to === lang) {
          this.switchLangs(false);
        }
        this.from = lang;
      }
      if (this.menu === 'to') {
        if (this.from === lang) {
          this.switchLangs(false);
        }
        this.to = lang;
      }
      this.menu = null;
      if (this.cachedText && this.cachedText.length) {
        this.getTranslation(this.cachedText);
      }
    },
    detectLang() {
      const lang = navigator.languages.find(f => languages[f] && f !== this.to);
      if (lang) {
        return lang;
      }
      if (languages[this.$i18n.locale] && this.$i18n.locale !== this.to) {
        return this.$i18n.locale;
      }
      return null;
    },
    getTranslation(text) {
      if (!text || !text.length) {
        this.text = '';
        this.detectedLang = null;
        return Promise.resolve('');
      }
      this.loading = true;
      return this.axios.post(`https://www.google.com/async/translate?nocache=${Date.now()}`,
        `async=translate,sl:${this.from},tl:${this.to},st:${
          encodeURIComponent(text)},qc:true,ac:true,id:1,_pms:qd,_fmt:json`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        .then((res) => {
          const data = JSON.parse(res.data.replace(")]}'", '').trim()).translateData.response;
          if (!data) throw new Error('Unexpected response');
          this.text = data.sentences.map(f => f.trans).join('\n');
          if (text !== this.cachedText) return res;
          if (this.from === 'auto' && data.detected_languages && data.detected_languages.srclangs) {
            [this.detectedLang] = data.detected_languages.srclangs;
          }
          if (this.detectedLang === this.to) {
            // Try different languages based on navigator languages or Epiboard language
            const lang = this.detectLang();
            if (lang) {
              this.to = lang;
              return this.getTranslation(text);
            }
          }
          return res;
        })
        .catch((err) => {
          if (this.$store.state.settings.debug) {
            console.error(err); // eslint-disable-line
          }
          this.text = 'Error';
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
