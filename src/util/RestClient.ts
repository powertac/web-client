import type {AxiosError, AxiosInstance, AxiosResponse} from "axios";
import {auth} from "@/security/AuthProvider";

export abstract class RestClient {

    constructor(protected readonly baseUrl: string) {}

    get client(): AxiosInstance {
        return auth.client(this.baseUrl);
    }

    protected get<R>(path: string): Promise<R> {
        return new Promise<R>((resolve: (value: R) => void, reject: (error: AxiosError) => void) => {
            this.rawGet<R>(path)
                .then((response: AxiosResponse<R>) => resolve(response.data))
                .catch((error: AxiosError) => {
                    this.processError(error);
                    reject(error);
                });
        });
    }

    protected post<D,R>(path: string, data: D): Promise<R> {
        return new Promise<R>((resolve: (value: R) => void, reject: (error: AxiosError) => void) => {
            this.rawPost<D,R>(path, data)
                .then((response: AxiosResponse<R>) => resolve(response.data))
                .catch((error: AxiosError) => {
                    this.processError(error);
                    reject(error);
                });
        });
    }

    protected processError(error: AxiosError): void {
        if (error.response !== undefined && error.response.status === 401) {
            auth.revoke(this.baseUrl);
        }
    }

    protected rawGet<R>(path: string): Promise<AxiosResponse<R>> {
        return this.client.get(this.getUrl(path));
    }

    protected rawPost<D, R>(path: string, data: D): Promise<AxiosResponse<R>> {
        return this.client.post(this.getUrl(path), data);
    }

    protected rawDelete(path: string): Promise<void> {
        return this.client.delete(this.getUrl(path));
    }

    protected getUrl(path: string): string {
        return new URL(path, this.baseUrl).toString();
    }

}
