import {RestClient} from "@/util/RestClient";
import type {BaselineData, NewBaselineData} from "@/baseline/domain/Baseline";
import type {ExportGameFilesConfig} from "@/game/domain/ExportGameFilesConfig";
import type {ExportBaselineGameFilesTaskConfig} from "@/baseline/domain/ExportBaselineGameFilesTask";
import type {TaskData} from "@/task/domain/Task";

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

    public getManifest(baselineId: string): Promise<string> {
        return this.get("/v2/baselines/" + baselineId + "/manifest");
    }

    public createManifest(baselineId: string): Promise<void> {
        return this.post("/v2/baselines/" + baselineId + "/manifest", undefined);
    }

    public exportFiles(baselineId: string, config: ExportGameFilesConfig): Promise<ExportBaselineGameFilesTaskConfig> {
        return this.post("/baselines/" + baselineId + "/exports", config);
    }

    public getExportTasks(baselineId: string): Promise<TaskData[]> {
        return this.get("/baselines/" + baselineId + "/exports");
    }

}
