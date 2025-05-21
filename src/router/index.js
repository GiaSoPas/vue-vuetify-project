import Vue from 'vue'
import VueRouter from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import Profile from '../views/Profile.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/new-order',
    name: 'NewOrder',
    component: () => import('@/views/NewOrder.vue')
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('@/views/Menu.vue')
  },
  {
    path: '/tables',
    name: 'Tables',
    component: () => import('@/views/Tables.vue')
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/Orders.vue')
  },
  {
    path: '/orders/:id',
    name: 'OrderDetails',
    component: () => import('@/views/OrderDetails.vue')
  },
  {
    path: '/kitchen',
    name: 'Kitchen',
    component: () => import('@/views/Kitchen.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      requiresAuth: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router 