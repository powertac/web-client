import {defineStore} from "pinia";
import {api} from "@/api";
import type {RegistrationToken} from "@/user/domain/RegistrationToken";
import {buildRegistrationToken} from "@/user/domain/RegistrationToken";
import {useUserStore} from "@/user/domain/UserStore";
import {DateTime} from "luxon";

export interface RegistrationStoreState {
    lastFullUpdate: DateTime|null;
    tokens: RegistrationToken[];
}

export const useRegistrationStore = defineStore({
    id: "registrations",
    state: () => ({lastFullUpdate: null, tokens: []} as RegistrationStoreState),
    getters: {
        isReady: (state: RegistrationStoreState) => state.lastFullUpdate !== null,
        findAll: (state: RegistrationStoreState) => () => Array.of(...state.tokens).filter(t => t !== undefined),
        findById: (state: RegistrationStoreState) => (id: number) => state.tokens[id]
    },
    actions: {
        async fetchAll(): Promise<void> {
            await useUserStore().fetchAll();
            const data = await api.orchestrator.registrations.getAll();
            data.forEach(r => this.tokens[r.id] = buildRegistrationToken(r));
            this.lastFullUpdate = DateTime.now();
        }
    }
});
