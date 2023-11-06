import {DateTime} from "luxon";
import type {LogProcessorTaskConfig} from "@/logprocessor/domain/LogProcessorTask";
import type {ExportBaselineGameFilesTaskConfig} from "@/baseline/domain/ExportBaselineGameFilesTask";
import type {ExportTreatmentGameFilesTaskConfig} from "@/treatment/domain/ExportTreatmentGameFilesTask";

export type TaskConfig =
    LogProcessorTaskConfig
    | ExportBaselineGameFilesTaskConfig
    | ExportTreatmentGameFilesTaskConfig;

export interface TaskData {
    type: string;
    id: string;
    creatorId: string;
    createdAt: number;
    start: number;
    end: number;
    priority: number;
    failed: boolean;
    config: TaskConfig
}

export const enum TaskStatus {
    QUEUED,
    RUNNING,
    COMPLETED,
    FAILED
}

export class Task<E extends TaskConfig> {

    constructor(public type: string,
                public id: string,
                public creatorId: string,
                public createdAt: DateTime,
                public start: DateTime | null,
                public end: DateTime | null,
                public priority: number,
                public failed: boolean,
                public config: E) {
    }

    static from(data: TaskData) {
        return new Task(
            data.type,
            data.id,
            data.creatorId,
            DateTime.fromMillis(data.createdAt),
            data.start !== null ? DateTime.fromMillis(data.start) : null,
            data.end !== null ? DateTime.fromMillis(data.end) : null,
            data.priority,
            data.failed,
            data.config);
    }

    get status(): TaskStatus {
        if (this.start === null) {
            return TaskStatus.QUEUED;
        } else if (this.end === null) {
            return TaskStatus.RUNNING;
        } else if (this.failed) {
            return TaskStatus.FAILED;
        } else {
            return TaskStatus.COMPLETED;
        }
    }

    get statusText(): string {
        return statusText(this.status);
    }

}

export function statusText(status: TaskStatus): string {
    switch (status) {
        case TaskStatus.QUEUED:
            return "queued";
        case TaskStatus.RUNNING:
            return "running";
        case TaskStatus.COMPLETED:
            return "completed";
        case TaskStatus.FAILED:
            return "failed";
    }
}