import type {GameConfig, GameConfigData} from "@/game/domain/GameConfig";
import type {GameRun, GameRunData} from "@/game/domain/GameRun";
import type {Baseline} from "@/baseline/domain/Baseline";
import type {Treatment} from "@/treatment/domain/Treatment";
import {buildGameConfig} from "@/game/domain/GameConfig";
import {buildGameRun} from "@/game/domain/GameRun";
import {useBaselineStore} from "@/baseline/domain/BaselineStore";
import {useTreatmentStore} from "@/treatment/domain/TreatmentStore";
import {useGameStore} from "@/game/domain/GameStore";
import moment from "moment";

export class Game {

    constructor(public readonly id: string,
                public readonly name: string,
                public readonly config: GameConfig,
                public readonly createdAt: moment.Moment,
                public readonly cancelled: boolean,
                public readonly runs: GameRun[],
                public readonly baseline: Baseline|null,
                public readonly treatment: Treatment|null,
                public readonly baseGame: Game|null) {}

    get status(): string {
        if (this.cancelled) {
            return 'cancelled';
        } else if (this.completedRun !== null) {
            return 'completed';
        } else if (this.activeRun !== null) {
            return 'running';
        } else if (this.runs.length < 3) {
            return 'queued';
        }
        return 'failed';
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

    get start(): moment.Moment|null {
        if (this.completedRun !== null) {
            return this.completedRun.start;
        } else if (this.activeRun !== null) {
            return this.activeRun.start;
        } else {
            return null;
        }
    }

    get end(): moment.Moment|null {
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
    config: GameConfigData; // FIXME : model is also changed in backend: this can be replaced by an ID as well
    createdAt: number;
    cancelled: boolean;
    runs: GameRunData[];
    baselineId: string|null;
    treatmentId: string|null;
    baseGameId: string|null;
}

const baselineStore = useBaselineStore();
const treatmentStore = useTreatmentStore();
const gameStore = useGameStore();

export function buildGame(data: GameData): Game {
    return new Game(
        data.id,
        data.name,
        buildGameConfig(data.config),
        moment(data.createdAt),
        data.cancelled,
        data.runs.map(data => buildGameRun(data)),
        data.baselineId !== null ? baselineStore.findById(data.baselineId) : null,
        data.treatmentId !== null ? treatmentStore.findById(data.treatmentId) : null,
        data.baseGameId !== null ? gameStore.findById(data.baseGameId) : null);
}
