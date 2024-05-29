import type {RouteRecordRaw} from "vue-router";
import SimulationServerVersionTableView from "@/simulation/views/SimulationServerVersionTableView.vue";

export const serverRoutes: Readonly<RouteRecordRaw[]> = [
    {
        path: '/simulation-servers/versions/table',
        name: 'simulation-server-versions-table',
        component: SimulationServerVersionTableView
    }
];