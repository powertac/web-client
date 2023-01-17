import {createRouter, createWebHistory} from "vue-router";
import DashboardView from "@/application/views/DashboardView.vue";
import NewGameView from "@/game/views/NewGameView.vue";
import GameTableView from "@/game/views/GameTableView.vue";
import NewBaselineView from "@/baseline/views/NewBaselineView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/baselines/new',
      name: 'new-baseline',
      component: NewBaselineView
    },
    {
      path: '/',
      name: 'home',
      component: DashboardView
    },
    {
      path: '/games/new',
      name: 'new-game',
      component: NewGameView
    },
    {
      path: '/games/table',
      name: 'game-table',
      component: GameTableView
    },
    {
      path: '/brokers/table',
      name: 'broker-table',
      component: GameTableView
    },
  ]
});

export default router;
