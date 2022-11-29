import type {Broker} from "@/broker/domain/Broker";
import {useBrokerStore} from "@/broker/domain/BrokerStore";

export class ReplaceBrokerModifierConfig {

    constructor(public readonly originalBroker: Broker,
                public readonly replacementBroker: Broker) {}

}

export interface ReplaceBrokerModifierConfigData {
    originalBrokerId: string;
    replacementBrokerId: string;
}

const brokerStore = useBrokerStore();

export function buildReplaceBrokerModifierConfig(data: ReplaceBrokerModifierConfigData): ReplaceBrokerModifierConfig {
    return new ReplaceBrokerModifierConfig(
        brokerStore.findById(data.originalBrokerId),
        brokerStore.findById(data.replacementBrokerId));
}
