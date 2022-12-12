import moment, {type Moment} from "moment";

export class GameRun {

    constructor(public readonly id: string,
                public readonly start: Moment,
                public readonly end: moment.Moment,
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
        moment(data.start),
        moment(data.end),
        data.phase,
        data.failed);
}
