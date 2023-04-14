import {RestClient} from "@/util/RestClient";

export class GameRunClient extends RestClient {

    public storageBytes(runId: string): Promise<number> {
        return this.get("/storage/runs/" + runId);
    }

    public removeFiles(runId: string): Promise<void> {
        return this.delete("/files/runs/" + runId);
    }

}
