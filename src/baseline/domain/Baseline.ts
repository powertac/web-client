import type {GameConfig, GameConfigData} from "@/game/domain/GameConfig";
import type {DateTime} from "luxon";
import {GameGroup} from "@/game/domain/GameGroup";
import type {NewGameData} from "@/game/domain/Game";

export class Baseline extends GameGroup {

    constructor(public id: string,
                public name: string,
                public config: GameConfig,
                public gameIds: string[],
                public createdAt: DateTime) {
        super();
    }

}

export interface BaselineData {
    id: string;
    name: string;
    config: GameConfigData;
    gameIds: string[];
    createdAt: number;
}

export interface NewBaselineData extends NewGameData {
    size: number;
}
