import {RestClient} from "@/util/RestClient";
import type {TaskData} from "@/task/domain/Task";

export class TaskClient extends RestClient {

    public getAll(): Promise<TaskData[]> {
        return this.get("/v2/tasks/");
    }

}