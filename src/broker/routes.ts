import AddBrokerView from "@/broker/views/AddBrokerView.vue";
import type {RouteRecordRaw} from "vue-router";
import BrokerTableView from "@/broker/views/BrokerTableView.vue";

export const brokerRoutes: Readonly<RouteRecordRaw[]> = [
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
];