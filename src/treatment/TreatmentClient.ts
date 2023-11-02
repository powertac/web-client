import {RestClient} from "@/util/RestClient";
import type {NewTreatmentDTO, TreatmentData} from "@/treatment/domain/Treatment";
import type {ExportGameFilesConfig} from "@/game/domain/ExportGameFilesConfig";
import type {ExportTreatmentGameFilesTaskData} from "@/treatment/domain/ExportTreatmentGameFilesTask";

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

    public exportFiles(treatmentId: string, config: ExportGameFilesConfig): Promise<ExportTreatmentGameFilesTaskData> {
        return this.post("/v2/treatments/" + treatmentId + "/exports", config);
    }

    public getExportTasks(treatmentId: string): Promise<ExportTreatmentGameFilesTaskData[]> {
        return this.get("/v2/treatments/" + treatmentId + "/exports");
    }

}
