import {createRouter, createWebHistory} from "vue-router";
import DashboardView from "@/application/views/DashboardView.vue";
import NewGameView from "@/game/views/NewGameView.vue";
import GameTableView from "@/game/views/GameTableView.vue";
import NewBaselineView from "@/baseline/views/NewBaselineView.vue";
import BaselineTableView from "@/baseline/views/BaselineTableView.vue";
import BrokerTableView from "@/broker/views/BrokerTableView.vue";
import NewTreatmentView from "@/treatment/views/NewTreatmentView.vue";
import AddBrokerView from "@/broker/views/AddBrokerView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      path: '/baselines/new',
      name: 'new-baseline',
      component: NewBaselineView
    },
    {
      path: '/baselines/table',
      name: 'baseline-table',
      component: BaselineTableView
    },
    {
      path: '/treatments/new',
      name: 'new-treatment',
      component: NewTreatmentView
    },
    {
      path: '/brokers/table',
      name: 'broker-table',
      component: BrokerTableView
    },
    {
      path: '/brokers/add',
      name: 'add-broker',
      component: AddBrokerView
    },
  ]
});

export default router;
