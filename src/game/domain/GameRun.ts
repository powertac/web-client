import {DateTime} from "luxon";

export class GameRun {

    constructor(public readonly id: string,
                public readonly start: DateTime|null,
                public readonly end: DateTime|null,
                public readonly phase: string, // FIXME : make it an enum
                public readonly failed: boolean) {}

}

export interface GameRunData {
    id: string;
    start: number;
    end: number;
    phase: string;
    failed: boolean;
}

export function buildGameRun(data: GameRunData): GameRun {
    return new GameRun(
        data.id,
        data.start !== null ? DateTime.fromMillis(data.start) : null,
        data.end !== null ? DateTime.fromMillis(data.end) : null,
        data.phase,
        data.failed);
}
