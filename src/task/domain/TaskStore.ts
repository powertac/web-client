import {defineStore} from "pinia";
import {createFindAllGetter, createFindByIdGetter} from "@/store/StoreUtils";
import type {Task} from "@/task/domain/Task";
import {api} from "@/api";
import {buildTask} from "@/task/domain/Task";

interface TaskStoreState {
    tasks: {[id: string]: Task}
}

export const useTaskStore = defineStore({
    id: "tasks",
    state: () => ({tasks: {}} as TaskStoreState),
    getters: {
        findById: (state: TaskStoreState) => createFindByIdGetter("task", state.tasks),
        findAll: (state: TaskStoreState) => createFindAllGetter(state.tasks),
    },
    actions: {
        async fetchAll(): Promise<void> {
            const data = await api.orchestrator.tasks.getAll();
            data.forEach(t => this.tasks[t.id] = buildTask(t));
        },
    }
});