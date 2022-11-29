import type {Game} from "@/game/domain/Game";
import moment from "moment";

export class GameRun {

    constructor(public readonly id: string,
                public readonly game: Game,
                public readonly start: moment.Moment,
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
        data.gameId, // FIXME : load from store; creation order counts!
        moment(data.start),
        moment(data.end),
        data.phase,
        data.failed);
}
