<script lang="ts" setup>
import {useGameStore} from "@/game/domain/GameStore";
import {useRouter} from "vue-router";
import {Game} from "@/game/domain/Game";
import {onMounted, ref} from "vue";
import GamePageHeader from "@/game/components/GamePageHeader.vue";
import type {LogProcessor} from "@/logprocessor/domain/LogProcessor";
import {api} from "@/api";
import {statusText, Task, TaskStatus} from "@/task/domain/Task";
import type {LogProcessorTaskConfig} from "@/logprocessor/domain/LogProcessorTask";

const gameStore = useGameStore();
const gameId = useRouter().currentRoute.value.params.id as string;
const game = ref<Game>();
const availableProcessors = ref<LogProcessor[]>([]);
const selectedProcessors = ref<Set<string>>(new Set());
const tasks = ref<Task<LogProcessorTaskConfig>[]>([]);

onMounted(() => gameStore.fetchOnceById(gameId)
    .then(() => game.value = gameStore.findById(gameId))
    .catch((error) => console.error(error)));
onMounted(() => api.orchestrator.processors.availableProcessors()
    .then(p => availableProcessors.value = p.sort((a,b) => a.name.localeCompare(b.name)))
    .catch(e => console.error("unable to load available log processors", e)));
onMounted(() => api.orchestrator.processors.getGameTasks(gameId)
    .then(t => t.map(d => Task.from(d)).forEach(l => tasks.value.push(l as Task<LogProcessorTaskConfig>)))
    .catch(e => console.error("unable to load log processor tasks for game", e)));

function toggleAll(): void {
    if (selectedProcessors.value.size === availableProcessors.value.length) {
        selectedProcessors.value.clear();
    } else {
        availableProcessors.value.map(p => p.name).forEach(n => selectedProcessors.value.add(n));
    }
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
    <div v-if="game !== undefined">
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
                            <!--<div class="text-right" v-if="getTaskStatus(processor.name) === TaskStatus.COMPLETED">
                                <button class="button button-sm">
                                    <icon :icon="['far', 'file']" />
                                    Open file
                                </button>
                                <button class="button button-sm ml-1">
                                    <icon icon="download" />
                                    Download
                                </button>
                            </div>-->
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