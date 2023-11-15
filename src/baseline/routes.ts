import type {RouteRecordRaw} from "vue-router";
import NewBaselineView from "@/baseline/views/NewBaselineView.vue";
import BaselineTableView from "@/baseline/views/BaselineTableView.vue";
import BaselineDetailsView from "@/baseline/views/BaselineDetailsView.vue";
import BaselineGamesView from "@/baseline/views/BaselineGamesView.vue";
import BaselineActionsView from "@/baseline/views/BaselineActionsView.vue";
import BaselineAnalysisView from "@/baseline/views/BaselineAnalysisView.vue";

export const baselineRoutes: Readonly<RouteRecordRaw[]> = [
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
    {
        path: '/baselines/:id/analysis',
        name: 'baseline-analysis',
        component: BaselineAnalysisView
    },
];