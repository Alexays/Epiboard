import Vue from 'vue';
import Router from 'vue-router';
import store from '@/helpers/store';

const Header = () => import('@/components/Header');
const Home = () => import('@/components/Home');
const Settings = () => import('@/components/Settings');

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

router.beforeEach((to, from, next) => {
  if (store._vm.$root.$data['vue-persist-patch-delay']) {
    // Hold the request, until the Storage is complete.
    store._vm.$root.$on('storageReady', () => {
      next();
    });
  } else next();
});

export default router;
