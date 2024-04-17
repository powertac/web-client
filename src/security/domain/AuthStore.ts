import {defineStore} from "pinia";
import type {User} from "@/user/domain/User";
import {api} from "@/api";
import type {AuthState} from "@/security/domain/AuthState";

export interface AuthStoreState {
    authState: AuthState|undefined;
    current: User|undefined;
}

export const useAuthStore = defineStore({
    id: "auth",
    state: () => ({authState: false} as AuthStoreState),
    getters: {
        isAuthenticated: (state: AuthStoreState): boolean => state.authState !== undefined ? state.authState.isAuthenticated : false,
        findAuthState: (state: AuthStoreState): AuthState|undefined => state.authState,
        findCurrentUser: (state: AuthStoreState): User|undefined => state.current,
    },
    actions: {
        async loadAuthState(): Promise<void> {
            return new Promise((resolve, reject) =>
                api.orchestrator.auth.getAuthState()
                    .then((authState) => {
                        this.authState = authState;
                        resolve();
                    })
                    .catch(e => reject(e)));
        },
        setAuthenticated(isAuthenticated: boolean) {
            this.authenticated = isAuthenticated;
        },
        setCurrentUser(user: User): void {
            this.current = user;
        }
    }
})
