import type {Game} from "@/game/domain/Game";
import type {GameConfig, GameConfigData} from "@/game/domain/GameConfig";
import {GameGroup} from "@/game/domain/GameGroup";
import type moment from "moment";

export class Baseline extends GameGroup {

    constructor(
        public id: string,
        public name: string,
        public config: GameConfig,
        public games: Game[],
        public createdAt: moment.Moment) {
        super();
    }

}

export interface BaselineData {
    id: string;
    name: string;
    config: GameConfigData;
    games: string[];
    createdAt: number;
}
