import type {User} from "@/user/domain/User";
import {defineStore} from "pinia";
import {createGetter} from "@/util/StoreUtils";

export interface UserStoreState {
    users: {[id: string]: User};
}

export const useUserStore = defineStore({
    id: "users",
    state: () => ({users: {}} as UserStoreState),
    getters: {
        findById: (state: UserStoreState) => createGetter("user", state.users)
    }
})
