import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from '@/langs/en';

Vue.use(VueI18n);

const defaultState = {
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en,
  },
};

const i18n = new VueI18n(defaultState);

const loadLang = (lang) => {
  if (!lang || lang === i18n.locale) return Promise.resolve();
  if (lang === defaultState.locale) {
    i18n.locale = lang;
    return Promise.resolve();
  }
  return import(/* webpackMode: "lazy-once" */`@/langs/${lang}.js`)
    .then((msgs) => {
      i18n.setLocaleMessage(lang, msgs.default);
      i18n.locale = lang;
    });
};

export { i18n, loadLang };
