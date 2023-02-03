import type {AxiosError} from "axios";
import type {Credentials} from "@/security/domain/Credentials";
import {RestClient} from '@/util/RestClient';
import {auth} from "@/security/AuthProvider";

export class AuthClient extends RestClient {

    public login(credentials: Credentials): Promise<void> {
        return new Promise<void>((resolve: () => void, reject: (error: AxiosError) => void) => {
            this.rawPost<Credentials, string>("/auth/", credentials)
                .then((response) => {
                    auth.authenticate(this.baseUrl, response.data);
                    resolve();
                })
                .catch((error: AxiosError) => {
                    this.processError(error);
                    reject(error);
                });
        });
    }

    public verify(): Promise<boolean> {
        return this.get("/auth/");
    }

    public logout(): Promise<void> {
        return new Promise<void>((resolve: () => void, reject: (error: AxiosError | void) => void) => {
            this.rawDelete("/auth/")
                .then(() => {
                    auth.revoke(this.baseUrl);
                    resolve();
                })
                .catch((error: AxiosError) => {
                    auth.revoke(this.baseUrl);
                    reject(error);
                });
        });
    }

}
