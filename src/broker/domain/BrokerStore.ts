import {defineStore} from "pinia";
import type {Broker} from "@/broker/domain/Broker";
import {createFindAllGetter, createFindByIdGetter} from "@/util/domain/StoreUtils";
import {api} from "@/api";
import {buildBroker} from "@/broker/domain/Broker";
import {DateTime} from "luxon";

export interface BrokerStoreState {
    lastFullUpdate: DateTime|null;
    brokers: {[id: string]: Broker};
}

export const useBrokerStore = defineStore({
    id: "brokers",
    state: () => ({lastFullUpdate: null, brokers: {}} as BrokerStoreState),
    getters: {
        isReady: (state: BrokerStoreState) => state.lastFullUpdate !== null,
        findById: (state: BrokerStoreState) => createFindByIdGetter("broker", state.brokers),
        findAll: (state: BrokerStoreState) => createFindAllGetter(state.brokers)
    },
    actions: {
        async fetchAll(): Promise<void> {
            const brokerData = await api.orchestrator.brokers.getAll();
            brokerData.map((data) => buildBroker(data))
                .forEach((broker) => this.brokers[broker.id] = broker);
            this.lastFullUpdate = DateTime.now();
        }
    }
});
