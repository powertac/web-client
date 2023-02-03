import type {Modifier, ModifierData, NewModifierData} from "@/treatment/domain/Modifier";
import {buildModifier} from "@/treatment/domain/Modifier";
import {GameGroup} from "@/game/domain/GameGroup";
import type {Baseline} from "@/baseline/domain/Baseline";
import {useBaselineStore} from "@/baseline/domain/BaselineStore";

export class Treatment extends GameGroup {

    constructor(public readonly id: string,
                public readonly name: string,
                public readonly baselineId: string,
                public readonly modifier: Modifier,
                public readonly gameIds: string[]) {
        super();
    }

    public get baseline(): Baseline {
        const baselineStore = useBaselineStore();
        return baselineStore.findById(this.baselineId);
    }

}

export interface TreatmentData {
    id: string;
    name: string;
    baselineId: string;
    modifier: ModifierData;
    gameIds: string[];
}

export interface NewTreatmentData {
    name: string;
    baselineId: string;
    modifier: NewModifierData;
}

export function buildTreatment(data: TreatmentData): Treatment {
    return new Treatment(
        data.id,
        data.name,
        data.baselineId,
        buildModifier(data.modifier),
        data.gameIds);
}
