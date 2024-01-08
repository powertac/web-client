import {createRouter, createWebHistory} from "vue-router";
import DashboardView from "@/application/views/DashboardView.vue";
import BrokerTableView from "@/broker/views/BrokerTableView.vue";
import AddBrokerView from "@/broker/views/AddBrokerView.vue";
import {taskRoutes} from "@/task/routes";
import {gameRoutes} from "@/game/routes";
import {baselineRoutes} from "@/baseline/routes";
import {treatmentRoutes} from "@/treatment/routes";
import {userRoutes} from "@/user/routes";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: DashboardView
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
        ...baselineRoutes,
        ...gameRoutes,
        ...taskRoutes,
        ...treatmentRoutes,
        ...userRoutes
    ]
});

export default router;
