import Vue from 'vue';
import Router from 'vue-router';
import Header from '@/components/Header';
import Home from '@/components/Home';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      components: {
        default: Home,
        header: Header,
      },
    },
  ],
});
