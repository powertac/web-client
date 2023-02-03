import type {ReplaceBrokerModifierConfig, ReplaceBrokerModifierConfigData} from "@/treatment/domain/ReplaceBrokerModifier";
import type {ParameterSetModifierConfig, ParameterSetModifierConfigData} from "@/treatment/domain/ParameterSetModifier";
import {buildReplaceBrokerModifierConfig} from "@/treatment/domain/ReplaceBrokerModifier";
import {buildParameterSetModifierConfig} from "@/treatment/domain/ParameterSetModifier";

export type ModifierConfig = ReplaceBrokerModifierConfig|ParameterSetModifierConfig;
export type ModifierConfigData = ReplaceBrokerModifierConfigData|ParameterSetModifierConfigData;

export enum ModifierType {
    ReplaceBroker = "replace-broker",
    ParameterSet = "parameter-set"
}

export class Modifier {

    constructor(public readonly id: string,
                public readonly name: string,
                public readonly type: ModifierType,
                public readonly config: ModifierConfig) {
    }

}

export interface NewModifierData {
    name: string;
    type: string;
    config: ModifierConfigData;
}

export interface ModifierData extends NewModifierData {
    id: string;
}

export function buildModifier(data: ModifierData): Modifier {
    let type: ModifierType;
    let config: ModifierConfig;
    switch (data.type) {
        case ModifierType.ReplaceBroker:
            type = ModifierType.ReplaceBroker;
            config = buildReplaceBrokerModifierConfig(data.config as ReplaceBrokerModifierConfigData);
            break;
        case ModifierType.ParameterSet:
            type = ModifierType.ParameterSet;
            config = buildParameterSetModifierConfig(data.config as ParameterSetModifierConfigData);
            break;
        default:
            throw new Error(data.type + "is not a valid modifier type");
    }
    return new Modifier(
        data.id,
        data.name,
        type,
        config);
}
