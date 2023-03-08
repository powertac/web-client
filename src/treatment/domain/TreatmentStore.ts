import {defineStore} from "pinia";
import {createFindByIdGetter} from "@/store/StoreUtils";
import {Treatment, type TreatmentData} from "@/treatment/domain/Treatment";
import {buildModifier} from "@/treatment/domain/Modifier";
import {DateTime} from "luxon";
import {api} from "@/api";
import {SyncGroup} from "@/util/SyncGroup";
import {useGameStore} from "@/game/domain/GameStore";
import {useBaselineStore} from "@/baseline/domain/BaselineStore";

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
            if (undefined === this.treatments[id]) {
                const data = await api.orchestrator.treatments.getById(id);
                console.log(data);
                this.treatments[id] = buildTreatment(data);
                const sync = new SyncGroup();
                const gameStore = useGameStore();
                data.gameIds.forEach((gid) => sync.add(gameStore.fetchOnceById(gid)));
                sync.add(useBaselineStore().fetchOnceById(data.baselineId));
                return sync.wait();
            }
        },
        async fetchAllOnce(): Promise<void> {
            const data: TreatmentData[] = await api.orchestrator.treatments.getAll();
            const baselineIds = new Set<string>();
            const gameIds = new Set<string>();
            for (const treatmentData of data) {
                if (undefined === this.treatments[treatmentData.id]) {
                    this.treatments[treatmentData.id] = buildTreatment(treatmentData);
                    treatmentData.gameIds.forEach((gid) => gameIds.add(gid));
                    baselineIds.add(treatmentData.baselineId);
                }
            }
            const sync = new SyncGroup();
            const gameStore = useGameStore();
            const baselineStore = useBaselineStore();
            [... baselineIds.values()].forEach((bid) => sync.add(baselineStore.fetchOnceById(bid)));
            [...gameIds.values()].forEach((gid) => sync.add(gameStore.fetchOnceById(gid)));
            return sync.wait();
        }
    }
});

export function buildTreatment(data: TreatmentData): Treatment {
    console.log(Object.keys(data));
    return new Treatment(
        data.id,
        data.name,
        data.baselineId,
        buildModifier(data.modifier),
        data.gameIds,
        DateTime.fromMillis(data.createdAt));
}
