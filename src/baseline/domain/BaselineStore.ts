import {defineStore} from "pinia";
import {Baseline, type BaselineData} from "@/baseline/domain/Baseline";
import {createFindAllGetter, createFindByIdGetter} from "@/store/StoreUtils";
import {api} from "@/api";
import {buildGameConfig} from "@/game/domain/GameConfig";
import {useGameStore} from "@/game/domain/GameStore";
import {DateTime} from "luxon";
import {SyncGroup} from "@/util/SyncGroup";
import {useTreatmentStore} from "@/treatment/domain/TreatmentStore";
import {useBrokerStore} from "@/broker/domain/BrokerStore";

export interface BaselineStoreState {
    baselines: {[id: string]: Baseline}
}

export const useBaselineStore = defineStore({
    id: "baselines",
    state: () => ({baselines: {}} as BaselineStoreState),
    getters: {
        exists: (state: BaselineStoreState) => (id: string) => state.baselines[id] !== undefined,
        findById: (state: BaselineStoreState) => createFindByIdGetter("baseline", state.baselines),
        findAll: (state: BaselineStoreState) => createFindAllGetter(state.baselines),
    },
    actions: {
        async fetchOnceById(id: string): Promise<void> {
            if (undefined === this.baselines[id]) {
                const data = await api.orchestrator.baselines.getById(id);
                this.baselines[id] = buildBaseline(data);
                await useGameStore().fetchByIds(data.gameIds);
            }
        },
        async fetchAll(): Promise<void> {
            const data = await api.orchestrator.baselines.getAll();
            const gameIds = new Set<string>();
            for (const baselineData of data) {
                if (undefined === this.baselines[baselineData.id]) {
                    this.baselines[baselineData.id] = buildBaseline(baselineData);
                    baselineData.gameIds.forEach((gid) => gameIds.add(gid));
                }
            }
            const sync = new SyncGroup();
            const gameStore = useGameStore();
            await [...gameIds.values()].forEach((gid) => sync.add(gameStore.fetchOnceById(gid)));
            return sync.wait();
        }
    }
});

function buildBaseline(data: BaselineData): Baseline {
    return new Baseline(
        data.id,
        data.name,
        buildGameConfig(data.config),
        data.gameIds,
        DateTime.fromMillis(data.createdAt));
}
