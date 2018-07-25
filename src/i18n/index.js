import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from '@/langs/en';

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
  },
});

const loadLang = lang => import(/* webpackMode: "lazy-once" */`@/langs/${lang}.js`)
  .then((msgs) => {
    i18n.setLocaleMessage(lang, msgs.default);
    i18n.locale = lang;
  });

export { i18n, loadLang };
