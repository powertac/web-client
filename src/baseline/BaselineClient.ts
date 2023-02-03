import {RestClient} from "@/util/RestClient";
import type {BaselineData, NewBaselineData} from "@/baseline/domain/Baseline";

export class BaselineClient extends RestClient {

    public getById(id: string): Promise<BaselineData> {
        return this.get("/v2/baselines/" + id);
    }

    public getAll(): Promise<BaselineData[]> {
        return this.get("/v2/baselines/");
    }

    public create(newBaseline: NewBaselineData): Promise<BaselineData> {
        return this.post("/v2/baselines/", newBaseline);
    }

}
