import type {LogProcessorTaskConfig} from "@/logprocessor/domain/LogProcessorTask";
import type {Task} from "@/task/domain/Task";

export interface LogProcessorArtifact {
    processorName: string;
    filePath: string|null;
    exists: boolean;
    tasks: Task<LogProcessorTaskConfig>[];
}