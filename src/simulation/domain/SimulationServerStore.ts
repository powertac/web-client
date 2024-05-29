import {DateTime} from "luxon";
import type {SimulationServerVersion} from "@/simulation/domain/SimulationServerVersion";
import {defineStore} from "pinia";
import {api} from "@/api";

export interface SimulationServerStoreState {
    lastFullUpdate: DateTime|null;
    versions: {[id:string]: SimulationServerVersion};
}

export const useServerStore = defineStore({
    id: "server",
    state: () => ({lastFullUpdate: null, versions: {}} as SimulationServerStoreState),
    getters: {
        isReady: (state: SimulationServerStoreState) => state.lastFullUpdate !== null,
        findAllVersions: (state: SimulationServerStoreState) => () => Object.values(state.versions),
        findVersion: (state: SimulationServerStoreState) => (id: string) => state.versions[id],
    },
    actions: {
        async fetchAll(): Promise<void> {
            const versionData = await api.orchestrator.servers.getAllVersions();
            versionData.forEach(v => this.versions[v.id] = v);
            this.lastFullUpdate = DateTime.now();
        }
    }
});