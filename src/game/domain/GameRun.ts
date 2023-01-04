import {DateTime} from "luxon";

export class GameRun {

    constructor(public readonly id: string,
                public readonly start: DateTime,
                public readonly end: DateTime,
                public readonly phase: string, // FIXME : make it an enum
                public readonly failed: boolean) {}

}

export interface GameRunData {
    id: string;
    gameId: string;
    start: number;
    end: number;
    phase: string;
    failed: boolean;
}

export function buildGameRun(data: GameRunData): GameRun {
    return new GameRun(
        data.id,
        DateTime.fromMillis(data.start),
        DateTime.fromMillis(data.end),
        data.phase,
        data.failed);
}
