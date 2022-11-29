import type {Game} from "@/game/domain/Game";
import type {Baseline} from "@/baseline/domain/Baseline";
import type {Modifier, ModifierData} from "@/treatment/domain/Modifier";
import {GameGroup} from "@/game/domain/GameGroup";
import {useBaselineStore} from "@/baseline/domain/BaselineStore";
import {buildModifier} from "@/treatment/domain/Modifier";

export class Treatment extends GameGroup {

    constructor(public readonly id: string,
                public readonly name: string,
                public readonly baseline: Baseline,
                public readonly modifier: Modifier,
                public readonly games: Game[]) {
        super();
    }

}

export interface TreatmentData {
    id: string;
    name: string;
    baselineId: string;
    modifier: ModifierData;
    games: string[];
}

const baselineStore = useBaselineStore();

export function buildTreatment(data: TreatmentData): Treatment {
    return new Treatment(
        data.id,
        data.name,
        baselineStore.findById(data.baselineId),
        buildModifier(data.modifier),
        []); // FIXME : add game resolving
}
