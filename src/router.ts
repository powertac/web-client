import {createRouter, createWebHistory} from "vue-router";
import DashboardView from "@/application/views/DashboardView.vue";
import NewGameView from "@/game/views/NewGameView.vue";
import GameTableView from "@/game/views/GameTableView.vue";
import NewBaselineView from "@/baseline/views/NewBaselineView.vue";
import BaselineTableView from "@/baseline/views/BaselineTableView.vue";
import BrokerTableView from "@/broker/views/BrokerTableView.vue";
import NewTreatmentView from "@/treatment/views/NewTreatmentView.vue";
import AddBrokerView from "@/broker/views/AddBrokerView.vue";
import TreatmentTableView from "@/treatment/views/TreatmentTableView.vue";
import GameDetailsView from "@/game/views/GameDetailsView.vue";
import GameFilesView from "@/game/views/GameFilesView.vue";
import GameActionsView from "@/game/views/GameActionsView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: DashboardView
    },
      // GAME
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
      path: '/games/:id',
      name: 'game-details',
      component: GameDetailsView
    },
    {
      path: '/games/:id/actions',
      name: 'game-actions',
      component: GameActionsView
    },
    {
      path: '/games/:id/files/:relativePath*',
      name: 'game-files',
      component: GameFilesView
    },
      // BASELINE
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
      // TREATMENT
    {
      path: '/treatments/new',
      name: 'new-treatment',
      component: NewTreatmentView
    },
    {
      path: '/treatments/table',
      name: 'treatment-table',
      component: TreatmentTableView
    },
      // BROKER
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
