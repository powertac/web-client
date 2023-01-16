import {defineStore} from "pinia";
import {api} from "@/api";

export interface ParameterStoreState {
    parameters: Set<string>
}

export const useParameterStore = defineStore({
    id: "parameters",
    state: () => ({parameters: new Set()} as ParameterStoreState),
    getters: {
        findAll: (state: ParameterStoreState) => () => Array.from(state.parameters.values()).sort()
    },
    actions: {
        async fetchAllOnce(): Promise<void> {
            if (this.parameters.size < 1) {
                const data = await api.orchestrator.parameters.getSupported();
                data.forEach((parameter) => this.parameters.add(parameter));
            }
        }
    }
});
