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
import BaselineDetailsView from "@/baseline/views/BaselineDetailsView.vue";
import BaselineGamesView from "@/baseline/views/BaselineGamesView.vue";
import BaselineActionsView from "@/baseline/views/BaselineActionsView.vue";
import TreatmentDetailsView from "@/treatment/views/TreatmentDetailsView.vue";
import TreatmentGamesView from "@/treatment/components/TreatmentGamesView.vue";
import {taskRoutes} from "@/task/routes";
import TreatmentActionsView from "@/treatment/views/TreatmentActionsView.vue";
import {gameRoutes} from "@/game/routes";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: DashboardView
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
        {
            path: '/baselines/:id',
            name: 'baseline-details',
            component: BaselineDetailsView
        },
        {
            path: '/baselines/:id/games',
            name: 'baseline-games',
            component: BaselineGamesView
        },
        {
            path: '/baselines/:id/actions',
            name: 'baseline-actions',
            component: BaselineActionsView
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
        {
            path: '/treatments/:id',
            name: 'treatment-details',
            component: TreatmentDetailsView
        },
        {
            path: '/treatments/:id/games',
            name: 'treatment-games',
            component: TreatmentGamesView
        },
        {
            path: '/treatments/:id/actions',
            name: 'treatment-actions',
            component: TreatmentActionsView
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
        ...gameRoutes,
        ...taskRoutes
    ]
});

export default router;
