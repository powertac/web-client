import type {GameConfig, GameConfigData} from "@/game/domain/GameConfig";
import type {GameRun, GameRunData} from "@/game/domain/GameRun";
import type {Baseline} from "@/baseline/domain/Baseline";
import type {Treatment} from "@/treatment/domain/Treatment";
import {useBaselineStore} from "@/baseline/domain/BaselineStore";
import {useTreatmentStore} from "@/treatment/domain/TreatmentStore";
import {useGameStore} from "@/game/domain/GameStore";
import type {DateTime} from "luxon";
import type {WeatherConfigData} from "@/weather/domain/WeatherConfig";
import {GameStatus} from "@/game/domain/GameStatus";

export class Game {

    constructor(public readonly id: string,
                public readonly name: string,
                public readonly config: GameConfig,
                public readonly createdAt: DateTime,
                public readonly cancelled: boolean,
                public readonly runs: GameRun[],
                private readonly baselineId: string|null,
                private readonly treatmentId: string|null,
                private readonly baseGameId: string|null) {}

    get baseline(): Baseline|null {
        // FIXME : check performance impact of loading from store vs. keeping local copy
        return null !== this.baselineId ? useBaselineStore().findById(this.baselineId) : null;
    }

    get treatment(): Treatment|null {
        // FIXME : check performance impact of loading from store vs. keeping local copy
        return null !== this.treatmentId ? useTreatmentStore().findById(this.treatmentId) : null;
    }

    get baseGame(): Game|null {
        // FIXME : check performance impact of loading from store vs. keeping local copy
        return null !== this.baseGameId ? useGameStore().findById(this.baseGameId) : null;
    }

    get status(): GameStatus {
        if (this.cancelled) {
            return GameStatus.Cancelled;
        } else if (this.completedRun !== null) {
            return GameStatus.Completed;
        } else if (this.activeRun !== null) {
            return GameStatus.Running;
        } else if (this.runs.length < 3) {
            return GameStatus.Queued;
        }
        return GameStatus.Failed;
    }

    get statusIndex(): number {
        switch (this.status) {
            case 'running': { return 0; }
            case 'queued': { return 1; }
            case 'completed': { return 2; }
            case 'failed': { return 3; }
            case 'cancelled': { return 4; }
            default: { return -1; }
        }
    }

    get activeRun(): GameRun|null {
        const activeRun = this.runs
            .filter((r) => r.phase !== 'DONE' && r.phase !== 'NONE')
            .pop();
        return activeRun !== undefined ? activeRun : null;
    }

    get completedRun(): GameRun|null {
        const completedRun = this.runs
            .filter((r) => !r.failed && r.phase === 'DONE')
            .pop();
        return completedRun !== undefined ? completedRun : null;
    }

    get start(): DateTime|null {
        if (this.completedRun !== null) {
            return this.completedRun.start;
        } else if (this.activeRun !== null) {
            return this.activeRun.start;
        } else {
            return null;
        }
    }

    get end(): DateTime|null {
        if (this.completedRun !== null) {
            return this.completedRun.end;
        } else if (this.activeRun !== null) {
            return this.activeRun.end;
        } else {
            return null;
        }
    }

}

export interface GameData {
    id: string;
    name: string;
    config: GameConfigData;
    createdAt: number;
    cancelled: boolean;
    runs: GameRunData[];
    baselineId: string|null;
    treatmentId: string|null;
    baseGameId: string|null;
}

export interface NewGameData {
    name: string;
    brokerIds: string[];
    parameters: { [key: string]: string };
    weather: WeatherConfigData;
}
