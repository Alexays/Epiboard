import Vue from 'vue';
import Router from 'vue-router';
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

router.beforeEach((to, from, next) => {
  if (store._vm.$root.$data['vuex-persit-wait'] !== 2) {
    // Hold the request, until the Storage is complete.
    store._vm.$root.$on('storageReady', () => next());
  } else next();
});

router.replace('/');

export default router;
