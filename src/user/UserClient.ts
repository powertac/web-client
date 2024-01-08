import {RestClient} from "@/util/RestClient";
import type {CreateUserData, UserData} from "@/user/domain/User";

export class UserClient extends RestClient {

    public getCurrent(): Promise<UserData> {
        return this.get("/users/current");
    }

    public getAll(): Promise<UserData[]> {
        return this.get("/users/");
    }

    public create(userData: CreateUserData): Promise<void> {
        return this.post("/users/", userData);
    }

}
