import type {GameConfig, GameConfigData} from "@/game/domain/GameConfig";
import type {Moment} from "moment";
import {GameGroup} from "@/game/domain/GameGroup";

export class Baseline extends GameGroup {

    constructor(public id: string,
                public name: string,
                public config: GameConfig,
                public gameIds: string[],
                public createdAt: Moment) {
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
