import {RestClient} from "@/util/RestClient";
import type {LogProcessor} from "@/logprocessor/domain/LogProcessor";
import type {LogProcessorTaskConfig} from "@/logprocessor/domain/LogProcessorTask";
import type {Task, TaskData} from "@/task/domain/Task";
import type {LogProcessorArtifact} from "@/logprocessor/domain/LogProcessorArtifact";

export class LogProcessorClient extends RestClient {

    public availableProcessors(): Promise<LogProcessor[]> {
        return this.get("/v2/log-processors/available");
    }

    public processGameLog(config: LogProcessorTaskConfig): Promise<Task<LogProcessorTaskConfig>> {
        return this.post("/v2/log-processors/", config);
    }

    // mind the plural
    public processGameLogs(configs: LogProcessorTaskConfig[]): Promise<Task<LogProcessorTaskConfig>[]> {
        return this.post("/v2/log-processors/batch", configs);
    }

    public getGameTasks(gameId: string): Promise<TaskData[]> {
        return this.get("/v2/log-processors/game/" + gameId);
    }

    public getGameArtifacts(gameId: string): Promise<LogProcessorArtifact[]> {
        return this.get("/v2/log-processors/game/" + gameId + "/artifacts");
    }

    public getBaselineArtifacts(baselineId: string): Promise<{[gameId: string]: LogProcessorArtifact[]}> {
        return this.get("/v2/log-processors/baseline/" + baselineId + "/artifacts");
    }

    public getTreatmentArtifacts(treatmentId: string): Promise<{[gameId: string]: LogProcessorArtifact[]}> {
        return this.get("/v2/log-processors/treatments/" + treatmentId + "/artifacts");
    }

}