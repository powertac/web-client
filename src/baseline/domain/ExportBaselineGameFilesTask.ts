import {Task, type TaskData} from "@/task/domain/Task";
import {DateTime} from "luxon";

// FIXME : improve inheritance scheme (just make it easier)
export class ExportBaselineGameFilesTask extends Task {

    constructor(public type: string,
                public id: string,
                public creatorId: string,
                public createdAt: DateTime,
                public start: DateTime|null,
                public end: DateTime|null,
                public priority: number,
                public failed: boolean,
                public target: string,
                public baseUri: string) {
        super(type, id, creatorId, createdAt, start, end, priority, failed);
    }

}

export interface ExportBaselineGameFilesTaskData extends TaskData {
    target: string;
    baseUri: string;
}

export function buildBaselineExportTask(data: ExportBaselineGameFilesTaskData): ExportBaselineGameFilesTask {
    return new ExportBaselineGameFilesTask(
        data.type,
        data.id,
        data.creatorId,
        DateTime.fromMillis(data.createdAt),
        data.start !== null ? DateTime.fromMillis(data.start) : null,
        data.end !== null ? DateTime.fromMillis(data.end) : null,
        data.priority,
        data.failed,
        data.target,
        data.baseUri);
}

