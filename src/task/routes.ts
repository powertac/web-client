import type {RouteRecordRaw} from "vue-router";
import TaskTableView from "@/task/views/TaskTableView.vue";

export const taskRoutes: Readonly<RouteRecordRaw[]> = [
    {
        path: "/tasks/table",
        name: "task-table",
        component: TaskTableView
    }
];