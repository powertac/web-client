<script lang="ts" setup>
import {computed, onMounted, ref} from "vue";
import {api} from "@/api";
import type {LogProcessorArtifact} from "@/logprocessor/domain/LogProcessorArtifact";
import type {Baseline} from "@/baseline/domain/Baseline";
import type {Game} from "@/game/domain/Game";
import type {Analyzer} from "@/analysis/domain/Analyzer";
import type {AnalyzerArtifact} from "@/analysis/domain/AnalyzerArtifact";
import config from "@/config";

const props = defineProps<{
    baseline: Baseline,
    artifacts: Map<Game, LogProcessorArtifact[]>
}>();
const availableAnalyzers = ref<Analyzer[]>([]);
const selectedAnalyzers = ref<Set<string>>(new Set());
const artifact = ref<AnalyzerArtifact|undefined>(undefined);
const artifactLoaded = ref(false);
const imagePath = computed(() => artifact.value !== undefined ? config.services.orchestrator.url + '/files/download/' + artifact.value.fileToken : "")

onMounted(() => api.orchestrator.analysis.available()
    .then(p => availableAnalyzers.value = p.sort((a,b) => a.name.localeCompare(b.name)))
    .catch(e => console.error("unable to load available analyzers", e)));
onMounted(() => api.orchestrator.analysis.getBaselineArtifact(props.baseline.id, "wholesale-prices-boxplot")
    .then(a => { artifact.value = a; artifactLoaded.value = true })
    .catch(e => { console.error("unable to load artifact", e); artifactLoaded.value = true }));

function toggleAll(): void {
    if (selectedAnalyzers.value.size === availableAnalyzers.value.length) {
        selectedAnalyzers.value.clear();
    } else {
        availableAnalyzers.value.map(p => p.name).forEach(n => selectedAnalyzers.value.add(n));
    }
}

function getArtifactMap(processorName: string): Map<Game, LogProcessorArtifact|undefined> {
    const artifactMap = new Map();
    props.artifacts.forEach((a, g) => artifactMap.set(g, a.filter(b => b.processorName === processorName).shift()))
    return artifactMap;
}

function getArtifacts(processorName: string): number {
    return Array.of(...props.artifacts.values())
        .map(set => set.filter(p => p.processorName === processorName).shift())
        .filter(p => p !== undefined)
        .length;
}

function preconditionsMet(analyzerName: string): boolean {
    const analyzer = availableAnalyzers.value.filter(a => a.name === analyzerName).pop();
    if (analyzer !== undefined) {
        return analyzer.requirements.map(r => getArtifacts(r.name))
            .filter(a => a === props.baseline.size)
            .length === analyzer.requirements.length;
    } else {
        console.error("analyzer not found");
        return false;
    }
}

function toggle(processorName: string): void {
    if (selectedAnalyzers.value.has(processorName)) {
        selectedAnalyzers.value.delete(processorName);
    } else {
        selectedAnalyzers.value.add(processorName);
    }
}

function runAnalyzer(analyzerName: string): void {
    console.log(analyzerName);
    api.orchestrator.analysis.runBaselineAnalyzer(props.baseline.id, analyzerName)
        .then(r => console.log(r))
        .catch(e => console.error("unable to create analyzer task", e));
}
</script>

<template>
    <div class="mt-10 text-slate-700" v-if="artifactLoaded">
        <h2 class="text-2xl font-semibold">Analyzers</h2>
        <table class="datatable bg-white border rounded border-slate-300 mt-4">
            <thead>
            <tr>
                <th class="!text-left">Name</th>
                <th>Status</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="analyzer in availableAnalyzers" :key="analyzer.name">
                <td class="!text-left">{{analyzer.name}}</td>
                <td class="uppercase text-sm">{{preconditionsMet(analyzer.name) ? "READY" : "UNMET REQUIREMENTS"}}</td>
                <td>
                    <button class="button button-sm" @click="runAnalyzer(analyzer.name)">
                        <icon icon="play" class="mr-1" />
                        Run
                    </button>
                </td>
            </tr>
            </tbody>
        </table>
        <div v-if="artifact !== undefined" class="mt-16">
            <h2 class="text-center text-2xl">wholesale-prices-boxplot</h2>
            <img :src="imagePath" class="m-auto" />
        </div>
    </div>
</template>