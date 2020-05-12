import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import MainInterface from '@/components/MainInterface'
import TVDetailPage from '@/components/TVDetailPage'
import SingleActorPage from '@/components/SingleActorPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/map',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/index',
      name: 'MainInterface',
      component: MainInterface
    },
    {
      path: '/tv/:tv_name',
      name: "剧集详情",
      component: TVDetailPage,
      props: true
    },
    {
      path: '/actor/:actor_name',
      name: "演员详情",
      component: SingleActorPage,
      props: true
    }
  ]
})


