import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

const Header = () => import(/* webpackChunkName: "header" */ '@/components/Header');
const Home = () => import(/* webpackChunkName: "home" */ '@/components/Home');
const Settings = () => import(/* webpackChunkName: "settings" */ '@/components/Settings');

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
  ],
});
router.push('/');

router.beforeEach((to, from, next) => {
  if (store._vm.$root.$data['vuex-persit-wait'] !== 2) {
    // Hold the request, until the Storage is complete.
    store._vm.$root.$on('storageReady', () => next());
  } else next();
});

export default router;
