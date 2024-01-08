import type {RouteRecordRaw} from "vue-router";
import UserTableView from "@/user/views/UserTableView.vue";
import RegistrationsTableView from "@/user/views/RegistrationsTableView.vue";
import RegisterNewUserView from "@/user/views/RegisterNewUserView.vue";

export const userRoutes: Readonly<RouteRecordRaw[]> = [
    {
        path: '/users/table',
        name: 'user-table',
        component: UserTableView
    },
    {
        path: '/users/registrations',
        name: 'registration-table',
        component: RegistrationsTableView
    },
    {
        path: '/users/register/:token',
        name: 'register-user',
        component: RegisterNewUserView,
        meta: {public: true}
    },
];