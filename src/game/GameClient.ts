import {RestClient} from "@/api/RestClient";
import type {GameData} from "@/game/domain/Game";

export class GameClient extends RestClient {

    public getById(id: string): Promise<GameData> {
        return this.get("/games/" + id);
    }

}
