import {RestClient} from "@/api/RestClient";
import type {GameData, NewGameData} from "@/game/domain/Game";

export class GameClient extends RestClient {

    public getById(id: string): Promise<GameData> {
        return this.get("/games/" + id);
    }

    public create(newGame: NewGameData): Promise<GameData> {
        return this.post("/v2/games/", newGame);
    }

    public findAll(): Promise<GameData[]> {
        return this.get("/v2/games/");
    }

}
