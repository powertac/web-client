import {RestClient} from "@/util/RestClient";
import type {SimulationServerVersion} from "@/simulation/domain/SimulationServerVersion";

export class SimulationServerClient extends RestClient {

    public getAllVersions(): Promise<SimulationServerVersion[]> {
        return this.get("/simulation-servers/versions");
    }

    public addNewVersion(version: {name: string, imageTag: string}): Promise<SimulationServerVersion> {
        return this.post("/simulation-servers/versions", version);
    }

}