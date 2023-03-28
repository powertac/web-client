import type {Modifier, ModifierData, NewModifierData} from "@/treatment/domain/Modifier";
import {GameGroup} from "@/game/domain/GameGroup";
import type {Baseline} from "@/baseline/domain/Baseline";
import {useBaselineStore} from "@/baseline/domain/BaselineStore";
import type {DateTime} from "luxon";
import type {GameConfigData} from "@/game/domain/GameConfig";
import type {GameConfig} from "@/game/domain/GameConfig";

export class Treatment extends GameGroup {

    constructor(public readonly id: string,
                public readonly name: string,
                public readonly baselineId: string,
                public readonly modifier: Modifier,
                public readonly gameIds: string[],
                public readonly config: GameConfig,
                public readonly createdAt: DateTime) {
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
    config: GameConfigData;
    createdAt: number;
}

export interface NewTreatmentDTO {
    name: string;
    baselineId: string;
    modifier: NewModifierData;
}
