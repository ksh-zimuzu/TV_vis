import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import MainInterface from '@/components/MainInterface'
import TVDetailPage from '@/components/TVDetailPage'
import SingleActorPage from '@/components/SingleActorPage'
import MetadataEditPage from '@/components/MetadataEdit/MetadataEditPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '全球趋势',
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
      path: '/actor/:actor_id',
      name: "演员详情",
      component: SingleActorPage,
      props: true
    }, {
      path: '/edit',
      name: "信息编辑",
      component: MetadataEditPage
    }
  ],
  mode: 'history',
  base: process.env.publicPath
})


