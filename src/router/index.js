import Vue from 'vue';
import Router from 'vue-router';
import { loadLang } from '@/i18n';
import store from '@/store';

const Header = () => import(/* webpackChunkName: "main" */ '@/components/Header');
const Home = () => import(/* webpackChunkName: "main" */ '@/components/Home');
const Settings = () => import(/* webpackChunkName: "settings" */ '@/components/Settings');
const OnBoarding = () => import(/* webpackChunkName: "onboarding" */ '@/components/Onboarding');

Vue.use(Router);

const router = new Router({
  mode: 'abstract',
  routes: [
    {
      path: '/',
      name: 'home',
      components: {
        default: Home,
        header: Header,
      },
    },
    {
      path: '/settings',
      name: 'settings',
      components: {
        default: Settings,
        header: Header,
      },
    },
    {
      path: '/onboarding',
      name: 'onboarding',
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

router.beforeEach((to, from, next) => {
  // Hold the request, until storage is ready if necessary.
  store.restored
    // Load lang if necessary.
    .then(() => loadLang(store._vm, store.state.settings.lang))
    .then(() => checkTutorial(to, next));
});

router.replace('/');

export default router;
