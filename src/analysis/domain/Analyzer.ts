import type {LogProcessor} from "@/logprocessor/domain/LogProcessor";
import type {Game} from "@/game/domain/Game";
import type {Baseline} from "@/baseline/domain/Baseline";
import type {Treatment} from "@/treatment/domain/Treatment";

export enum AnalyzerScope {
    GAME,
    GROUP,
    MULTIGROUP
}

export type Producer = Analyzer|LogProcessor;

export interface Artifact {
    producer: Producer;
    entities: Game|Baseline|Treatment|(Baseline|Treatment)[]; // depending on producer scope
}

export interface Analyzer {
    name: string;
    requirements: Producer[]; // log processor names
    scope: string;
}