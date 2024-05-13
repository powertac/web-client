import {defineStore} from "pinia";
import {createFindAllGetter, createFindByIdGetter} from "@/util/domain/StoreUtils";
import {Task, type TaskConfig, TaskStatus} from "@/task/domain/Task";
import {api} from "@/api";
import type {LogProcessorTaskConfig} from "@/logprocessor/domain/LogProcessorTask";
import type {Game} from "@/game/domain/Game";
import {DateTime} from "luxon";
import type {LogProcessorArtifact} from "@/logprocessor/domain/LogProcessorArtifact";
import {dateComp} from "@/util/Dates";

interface TaskStoreState {
    lastUpdate: DateTime|null;
    tasks: {[id: string]: Task<TaskConfig>};
}

export const useTaskStore = defineStore({
    id: "tasks",
    state: () => ({lastUpdate: null, tasks: {}} as TaskStoreState),
    getters: {
        isReady: (state: TaskStoreState) => state.lastUpdate !== null,
        findById: (state: TaskStoreState) => createFindByIdGetter("task", state.tasks),
        findAll: (state: TaskStoreState) => createFindAllGetter(state.tasks),
        findLogProcessorTasksByGameAndName: (state: TaskStoreState) => (game: Game, processorName: string) =>
            Object.values(state.tasks)
                .filter(t => t.type === 'log-processor')
                .filter(t => (t as Task<LogProcessorTaskConfig>).config.gameId === game.id)
                .filter(t => (t as Task<LogProcessorTaskConfig>).config.processorNames.filter(n => n === processorName).length > 0),
        findTaskStatusForGameArtifact: (state) => (game: Game, artifact: LogProcessorArtifact): TaskStatus|undefined =>
            Object.values(state.tasks)
                .filter(t => t.type === 'log-processor')
                .filter(t => (t as Task<LogProcessorTaskConfig>).config.gameId === game.id)
                .filter(t => (t as Task<LogProcessorTaskConfig>).config.processorNames.filter(n => n === artifact.processorName).length > 0)
                .sort((a,b) => dateComp(b.createdAt, a.createdAt))
                .map(t => t.status)
                .shift(),
        gameHasQueuedProcessorTask: (state: TaskStoreState) => (game: Game) =>
            Object.values(state.tasks)
                .filter(t => t.type === 'log-processor')
                .filter(t => t.status === TaskStatus.QUEUED)
                .filter(t => (t as Task<LogProcessorTaskConfig>).config.gameId === game.id)
                .length > 0,
        gameHasRunningLogProcessorTasks: (state: TaskStoreState) => (game: Game): boolean =>
            Object.values(state.tasks)
                .filter(t => t.type === 'log-processor')
                .filter(t => t.status === TaskStatus.RUNNING)
                .filter(t => (t as Task<LogProcessorTaskConfig>).config.gameId === game.id)
                .length > 0
    },
    actions: {
        async fetchAll(): Promise<void> {
            const data = await api.orchestrator.tasks.getAll();
            data.forEach(t => this.tasks[t.id] = Task.from(t));
            this.lastUpdate = DateTime.now();
        },
        async fetchUpdate(): Promise<void> {
            if (this.lastUpdate === null) {
                return this.fetchAll();
            } else {
                const data = await api.orchestrator.tasks.getUpdated(this.lastUpdate);
                data.forEach(t => this.tasks[t.id] = Task.from(t));
                this.lastUpdate = DateTime.now();
            }
        }
    }
});