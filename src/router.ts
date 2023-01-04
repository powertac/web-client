import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "@/application/views/DashboardView.vue";
import NewGameView from "@/game/views/NewGameView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DashboardView
    },
    {
      path: '/game/new',
      name: 'home',
      component: NewGameView
    },
  ]
})

export default router
