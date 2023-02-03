import {defineStore} from "pinia";
import {createFindByIdGetter} from "@/store/StoreUtils";
import {Treatment, type TreatmentData} from "@/treatment/domain/Treatment";
import {buildModifier} from "@/treatment/domain/Modifier";

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
        async fetchOnceById(id: string): Promise<void> {
        },
        async fetchAllOnce(): Promise<void> {

        }
    }
});

export function buildTreatment(data: TreatmentData): Treatment {
    return new Treatment(
        data.id,
        data.name,
        data.baselineId,
        buildModifier(data.modifier),
        data.gameIds);
}
