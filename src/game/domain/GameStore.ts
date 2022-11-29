import type {Game} from "@/game/domain/Game";
import {defineStore} from "pinia";
import {createGetter} from "@/util/StoreUtils";

interface GameStoreState {
    games: {[id: string]: Game}
}

export const useGameStore = defineStore({
    id: "games",
    state: () => ({games: {}} as GameStoreState),
    getters: {
        findById: (state: GameStoreState) => createGetter("game", state.games)
    }
})
