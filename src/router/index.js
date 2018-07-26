import Vue from 'vue';
import Router from 'vue-router';
import { loadLang } from '@/i18n';
import store from '@/store';

const Header = () => import(/* webpackChunkName: "header" */ '@/components/Header').then(_ => _.default);
const Home = () => import(/* webpackChunkName: "home" */ '@/components/Home').then(_ => _.default);
const Settings = () => import(/* webpackChunkName: "settings" */ '@/components/Settings').then(_ => _.default);
const OnBoarding = () => import(/* webpackChunkName: "onboarding" */ '@/components/Onboarding').then(_ => _.default);

Vue.use(Router);

const router = new Router({
  mode: 'abstract',
  routes: [
    {
      path: '/',
      name: 'Home',
      components: {
        default: Home,
        header: Header,
      },
    },
    {
      path: '/settings',
      name: 'Settings',
      components: {
        default: Settings,
        header: Header,
      },
    },
    {
      path: '/onboarding',
      name: 'OnBoarding',
      components: {
        default: OnBoarding,
        header: Header,
      },
    },
  ],
});

const checkTutorial = (to, next) => {
  const { tutorial } = store.state.settings;
  if (!tutorial && to.path !== '/onboarding') next('/onboarding');
  else next();
};

const waitStorage = () => {
  if (store._vm.$root.$data['vuex-persit-wait'] === 2) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    store._vm.$root.$once('storageReady', () => resolve());
  });
};

router.beforeEach((to, from, next) => {
  // Hold the request, until storage is ready if necessary.
  waitStorage()
    // Load lang if necessary.
    .then(() => loadLang(store.state.settings.lang))
    .then(() => checkTutorial(to, next));
});

router.replace('/');

export default router;
