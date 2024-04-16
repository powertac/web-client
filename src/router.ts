import {createRouter, createWebHistory} from "vue-router";
import DashboardView from "@/application/views/DashboardView.vue";
import BrokerTableView from "@/broker/views/BrokerTableView.vue";
import AddBrokerView from "@/broker/views/AddBrokerView.vue";
import {taskRoutes} from "@/task/routes";
import {gameRoutes} from "@/game/routes";
import {baselineRoutes} from "@/baseline/routes";
import {treatmentRoutes} from "@/treatment/routes";
import {userRoutes} from "@/user/routes";
import LoginView from "@/security/views/LoginView.vue";
import {useAuthStore} from "@/security/domain/AuthStore";
import type {AuthState} from "@/security/domain/AuthState";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'dash',
            component: DashboardView
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView,
            meta: {public: true}
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

router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    authStore.loadAuthState().then(() => {
        const authenticated = (authStore.findAuthState as AuthState).isAuthenticated;
        if (to.meta.public !== true && !authenticated) {
            next({name: 'login'});
        } else if (to.name === 'login' && authenticated) {
            next({name: 'dash'});
        } else {
            next();
        }
    })
    .catch(e => console.log("unable to determine auth state", e));
});

export default router;
