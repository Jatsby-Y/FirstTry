import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import List from '../components/List'
import Detail from '../components/Detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'ToLogin',
      redirect: '/login'
    }, {
      path: '/login',
      name: 'Login',
      component: Login
    }, {
      path: '/list',
      name: 'List',
      component: List
    }, {
      path: '/league/:id',
      name: 'Detail',
      component: Detail
    }
  ]
})
