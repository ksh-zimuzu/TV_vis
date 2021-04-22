import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import TVDetailPage from '@/components/TVDetailPage'
import SingleActorPage from '@/components/SingleActorPage'
import callbackPage from '@/components/callbackPage'
import AddTVShowPage from '@/components/MetadataEdit/AddTVShowPage'
import HomePage from "@/components/Homepage/homepage";

Vue.use(Router);

const router = new Router({
  routes: [
    {
      path: '/',
      name: '首页',
      subtitle: false,
      component: HomePage
    }
    ,
    {
      path: '/trend',
      name: '全球趋势',
      subtitle: false,
      component: HelloWorld
    },
    {
      path: '/tv/:tv_id',
      name: "剧集详情",
      subtitle: true,
      component: TVDetailPage,
      props: true
    },
    {
      path: '/actor/:actor_id',
      name: "演员详情",
      subtitle: true,
      component: SingleActorPage,
      props: true
    }, {
      path: '/callback',
      component: callbackPage
    },
    {
      path: "/add",
      subtitle: false,
      component: AddTVShowPage
    }
  ],
  mode: 'history',
  base: process.env.BASE_URL
})


router.beforeEach(function (to, from, next) {
  router.app.$options.store.commit("setTitle", to.name);

  if (!to.subtitle) {
    router.app.$options.store.commit("setSubtitle", "");
  }
  next();
})

export default router;
