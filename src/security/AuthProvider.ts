import axios, {type AxiosInstance, type CreateAxiosDefaults} from 'axios';
import {tokenStorage} from "@/security/TokenStorage";
import {useAuthStore} from "@/security/domain/AuthStore";

class AuthProvider {

    private readonly clients: { [baseUrl: string]: AxiosInstance };

    constructor() {
        this.clients = {}
    }

    public client(baseUrl: string): AxiosInstance {
        if (undefined === this.clients[baseUrl]) {
            const storedToken = tokenStorage.loadToken(baseUrl);
            this.clients[baseUrl] = AuthProvider.createClient(baseUrl, storedToken);
        }
        return this.clients[baseUrl];
    }

    public authenticate(baseUrl: string, token: string) {
        tokenStorage.saveToken(baseUrl, token);
        this.clients[baseUrl] = AuthProvider.createClient(baseUrl, token);
        useAuthStore().setAuthenticated(true); // FIXME : granular auth state
    }

    public revoke(baseUrl: string): void {
        tokenStorage.clearToken(baseUrl);
        this.clients[baseUrl] = AuthProvider.createClient(baseUrl, null);
        useAuthStore().setAuthenticated(false); // FIXME : granular auth state
    }

    private static createClient(baseUrl: string, token: string | null): AxiosInstance {
        const clientConfig: CreateAxiosDefaults = {
            baseURL: baseUrl
        };
        if (null !== token) {
            clientConfig.headers = {Authorization: token};
        }
        return axios.create(clientConfig);
    }

}

export const auth = new AuthProvider();
