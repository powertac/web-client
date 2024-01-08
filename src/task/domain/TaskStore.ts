import {defineStore} from "pinia";
import {createFindAllGetter, createFindByIdGetter} from "@/util/domain/StoreUtils";
import {Task, type TaskConfig} from "@/task/domain/Task";
import {api} from "@/api";

interface TaskStoreState {
    tasks: {[id: string]: Task<TaskConfig>}
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
            data.forEach(t => this.tasks[t.id] = Task.from(t));
        },
    }
});