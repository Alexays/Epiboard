import Vue from 'vue';
import Router from 'vue-router';
import Header from '@/components/Header';
import Home from '@/components/Home';
import Settings from '@/components/Settings';
import store from '@/helpers/store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: window.location.pathname,
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
    return;
  }
  next();
});

export default router;
