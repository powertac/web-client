export class ParameterSetModifierConfig {
    constructor(public readonly parameters: {[key: string]: string}) {}
}

export interface ParameterSetModifierConfigData {
    parameters: {[key: string]: string}
}

export function buildParameterSetModifierConfig(data: ParameterSetModifierConfigData): ParameterSetModifierConfig {
    return new ParameterSetModifierConfig(data.parameters);
}
