import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../pages/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    // 路由懒加载示例
    component: () => import('../pages/About.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 