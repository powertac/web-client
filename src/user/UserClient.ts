import {RestClient} from "@/util/RestClient";
import type {UserData} from "@/user/domain/User";

export class UserClient extends RestClient {

    public getCurrent(): Promise<UserData> {
        return this.get("/users/current");
    }

}
