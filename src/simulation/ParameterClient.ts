import {RestClient} from "@/util/RestClient";

export class ParameterClient extends RestClient {

    public getSupported(): Promise<string[]> {
        return this.get("/game-parameters/");
    }

}
