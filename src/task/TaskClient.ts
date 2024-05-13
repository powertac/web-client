import {RestClient} from "@/util/RestClient";
import type {TaskData} from "@/task/domain/Task";
import type {DateTime} from "luxon";

export class TaskClient extends RestClient {

    public getAll(): Promise<TaskData[]> {
        return this.get("/v2/tasks/");
    }

    public getUpdated(lastUpdate: DateTime): Promise<TaskData[]> {
        return this.get("/v2/tasks/since/" + lastUpdate.toISO());
    }

}