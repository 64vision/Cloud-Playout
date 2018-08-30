import Vue from 'vue'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Playout from './views/Playout.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: Login
    },
    {
      path: '/playout',
      name: 'playout',
      component: Playout,
     
    }
  ]
})
