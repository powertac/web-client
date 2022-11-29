import {defineStore} from "pinia";
import {createGetter} from "@/util/StoreUtils";
import type {Treatment} from "@/treatment/domain/Treatment";

export interface TreatmentStoreState {
    treatments: {[id: string]: Treatment}
}

export const useTreatmentStore = defineStore({
    id: "treatments",
    state: () => ({treatments: {}} as TreatmentStoreState),
    getters: {
        findById: (state: TreatmentStoreState) => createGetter("treatment", state.treatments)
    }
});
