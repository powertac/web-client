import {RestClient} from "@/api/RestClient";
import type {GameData, NewGameData} from "@/game/domain/Game";

export class GameClient extends RestClient {

    public getById(id: string): Promise<GameData> {
        return this.get("/games/" + id);
    }

    public create(newGame: NewGameData): Promise<GameData> {
        return this.post("/games/", newGame);
    }

}
