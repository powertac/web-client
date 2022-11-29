import {defineStore} from "pinia";
import type {Baseline} from "@/baseline/domain/Baseline";
import {createGetter} from "@/util/StoreUtils";

export interface BaselineStoreState {
    baselines: {[id: string]: Baseline}
}

export const useBaselineStore = defineStore({
    id: "baselines",
    state: () => ({baselines: {}} as BaselineStoreState),
    getters: {
        findById: (state: BaselineStoreState) => createGetter("baseline", state.baselines)
    }
});
