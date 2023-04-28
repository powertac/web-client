import {defineStore} from "pinia";
import type {User} from "@/user/domain/User";

export interface AuthStoreState {
    authenticated: boolean;
    current: User|undefined;
}

export const useAuthStore = defineStore({
    id: "auth",
    state: () => ({authenticated: false} as AuthStoreState),
    getters: {
        isAuthenticated: (state: AuthStoreState) => state.authenticated,
        findCurrentUser: (state: AuthStoreState) => state.current,
    },
    actions: {
        setAuthenticated(isAuthenticated: boolean) {
            this.authenticated = isAuthenticated;
        },
        setCurrentUser(user: User): void {
            this.current = user;
        }
    }
})
