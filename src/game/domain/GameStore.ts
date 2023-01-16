import {Game, type GameData} from "@/game/domain/Game";
import {defineStore} from "pinia";
import {createFindAllGetter, createFindByIdGetter} from "@/store/StoreUtils";
import {buildGameConfig} from "@/game/domain/GameConfig";
import {buildGameRun} from "@/game/domain/GameRun";
import {api} from "@/api";
import {useBaselineStore} from "@/baseline/domain/BaselineStore";
import {useTreatmentStore} from "@/treatment/domain/TreatmentStore";
import {SyncGroup} from "@/concurrency/SyncGroup";
import {DateTime} from "luxon";

interface GameStoreState {
    games: {[id: string]: Game|undefined}
}

export const useGameStore = defineStore({
    id: "games",
    state: () => ({games: {}} as GameStoreState),
    getters: {
        exists: (state: GameStoreState) => (id: string) => state.games[id] !== undefined,
        findById: (state: GameStoreState) => createFindByIdGetter("game", state.games),
        findAll: (state: GameStoreState) => createFindAllGetter(state.games)
    },
    actions: {
        async fetchById(id: string, force?: boolean): Promise<void> {
            if (force !== undefined && force) {
                this.games[id] = undefined;
            }
            if (undefined === this.games[id]) {
                const data = await api.orchestrator.games.getById(id);
                this.games[id] = buildGame(data);
                const sync = new SyncGroup();
                if (null !== data.baselineId)
                    sync.add(useBaselineStore().fetchById(data.baselineId));
                if (null !== data.treatmentId)
                    sync.add(useTreatmentStore().fetchById(data.treatmentId));
                if (null !== data.baseGameId)
                    sync.add(this.fetchById(data.baseGameId));
                return sync.wait();
            }
        },
        async fetchByIds(ids: string[]): Promise<void> {
            const sync = new SyncGroup();
            for (let i=0; i < ids.length; i++) {
                sync.add(this.fetchById(ids[i]));
            }
            return sync.wait();
        },
        async fetchAllOnce(): Promise<void> {
            const data = await api.orchestrator.games.findAll();
            const baselineIds = new Set<string>();
            const treatmentIds = new Set<string>();
            const baseGameIds = new Set<string>();
            for (const gameData of data) {
                if (undefined === this.games[gameData.id]) {
                    this.games[gameData.id] = buildGame(gameData);
                    if (null !== gameData.baselineId)
                        baselineIds.add(gameData.baselineId)
                    if (null !== gameData.treatmentId)
                        treatmentIds.add(gameData.treatmentId)
                    if (null !== gameData.baseGameId)
                        baseGameIds.add(gameData.baseGameId)
                }
            }
            const sync = new SyncGroup();
            baselineIds.forEach((id) => sync.add(useBaselineStore().fetchById(id)))
            treatmentIds.forEach((id) => sync.add(useTreatmentStore().fetchById(id)))
            baseGameIds.forEach((id) => sync.add(this.fetchById(id)))
            return sync.wait();
        }
    }
});

function buildGame(data: GameData): Game {
    return new Game(
        data.id,
        data.name,
        buildGameConfig(data.config),
        DateTime.fromMillis(data.createdAt),
        data.cancelled,
        data.runs.map(data => buildGameRun(data)),
        data.baselineId,
        data.treatmentId,
        data.baseGameId);
}
