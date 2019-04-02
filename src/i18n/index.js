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

const setLang = (vm, lang) => {
  i18n.locale = lang;
  vm.axios.defaults.headers.common['Accept-Language'] = lang; // eslint-disable-line
};

const loadLang = (vm, lang) => {
  if (!lang || lang === i18n.locale) return Promise.resolve();
  if (lang === defaultState.locale) {
    setLang(vm, lang);
    return Promise.resolve();
  }
  return import(/* webpackChunkName: "lang-[request]" */`@/langs/${lang}.js`)
    .then((msgs) => {
      i18n.setLocaleMessage(lang, msgs.default);
      setLang(vm, lang);
    });
};

export { i18n, loadLang };
