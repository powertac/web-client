<script lang="ts" setup>
import {onMounted, ref} from "vue";
import type {LogProcessor} from "@/logprocessor/domain/LogProcessor";
import {api} from "@/api";
import type {LogProcessorArtifact} from "@/logprocessor/domain/LogProcessorArtifact";
import type {Game} from "@/game/domain/Game";
import GameGroupArtifactStatus from "@/logprocessor/components/GameGroupArtifactStatus.vue";
import type {Treatment} from "@/treatment/domain/Treatment";

const props = defineProps<{
    treatment: Treatment,
    artifacts: Map<Game, LogProcessorArtifact[]>
}>();
const availableProcessors = ref<LogProcessor[]>([]);
const selectedProcessors = ref<Set<string>>(new Set());

onMounted(() => api.orchestrator.processors.availableProcessors()
    .then(p => availableProcessors.value = p.sort((a,b) => a.name.localeCompare(b.name)))
    .catch(e => console.error("unable to load available log processors", e)));

function toggleAll(): void {
    if (selectedProcessors.value.size === availableProcessors.value.length) {
        selectedProcessors.value.clear();
    } else {
        availableProcessors.value.map(p => p.name).forEach(n => selectedProcessors.value.add(n));
    }
}

function getArtifactMap(processorName: string): Map<Game, LogProcessorArtifact|undefined> {
    const artifactMap = new Map();
    props.artifacts.forEach((a, g) => artifactMap.set(g, a.filter(b => b.processorName === processorName).shift()))
    return artifactMap;
}

function toggle(processorName: string): void {
    if (selectedProcessors.value.has(processorName)) {
        selectedProcessors.value.delete(processorName);
    } else {
        selectedProcessors.value.add(processorName);
    }
}

function runSelected(): void {
    if (selectedProcessors.value.size > 0) {
        api.orchestrator.processors.processGameLogs(props.treatment.games.map(g => ({
            gameId: g.id,
            processorNames: Array.from(selectedProcessors.value)
        })));
    } else {
        console.error("missing game or selected processors");
    }
}
</script>

<template>
    <div class="mt-10 text-slate-700">
        <h2 class="text-2xl font-semibold">Log processing</h2>
        <div class="border-t border-x border-slate-300 rounded-t py-2 px-4 mt-4 flex items-center">
            <icon icon="turn-down" :rotation="270" class="ml-2 text-slate-500" />
            <button class="button ml-5" v-if="selectedProcessors.size > 0" @click="runSelected">
                <icon icon="play" class="mr-1.5" />
                Run selected
            </button>
            <div class="inline-block border px-2.5 py-1.5 ml-5 rounded border-transparent italic text-slate-500" v-else>
                Select processor(s) to continue
            </div>
        </div>
        <table class="datatable bg-white border rounded-b border-slate-300">
            <thead>
            <tr>
                <th class="!text-left"><input type="checkbox" @click="toggleAll" :checked="selectedProcessors.size === availableProcessors.length" /></th>
                <th class="!text-left">Name</th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="processor in availableProcessors" :key="processor.name">
                <td class="!text-left">
                    <input type="checkbox" @click="toggle(processor.name)" :checked="selectedProcessors.has(processor.name)" />
                </td>
                <td class="!text-left">{{processor.name}}</td>
                <td><GameGroupArtifactStatus :artifacts="getArtifactMap(processor.name)" /></td>
            </tr>
            </tbody>
        </table>
    </div>
</template>