import {defineStore} from "pinia";
import type {Broker} from "@/broker/domain/Broker";
import {createFindAllGetter, createFindByIdGetter} from "@/util/domain/StoreUtils";
import {api} from "@/api";
import {buildBroker} from "@/broker/domain/Broker";

export interface BrokerStoreState {
    brokers: {[id: string]: Broker}
}

export const useBrokerStore = defineStore({
    id: "brokers",
    state: () => ({brokers: {}} as BrokerStoreState),
    getters: {
        findById: (state: BrokerStoreState) => createFindByIdGetter("broker", state.brokers),
        findAll: (state: BrokerStoreState) => createFindAllGetter(state.brokers)
    },
    actions: {
        async fetchAll(): Promise<void> {
            (await api.orchestrator.brokers.getAll())
                .map((data) => buildBroker(data))
                .forEach((broker) => this.brokers[broker.id] = broker);
        }
    }
});
