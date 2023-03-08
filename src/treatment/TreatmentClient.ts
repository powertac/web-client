import {RestClient} from "@/util/RestClient";
import type {NewTreatmentDTO, TreatmentData} from "@/treatment/domain/Treatment";

export class TreatmentClient extends RestClient {

    public getById(id: string): Promise<TreatmentData> {
        return this.get("/v2/treatments/" + id + "/");
    }

    public getAll(): Promise<TreatmentData[]> {
        return this.get("/v2/treatments/");
    }

    public create(newTreatment: NewTreatmentDTO): Promise<TreatmentData> {
        return this.post("/v2/treatments/", newTreatment);
    }

}
