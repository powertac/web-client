<script lang="ts" setup>
import {useGameStore} from "@/game/domain/GameStore";
import {useRouter} from "vue-router";
import {Game} from "@/game/domain/Game";
import {onMounted, ref, watch} from "vue";
import GamePageHeader from "@/game/components/GamePageHeader.vue";
import type {LogProcessor} from "@/logprocessor/domain/LogProcessor";
import {api} from "@/api";
import {statusText, Task, TaskStatus} from "@/task/domain/Task";
import type {LogProcessorTaskConfig} from "@/logprocessor/domain/LogProcessorTask";
import type {LogProcessorArtifact} from "@/logprocessor/domain/LogProcessorArtifact";
import {filename} from "@/util/Path";
import {useDownloadTokenStore} from "@/file/domain/DownloadTokenStore";
import config from "@/config";

const gameStore = useGameStore();
const downloadTokenStore = useDownloadTokenStore();
const gameId = useRouter().currentRoute.value.params.id as string;
const ready = ref(false);
const game = ref<Game>();
const availableProcessors = ref<LogProcessor[]>([]);
const selectedProcessors = ref<Set<string>>(new Set());
const tasks = ref<Task<LogProcessorTaskConfig>[]>([]);
const artifacts = ref<LogProcessorArtifact[]>([]);

onMounted(() => gameStore.fetchOnceById(gameId)
    .then(() => game.value = gameStore.findById(gameId))
    .catch((error) => console.error(error)));
onMounted(() => api.orchestrator.processors.availableProcessors()
    .then(p => availableProcessors.value = p.sort((a,b) => a.name.localeCompare(b.name)))
    .catch(e => console.error("unable to load available log processors", e)));
onMounted(() => api.orchestrator.processors.getGameTasks(gameId)
    .then(t => t.map(d => Task.from(d)).forEach(l => tasks.value.push(l as Task<LogProcessorTaskConfig>)))
    .catch(e => console.error("unable to load log processor tasks for game", e)));
onMounted(() => api.orchestrator.processors.getGameArtifacts(gameId)
    .then(a => {
        artifacts.value = a
        downloadTokenStore.fetchMany(
            a.map(a => "/games/" + gameId + "/artifacts/" + filename(a.filePath)))
            .then(() => ready.value = true)
            .catch(e => console.error(e))
    })
    .catch(e => console.error("unable to load log processor artifacts for game", e)));


function toggleAll(): void {
    if (selectedProcessors.value.size === availableProcessors.value.length) {
        selectedProcessors.value.clear();
    } else {
        availableProcessors.value.map(p => p.name).forEach(n => selectedProcessors.value.add(n));
    }
}

function getArtifact(processorName: string): LogProcessorArtifact|undefined {
    return artifacts.value
        .filter(a => a.processorName === processorName)
        .shift();
}

function getFileUrl(processorName: string): string {
    const artifact = getArtifact(processorName);
    return artifact !== undefined
        ? "/games/" + gameId + "/files/artifacts/" + filename(artifact.filePath)
        : "";
}

function getDownloadUrl(processorName: string): string|undefined {
    const artifact = getArtifact(processorName);
    return artifact !== undefined
        ? config.services.orchestrator.url
            + "/files/download/"
            + downloadTokenStore.findByPath("/games/" + gameId + "/artifacts/" + filename(artifact.filePath))
        : "";
}

function getTaskStatus(processorName: string): TaskStatus|undefined {
    return  tasks.value.filter(t => t.config.processorNames.includes(processorName))
        .map(t => t.status)
        .sort((a,b) => a - b)
        .shift();
}

function toggle(processorName: string): void {
    if (selectedProcessors.value.has(processorName)) {
        selectedProcessors.value.delete(processorName);
    } else {
        selectedProcessors.value.add(processorName);
    }
}

function runSelected(): void {
    if (game.value !== undefined && selectedProcessors.value.size > 0) {
        api.orchestrator.processors.processGameLog({
            gameId: game.value?.id,
            processorNames: Array.from(selectedProcessors.value)
        });
    } else {
        console.error("missing game or selected processors");
    }
}
</script>


<template>
    <div v-if="game !== undefined && ready">
        <GamePageHeader :game="game" />
        <div class="max-w-screen-md mx-auto">
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
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="processor in availableProcessors" :key="processor.name">
                        <td class="!text-left">
                            <input type="checkbox" @click="toggle(processor.name)" :checked="selectedProcessors.has(processor.name)" />
                        </td>
                        <td class="!text-left">{{processor.name}}</td>
                        <td class="uppercase text-xs">{{ getTaskStatus(processor.name) !== undefined ? statusText(getTaskStatus(processor.name)) : '-' }}</td>
                        <td>
                            <div class="text-right" v-if="getArtifact(processor.name) !== undefined">
                                <router-link :to="getFileUrl(processor.name)" class="button button-sm">
                                    <icon :icon="['far', 'file']" class="mr-1" />
                                    Open file
                                </router-link>
                                <a :href="getDownloadUrl(processor.name)" class="button button-sm ml-1">
                                    <icon icon="download" class="mr-1" />
                                    Download
                                </a>
                            </div>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div v-else>
        LOADING
    </div>
</template>