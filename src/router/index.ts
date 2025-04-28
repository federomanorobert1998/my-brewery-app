import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/HomePage.vue'),
  },
  {
    path: '/brewery/:id',
    name: 'BreweryDetail',
    component: () => import('../pages/BreweryDetail.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
