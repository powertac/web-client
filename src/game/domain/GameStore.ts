import {Game, type GameData} from "@/game/domain/Game";
import {defineStore} from "pinia";
import {createFindByIdGetter} from "@/store/StoreUtils";
import {buildGameConfig} from "@/game/domain/GameConfig";
import {buildGameRun} from "@/game/domain/GameRun";
import {api} from "@/api/api";
import moment from "moment";
import {useBaselineStore} from "@/baseline/domain/BaselineStore";
import {useTreatmentStore} from "@/treatment/domain/TreatmentStore";
import {SyncGroup} from "@/concurrency/SyncGroup";

interface GameStoreState {
    games: {[id: string]: Game|undefined}
}

export const useGameStore = defineStore({
    id: "games",
    state: () => ({games: {}} as GameStoreState),
    getters: {
        exists: (state: GameStoreState) => (id: string) => state.games[id] !== undefined,
        findById: (state: GameStoreState) => createFindByIdGetter("game", state.games)
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
        }
    }
});

function buildGame(data: GameData): Game {
    return new Game(
        data.id,
        data.name,
        buildGameConfig(data.config),
        moment(data.createdAt),
        data.cancelled,
        data.runs.map(data => buildGameRun(data)),
        data.baselineId,
        data.treatmentId,
        data.baseGameId);
}
