import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from './en.json';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
  },
});

export default i18n;
