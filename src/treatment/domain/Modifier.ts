export interface ReplaceBrokerModifierConfig {
    brokerMapping: {[originalId: string]: string} // mapping original broker id to replacement broker id
}

export interface ParameterSetModifierConfig {
    parameters: {[originalId: string]: string} // mapping original broker id to replacement broker id
}

export type ModifierConfig = ReplaceBrokerModifierConfig|ParameterSetModifierConfig;
export type ModifierConfigData = ReplaceBrokerModifierConfig|ParameterSetModifierConfig;

export enum ModifierType {
    ReplaceBroker = "REPLACE_BROKER",
    ParameterSet = "PARAMETER_SET"
}

export class Modifier {

    constructor(public readonly id: string,
                public readonly type: ModifierType,
                public readonly config: ModifierConfig) {
    }

}

export interface NewModifierData {
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
            config = data.config;
            break;
        case ModifierType.ParameterSet:
            type = ModifierType.ParameterSet;
            config = data.config;
            break;
        default:
            throw new Error(data.type + "is not a valid modifier type");
    }
    return new Modifier(data.id, type, config);
}
