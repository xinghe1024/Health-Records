import { createRouter, createWebHistory } from 'vue-router'
import { mainRoutes } from './routes'

import MainLayout from '@/layouts/MainLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', component: MainLayout, children: mainRoutes},
    // 未匹配的地址一律回首页
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ],
  scrollBehavior: () => ({ top: 0, behavior: 'smooth' }),

})

export default router