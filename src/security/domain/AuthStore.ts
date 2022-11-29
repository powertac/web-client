import {defineStore} from "pinia";

export interface AuthStoreState {
    authenticated: boolean;
}

export const useAuthStore = defineStore({
    id: "auth",
    state: () => ({authenticated: false} as AuthStoreState),
    getters: {
        isAuthenticated: (state: AuthStoreState) => state.authenticated
    },
    actions: {
        setAuthenticated(isAuthenticated: boolean) {
            this.authenticated = isAuthenticated;
        }
    }
})
