import {RestClient} from "@/api/RestClient";
import type {BaselineData} from "@/baseline/domain/Baseline";

export class BaselineClient extends RestClient {

    public getById(id: string): Promise<BaselineData> {
        return this.get("/baselines/" + id);
    }

}
