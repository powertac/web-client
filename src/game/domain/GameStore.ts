import {Game, type GameData} from "@/game/domain/Game";
import {defineStore} from "pinia";
import {createFindAllGetter, createFindByIdGetter} from "@/store/StoreUtils";
import {buildGameConfig} from "@/game/domain/GameConfig";
import {buildGameRun} from "@/game/domain/GameRun";
import {api} from "@/api";
import {useBaselineStore} from "@/baseline/domain/BaselineStore";
import {useTreatmentStore} from "@/treatment/domain/TreatmentStore";
import {SyncGroup} from "@/util/SyncGroup";
import {DateTime} from "luxon";

interface GameStoreState {
    games: {[id: string]: Game|undefined},
    runningIds: Set<string>
}

export const useGameStore = defineStore({
    id: "games",
    state: () => ({games: {}, runningIds: new Set()} as GameStoreState),
    getters: {
        exists: (state: GameStoreState) => (id: string) => state.games[id] !== undefined,
        findById: (state: GameStoreState) => createFindByIdGetter("game", state.games),
        findAll: (state: GameStoreState) => createFindAllGetter(state.games),
        findRunning: (state: GameStoreState) => Array.from(state.runningIds)
            .filter(id => state.games[id] !== undefined)
            .map(id => state.games[id] as Game)
    },
    actions: {
        async add(data: GameData[]): Promise<void> {
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
            baselineIds.forEach((id) => sync.add(useBaselineStore().fetchOnceById(id)));
            treatmentIds.forEach((id) => sync.add(useTreatmentStore().fetchOnceById(id)));
            baseGameIds.forEach((id) => sync.add(this.fetchOnceById(id)));
            return sync.wait();
        },
        async fetchById(id: string): Promise<void> {
            const data = await api.orchestrator.games.getById(id);
            return this.add([data]);
        },
        async fetchOnceById(id: string): Promise<void> {
            if (this.games[id] === undefined) {
                return this.fetchById(id);
            }
        },
        async fetchByIds(ids: string[]): Promise<void> {
            const sync = new SyncGroup();
            for (let i=0; i < ids.length; i++) {
                sync.add(this.fetchOnceById(ids[i]));
            }
            return sync.wait();
        },
        async fetchAll(): Promise<void> {
            const data = await api.orchestrator.games.getAll();
            return this.add (data);
        },
        async fetchRunning(): Promise<void> {
            const data = await api.orchestrator.games.getRunning();
            return new Promise<void>((resolve, reject) => {
                this.add(data).then(() => {
                    this.runningIds.clear();
                    data.forEach(gameData => this.runningIds.add(gameData.id))
                    resolve();
                }).catch(e => reject(e));
            });
        }
    }
});

function buildGame(data: GameData): Game {
    const runs = data.runs.map(data => buildGameRun(data)).sort((a, b) => {
        if (a.start === null && b.start === null) return 0;
        else if (a.start === null) return -1;
        else if (b.start === null) return 1;
        else return a.start.toMillis() - b.start.toMillis();
    });
    return new Game(
        data.id,
        data.name,
        buildGameConfig(data.config),
        DateTime.fromMillis(data.createdAt),
        data.cancelled,
        runs,
        data.baselineId,
        data.treatmentId,
        data.baseGameId);
}
