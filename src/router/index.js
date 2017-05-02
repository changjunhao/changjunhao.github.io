import Vue from 'vue';
import Router from 'vue-router';
import Intro from '@/components/Intro';
import Skill from '@/components/Skill';
import Works from '@/components/Works';
import More from '@/components/More';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Intro',
      component: Intro,
    },
    {
      path: '/skill',
      name: 'Skill',
      component: Skill,
    },
    {
      path: '/works',
      name: 'Works',
      component: Works,
    },
    {
      path: '/more',
      name: 'More',
      component: More,
    },
  ],
});
