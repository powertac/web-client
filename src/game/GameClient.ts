import {RestClient} from "@/util/RestClient";
import type {GameData, NewGameData} from "@/game/domain/Game";

export class GameClient extends RestClient {

    public getById(id: string): Promise<GameData> {
        return this.get("/v2/games/" + id);
    }

    public create(newGame: NewGameData): Promise<GameData> {
        return this.post("/v2/games/", newGame);
    }

    public getAll(): Promise<GameData[]> {
        return this.get("/v2/games/");
    }

}
