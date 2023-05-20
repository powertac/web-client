import {RestClient} from "@/util/RestClient";
import type {GameData, NewGameData} from "@/game/domain/Game";
import type FileNode from "@/file/domain/FileNode";

export class GameClient extends RestClient {

    public create(newGame: NewGameData): Promise<GameData> {
        return this.post("/v2/games/", newGame);
    }

    public getById(id: string): Promise<GameData> {
        return this.get("/v2/games/" + id);
    }

    public getAll(): Promise<GameData[]> {
        return this.get("/v2/games/");
    }

    public getRunning(): Promise<GameData[]> {
        return this.get("/v2/games/running");
    }

    public getRootNode(gameId: string): Promise<FileNode> {
        return this.get("/v2/games/" + gameId + "/file-root");
    }

    public getDirectoryPath(gameId: string): Promise<string> {
        return this.get("/v2/games/" + gameId + "/paths/dir");
    }

}
