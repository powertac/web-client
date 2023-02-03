import {RestClient} from "@/util/RestClient";
import type {NewTreatmentData, TreatmentData} from "@/treatment/domain/Treatment";

export class TreatmentClient extends RestClient {

    public getAll(): Promise<TreatmentData[]> {
        return this.get("/v2/treatments/");
    }

    public create(newTreatment: NewTreatmentData): Promise<TreatmentData> {
        return this.post("/v2/treatments/", newTreatment);
    }

}
