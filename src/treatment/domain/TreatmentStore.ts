import {defineStore} from "pinia";
import {createFindAllGetter, createFindByIdGetter} from "@/util/domain/StoreUtils";
import {Treatment, type TreatmentData} from "@/treatment/domain/Treatment";
import {buildModifier} from "@/treatment/domain/Modifier";
import {DateTime} from "luxon";
import {api} from "@/api";
import {SyncGroup} from "@/util/SyncGroup";
import {useGameStore} from "@/game/domain/GameStore";
import {useBaselineStore} from "@/baseline/domain/BaselineStore";
import {buildGameConfig} from "@/game/domain/GameConfig";

export interface TreatmentStoreState {
    lastFullUpdate: DateTime|null;
    treatments: {[id: string]: Treatment};
}

export const useTreatmentStore = defineStore({
    id: "treatments",
    state: () => ({ lastFullUpdate: null, treatments: {} } as TreatmentStoreState),
    getters: {
        isReady: (state: TreatmentStoreState) => state.lastFullUpdate !== null,
        findById: (state: TreatmentStoreState) => createFindByIdGetter("treatment", state.treatments),
        findAll: (state: TreatmentStoreState) => createFindAllGetter(state.treatments)
    },
    actions: {
        async fetchOnceById(id: string): Promise<void> {
            if (undefined === this.treatments[id]) {
                const data = await api.orchestrator.treatments.getById(id);
                this.treatments[id] = buildTreatment(data);
                const sync = new SyncGroup();
                const gameStore = useGameStore();
                data.gameIds.forEach((gid) => sync.add(gameStore.fetchOnceById(gid)));
                sync.add(useBaselineStore().fetchOnceById(data.baselineId));
                return sync.wait();
            }
        },
        async fetchAll(): Promise<void> {
            console.log("loading treatments");
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
            await sync.wait();
            console.log("treatments loaded");
            this.lastFullUpdate = DateTime.now();
        }
    }
});

export function buildTreatment(data: TreatmentData): Treatment {
    return new Treatment(
        data.id,
        data.name,
        data.baselineId,
        buildModifier(data.modifier),
        data.gameIds,
        buildGameConfig(data.config),
        DateTime.fromMillis(data.createdAt));
}
