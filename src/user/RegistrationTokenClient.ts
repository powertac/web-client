import {RestClient} from "@/util/RestClient";
import type {RegistrationTokenData} from "@/user/domain/RegistrationToken";

export class RegistrationTokenClient extends RestClient {

    public getAll(): Promise<RegistrationTokenData[]> {
        return this.get("/registrations/");
    }

    public create(): Promise<RegistrationTokenData> {
        return this.post("/registrations/", {});
    }

    public verify(token: string): Promise<void> {
        return this.get("/registrations/" + token);
    }

}
