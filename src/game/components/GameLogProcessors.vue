<script lang="ts" setup>
import {Game} from "@/game/domain/Game";
import {computed, onMounted, ref, watch} from "vue";
import {api} from "@/api";
import {statusText, Task, TaskStatus} from "@/task/domain/Task";
import type {LogProcessorArtifact} from "@/logprocessor/domain/LogProcessorArtifact";
import {filename} from "@/util/Path";
import {useDownloadTokenStore} from "@/file/domain/DownloadTokenStore";
import config from "@/config";
import {useTaskStore} from "@/task/domain/TaskStore";

const props = defineProps<{
    game: Game
}>();
const downloadTokenStore = useDownloadTokenStore();
const taskStore = useTaskStore();
const tokensFetched = ref(false);
const artifacts = ref<LogProcessorArtifact[]>([]);
const availableProcessors = computed(() => artifacts.value.map(a => a.processorName));
const selectedProcessors = ref<Set<string>>(new Set());

onMounted(() => api.orchestrator.processors.getGameArtifacts(props.game.id)
    .then(artifactsResponse => {
        // TODO - move to artifacts store
        artifacts.value = artifactsResponse.map(a => {
            // hydrate tasks for each artifact
            a.tasks = a.tasks.map(t => Task.from(t));
            return a;
        });
    })
    .catch(e => console.error(e)));

watch(artifacts, () => downloadTokenStore.fetchMany(artifacts.value.filter(a => a.filePath !== null).map(a => "/games/" + props.game.id + "/artifacts/" + filename(a.filePath)))
    .then(() => tokensFetched.value = true)
    .catch(e => console.error(e)));

function toggleAll(): void {
    if (selectedProcessors.value.size === availableProcessors.value.length) {
        selectedProcessors.value.clear();
    } else {
        availableProcessors.value.forEach(n => selectedProcessors.value.add(n));
    }
}

function getFileUrl(artifact: LogProcessorArtifact): string {
    return "/games/" + props.game.id + "/files/artifacts/" + filename(artifact.filePath);
}

function getDownloadUrl(artifact: LogProcessorArtifact): string|undefined {
    return artifact.filePath !== null
        ? config.services.orchestrator.url
        + "/files/download/"
        + downloadTokenStore.findByPath("/games/" + props.game.id + "/artifacts/" + filename(artifact.filePath))
        : "";
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
        api.orchestrator.processors.processGameLog({
            gameId: props.game.id,
            processorNames: Array.from(selectedProcessors.value)
        }).then(() => selectedProcessors.value = new Set());
    } else {
        console.error("missing game or selected processors");
    }
}
</script>

<template>
    <div class="mt-10 text-slate-700">
        <h2 class="text-2xl">Log processing</h2>
        <div class="border-t border-x border-slate-300 rounded-t py-2 px-4 mt-4 flex items-center h-20">
            <div class="p-2.5 flex items-center" v-if="taskStore.gameHasRunningLogProcessorTasks(game)">
                <icon icon="circle-notch" class="animate-spin text-2xl text-blue-600" />
                <span class="ml-6 italic -mb-[1px] text-blue-700">Log processor task running</span>
            </div>
            <div class="p-2.5 flex items-center" v-else-if="taskStore.gameHasQueuedProcessorTask(game)">
                <icon icon="circle-exclamation" class="text-2xl text-blue-600" />
                <span class="ml-6 italic text-blue-700 -mb-[1px]">Log processor task queued</span>
            </div>
            <div class="flex items-center" v-else>
                <icon icon="turn-down" :rotation="270" class="ml-2.5 text-slate-500" />
                <button type="button" class="button font-semibold flex items-center ml-5" v-if="selectedProcessors.size > 0" @click="runSelected">
                    <icon icon="play" class="-mt-[1px] mr-2.5 text-lg" />
                    Run selected
                </button>
                <div class="inline-block border px-2.5 py-1.5 ml-4 rounded border-transparent italic text-slate-500" v-else>
                    Select processor(s) to continue
                </div>
            </div>
        </div>
        <table class="datatable bg-white border rounded-b border-slate-300">
            <thead>
            <tr>
                <th class="w-12 !px-1"><input type="checkbox" @click="toggleAll" :checked="selectedProcessors.size === availableProcessors.length" /></th>
                <th class="!text-left">Name</th>
                <th>Status</th>
                <th></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="artifact in artifacts.slice().sort((a,b) => a.processorName.localeCompare(b.processorName))" :key="artifact.processorName">
                <td class="text-center !px-1">
                    <input type="checkbox" @click="toggle(artifact.processorName)"
                           :checked="selectedProcessors.has(artifact.processorName)" />
                </td>
                <td class="!text-left">{{artifact.processorName}}</td>
                <td class="uppercase text-xs text-center">{{ taskStore.findTaskStatusForGameArtifact(game, artifact) !== undefined ? statusText(taskStore.findTaskStatusForGameArtifact(game, artifact)) : '-' }}</td>
                <td class="w-72">
                    <div class="text-center" v-if="taskStore.findTaskStatusForGameArtifact(game, artifact) === TaskStatus.COMPLETED && artifact.exists">
                        <router-link :to="getFileUrl(artifact)" class="button button-sm">
                            <icon :icon="['far', 'file']" class="mr-1" />
                            Open file
                        </router-link>
                        <a :href="getDownloadUrl(artifact)" class="button button-sm ml-1" v-if="tokensFetched">
                            <icon icon="download" class="mr-1" />
                            Download
                        </a>
                        <a class="button button-sm ml-1 disabled animate-pulse" v-else>
                            <icon icon="download" class="mr-1" />
                            Download
                        </a>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>