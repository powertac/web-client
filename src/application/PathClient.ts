import {RestClient} from "@/util/RestClient";

export class PathClient extends RestClient {

    public baselineManifest(baselineId: string): Promise<string> {
        return this.get("/paths/baselines/" + baselineId + "/manifest");
    }

}
