import type {User} from "@/user/domain/User";
import {defineStore} from "pinia";
import {createFindByIdGetter} from "@/store/StoreUtils";

export interface UserStoreState {
    users: {[id: string]: User};
}

export const useUserStore = defineStore({
    id: "users",
    state: () => ({users: {}} as UserStoreState),
    getters: {
        findById: (state: UserStoreState) => createFindByIdGetter("user", state.users)
    }
})
