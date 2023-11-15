import type {RouteRecordRaw} from "vue-router";
import NewTreatmentView from "@/treatment/views/NewTreatmentView.vue";
import TreatmentTableView from "@/treatment/views/TreatmentTableView.vue";
import TreatmentDetailsView from "@/treatment/views/TreatmentDetailsView.vue";
import TreatmentGamesView from "@/treatment/components/TreatmentGamesView.vue";
import TreatmentActionsView from "@/treatment/views/TreatmentActionsView.vue";
import TreatmentAnalysisView from "@/treatment/views/TreatmentAnalysisView.vue";

export const treatmentRoutes: Readonly<RouteRecordRaw[]> = [
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
    {
        path: '/treatments/:id/analysis',
        name: 'treatment-analysis',
        component: TreatmentAnalysisView
    },
];