import {defineStore} from "pinia";
import {createFindByIdGetter} from "@/store/StoreUtils";
import type {Treatment} from "@/treatment/domain/Treatment";

export interface TreatmentStoreState {
    treatments: {[id: string]: Treatment}
}

export const useTreatmentStore = defineStore({
    id: "treatments",
    state: () => ({treatments: {}} as TreatmentStoreState),
    getters: {
        findById: (state: TreatmentStoreState) => createFindByIdGetter("treatment", state.treatments)
    },
    actions: {
        async fetchById(id: string): Promise<void> {
        }
    }
});
