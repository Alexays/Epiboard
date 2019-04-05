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
    switchLangs() {
      const tmp = this.to;
      if (this.from === 'auto') {
        this.to = this.detectedLang || 'en';
      } else {
        this.to = this.from;
      }
      this.from = tmp;
      const tmpText = this.text;
      this.text = this.cachedText;
      this.cachedText = tmpText;
    },
    setLang(lang) {
      if (this.menu === 'from') {
        this.detectedLang = null;
        this.from = lang;
      }
      if (this.menu === 'to') {
        this.to = lang;
      }
      this.menu = null;
      if (this.cachedText && this.cachedText.length) {
        this.getTranslation(this.cachedText);
      }
    },
    getTranslation(text) {
      if (!text || !text.length) {
        this.text = '';
        return;
      }
      this.loading = true;
      this.axios.post(`https://www.google.com/async/translate?nocache=${Date.now()}`,
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
          if (this.from === 'auto' && data.detected_languages && data.detected_languages.srclangs) {
            [this.detectedLang] = data.detected_languages.srclangs;
          }
          this.text = data.sentences.map(f => f.trans).join('\n');
        })
        .catch((err) => {
          console.error(err);
          this.text = 'Error';
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
