import type {Game} from "@/game/domain/Game";
import {useGameStore} from "@/game/domain/GameStore";
import {GameStatus} from "@/game/domain/GameStatus";

export abstract class GameGroup {

    abstract get gameIds(): string[];

    get games(): Game[] {
        const gameStore = useGameStore();
        return this.gameIds.map((id) => gameStore.findById(id));
    }

    get size(): number {
        return this.gameIds.length;
    }

    get completedGames(): Game[] {
        return this.games.slice().filter((g) => g.status === GameStatus.Completed);
    }

    get failedGames(): Game[] {
        return this.games.slice().filter((g) => g.status === GameStatus.Failed);
    }

    get runningGames(): Game[] {
        return this.games.slice().filter((g) => g.status === GameStatus.Running);
    }

    get progress(): number {
        if (this.games.length < 1) {
            return 0;
        }
        return this.completedGames.length / this.games.length;
    }

    get isRunning(): boolean {
        return this.games.slice().filter((g) => g.status === 'running').length > 0;
    }

    get status(): string { // FIXME : make enum
        if (this.progress === 1) {
            return 'completed';
        } else if (this.isRunning) {
            return 'running';
        } else if (this.failedGames.length > 0) {
            return 'failed';
        } else {
            return 'queued';
        }
    }

}
