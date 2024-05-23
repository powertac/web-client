import type {User} from "@/user/domain/User";
import {defineStore} from "pinia";
import {createFindAllGetter, createFindByIdGetter} from "@/util/domain/StoreUtils";
import {api} from "@/api";
import {buildUser} from "@/user/domain/User";
import {DateTime} from "luxon";

export interface UserStoreState {
    lastFullUpdate: DateTime|null;
    users: {[id: string]: User};
}

export const useUserStore = defineStore({
    id: "users",
    state: () => ({lastFullUpdate: null, users: {}} as UserStoreState),
    getters: {
        isReady: (state: UserStoreState) => state.lastFullUpdate !== null,
        findById: (state: UserStoreState) => createFindByIdGetter("user", state.users),
        findAll: (state: UserStoreState) => createFindAllGetter(state.users)
    },
    actions: {
        async fetchAll(): Promise<void> {
            const users = await api.orchestrator.users.getAll();
            users.forEach(u => this.users[u.id] = buildUser(u));
            this.lastFullUpdate = DateTime.now();
        }
    }
});
