import {defineStore} from "pinia";
import type {Broker} from "@/broker/domain/Broker";
import {EntityNotFoundError} from "@/util/EntityNotFoundError";
import {createGetter} from "@/util/StoreUtils";

export interface BrokerStoreState {
    brokers: {[id: string]: Broker}
}

export const useBrokerStore = defineStore({
    id: "brokers",
    state: () => ({brokers: {}} as BrokerStoreState),
    getters: {
        findById: (state: BrokerStoreState) => createGetter("broker", state.brokers)
    }
});
