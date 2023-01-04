import {defineStore} from "pinia";
import {Baseline, type BaselineData} from "@/baseline/domain/Baseline";
import {createFindByIdGetter} from "@/store/StoreUtils";
import {api} from "@/api/api";
import {buildGameConfig} from "@/game/domain/GameConfig";
import {useGameStore} from "@/game/domain/GameStore";
import {DateTime} from "luxon";

export interface BaselineStoreState {
    baselines: {[id: string]: Baseline}
}

export const useBaselineStore = defineStore({
    id: "baselines",
    state: () => ({baselines: {}} as BaselineStoreState),
    getters: {
        exists: (state: BaselineStoreState) => (id: string) => state.baselines[id] !== undefined,
        findById: (state: BaselineStoreState) => createFindByIdGetter("baseline", state.baselines)
    },
    actions: {
        async fetchById(id: string): Promise<void> {
            if (undefined === this.baselines[id]) {
                const data = await api.orchestrator.baselines.getById(id);
                this.baselines[id] = buildBaseline(data);
                await useGameStore().fetchByIds(data.gameIds);
            }
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
