import { createRouter, createWebHistory } from "vue-router";
import DashboardView from "@/application/views/DashboardView.vue";
import GameConfigEditor from "@/game/components/GameConfigEditor.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DashboardView
    },
    {
      path: '/game-configs/new',
      name: 'home',
      component: GameConfigEditor
    },
  ]
})

export default router
